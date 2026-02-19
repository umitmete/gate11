const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTeam() {
    console.log('🌱 Ekip üyeleri ekleniyor...');

    const instructors = [
        {
            name: "Alexander Bauer",
            role: "Fahrschulleiter",
            bio: "Mit über 20 Jahren Erfahrung sorgt er dafür, dass jeder Schüler sicher ans Ziel kommt.",
            licenseTypes: "A, B, C, D, E",
            isVisible: true
        },
        {
            name: "Sarah Müller",
            role: "Fahrlehrerin",
            bio: "Geduldig und professionell – spezialisiert auf nervöse Fahranfänger.",
            licenseTypes: "B, L17",
            isVisible: true
        },
        {
            name: "Michael Schmidt",
            role: "Motorrad-Instruktor",
            bio: "Leidenschaftlicher Biker und Experte für alle Zweirad-Klassen.",
            licenseTypes: "A, A1, A2",
            isVisible: true
        }
    ];

    try {
        // Önce mevcutları temizle
        await prisma.instructor.deleteMany({});
        console.log('✅ Eski kayıtlar temizlendi');

        for (const instructor of instructors) {
            await prisma.instructor.create({
                data: instructor
            });
            console.log(`✅ Eklendi: ${instructor.name}`);
        }

        console.log('🎉 Ekip üyeleri başarıyla eklendi!');
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedTeam();
