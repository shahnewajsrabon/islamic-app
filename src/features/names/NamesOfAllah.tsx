import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const names = [
    { number: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Beneficent" },
    { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Merciful" },
    { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King" },
    { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
    { number: 5, arabic: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
    { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith" },
    { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector" },
    { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty" },
    { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller" },
    { number: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Majestic" },
    // Add more up to 99 in a real app, truncating for brevity here but structure is ready
    { number: 99, arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient" }
];

const NamesOfAllah = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNames = names.filter(name =>
        name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.arabic.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold font-serif text-emerald-800 dark:text-emerald-400">Asma-ul-Husna</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    The 99 Beautiful Names of Allah. "And (all) the Most Beautiful Names belong to Allah, so call on Him by them." (7:180)
                </p>

                <div className="relative max-w-md mx-auto mt-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search names..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredNames.map((name) => (
                    <motion.div
                        key={name.number}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="text-center hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group relative overflow-hidden h-full flex flex-col justify-center">
                            <div className="absolute top-2 left-2 text-xs font-bold text-gray-300 dark:text-slate-700 bg-gray-50 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center">
                                {name.number}
                            </div>

                            <div className="py-2">
                                <h2 className="text-3xl font-amiri font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {name.arabic}
                                </h2>
                                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                    {name.transliteration}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                                    "{name.meaning}"
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredNames.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    No names found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default NamesOfAllah;
