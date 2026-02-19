const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAllCourses() {
    console.log('🌱 Seeding all course dates...');

    // Clear existing data
    await prisma.yearlyPlan.deleteMany({});

    // Add dates for all 6 courses
    const courses = [
        {
            title: 'B-L17',
            description: 'B-L17 Kurs - Vorgezogene Lenkerberechtigung',
            startDate: new Date('2026-01-29'),
            endDate: new Date('2026-02-06'),
            isActive: true
        },
        {
            title: 'B-PAKET',
            description: 'B-Paket Kurs - Der Klassiker',
            startDate: new Date('2026-02-10'),
            endDate: new Date('2026-02-18'),
            isActive: true
        },
        {
            title: 'B-DUAL',
            description: 'B-Dual Kurs - Duale Ausbildung',
            startDate: new Date('2026-02-24'),
            endDate: new Date('2026-03-04'),
            isActive: true
        },
        {
            title: 'A1-PAKET',
            description: 'A1-Paket Kurs - Motorrad Einstieg',
            startDate: new Date('2026-03-09'),
            endDate: new Date('2026-03-17'),
            isActive: true
        },
        {
            title: 'A2-PAKET',
            description: 'A2-Paket Kurs - Motorrad Aufstieg',
            startDate: new Date('2026-03-23'),
            endDate: new Date('2026-03-31'),
            isActive: true
        },
        {
            title: 'A-PAKET',
            description: 'A-Paket Kurs - Motorrad Vollausbau',
            startDate: new Date('2026-04-06'),
            endDate: new Date('2026-04-14'),
            isActive: true
        }
    ];

    for (const course of courses) {
        await prisma.yearlyPlan.create({
            data: course
        });
        console.log(`✅ Created: ${course.title} (${course.startDate.toLocaleDateString('de-DE')} - ${course.endDate.toLocaleDateString('de-DE')})`);
    }

    console.log('✨ All courses seeded successfully!');
}

seedAllCourses()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
