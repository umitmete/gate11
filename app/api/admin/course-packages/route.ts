import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { translateText, translateArray } from '@/lib/translation-service';

// GET - Tüm kurs paketlerini getir
export async function GET() {
    try {
        const packages = await prisma.coursePackage.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(packages);
    } catch (error) {
        console.error('Course Packages GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

// POST - Yeni kurs paketi ekle
export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Almanca verileri temel alıyoruz
        const titleDe = data.titleDe;
        const tagDe = data.tagDe;
        const featuresDeList = JSON.parse(data.featuresDe || '[]');

        let titleEn = data.titleEn || '';
        let titleTr = data.titleTr || '';
        let titleAr = '';
        let titleFa = '';

        let tagEn = data.tagEn || '';
        let tagTr = data.tagTr || '';
        let tagAr = '';
        let tagFa = '';

        let featuresEn = data.featuresEn || '[]';
        let featuresTr = data.featuresTr || '[]';
        let featuresAr = '[]';
        let featuresFa = '[]';

        // Eğer otomatik çeviri açıksa (veya diğer diller boşsa) çevir
        if (data.autoTranslate) {
            // Başlık Çevirileri
            [titleEn, titleTr, titleAr, titleFa] = await Promise.all([
                translateText(titleDe, 'en'),
                translateText(titleDe, 'tr'),
                translateText(titleDe, 'ar'),
                translateText(titleDe, 'fa')
            ]);

            // Etiket Çevirileri
            [tagEn, tagTr, tagAr, tagFa] = await Promise.all([
                translateText(tagDe, 'en'),
                translateText(tagDe, 'tr'),
                translateText(tagDe, 'ar'),
                translateText(tagDe, 'fa')
            ]);

            // Özellikler Çevirileri
            const [fEn, fTr, fAr, fFa] = await Promise.all([
                translateArray(featuresDeList, 'en'),
                translateArray(featuresDeList, 'tr'),
                translateArray(featuresDeList, 'ar'),
                translateArray(featuresDeList, 'fa')
            ]);

            featuresEn = JSON.stringify(fEn);
            featuresTr = JSON.stringify(fTr);
            featuresAr = JSON.stringify(fAr);
            featuresFa = JSON.stringify(fFa);
        }

        const newPackage = await prisma.coursePackage.create({
            data: {
                title: titleDe || data.title,
                tag: tagDe || data.tag,
                price: data.price,
                courseType: data.courseType,
                features: data.featuresDe || data.features,

                titleDe,
                titleEn,
                titleTr,
                titleAr,
                titleFa,

                tagDe,
                tagEn,
                tagTr,
                tagAr,
                tagFa,

                featuresDe: data.featuresDe,
                featuresEn,
                featuresTr,
                featuresAr,
                featuresFa,

                isVisible: data.isVisible ?? true,
                order: data.order || 0,
            }
        });

        return NextResponse.json(newPackage, { status: 201 });
    } catch (error) {
        console.error('Course Package POST Error:', error);
        return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }
}

// PATCH - Toplu güncelleme
export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        
        // Eğer global showDate güncellemesi ise
        if (data.showDate !== undefined) {
             const newValue = data.showDate ? 1 : 0;
             const count = await prisma.$executeRaw`
                UPDATE "CoursePackage" SET showDate = ${newValue}
             `;
             return NextResponse.json({ success: true, count });
        }
        
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        
    } catch (error) {
        console.error('Course Package Bulk Update Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
