const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const newPackage = await prisma.coursePackage.create({
            data: {
                title: "Test",
                tag: "Test tag",
                price: "€ 100",
                courseType: "DAY",
                features: "[]",
                titleDe: "Test",
                tagDe: "Test tag",
                featuresDe: "[]",
                isVisible: true,
                order: 0,
                categoryId: null,
                categoryIds: "[]"
            }
        });
        console.log("Success:", newPackage);
    } catch (e) {
        console.error("Error creating:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
