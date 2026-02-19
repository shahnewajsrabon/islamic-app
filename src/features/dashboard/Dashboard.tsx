import { motion } from 'framer-motion';
import { usePrayerTimes } from '../prayer/usePrayerTimes';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Clock, MapPin, Calendar, BookOpen, Heart } from 'lucide-react';

const Dashboard = () => {
    const { prayers, nextPrayer, loading, error, location, hijri } = usePrayerTimes();
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = date.toLocaleDateString('en-US', options);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-red-500 gap-4">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white shadow-xl"
            >
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold">Islamic Companion</h1>
                            <p className="text-emerald-100 mt-1 flex items-center gap-2">
                                <Calendar size={16} />
                                {currentDate}
                            </p>
                            {hijri && (
                                <p className="text-emerald-200 text-sm mt-1 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    {hijri.day} {hijri.month.en} {hijri.year} AH
                                </p>
                            )}
                        </div>

                        <div className="text-right md:text-left">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <p className="text-emerald-100 text-xs uppercase tracking-wider font-medium">Next Prayer</p>
                                <h2 className="text-4xl font-bold mt-1">{nextPrayer}</h2>
                                <p className="text-emerald-200 text-sm font-medium">
                                    {prayers && nextPrayer ? prayers[nextPrayer] : '--:--'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-sm text-emerald-100/80">
                        <MapPin size={16} />
                        <span>{location ? 'Location Detected' : 'Mecca (Default)'}</span>
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 opacity-10 w-64 h-64 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69.1,-58.3,77.3,-46.3C85.5,-34.3,91.7,-21.3,92.6,-8.1C93.5,5.1,89.1,18.5,81.1,29.3C73.1,40.1,61.5,48.3,50,55.1C38.5,61.9,27.1,67.3,15.1,69.8C3.1,72.3,-9.5,71.9,-21.5,68.4C-33.5,64.9,-44.9,58.3,-54.8,49.8C-64.7,41.3,-73.1,30.9,-77.9,19.1C-82.7,7.3,-83.9,-5.9,-79.6,-17.8C-75.3,-29.7,-65.5,-40.3,-54.2,-48.1C-42.9,-55.9,-30.1,-60.9,-17.5,-63.3C-4.9,-65.7,7.5,-65.5,19.5,-63.4L45.7,-76.3Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {prayers && ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                    <Card key={prayer} variant={nextPrayer === prayer ? 'default' : 'outline'} className={`flex items-center justify-between ${nextPrayer === prayer ? 'border-emerald-500 ring-1 ring-emerald-500' : ''}`}>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{prayer}</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{prayers[prayer]}</p>
                        </div>
                        <Clock size={20} className={nextPrayer === prayer ? 'text-emerald-600' : 'text-gray-300'} />
                    </Card>
                ))}
            </div>

            {/* Daily Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="glass" className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="font-semibold text-lg">Daily Verse</h3>
                    </div>
                    <blockquote className="italic text-gray-600 dark:text-gray-300 border-l-4 border-emerald-500 pl-4 py-1">
                        "Variable daily verse would go here..."
                    </blockquote>
                    <p className="text-sm text-emerald-600 font-medium text-right">Surah Example [1:1]</p>
                </Card>

                <Card variant="glass" className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <Heart size={20} />
                        </div>
                        <h3 className="font-semibold text-lg">Daily Dua</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        "Rabbana atina..."
                    </p>
                    <p className="text-sm text-blue-600 font-medium text-right">Protection & Guidance</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
