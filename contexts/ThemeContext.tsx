'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setMode: (mode: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark

    const updateTheme = (newTheme: Theme) => {
        // Always force dark
        const forcedTheme = 'dark';
        setTheme(forcedTheme);
        localStorage.setItem('theme', forcedTheme);

        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
    };

    useEffect(() => {
        // Enforce dark mode on mount
        updateTheme('dark');
    }, []);

    const toggleTheme = () => {
        // Disable toggling
        updateTheme('dark');
    };

    const setMode = (mode: Theme) => {
        // Disable mode setting
        updateTheme('dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
