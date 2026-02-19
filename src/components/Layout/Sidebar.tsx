import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
    LayoutDashboard,
    Clock,
    BookOpen,
    Compass,
    Heart,
    List,
    Percent,
    Calculator,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useSettings();

    const navItems = [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/prayer-times", icon: Clock, label: "Prayer Times" },
        { to: "/quran", icon: BookOpen, label: "Al-Quran" },
        { to: "/qibla", icon: Compass, label: "Qibla Compass" },
        { to: "/dua", icon: Heart, label: "Dua & Adhkar" },
        { to: "/names-of-allah", icon: List, label: "99 Names" },
        { to: "/tasbih", icon: Percent, label: "Tasbih" },
        { to: "/zakat", icon: Calculator, label: "Zakat Calculator" },
    ];

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden fixed top-4 right-4 z-50 p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-72 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-r border-gray-100 dark:border-slate-900 shadow-2xl transition-transform duration-300 ease-spring md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <BookOpen className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">
                                Islamic App
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Premium Edition</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={20} className={cn("transition-colors", isActive && "fill-current opacity-20")} />
                                        <span className="relative z-10">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer / Theme Toggle */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            <span className="flex items-center gap-2">
                                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <div className={cn(
                                "w-10 h-5 rounded-full relative transition-colors",
                                theme === 'dark' ? "bg-emerald-500" : "bg-slate-300"
                            )}>
                                <div className={cn(
                                    "w-3 h-3 bg-white rounded-full absolute top-1 transition-transform",
                                    theme === 'dark' ? "left-6" : "left-1"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
