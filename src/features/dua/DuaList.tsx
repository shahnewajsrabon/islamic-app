import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, Share2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ["All", "Morning", "Evening", "Prayer", "Protection", "Forgiveness"];

const duas = [
    {
        id: 1,
        category: "Morning",
        arabic: "اللّهُـمَّ بِكَ أَصْـبَحْنا وَبِكَ أَمْسَـينا ، وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ النُّـشُور",
        transliteration: "Allahumma bika asbahna wa bika amsayna, wa bika nahya wa bika namutu wa ilaykan-nushur.",
        meaning: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
        reference: "Tirmidhi"
    },
    {
        id: 2,
        category: "Prayer",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar.",
        meaning: "Our Lord! Give us in this world that which is good and in the Hereafter that which is good, and save us from the torment of the Fire.",
        reference: "Surah Al-Baqarah 2:201"
    },
    {
        id: 3,
        category: "Forgiveness",
        arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullah wa atubu ilayh.",
        meaning: "I seek forgiveness from Allah and repent to Him.",
        reference: "Bukhari"
    }
];

const DuaList = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDuas = duas.filter(dua =>
        (selectedCategory === "All" || dua.category === selectedCategory) &&
        (dua.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dua.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dua.arabic.includes(searchTerm))
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 py-4">
                <h1 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">Dua & Adhkar</h1>
                <p className="text-gray-500 dark:text-gray-400">Authentic supplications for daily life</p>
            </div>

            {/* Search and Filter */}
            <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm py-4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search dua..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dua Cards */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredDuas.map((dua) => (
                        <motion.div
                            key={dua.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="hover:border-emerald-200 dark:hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg uppercase tracking-wide">
                                        {dua.category}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${dua.arabic}\n\n${dua.transliteration}\n\n${dua.meaning}`)}>
                                            <Copy size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Share2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-right mb-6">
                                    <p className="font-amiri text-2xl md:text-3xl leading-loose text-slate-800 dark:text-slate-100">
                                        {dua.arabic}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-emerald-700 dark:text-emerald-400 font-medium italic">
                                        {dua.transliteration}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {dua.meaning}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2 block border-t border-gray-100 dark:border-slate-800 pt-2">
                                        Reference: {dua.reference}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredDuas.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        No duas found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DuaList;
