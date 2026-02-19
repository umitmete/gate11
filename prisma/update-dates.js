const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCourseDates() {
    console.log('🔄 Updating course dates...');

    // Clear old data
    await prisma.yearlyPlan.deleteMany({});

    // Add one current course date for B-L17
    const course = {
        title: 'B-L17',
        description: 'Nächster B-L17 Kurs',
        startDate: new Date('2026-01-29'),
        endDate: new Date('2026-02-06'),
        isActive: true
    };

    await prisma.yearlyPlan.create({
        data: course
    });

    console.log(`✅ Created: ${course.title} (${course.startDate.toLocaleDateString('de-DE')} - ${course.endDate.toLocaleDateString('de-DE')})`);
    console.log('✨ Update completed!');
}

updateCourseDates()
    .catch((e) => {
        console.error('❌ Error updating:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
