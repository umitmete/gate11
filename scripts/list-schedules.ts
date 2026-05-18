import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const schedules = await prisma.courseSchedule.findMany({
    take: 10,
    orderBy: { date: 'asc' }
  });
  console.log("SCHEDULES:", JSON.stringify(schedules, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
