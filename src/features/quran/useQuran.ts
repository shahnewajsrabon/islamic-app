import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

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

    const surahsQuery = useQuery({
        queryKey: ['surahs'],
        queryFn: async () => {
            const response = await axios.get('http://api.alquran.cloud/v1/surah');
            return response.data.data as Surah[];
        },
        staleTime: Infinity, // Surah list doesn't change
    });

    return {
        surahs: surahsQuery.data || [],
        loading: surahsQuery.isLoading,
        error: surahsQuery.error ? 'Failed to fetch Surah list' : null,
        toggleBookmark,
        isBookmarked,
        bookmarks
    };
};

export const useSurahDetail = (number: number) => {
    return useQuery({
        queryKey: ['surah', number],
        queryFn: async () => {
            const response = await axios.get(`http://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.asad`);
            return response.data.data as SurahDetail[];
        },
        enabled: !!number,
        staleTime: Infinity,
    });
};
