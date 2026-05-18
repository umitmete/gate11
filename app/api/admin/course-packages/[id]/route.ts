import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { translateText, translateArray } from '@/lib/translation-service';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const pkg = await prisma.coursePackage.findUnique({
            where: { id: params.id }
        });
        if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(pkg);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const data = await request.json();

        // Almanca verileri temel alıyoruz
        const titleDe = data.titleDe || data.title;
        const tagDe = data.tagDe || data.tag;
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
        } else {
            // Otomatik çeviri kapalıysa gelen diğer dil değerlerini koru
            titleEn = data.titleEn || '';
            titleTr = data.titleTr || '';
            titleAr = data.titleAr || '';
            titleFa = data.titleFa || '';

            tagEn = data.tagEn || '';
            tagTr = data.tagTr || '';
            tagAr = data.tagAr || '';
            tagFa = data.tagFa || '';

            featuresEn = data.featuresEn || '[]';
            featuresTr = data.featuresTr || '[]';
            featuresAr = data.featuresAr || '[]';
            featuresFa = data.featuresFa || '[]';
        }

        const updated = await prisma.coursePackage.update({
            where: { id: params.id },
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
                order: data.order || 0
            }
        });

        // Use raw SQL to bypass old Prisma client loaded in Next.js memory
        if (data.categoryId !== undefined || data.categoryIds !== undefined) {
            await prisma.$executeRawUnsafe(
                `UPDATE "CoursePackage" SET "categoryId" = $1, "categoryIds" = $2 WHERE "id" = $3`,
                data.categoryId || null,
                data.categoryIds || '[]',
                params.id
            );
        }
        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Course Package PUT Error:', error);
        return NextResponse.json({ error: 'Failed', details: error?.message || String(error) }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const data = await request.json();

        // SWAP MANTIĞI: Eğer sıra değişiyorsa ve hedef sıra doluysa, yer değiştir.
        if (data.order !== undefined) {
            const targetOrder = Number(data.order);
            const currentPkg = await prisma.coursePackage.findUnique({
                where: { id: params.id },
                select: { order: true }
            });

            if (currentPkg && currentPkg.order !== targetOrder) {
                // Hedef sırada birisi var mı?
                const collision = await prisma.coursePackage.findFirst({
                    where: {
                        order: targetOrder,
                        id: { not: params.id }
                    }
                });

                if (collision) {
                    // Varsa, onun sırasını bizim eski sıramıza al (Swap)
                    await prisma.coursePackage.update({
                        where: { id: collision.id },
                        data: { order: currentPkg.order }
                    });
                }
            }
        }
        const updateData: any = {};
        if (data.showDate !== undefined) updateData.showDate = Boolean(data.showDate);
        if (data.showPrice !== undefined) updateData.showPrice = Boolean(data.showPrice);
        if (data.isVisible !== undefined) updateData.isVisible = Boolean(data.isVisible);
        if (data.order !== undefined) updateData.order = Number(data.order);
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;

        if (Object.keys(updateData).length > 0) {
            await prisma.coursePackage.update({
                where: { id: params.id },
                data: updateData
            });
        }

        if (data.categoryIds !== undefined) {
            await prisma.$executeRawUnsafe(
                `UPDATE "CoursePackage" SET "categoryIds" = $1 WHERE "id" = $2`,
                data.categoryIds,
                params.id
            );
        }

        const pkg = await prisma.coursePackage.findUnique({ where: { id: params.id } });
        return NextResponse.json(pkg || { success: true });
    } catch (error: any) {
        try {
            const fs = require('fs');
            fs.writeFileSync('api-patch-error.log', `${new Date().toISOString()} - ERROR: ${error?.message || error}\n${error?.stack || ''}\n\n`);
        } catch (e) {}
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        await prisma.coursePackage.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        try {
            const fs = require('fs');
            fs.writeFileSync('api-error.log', `${new Date().toISOString()} - ERROR: ${error?.message || error}\n${error?.stack || ''}\n\n`);
        } catch (e) {}
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
