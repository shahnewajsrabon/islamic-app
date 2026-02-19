import React, { useState } from 'react';
import { useQuran, Surah } from '../hooks/useQuran';
import { Search, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Quran = () => {
    const { surahs, loading, error } = useQuran();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredSurahs = surahs.filter(surah =>
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
    );

    if (loading && surahs.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">Retry</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Al-Quran</h1>
                    <p className="text-gray-500 dark:text-gray-400">Read and reflect upon the Holy Quran</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Surah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                    <div
                        key={surah.number}
                        onClick={() => navigate(`/quran/${surah.number}`)}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md hover:border-emerald-200 cursor-pointer transition-all flex items-center gap-4 group"
                    >
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors relative">
                            <span className="z-10">{surah.number}</span>
                            <div className="absolute inset-0 bg-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 dark:text-white">{surah.englishName}</h3>
                            <p className="text-xs text-gray-500">{surah.englishNameTranslation}</p>
                        </div>

                        <div className="text-right">
                            <p className="font-amiri font-bold text-xl text-gray-800 dark:text-white">{surah.name.replace('سورة ', '')}</p>
                            <p className="text-xs text-gray-400">{surah.numberOfAyahs} Verses</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Quran;
