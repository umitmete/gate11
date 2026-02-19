'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-primary" />
            ) : (
                <Moon className="w-5 h-5 text-primary" />
            )}
        </button>
    );
}
