import { useState, useEffect } from 'react';
import axios from 'axios';

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export interface WebLocation {
    latitude: number;
    longitude: number;
}

export const usePrayerTimes = () => {
    const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<WebLocation | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    setError('Location access denied. Using default location (Mecca).');
                    // Default to Mecca
                    setLocation({ latitude: 21.4225, longitude: 39.8262 });
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLocation({ latitude: 21.4225, longitude: 39.8262 });
        }
    }, []);

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            if (!location) return;

            try {
                const date = new Date();
                const timestamp = Math.floor(date.getTime() / 1000);

                // Using Aladhan API
                const response = await axios.get('https://api.aladhan.com/v1/timings/' + timestamp, {
                    params: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        method: 2, // ISNA
                    }
                });

                if (response.data && response.data.data) {
                    setPrayers(response.data.data.timings);
                    calculateNextPrayer(response.data.data.timings);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch prayer times.');
                setLoading(false);
            }
        };

        fetchPrayerTimes();
    }, [location]);

    const calculateNextPrayer = (timings: PrayerTimes) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        for (const prayer of prayerOrder) {
            const timeStr = timings[prayer];
            const [hours, minutes] = timeStr.split(':').map(Number);
            const prayerTime = hours * 60 + minutes;

            if (prayerTime > currentTime) {
                setNextPrayer(prayer);
                return;
            }
        }

        // If all passed, next is Fajr tomorrow
        setNextPrayer('Fajr');
    };

    return { prayers, nextPrayer, loading, error, location };
};
