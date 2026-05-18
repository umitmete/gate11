const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { translateText, translateArray } = require('./lib/translation-service.ts');

async function main() {
    const data = {
        titleDe: "B-PAKET",
        tagDe: "Klassik",
        price: "€ 100",
        courseType: "DAY",
        isVisible: true,
        order: 0,
        autoTranslate: true,
        categoryId: null,
        title: "B-PAKET",
        tag: "Klassik",
        features: "[\"Test\"]",
        featuresDe: "[\"Test\"]",
        categoryIds: "[]"
    };

    try {
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

        // Fake the translate logic
        titleEn = "Translated"; titleTr = "Translated"; titleAr = "Translated"; titleFa = "Translated";
        tagEn = "Translated"; tagTr = "Translated"; tagAr = "Translated"; tagFa = "Translated";
        featuresEn = "[]"; featuresTr = "[]"; featuresAr = "[]"; featuresFa = "[]";

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
                categoryId: data.categoryId || null,
                categoryIds: data.categoryIds || '[]',
            }
        });
        console.log("Success", newPackage);
    } catch (e) {
        console.error("DEBUG ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
