const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const packages = await prisma.coursePackage.findMany({
            select: { id: true, title: true, categoryIds: true, createdAt: true }
        });
        console.log("Packages:", packages);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
