'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Language } from '@/lib/translations';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const langs: { id: Language; label: string; full: string }[] = [
        { id: 'de', label: 'DE', full: 'Deutsch' },
        { id: 'en', label: 'EN', full: 'English' },
        { id: 'tr', label: 'TR', full: 'Türkçe' },
        { id: 'ar', label: 'AR', full: 'العربية' },
        { id: 'fa', label: 'FA', full: 'فارسی' }
    ];

    const currentLang = langs.find(l => l.id === language) || langs[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 hover:border-primary/50 transition-all active:scale-95"
            >
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold tracking-widest text-foreground">{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 py-2 w-32 bg-background/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {langs.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => {
                                    setLanguage(lang.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-2.5 text-[11px] font-bold tracking-widest transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${language === lang.id
                                    ? 'text-primary bg-primary/5'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <span className={`flex-1 ${language === 'ar' || language === 'fa' ? 'text-right' : 'text-left'}`}>{lang.full}</span>
                                {language === lang.id && <div className="w-1 h-1 rounded-full bg-primary" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

