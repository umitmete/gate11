const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSimpleCourses() {
    console.log('🌱 Temel kurslar (Kurse) ekleniyor...');

    const courses = [
        {
            name: "Mopedführerschein (AM)",
            description: "Freiheit auf zwei Rädern ab 15 Jahren. Inklusive Theorie und Praxistraining.",
            price: 199.00,
            duration: "6 UE Theorie + 8 UE Praxis",
            isVisible: true,
            order: 1
        },
        {
            name: "Code 111 (B-Schein)",
            description: "Motorradfahren (bis 125ccm) mit dem B-Führerschein. Keine Prüfung erforderlich!",
            price: 249.00,
            duration: "6 UE Praxis",
            isVisible: true,
            order: 2
        },
        {
            name: "Mehrphasenausbildung",
            description: "Die zweite Ausbildungsphase für Fahranfänger. Perfektion und Sicherheit.",
            price: 350.00,
            duration: "2 Perfektionsfahrten + Fahrsicherheitstraining",
            isVisible: true,
            order: 3
        }
    ];

    try {
        // Önce mevcutları temizle
        await prisma.course.deleteMany({});
        console.log('✅ Eski kurslar temizlendi');

        for (const course of courses) {
            await prisma.course.create({
                data: course
            });
            console.log(`✅ Eklendi: ${course.name}`);
        }

        console.log('🎉 Temel kurslar başarıyla eklendi!');
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSimpleCourses();
