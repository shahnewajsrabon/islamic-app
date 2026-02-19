import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RotateCcw, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasbih = () => {
    const [count, setCount] = useState(() => {
        const saved = localStorage.getItem('tasbih-count');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [target, setTarget] = useState(33);

    useEffect(() => {
        localStorage.setItem('tasbih-count', count.toString());
    }, [count]);

    const increment = () => {
        if (navigator.vibrate) navigator.vibrate(10);
        setCount(c => c + 1);
    };

    const decrement = () => {
        if (count > 0) {
            if (navigator.vibrate) navigator.vibrate(10);
            setCount(c => c - 1);
        }
    };

    const reset = () => {
        if (window.confirm('Reset counter?')) {
            setCount(0);
        }
    };

    const progress = Math.min((count % target) / target * 100, 100);

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Digital Tasbih</h1>
                <p className="text-gray-500 dark:text-gray-400">Keep track of your Dhikr</p>
            </div>

            <Card className="flex flex-col items-center justify-center p-10 relative overflow-hidden">
                {/* Progress Ring Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <svg className="w-64 h-64 transform -rotate-90">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 120}
                            strokeDashoffset={2 * Math.PI * 120 - (progress / 100) * 2 * Math.PI * 120}
                            className="text-emerald-500 transition-all duration-300 ease-out"
                        />
                    </svg>
                </div>

                <div className="relative z-10 text-center">
                    <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Count</p>
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={count}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            className="text-8xl font-bold text-emerald-600 dark:text-emerald-400 font-mono"
                        >
                            {count}
                        </motion.h2>
                    </AnimatePresence>
                </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
                <Button
                    variant="secondary"
                    onClick={decrement}
                    className="h-20 rounded-2xl text-xl"
                >
                    <Minus size={24} />
                </Button>

                <Button
                    variant="primary"
                    onClick={increment}
                    className="h-20 col-span-2 rounded-2xl text-2xl shadow-emerald-500/30"
                >
                    <Plus size={32} />
                    <span className="sr-only">Count</span>
                </Button>
            </div>

            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Target:</span>
                    <select
                        value={target}
                        onChange={(e) => setTarget(parseInt(e.target.value))}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm font-bold focus:ring-emerald-500"
                    >
                        <option value={33}>33</option>
                        <option value={99}>99</option>
                        <option value={100}>100</option>
                        <option value={1000}>1000</option>
                    </select>
                </div>

                <Button variant="ghost" size="sm" onClick={reset} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <RotateCcw size={16} className="mr-2" />
                    Reset
                </Button>
            </div>

            <p className="text-xs text-center text-gray-400">
                Tip: Use spacebar to count on desktop.
            </p>
        </div>
    );
};

export default Tasbih;
