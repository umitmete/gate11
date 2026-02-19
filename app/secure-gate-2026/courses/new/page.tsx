import { prisma } from "@/lib/db";
import CoursePackageForm from '../CoursePackageForm';

export const dynamic = 'force-dynamic';

async function getTotalPackages() {
    try {
        return await prisma.coursePackage.count();
    } catch (error) {
        return 0;
    }
}

export default async function NewCoursePackagePage() {
    const totalPackages = await getTotalPackages();
    return <CoursePackageForm totalPackages={totalPackages} />;
}
