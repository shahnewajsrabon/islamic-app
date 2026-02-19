import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const PrayerTimes = () => {
    const { prayers, nextPrayer, loading, error, location } = usePrayerTimes();
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">Retry</button>
            </div>
        );
    }

    const prayerNames = [
        { key: 'Fajr', label: 'Fajr' },
        { key: 'Sunrise', label: 'Sunrise' },
        { key: 'Dhuhr', label: 'Dhuhr' },
        { key: 'Asr', label: 'Asr' },
        { key: 'Maghrib', label: 'Maghrib' },
        { key: 'Isha', label: 'Isha' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Prayer Times</h1>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                            <Calendar size={16} />
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm">
                        <MapPin size={16} />
                        <span>{location?.latitude.toFixed(2)}, {location?.longitude.toFixed(2)}</span>
                    </div>
                </div>

                <div className="grid gap-4">
                    {prayers && prayerNames.map((prayer) => (
                        <div
                            key={prayer.key}
                            className={`
                flex items-center justify-between p-4 rounded-xl transition-all
                ${prayer.key === nextPrayer
                                    ? 'bg-emerald-600 text-white shadow-lg scale-[1.02]'
                                    : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${prayer.key === nextPrayer ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'}
                `}>
                                    <Clock size={20} />
                                </div>
                                <span className="font-semibold text-lg">{prayer.label}</span>
                            </div>
                            <span className="text-xl font-mono font-medium">{prayers[prayer.key]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default PrayerTimes;
