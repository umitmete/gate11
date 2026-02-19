import { prisma } from "@/lib/db";
import CoursePackageForm from '../CoursePackageForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getCoursePackage(id: string) {
    try {
        return await prisma.coursePackage.findUnique({
            where: { id }
        });
    } catch (error) {
        return null;
    }
}

async function getTotalPackages() {
    try {
        return await prisma.coursePackage.count();
    } catch (error) {
        return 0;
    }
}

export default async function EditCoursePackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [pkg, totalPackages] = await Promise.all([
        getCoursePackage(id),
        getTotalPackages()
    ]);

    if (!pkg) {
        notFound();
    }

    return <CoursePackageForm initialData={pkg} isEdit totalPackages={totalPackages} />;
}
