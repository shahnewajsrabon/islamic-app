import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurahDetail, useQuran } from './useQuran';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Play, Pause, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

const QuranReader = () => {
    const { number } = useParams<{ number: string }>();
    const navigate = useNavigate();
    const surahNumber = parseInt(number || '1');
    const { data: surahData, isLoading, error } = useSurahDetail(surahNumber);
    const { toggleBookmark, isBookmarked } = useQuran();

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.addEventListener('ended', () => setIsPlaying(false));
        } else {
            audioRef.current.src = audioUrl;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !surahData) {
        return <div className="text-center text-red-500 py-10">Failed to load Surah.</div>;
    }

    const uthmani = surahData.find(e => e.edition.type === 'quran');
    const translation = surahData.find(e => e.edition.type === 'translation');

    if (!uthmani) return null;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm z-30 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/quran')}>
                    <ArrowLeft size={20} />
                </Button>

                <div className="text-center">
                    <h1 className="text-lg font-bold">{uthmani.englishName}</h1>
                    <p className="text-xs text-gray-500">{uthmani.englishNameTranslation}</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={toggleAudio} className={isPlaying ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" : ""}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(surahNumber)}
                        className={isBookmarked(surahNumber) ? "text-emerald-500" : "text-gray-400"}
                    >
                        <Bookmark fill={isBookmarked(surahNumber) ? "currentColor" : "none"} size={20} />
                    </Button>
                </div>
            </div>

            {/* Bismillah */}
            <div className="text-center py-8">
                <p className="font-amiri text-3xl md:text-4xl text-emerald-800 dark:text-emerald-400">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
            </div>

            {/* Verses */}
            <div className="space-y-6 max-w-3xl mx-auto">
                {uthmani.ayahs.map((ayah, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        key={ayah.number}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow relative"
                    >
                        <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {ayah.numberInSurah}
                        </div>

                        <div className="mb-6 text-right pt-6">
                            <p className="font-amiri text-2xl md:text-3xl leading-loose text-slate-800 dark:text-slate-200">
                                {ayah.text}
                            </p>
                        </div>

                        <div className="text-left border-t border-gray-100 dark:border-slate-800 pt-4">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {translation?.ayahs[index].text}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default QuranReader;
