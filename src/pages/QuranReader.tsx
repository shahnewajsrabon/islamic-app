import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuran, type SurahDetail } from '../hooks/useQuran';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const QuranReader = () => {
    const { number } = useParams<{ number: string }>();
    const navigate = useNavigate();
    const { fetchSurahDetail } = useQuran();
    const [surahData, setSurahData] = useState<SurahDetail[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSurah = async () => {
            if (number) {
                const data = await fetchSurahDetail(parseInt(number));
                setSurahData(data);
                setLoading(false);
            }
        };
        loadSurah();
    }, [number]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!surahData) return <div>Surah not found</div>;

    const uthmani = surahData.find(edition => edition.edition.type === 'quran');
    const translation = surahData.find(edition => edition.edition.type === 'translation');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-20"
        >
            {/* Header */}
            <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm z-20 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <button
                    onClick={() => navigate('/quran')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="text-center">
                    <h1 className="text-xl font-bold">{uthmani?.englishName}</h1>
                    <p className="text-xs text-gray-500">{uthmani?.englishNameTranslation} • {uthmani?.numberOfAyahs} Verses</p>
                </div>

                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Bismillah */}
            <div className="text-center py-8">
                <p className="font-amiri text-3xl md:text-4xl text-emerald-800 dark:text-emerald-400">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
            </div>

            {/* Verses */}
            <div className="space-y-6 max-w-3xl mx-auto">
                {uthmani?.ayahs.map((ayah, index) => (
                    <div key={ayah.number} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow relative group">
                        <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {ayah.numberInSurah}
                        </div>

                        <div className="mb-6 text-right">
                            <p className="font-amiri text-2xl md:text-3xl leading-loose text-slate-800 dark:text-slate-200">
                                {ayah.text}
                            </p>
                        </div>

                        <div className="text-left border-t border-gray-100 dark:border-slate-800 pt-4">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {translation?.ayahs[index].text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default QuranReader;
