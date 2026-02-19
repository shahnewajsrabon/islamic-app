import React from 'react';
import { motion } from 'framer-motion';
import { namesOfAllah } from '../data/namesData';

const AllahNames = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">99 Names of Allah</h1>
                    <p className="text-gray-500 dark:text-gray-400">Asma-ul-Husna (The Most Beautiful Names)</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {namesOfAllah.map((name) => (
                    <motion.div
                        key={name.number}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-emerald-200 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold mb-4">
                            {name.number}
                        </div>

                        <h3 className="font-amiri text-3xl text-emerald-700 dark:text-emerald-400 mb-2">
                            {name.arabic}
                        </h3>

                        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            {name.transliteration}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {name.meaning}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default AllahNames;
