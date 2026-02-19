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

export interface AudioEdition {
    number: number;
    audio: string;
    audioSecondary: string[];
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export const useQuran = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [bookmarks, setBookmarks] = useState<number[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('quran_bookmarks');
        if (saved) {
            setBookmarks(JSON.parse(saved));
        }
    }, []);

    const toggleBookmark = (surahNumber: number) => {
        let newBookmarks;
        if (bookmarks.includes(surahNumber)) {
            newBookmarks = bookmarks.filter(b => b !== surahNumber);
        } else {
            newBookmarks = [...bookmarks, surahNumber];
        }
        setBookmarks(newBookmarks);
        localStorage.setItem('quran_bookmarks', JSON.stringify(newBookmarks));
    };

    const isBookmarked = (surahNumber: number) => bookmarks.includes(surahNumber);

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

    const fetchSurahAudio = async (number: number): Promise<AudioEdition[] | null> => {
        try {
            const response = await axios.get(`http://api.alquran.cloud/v1/surah/${number}/ar.alafasy`);
            if (response.data && response.data.data && response.data.data.ayahs) {
                return response.data.data.ayahs;
            }
            return null;
        } catch (err) {
            console.error("Failed to fetch audio", err);
            return null;
        }
    };

    useEffect(() => {
        fetchSurahs();
    }, []);

    return { surahs, fetchSurahDetail, fetchSurahAudio, loading, error, toggleBookmark, isBookmarked, bookmarks };
};
