import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Heart } from 'lucide-react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

// Static content for rotation
const DAILY_VERSES = [
    { text: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.", source: "Surah Al-Baqarah [2:152]" },
    { text: "Indeed, Allah is with the patient.", source: "Surah Al-Baqarah [2:153]" },
    { text: "Call upon Me; I will respond to you.", source: "Surah Ghafir [40:60]" },
    { text: "And He found you lost and guided [you].", source: "Surah Ad-Duhaa [93:7]" },
];

const DAILY_DUAS = [
    { arabic: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar.", meaning: "Our Lord! Give us in this world that which is good and in the Hereafter that which is good." },
    { arabic: "Rabbi zidni 'ilma.", meaning: "My Lord, increase me in knowledge." },
    { arabic: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni.", meaning: "O Allah, You are Forgiving and love forgiveness, so forgive me." },
];

const Home = () => {
    const { prayers, nextPrayer, loading, location, hijri } = usePrayerTimes() as any;
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = date.toLocaleDateString('en-US', options);

    // Rotation Logic
    const dayIndex = date.getDate() % DAILY_VERSES.length;
    const dailyVerse = DAILY_VERSES[dayIndex];
    const dailyDua = DAILY_DUAS[date.getDate() % DAILY_DUAS.length];

    // Fast Tracker Logic
    const [timeToNext, setTimeToNext] = useState<string>('--:--');
    const [nextEvent, setNextEvent] = useState<string>('Iftar');

    useEffect(() => {
        if (!prayers) return;

        const updateCountdown = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            const parseTime = (timeStr: string) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const fajrTime = parseTime(prayers.Fajr);
            const maghribTime = parseTime(prayers.Maghrib);

            let targetTime = 0;
            let event = '';

            if (currentTime < fajrTime) {
                targetTime = fajrTime;
                event = 'Suhoor Ends';
            } else if (currentTime < maghribTime) {
                targetTime = maghribTime;
                event = 'Iftar';
            } else {
                targetTime = fajrTime + 24 * 60; // Next Fajr
                event = 'Suhoor Ends';
            }

            let diff = targetTime - currentTime;
            if (diff < 0) diff += 24 * 60;

            const h = Math.floor(diff / 60);
            const m = diff % 60;
            setTimeToNext(`${h}:${m.toString().padStart(2, '0')}`);
            setNextEvent(event);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [prayers]);

    const heroContent = loading ? (
        <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-white/20 rounded w-1/3"></div>
            <div className="h-4 bg-white/20 rounded w-1/4"></div>
            <div className="flex gap-8 mt-4">
                <div className="h-16 bg-white/20 rounded w-24"></div>
                <div className="h-16 bg-white/20 rounded w-24"></div>
            </div>
        </div>
    ) : (
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-emerald-100 mb-1">{currentDate}</p>
            {hijri && (
                <p className="text-emerald-200 text-sm mb-6 font-medium bg-white/10 inline-block px-3 py-1 rounded-full">
                    {hijri.day} {hijri.month.en} {hijri.year} AH
                </p>
            )}
            {!hijri && <div className="mb-6"></div>}

            <div className="flex flex-col md:flex-row gap-8">
                <div>
                    <p className="text-sm text-emerald-100 uppercase tracking-wider">Next Prayer</p>
                    <h2 className="text-4xl font-bold mt-1">{nextPrayer || 'Loading...'}</h2>
                    <p className="text-emerald-200 text-sm">{prayers && nextPrayer ? prayers[nextPrayer] : '--:--'}</p>
                </div>

                <div className="hidden md:block w-px bg-emerald-500/50"></div>

                <div>
                    <p className="text-sm text-emerald-100 uppercase tracking-wider">Location</p>
                    <h2 className="text-lg font-bold mt-1">{location ? 'Detected' : 'Mecca (Default)'}</h2>
                    <p className="text-emerald-200 text-sm">Prayer Method: ISNA</p>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden min-h-[240px]">
                {heroContent}

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69.1,-58.3,77.3,-46.3C85.5,-34.3,91.7,-21.3,92.6,-8.1C93.5,5.1,89.1,18.5,81.1,29.3C73.1,40.1,61.5,48.3,50,55.1C38.5,61.9,27.1,67.3,15.1,69.8C3.1,72.3,-9.5,71.9,-21.5,68.4C-33.5,64.9,-44.9,58.3,-54.8,49.8C-64.7,41.3,-73.1,30.9,-77.9,19.1C-82.7,7.3,-83.9,-5.9,-79.6,-17.8C-75.3,-29.7,-65.5,-40.3,-54.2,-48.1C-42.9,-55.9,-30.1,-60.9,-17.5,-63.3C-4.9,-65.7,7.5,-65.5,19.5,-63.4L45.7,-76.3Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            {/* Quick Actions / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Daily Verse</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                        "{dailyVerse.text}"
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">{dailyVerse.source}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <Heart size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Daily Dua</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {dailyDua.arabic}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">{dailyDua.meaning}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                        <Clock size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Fast Tracker</h3>
                    <div className="text-center py-2">
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">{timeToNext}</p>
                        <p className="text-xs text-gray-500">Hours until {nextEvent}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
