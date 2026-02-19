const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCourses() {
    console.log('🌱 Kurs paketleri ekleniyor...');

    // Gündüz Kursları
    const dayCourses = [
        {
            titleDe: 'B-PAKET',
            tagDe: 'Der Klassiker',
            price: '€ 1.490',
            courseType: 'DAY',
            featuresDe: JSON.stringify([
                "Verwaltungsaufwand",
                "Versicherung",
                "32 UE Theoriekurs (GW+B)",
                "18 Fahrlektionen",
                "Nachtfahrtzuschlag",
                "1. Theorie-Prüfung",
                "1. Praxis-Prüfung",
                "Online Code"
            ]),
            order: 1
        },
        {
            titleDe: 'B-DUAL',
            tagDe: 'Duale Ausbildung',
            price: '€ 1.249',
            courseType: 'DAY',
            featuresDe: JSON.stringify([
                "Verwaltungsaufwand",
                "Versicherung",
                "32 UE Theoriekurs (GW+B)",
                "12 Fahrlektionen",
                "1 UE Theoretische Einweisung",
                "2X L Tafel",
                "1. Theorie-Prüfung",
                "1. Praxis-Prüfung",
                "Online Code"
            ]),
            order: 2
        },
        {
            titleDe: 'B-L17',
            tagDe: 'Vorgezogene Lenkerberechtigung',
            price: '€ 1.649',
            courseType: 'DAY',
            featuresDe: JSON.stringify([
                "Verwaltungsaufwand",
                "Versicherung",
                "32 UE Theoriekurs (GW+B)",
                "17 Fahrlektionen",
                "1 UE Vorbesprechung",
                "2 UE Nachbesprechung",
                "2X L17 Tafel",
                "1. Theorie-Prüfung",
                "1. Praxis-Prüfung",
                "Online Code"
            ]),
            order: 3
        },
        {
            titleDe: 'A1-PAKET',
            tagDe: 'Motorrad Einstieg',
            price: '€ 1.349',
            courseType: 'DAY',
            featuresDe: JSON.stringify([
                "Verwaltungsaufwand",
                "Versicherung",
                "26 UE Theoriekurs (GW+A)",
                "14 Fahrlektionen",
                "1. Theorie-Prüfung",
                "1. Praxis-Prüfung",
                "Online Code"
            ]),
            order: 4
        },
        {
            titleDe: 'A2-PAKET',
            tagDe: 'Motorrad Aufstieg',
            price: '€ 1.249',
            courseType: 'DAY',
            featuresDe: JSON.stringify([
                "Verwaltungsaufwand",
                "Versicherung",
                "6UE Theoriekurs (A)",
                "14 Fahrlektionen",
                "1. Theorie-Prüfung",
                "1. Praxis-Prüfung",
                "Online Code"
            ]),
            order: 5
        },
        {
            titleDe: 'A-PAKET',
            tagDe: 'Motorrad Vollausbau',
            price: '€ 1.249',
            courseType: 'DAY',
            featuresDe: JSON.stringify([
                "Verwaltungsaufwand",
                "Versicherung",
                "6 UE Theoriekurs (A)",
                "14 Fahrlektionen",
                "1. Theorie-Prüfung",
                "1. Praxis-Prüfung",
                "Online Code"
            ]),
            order: 6
        }
    ];

    // Gece Kursları (aynı paketler)
    const nightCourses = dayCourses.map((course, index) => ({
        ...course,
        courseType: 'NIGHT',
        order: index + 1
    }));

    try {
        // Önce mevcut kursları temizle
        await prisma.coursePackage.deleteMany({});
        console.log('✅ Eski kurslar temizlendi');

        // Gündüz kurslarını ekle
        for (const course of dayCourses) {
            await prisma.coursePackage.create({
                data: {
                    ...course,
                    title: course.titleDe,
                    tag: course.tagDe,
                    features: course.featuresDe,
                    isVisible: true
                }
            });
        }
        console.log(`✅ ${dayCourses.length} gündüz kursu eklendi`);

        // Gece kurslarını ekle
        for (const course of nightCourses) {
            await prisma.coursePackage.create({
                data: {
                    ...course,
                    title: course.titleDe,
                    tag: course.tagDe,
                    features: course.featuresDe,
                    isVisible: true
                }
            });
        }
        console.log(`✅ ${nightCourses.length} gece kursu eklendi`);

        console.log('🎉 Tüm kurslar başarıyla eklendi!');
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedCourses();
