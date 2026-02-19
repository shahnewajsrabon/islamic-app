import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Clock,
    BookOpen,
    Compass,
    Heart,
    List,
    Hash,
    Calculator,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const navItems = [
        { to: "/", icon: Home, label: "Dashboard" },
        { to: "/prayer-times", icon: Clock, label: "Prayer Times" },
        { to: "/quran", icon: BookOpen, label: "Al-Quran" },
        { to: "/qibla", icon: Compass, label: "Qibla Compass" },
        { to: "/dua", icon: Heart, label: "Dua & Adhkar" },
        { to: "/names-of-allah", icon: List, label: "99 Names" },
        { to: "/tasbih", icon: Hash, label: "Tasbih" },
        { to: "/zakat", icon: Calculator, label: "Zakat Calculator" },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-emerald-600 text-white rounded-lg shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full bg-white dark:bg-slate-900 shadow-xl z-40 transition-transform duration-300 ease-in-out
        w-64 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">
                        Islamic App
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Guide to Serenity</p>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                                    ? 'bg-emerald-50 text-emerald-600 font-medium shadow-sm dark:bg-emerald-900/20 dark:text-emerald-400'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600 dark:text-gray-400 dark:hover:bg-slate-800'
                                }
              `}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
