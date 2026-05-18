const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.adminUser.count();
        const packageCount = await prisma.coursePackage.count();
        const categoryCount = await prisma.packageCategory.count();
        
        console.log(`AdminUsers: ${userCount}`);
        console.log(`Packages: ${packageCount}`);
        console.log(`Categories: ${categoryCount}`);
        
        const users = await prisma.adminUser.findMany();
        console.log("Admin details:", users);
    } catch (e) {
        console.error("DB Check Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
