import { prisma } from "@/lib/db";
import CoursePackagesFinal from './CoursePackagesFinal';

export const dynamic = 'force-dynamic';

// Kurs paketlerini getiren ana admin sayfası
async function getCoursePackages() {
    try {
        const packages = await prisma.$queryRawUnsafe(`
            SELECT id, title, tag, price, "courseType", features, "titleDe", "tagDe", "featuresDe", "isVisible", "showDate", "showPrice", "order", "categoryId", "categoryIds"
            FROM "CoursePackage"
            ORDER BY "order" ASC, "createdAt" DESC
        `) as any[];

        return packages;
    } catch (error) {
        console.error('Course Packages Fetch Error:', error);
        return [];
    }
}

export default async function AdminCoursesPage() {
    const packages = await getCoursePackages();

    return <CoursePackagesFinal packages={packages} />;
}
