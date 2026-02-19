// Rate limiting ve bot koruması
interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
        blocked: boolean;
        blockUntil?: number;
    };
}

const store: RateLimitStore = {};

// Temizlik işlemi - her 5 dakikada bir eski kayıtları sil
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now && !store[key].blocked) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);

interface RateLimitConfig {
    windowMs: number; // Zaman penceresi (milisaniye)
    maxRequests: number; // Maksimum istek sayısı
    blockDuration?: number; // Blok süresi (milisaniye)
    message?: string; // Hata mesajı
}

export function rateLimit(config: RateLimitConfig) {
    const {
        windowMs = 60000, // Varsayılan: 1 dakika
        maxRequests = 10, // Varsayılan: 10 istek
        blockDuration = 15 * 60 * 1000, // Varsayılan: 15 dakika blok
        message = 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
    } = config;

    return async (request: Request): Promise<Response | null> => {
        // IP adresini al
        const ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

        const now = Date.now();
        const key = `${ip}:${new URL(request.url).pathname}`;

        // Mevcut kayıt yoksa oluştur
        if (!store[key]) {
            store[key] = {
                count: 1,
                resetTime: now + windowMs,
                blocked: false,
            };
            return null; // İzin ver
        }

        const record = store[key];

        // Bloklu mu kontrol et
        if (record.blocked && record.blockUntil && record.blockUntil > now) {
            return new Response(
                JSON.stringify({ 
                    error: 'IP adresiniz geçici olarak engellenmiştir.',
                    retryAfter: Math.ceil((record.blockUntil - now) / 1000),
                }),
                { 
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(Math.ceil((record.blockUntil - now) / 1000)),
                    },
                }
            );
        }

        // Blok süresi dolmuşsa sıfırla
        if (record.blocked && record.blockUntil && record.blockUntil <= now) {
            record.blocked = false;
            record.count = 1;
            record.resetTime = now + windowMs;
            delete record.blockUntil;
            return null;
        }

        // Zaman penceresi dolmuşsa sıfırla
        if (record.resetTime <= now) {
            record.count = 1;
            record.resetTime = now + windowMs;
            return null;
        }

        // İstek sayısını artır
        record.count++;

        // Limit aşıldı mı?
        if (record.count > maxRequests) {
            record.blocked = true;
            record.blockUntil = now + blockDuration;
            
            return new Response(
                JSON.stringify({ 
                    error: message,
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
            );
        }

        // İzin ver
        return null;
    };
}

// Bot algılama
export function detectBot(request: Request): boolean {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    
    // Bilinen bot pattern'leri
    const botPatterns = [
        'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
        'python', 'java', 'perl', 'ruby', 'go-http-client',
        'headless', 'phantom', 'selenium', 'puppeteer',
    ];

    return botPatterns.some(pattern => userAgent.includes(pattern));
}

// Honeypot kontrolü (gizli alan)
export function checkHoneypot(formData: FormData): boolean {
    // Eğer honeypot alanı doldurulmuşsa bot'tur
    const honeypot = formData.get('website') || formData.get('url') || formData.get('homepage');
    return honeypot !== null && honeypot !== '';
}

// CSRF token doğrulama
export function generateCSRFToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
}
