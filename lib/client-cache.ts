'use client';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export function getCachedData<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    // 1. Check memory cache
    const mem = memoryCache.get(key);
    if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
        return mem.data as T;
    }

    // 2. Check sessionStorage
    try {
        const raw = sessionStorage.getItem(`g11_cache_${key}`);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
                memoryCache.set(key, parsed);
                return parsed.data as T;
            }
        }
    } catch {
        // Ignore storage errors
    }

    return null;
}

export function setCachedData<T>(key: string, data: T): void {
    if (typeof window === 'undefined' || !data) return;
    const item = { data, timestamp: Date.now() };
    memoryCache.set(key, item);
    try {
        sessionStorage.setItem(`g11_cache_${key}`, JSON.stringify(item));
    } catch {
        // Ignore storage quotas
    }
}

export async function fetchWithCache<T>(url: string): Promise<T> {
    const cached = getCachedData<T>(url);
    if (cached) {
        // Background revalidation (SWR) without blocking UI
        fetch(url)
            .then(res => (res.ok ? res.json() : null))
            .then(freshData => {
                if (freshData) setCachedData(url, freshData);
            })
            .catch(() => {});
        return cached;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    setCachedData(url, data);
    return data as T;
}

export function prefetchSiteData(language: string) {
    if (typeof window === 'undefined') return;

    const endpoints = [
        `/api/course-packages?type=DAY&lang=${language}`,
        `/api/admin/package-categories`,
        `/api/plans?type=DAY`,
        `/api/course-schedules?lang=${language}`,
    ];

    endpoints.forEach(url => {
        if (!getCachedData(url)) {
            fetch(url)
                .then(res => (res.ok ? res.json() : null))
                .then(data => {
                    if (data) setCachedData(url, data);
                })
                .catch(() => {});
        }
    });
}

