import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { translateText, translateArray } from '@/lib/translation-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseType = searchParams.get('type') || 'DAY';
        const lang = searchParams.get('lang') || 'de';

        // RAW QUERY kullanıyoruz çünkü Prisma Client generate edilemedi (Dosya kilitli).
        // SQLite'da boolean değerler 1 ve 0 olarak tutulur.
        const packages = await prisma.$queryRaw`
            SELECT * FROM "CoursePackage" 
            WHERE "courseType" = ${courseType} AND "isVisible" = true
            ORDER BY "order" ASC, "createdAt" DESC
        ` as any[];

        // Dil bazında formatlama ve Otomatik Çeviri
        const formattedPackages = await Promise.all(packages.map(async (pkg: any) => {
            let title, tag, features;

            // showDate mantığı
            const rawShowDate = pkg.showDate ?? pkg.show_date ?? pkg.ShowDate ?? pkg.isVisibleDate ?? pkg.showdate;
            let showDate = true;
            if (rawShowDate !== undefined && rawShowDate !== null) {
                showDate = Boolean(rawShowDate);
            }

            // showPrice mantığı
            const rawShowPrice = pkg.showPrice ?? pkg.show_price ?? pkg.ShowPrice ?? pkg.isVisiblePrice ?? pkg.showprice;
            let showPrice = true;
            if (rawShowPrice !== undefined && rawShowPrice !== null) {
                showPrice = Boolean(rawShowPrice);
            }

            if (lang !== 'de') {
                const targetLang = lang as any;

                // Başlık - Paket isimlerini (A-PAKET, B-PAKET, vb.) çevirme
                const dbTitle = pkg[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
                const originalTitle = pkg.titleDe || pkg.title;
                // Paket ismi formatında mı kontrol et (örn: A-PAKET, B-L17, A1-PAKET)
                const isPackageName = /^[AB][12]?(-[A-Z0-9]+)?$/i.test(originalTitle);
                title = isPackageName ? originalTitle : (dbTitle || await translateText(originalTitle, targetLang).catch(() => originalTitle));

                // Etiket
                const dbTag = pkg[`tag${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
                tag = dbTag || await translateText(pkg.tagDe || pkg.tag, targetLang).catch(() => pkg.tagDe || pkg.tag);

                // Özellikler (Array)
                const dbFeaturesStr = pkg[`features${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
                let dbFeatures = [];
                try { dbFeatures = dbFeaturesStr ? JSON.parse(dbFeaturesStr) : []; } catch (e) { }

                if (dbFeatures && dbFeatures.length > 0) {
                    features = dbFeatures;
                } else {
                    const deFeatures = JSON.parse(pkg.featuresDe || pkg.features || '[]');
                    features = await translateArray(deFeatures, targetLang).catch(() => deFeatures);
                }
            } else {
                title = pkg.titleDe || pkg.title;
                tag = pkg.tagDe || pkg.tag;
                features = JSON.parse(pkg.featuresDe || pkg.features || '[]');
            }

            return {
                id: pkg.id,
                title,
                tag,
                price: showPrice ? pkg.price : null,
                features,
                showDate: showDate,
                showPrice: showPrice
            };
        }));

        return new NextResponse(JSON.stringify(formattedPackages), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Public Course Packages Error:', error);
        return NextResponse.json([], { status: 200 });
    }
}
