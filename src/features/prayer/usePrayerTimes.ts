import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const PRAYER_API_URL = 'https://api.aladhan.com/v1/timings';

export interface PrayerTimesData {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: any;
}

export interface HijriDate {
    day: string;
    month: {
        number: number;
        en: string;
        ar: string;
    };
    year: string;
}


export const usePrayerTimes = () => {
    const { location, setLocation, calculationMethod } = useSettings();
    const [error, setError] = useState<string | null>(null);

    // Geo-location logic (moved here or could be a separate hook)
    useEffect(() => {
        if (!location) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    () => {
                        setError('Location access denied. Using default (Mecca).');
                        setLocation({ latitude: 21.4225, longitude: 39.8262 });
                    }
                );
            } else {
                setError('Geolocation not supported.');
                setLocation({ latitude: 21.4225, longitude: 39.8262 });
            }
        }
    }, [location, setLocation]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['prayerTimes', location?.latitude, location?.longitude, calculationMethod],
        queryFn: async () => {
            if (!location) return null;
            const date = new Date();
            const timestamp = Math.floor(date.getTime() / 1000);

            const response = await axios.get(`${PRAYER_API_URL}/${timestamp}`, {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    method: calculationMethod,
                },
            });
            return response.data.data;
        },
        enabled: !!location,
    });

    const prayerTimes: PrayerTimesData | null = data?.timings || null;
    const hijriDate: HijriDate | null = data?.date?.hijri || null;

    // Next Prayer logic
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);

    useEffect(() => {
        if (prayerTimes) {
            const calculateNext = () => {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

                for (const prayer of prayerOrder) {
                    const timeStr = prayerTimes[prayer];
                    if (!timeStr) continue;
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    const prayerTime = hours * 60 + minutes;

                    if (prayerTime > currentTime) {
                        setNextPrayer(prayer);
                        return;
                    }
                }
                setNextPrayer('Fajr'); // Tomorrow
            };
            calculateNext();
            const interval = setInterval(calculateNext, 60000);
            return () => clearInterval(interval);
        }
    }, [prayerTimes]);

    return {
        prayers: prayerTimes,
        hijri: hijriDate,
        nextPrayer,
        loading: isLoading,
        error: isError ? 'Failed to fetch data' : error,
        location
    };
};
