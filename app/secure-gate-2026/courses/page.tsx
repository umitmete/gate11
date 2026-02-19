import { prisma } from "@/lib/db";
import CoursePackagesFinal from './CoursePackagesFinal';

export const dynamic = 'force-dynamic';

// Kurs paketlerini getiren ana admin sayfası
async function getCoursePackages() {
    try {
        // Raw query kullanıyoruz çünkü Prisma Client eski şemada kalmış olabilir
        const packages = await prisma.$queryRaw`
            SELECT * FROM "CoursePackage" 
            ORDER BY "order" ASC, "createdAt" DESC
        ` as any[];

        // Boolean alanları SQLite'dan doğru bir şekilde çevirelim
        return packages.map(pkg => ({
            ...pkg,
            showDate: pkg.showDate === 1 || pkg.showDate === true || pkg.showDate === '1' || pkg.showDate === null,
            // showPrice ekledim
            showPrice: pkg.showPrice === 1 || pkg.showPrice === true || pkg.showPrice === '1' || pkg.showPrice === null
        }));
    } catch (error) {
        console.error('Course Packages Fetch Error:', error);
        return [];
    }
}

export default async function AdminCoursesPage() {
    const packages = await getCoursePackages();

    return <CoursePackagesFinal packages={packages} />;
}
