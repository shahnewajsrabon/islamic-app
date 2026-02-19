import { useState, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { duaCategories, duas } from '../data/duaData';
import { Sun, Moon, Layout, Car, Home } from 'lucide-react';

const icons: { [key: string]: ElementType } = {
    Sun, Moon, Layout, Car, Home
};

const DuaPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('morning');

    const filteredDuas = duas.filter(dua => dua.categoryId === selectedCategory);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Dua & Adhkar</h1>
                    <p className="text-gray-500 dark:text-gray-400">Remembrance of Allah for every occasion</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {duaCategories.map((category) => {
                    const Icon = icons[category.icon];
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all
                                ${selectedCategory === category.id
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            <Icon size={18} />
                            <span>{category.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* Dua List */}
            <div className="grid gap-6">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {filteredDuas.map((dua) => (
                            <div key={dua.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-emerald-600 mb-4">{dua.title}</h3>

                                <div className="mb-6 text-right">
                                    <p className="font-amiri text-2xl md:text-3xl leading-loose text-slate-800 dark:text-slate-200">
                                        {dua.arabic}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                                        "{dua.transliteration}"
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-300">
                                        {dua.translation}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400">
                                    Reference: {dua.reference}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default DuaPage;
