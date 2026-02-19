import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT Secret Key
const SECRET_KEY = process.env.JWT_SECRET || 'gate11-super-secret-key-change-this-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

// Basit in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean; blockUntil?: number }>();

// Temizlik - her 5 dakikada bir
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        rateLimitMap.forEach((value, key) => {
            if (value.resetTime < now && !value.blocked) {
                rateLimitMap.delete(key);
            }
        });
    }, 5 * 60 * 1000);
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; response?: NextResponse } {
    const now = Date.now();
    const key = `${ip}:${pathname}`;

    // Rate limit ayarları (endpoint'e göre)
    let maxRequests = 60; // Varsayılan: 60 istek/dakika
    let windowMs = 60000; // 1 dakika
    let blockDuration = 15 * 60 * 1000; // 15 dakika blok

    // Giriş denemeleri için sıkı limit (Brute Force Koruması)
    if (pathname === '/login' || pathname === '/api/auth/login') {
        maxRequests = 5; // 5 deneme
        windowMs = 10 * 60 * 1000; // 10 dakika içinde
        blockDuration = 60 * 60 * 1000; // 1 saat blok
    }

    // Admin endpoint'leri
    if (pathname.startsWith('/secure-gate-2026')) {
        maxRequests = 100;
        windowMs = 60000;
    }

    // Mevcut kayıt yoksa oluştur
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + windowMs,
            blocked: false,
        });
        return { allowed: true };
    }

    const record = rateLimitMap.get(key)!;

    // Bloklu mu kontrol et
    if (record.blocked && record.blockUntil && record.blockUntil > now) {
        return {
            allowed: false,
            response: new NextResponse(
                JSON.stringify({
                    error: 'Çok fazla deneme yaptınız. Güvenliğiniz için erişim geçici olarak durduruldu.',
                    retryAfter: Math.ceil((record.blockUntil - now) / 1000),
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(Math.ceil((record.blockUntil - now) / 1000)),
                    },
                }
            ),
        };
    }

    // Blok süresi dolmuşsa sıfırla
    if (record.blocked && record.blockUntil && record.blockUntil <= now) {
        record.blocked = false;
        record.count = 1;
        record.resetTime = now + windowMs;
        delete record.blockUntil;
        return { allowed: true };
    }

    // Zaman penceresi dolmuşsa sıfırla
    if (record.resetTime <= now) {
        record.count = 1;
        record.resetTime = now + windowMs;
        return { allowed: true };
    }

    // İstek sayısını artır
    record.count++;

    // Limit aşıldı mı?
    if (record.count > maxRequests) {
        record.blocked = true;
        record.blockUntil = now + blockDuration;

        return {
            allowed: false,
            response: new NextResponse(
                JSON.stringify({
                    error: 'İstek limiti aşıldı.',
                    retryAfter: Math.ceil(blockDuration / 1000),
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(Math.ceil(blockDuration / 1000)),
                        'X-RateLimit-Limit': String(maxRequests),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(record.blockUntil),
                    },
                }
            ),
        };
    }

    return { allowed: true };
}

async function verifySession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // IP adresini al
    const ip = req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        'unknown';

    // 1. Rate Limiting Kontrolü (Görünmez Kalkan)
    if (pathname.startsWith('/api') || pathname.startsWith('/secure-gate-2026') || pathname === '/login') {
        const rateLimitResult = checkRateLimit(ip, pathname);
        if (!rateLimitResult.allowed && rateLimitResult.response) {
            return rateLimitResult.response;
        }
    }

    // 2. Admin Paneli Güvenliği
    if (pathname.startsWith('/secure-gate-2026')) {
        const session = await verifySession(req);

        // Oturum yoksa veya geçersizse giriş sayfasına yönlendir
        if (!session) {
            const loginUrl = new URL('/login', req.url);
            // loginUrl.searchParams.set('from', pathname); // İstenirse eklenebilir
            return NextResponse.redirect(loginUrl);
        }
    }

    // 3. Giriş Sayfası Kontrolü (Zaten giriş yapmışsa admin'e yönlendir)
    if (pathname === '/login') {
        const session = await verifySession(req);
        if (session) {
            return NextResponse.redirect(new URL('/secure-gate-2026', req.url));
        }
    }

    // 4. Güvenlik Başlıkları (Security Headers)
    const response = NextResponse.next();

    // X-DNS-Prefetch-Control: Sahte DNS yönlendirmelerini engeller
    response.headers.set('X-DNS-Prefetch-Control', 'on');

    // Strict Transport Security: Sadece HTTPS (Prodüksiyonda otomatik devreye girer genelde ama burada da olması iyidir)
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // X-Frame-Options: Başka sitelerin iframe içinde bu siteyi göstermesini engeller (Clickjacking koruması)
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');

    // X-Content-Type-Options: Dosya türü sahteciliğini engeller
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy: Trafik kaynağını gizler
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // X-XSS-Protection: Eski tarayıcılar için XSS koruması
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

export const config = {
    matcher: ['/secure-gate-2026/:path*', '/login', '/api/:path*'],
};
