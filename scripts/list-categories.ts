import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.packageCategory.findMany({
    orderBy: { order: 'asc' }
  });
  console.log("CATEGORIES:", JSON.stringify(categories, null, 2));
  
  const packages = await prisma.coursePackage.findMany({
    include: { category: true }
  });
  console.log("PACKAGES:", JSON.stringify(packages.map(p => ({
    id: p.id,
    title: p.title,
    categoryName: p.category?.name,
    categoryIds: p.categoryIds
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
