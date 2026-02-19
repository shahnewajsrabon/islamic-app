import { useState } from 'react';
import { useQuran } from './useQuran';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Search, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SurahList = () => {
    const { surahs, loading, error, isBookmarked } = useQuran();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredSurahs = surahs.filter(surah =>
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.name.includes(searchTerm) ||
        surah.number.toString().includes(searchTerm)
    );

    if (loading && surahs.length === 0) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Al-Quran</h1>
                    <p className="text-gray-500 dark:text-gray-400">Read and reflect upon the Holy Quran</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Surah (English/Arabic)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                    <Card
                        key={surah.number}
                        variant="default"
                        onClick={() => navigate(`/quran/${surah.number}`)}
                        className="cursor-pointer hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors relative z-10">
                                <span>{surah.number}</span>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">{surah.englishName}</h3>
                                <p className="text-xs text-gray-500">{surah.englishNameTranslation}</p>
                            </div>

                            <div className="text-right relative z-10">
                                <p className="font-amiri font-bold text-xl text-gray-800 dark:text-white">{surah.name.replace('سورة ', '')}</p>
                                <p className="text-xs text-gray-400">{surah.numberOfAyahs} Verses</p>
                            </div>
                        </div>

                        {isBookmarked(surah.number) && (
                            <div className="absolute top-0 right-0 p-2 text-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                <Bookmark fill="currentColor" size={80} className="transform translate-x-1/2 -translate-y-1/2 rotate-12" />
                            </div>
                        )}
                        {isBookmarked(surah.number) && (
                            <div className="absolute top-2 right-2 text-emerald-500 z-20">
                                <Bookmark fill="currentColor" size={16} />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SurahList;
