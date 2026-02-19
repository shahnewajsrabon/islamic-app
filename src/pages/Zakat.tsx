import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Coins, TrendingUp, AlertCircle } from 'lucide-react';

const ZakatCalculator = () => {
    const [values, setValues] = useState({
        cash: 0,
        bank: 0,
        gold: 0,
        silver: 0,
        investments: 0,
        businessPoints: 0,
        debts: 0,
    });

    const [prices, setPrices] = useState({
        gold: 65, // Price per gram
        silver: 0.8, // Price per gram
    });

    const [nisabType, setNisabType] = useState<'gold' | 'silver'>('silver');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const calculateTotalAssets = () => {
        const goldValue = values.gold * prices.gold;
        const silverValue = values.silver * prices.silver;
        return values.cash + values.bank + goldValue + silverValue + values.investments + values.businessPoints;
    };

    const calculateNetAssets = () => {
        return calculateTotalAssets() - values.debts;
    };

    const calculateNisab = () => {
        return nisabType === 'gold' ? 87.48 * prices.gold : 612.36 * prices.silver;
    };

    const netAssets = calculateNetAssets();
    const nisabThreshold = calculateNisab();
    const isEligible = netAssets >= nisabThreshold;
    const zakatPayable = isEligible ? netAssets * 0.025 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-20"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Zakat Calculator</h1>
                    <p className="text-gray-500 dark:text-gray-400">Calculate your annual Zakat (2.5%)</p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Nisab Threshold: ${nisabThreshold.toFixed(2)} ({nisabType})</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Asset Inputs */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <DollarSign size={20} className="text-emerald-500" />
                            Cash & Savings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Cash on Hand</label>
                                <input
                                    type="number" name="cash" value={values.cash || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800" placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bank Balance</label>
                                <input
                                    type="number" name="bank" value={values.bank || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800" placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Coins size={20} className="text-yellow-500" />
                            Gold & Silver
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Gold (grams)</label>
                                <input
                                    type="number" name="gold" value={values.gold || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800" placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Silver (grams)</label>
                                <input
                                    type="number" name="silver" value={values.silver || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800" placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Assets & Debts
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Investments / Shares</label>
                                <input
                                    type="number" name="investments" value={values.investments || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800" placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Business Inventory Value</label>
                                <input
                                    type="number" name="businessPoints" value={values.businessPoints || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800" placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-red-500 mb-1">Debts / Liabilities (Deductible)</label>
                                <input
                                    type="number" name="debts" value={values.debts || ''} onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10" placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Sidebar */}
                <div className="space-y-6">
                    <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-lg sticky top-24">
                        <h2 className="text-2xl font-bold mb-6">Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-emerald-100">
                                <span>Total Assets</span>
                                <span className="font-mono font-bold">${calculateTotalAssets().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-red-200">
                                <span>Total Liabilities</span>
                                <span className="font-mono font-bold">-${values.debts.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-emerald-500"></div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Net Worth</span>
                                <span className="font-mono">${netAssets.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-white/10 p-6 rounded-2xl mb-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-emerald-100 text-sm uppercase tracking-wider">Zakat Payable</span>
                                {isEligible ? (
                                    <span className="text-xs bg-white text-emerald-600 px-2 py-0.5 rounded font-bold">ELIGIBLE</span>
                                ) : (
                                    <span className="text-xs bg-red-500/50 text-white px-2 py-0.5 rounded font-bold">NOT ELIGIBLE</span>
                                )}
                            </div>
                            <div className="text-4xl font-mono font-bold">${zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>

                        {/* Settings */}
                        <div className="bg-emerald-700/50 p-4 rounded-xl text-sm">
                            <p className="font-semibold mb-2 text-emerald-100">Calculation Settings</p>
                            <div className="flex justify-between items-center mb-2">
                                <span>Nisab Standard</span>
                                <div className="bg-emerald-800 rounded-lg p-1 flex">
                                    <button
                                        onClick={() => setNisabType('gold')}
                                        className={`px-2 py-1 rounded ${nisabType === 'gold' ? 'bg-white text-emerald-800 shadow' : 'text-emerald-200'}`}
                                    >
                                        Gold
                                    </button>
                                    <button
                                        onClick={() => setNisabType('silver')}
                                        className={`px-2 py-1 rounded ${nisabType === 'silver' ? 'bg-white text-emerald-800 shadow' : 'text-emerald-200'}`}
                                    >
                                        Silver
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-emerald-200 mt-2 gap-2">
                                <div className="flex items-center gap-1">
                                    <span>Gold Price ($/g):</span>
                                    <input
                                        type="number"
                                        value={prices.gold}
                                        onChange={(e) => setPrices({ ...prices, gold: parseFloat(e.target.value) || 0 })}
                                        className="w-16 p-1 rounded text-gray-800 text-right h-6"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>Silver Price ($/g):</span>
                                    <input
                                        type="number"
                                        value={prices.silver}
                                        onChange={(e) => setPrices({ ...prices, silver: parseFloat(e.target.value) || 0 })}
                                        className="w-16 p-1 rounded text-gray-800 text-right h-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ZakatCalculator;
