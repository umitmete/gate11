'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('de');

    useEffect(() => {
        // Hidrasyon çakışmalarını önlemek için gecikme eklendi
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && ['de', 'en', 'tr', 'ar', 'fa'].includes(savedLang)) {
            setLanguage(savedLang);
            updateDocument(savedLang);
        } else {
            // Kayıtlı dil yoksa document üzerinde 'de' (Almanca) dilinin uygulandığından emin ol
            updateDocument('de');
        }
    }, []);

    const updateDocument = (lang: Language) => {
        const dir = (lang === 'ar' || lang === 'fa') ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    };

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        updateDocument(lang);
    };

    const t = translations[language] || translations.de;

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
