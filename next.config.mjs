/** @type {import('next').NextConfig} */
const nextConfig = {
    // Görsel optimizasyonu
    images: {
        formats: ['image/webp', 'image/avif'], // Modern formatlar
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive boyutlar
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Küçük görseller için
        minimumCacheTTL: 31536000, // 1 yıl cache (saniye)
        dangerouslyAllowSVG: true, // SVG desteği
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Sıkıştırma ve optimizasyon
    compress: true, // Gzip sıkıştırma
    poweredByHeader: false, // X-Powered-By header'ını kaldır (güvenlik)

    // Production optimizasyonları
    productionBrowserSourceMaps: false, // Source map'leri kapat (daha hızlı)

    // Compiler optimizasyonları
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'], // Production'da console.log'ları kaldır
        } : false,
    },

    // Experimental özellikler (performans için)
    experimental: {
        optimizeCss: false, // CSS optimizasyonu (critters hatası nedeniyle kapalı)
        optimizePackageImports: ['lucide-react', 'framer-motion'], // Paket import optimizasyonu
    },

    // Cache headers
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable', // 1 yıl cache
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },

    async rewrites() {
        return [
            // Almanca URL'leri gerçek klasör yollarına yönlendir
            {
                source: '/Fahrakademie',
                destination: '/courses',
            },
            {
                source: '/Fahrakademie/:path*',
                destination: '/courses/:path*',
            },
            {
                source: '/kurse',
                destination: '/kurstermine',
            },
            {
                source: '/Team',
                destination: '/team',
            },
            {
                source: '/secure-gate-2026/Voranmeldungen',
                destination: '/secure-gate-2026/registrations',
            },
            {
                source: '/secure-gate-2026/Voranmeldungen/:path*',
                destination: '/secure-gate-2026/registrations/:path*',
            },
            {
                source: '/secure-gate-2026/Schuelerlisten',
                destination: '/secure-gate-2026/students',
            },
            {
                source: '/secure-gate-2026/Schuelerlisten/:path*',
                destination: '/secure-gate-2026/students/:path*',
            },
            {
                source: '/secure-gate-2026/Fahrakademie',
                destination: '/secure-gate-2026/courses',
            },
            {
                source: '/secure-gate-2026/Fahrakademie/:path*',
                destination: '/secure-gate-2026/courses/:path*',
            },
            {
                source: '/secure-gate-2026/kurse',
                destination: '/secure-gate-2026/kurstermine',
            },
            {
                source: '/secure-gate-2026/kurse/:path*',
                destination: '/secure-gate-2026/kurstermine/:path*',
            },
            {
                source: '/secure-gate-2026/Jahresplan',
                destination: '/secure-gate-2026/plans',
            },
            {
                source: '/secure-gate-2026/Jahresplan/:path*',
                destination: '/secure-gate-2026/plans/:path*',
            },
            {
                source: '/secure-gate-2026/Team',
                destination: '/secure-gate-2026/instructors',
            },
            {
                source: '/secure-gate-2026/Team/:path*',
                destination: '/secure-gate-2026/instructors/:path*',
            },
        ];
    },
};

export default nextConfig;