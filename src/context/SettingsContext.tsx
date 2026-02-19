import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    location: { latitude: number; longitude: number } | null;
    setLocation: (loc: { latitude: number; longitude: number } | null) => void;
    calculationMethod: number;
    setCalculationMethod: (method: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [calculationMethod, setCalculationMethod] = useState<number>(() => {
        const saved = localStorage.getItem('calculationMethod');
        return saved ? parseInt(saved) : 2; // Default to ISNA (2)
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // Load location if saved? Or rely on hook. 
    // For now, let's keep location ephemeral or handled by a specialized hook, 
    // but context is good for sharing it without prop drilling.

    useEffect(() => {
        localStorage.setItem('calculationMethod', calculationMethod.toString());
    }, [calculationMethod]);

    return (
        <SettingsContext.Provider value={{ theme, setTheme, location, setLocation, calculationMethod, setCalculationMethod }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
