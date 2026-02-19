import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

const Tasbih = () => {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Load state from local storage on mount
    useEffect(() => {
        const savedCount = localStorage.getItem('tasbih-count');
        if (savedCount) setCount(parseInt(savedCount));

        const savedTarget = localStorage.getItem('tasbih-target');
        if (savedTarget) setTarget(parseInt(savedTarget));
    }, []);

    // Save state to local storage
    useEffect(() => {
        localStorage.setItem('tasbih-count', count.toString());
    }, [count]);

    useEffect(() => {
        localStorage.setItem('tasbih-target', target.toString());
    }, [target]);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        triggerFeedback(newCount);
    };

    const reset = () => {
        if (window.confirm('Are you sure you want to reset the counter?')) {
            setCount(0);
        }
    };

    const triggerFeedback = (currentCount: number) => {
        // Vibration
        if (navigator.vibrate) {
            if (currentCount % target === 0) {
                navigator.vibrate([100, 50, 100]); // Long vibration on target
            } else {
                navigator.vibrate(20); // Short tick
            }
        }

        // Sound could be added here if soundEnabled is true
        // For now we just toggle the state
    };

    const completionPercentage = Math.min((count % target) / target * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[70vh] gap-8"
        >
            {/* Header/Settings */}
            <div className="flex justify-between w-full max-w-md items-center">
                <div className="flex gap-2">
                    {[33, 100, 1000].map(val => (
                        <button
                            key={val}
                            onClick={() => setTarget(val)}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${target === val ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 text-gray-500'}`}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 text-gray-400">
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className={`hover:text-emerald-600 transition-colors ${soundEnabled ? 'text-emerald-600' : ''}`}>
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button onClick={reset} className="hover:text-red-500 transition-colors">
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Main Counter UI */}
            <div className="relative">
                {/* Progress Circle */}
                <svg className="w-80 h-80 transform -rotate-90">
                    <circle
                        cx="160"
                        cy="160"
                        r="150"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-100 dark:text-slate-800"
                    />
                    <circle
                        cx="160"
                        cy="160"
                        r="150"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 150}
                        strokeDashoffset={2 * Math.PI * 150 * (1 - completionPercentage / 100)}
                        className="text-emerald-500 transition-all duration-300 ease-out"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Tap Area */}
                <button
                    onClick={increment}
                    className="absolute inset-4 rounded-full bg-emerald-50 dark:bg-slate-900 shadow-inner flex flex-col items-center justify-center active:scale-95 transition-transform"
                >
                    <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-medium">Count</div>
                    <div className="text-8xl font-bold text-gray-800 dark:text-white font-mono">
                        {count}
                    </div>
                    <div className="text-emerald-600 text-sm mt-2 font-medium">
                        Target: {Math.floor(count / target)} x {target} + {count % target}
                    </div>
                </button>
            </div>

            <p className="text-gray-400 text-sm">
                Tap the circle to count
            </p>

        </motion.div>
    );
};

export default Tasbih;
