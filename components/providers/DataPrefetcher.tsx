'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { prefetchSiteData } from '@/lib/client-cache';

export function DataPrefetcher() {
    const { language } = useLanguage();

    useEffect(() => {
        // Run prefetch after initial page rendering is settled
        const timer = setTimeout(() => {
            prefetchSiteData(language);
        }, 300);

        return () => clearTimeout(timer);
    }, [language]);

    return null;
}

