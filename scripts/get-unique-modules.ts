import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const schedules = await prisma.courseSchedule.findMany({
    orderBy: { abbreviation: 'asc' }
  });
  
  const unique = new Map<string, string>();
  schedules.forEach(s => {
    unique.set(s.abbreviation, s.topic);
  });
  
  console.log("MODULES:", JSON.stringify(Array.from(unique.entries()), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
