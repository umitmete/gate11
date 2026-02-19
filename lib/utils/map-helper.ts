'use client';

export const getMapUrl = () => {
    const address = "Simmeringer Hauptstraße 179, 1110 Wien";
    const encodedAddress = encodeURIComponent(address);

    // Tarayıcı bilgisinden cihazı algıla
    if (typeof window !== 'undefined') {
        const platform = window.navigator.platform.toLowerCase();
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isMac = platform.includes('mac');

        // SADECE iPhone veya Mac (Apple cihazı) ise Apple Maps linki döndür
        if (isIos || isMac) {
            return `https://maps.apple.com/?daddr=${encodedAddress}`;
        }
    }

    // Diğer tüm durumlarda (PC, Android, Windows) doğrudan Google Maps Yol Tarifi linki döndür
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
};
