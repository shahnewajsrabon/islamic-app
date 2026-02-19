import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export interface SurahDetail {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
    edition: {
        identifier: string;
        language: string;
        name: string;
        englishName: string;
        format: string;
        type: string;
    }
}

export const useQuran = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSurahs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://api.alquran.cloud/v1/surah');
            if (response.data && response.data.data) {
                setSurahs(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch Surah list.');
            setLoading(false);
        }
    };

    const fetchSurahDetail = async (number: number): Promise<SurahDetail[] | null> => {
        setLoading(true);
        try {
            // Fetching Uthmani script and English translation
            const response = await axios.get(`http://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.asad`);
            setLoading(false);
            if (response.data && response.data.data) {
                return response.data.data; // Returns array of 2 editions
            }
            return null;
        } catch (err) {
            setError('Failed to fetch Surah details.');
            setLoading(false);
            return null;
        }
    };

    useEffect(() => {
        fetchSurahs();
    }, []);

    return { surahs, fetchSurahDetail, loading, error };
};
