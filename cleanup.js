const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.coursePackage.deleteMany({
        where: { titleDe: { in: ['Test', 'B-PAKET'] }, createdAt: { gt: new Date(Date.now() - 10 * 60000) } }
    });
}
main();
