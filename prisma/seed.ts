const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPlans() {
    console.log('🌱 Seeding course dates...');

    // Clear existing plans
    await prisma.yearlyPlan.deleteMany({});

    // Add current valid course dates
    const plans = [
        {
            title: 'Theoriekurs Block 1',
            description: 'Erster Theoriekurs-Block für Jänner/Februar 2026',
            startDate: new Date('2026-01-29'),
            endDate: new Date('2026-02-06'),
            isActive: true
        },
        {
            title: 'Theoriekurs Block 2',
            description: 'Zweiter Theoriekurs-Block für Februar 2026',
            startDate: new Date('2026-02-10'),
            endDate: new Date('2026-02-18'),
            isActive: true
        },
        {
            title: 'Theoriekurs Block 3',
            description: 'Dritter Theoriekurs-Block für März 2026',
            startDate: new Date('2026-03-02'),
            endDate: new Date('2026-03-10'),
            isActive: true
        }
    ];

    for (const plan of plans) {
        await prisma.yearlyPlan.create({
            data: plan
        });
        console.log(`✅ Created: ${plan.title} (${plan.startDate.toLocaleDateString('de-DE')} - ${plan.endDate.toLocaleDateString('de-DE')})`);
    }

    console.log('✨ Seeding completed!');
}

seedPlans()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
