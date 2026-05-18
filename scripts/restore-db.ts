import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const backupPath = path.join(process.cwd(), 'database-backup.json');
    if (!fs.existsSync(backupPath)) {
        console.error(`❌ Backup file not found at: ${backupPath}`);
        return;
    }

    console.log(`🔄 Reading backup data from: ${backupPath}...`);
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    console.log('⚠️ WARNING: This will completely replace the current database with the backup data!');
    console.log('🔄 Starting restore transaction...');

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Clear existing tables (order matters due to foreign keys)
            console.log('🧹 Clearing existing database tables...');
            await tx.coursePackage.deleteMany();
            await tx.packageCategory.deleteMany();
            await tx.courseSchedule.deleteMany();
            await tx.course.deleteMany();
            await tx.instructor.deleteMany();
            await tx.vehicle.deleteMany();
            await tx.yearlyPlan.deleteMany();
            await tx.studentRegistration.deleteMany();
            await tx.adminUser.deleteMany();

            // 2. Insert Categories
            console.log(`📥 Restoring ${backupData.packageCategories.length} categories...`);
            for (const item of backupData.packageCategories) {
                await tx.packageCategory.create({ data: item });
            }

            // 3. Insert Packages
            console.log(`📥 Restoring ${backupData.coursePackages.length} packages...`);
            for (const item of backupData.coursePackages) {
                await tx.coursePackage.create({ data: item });
            }

            // 4. Insert AdminUsers
            console.log(`📥 Restoring ${backupData.adminUsers.length} admin users...`);
            for (const item of backupData.adminUsers) {
                await tx.adminUser.create({ data: item });
            }

            // 5. Insert Schedules
            console.log(`📥 Restoring ${backupData.courseSchedules.length} schedules...`);
            for (const item of backupData.courseSchedules) {
                await tx.courseSchedule.create({
                    data: {
                        ...item,
                        date: new Date(item.date)
                    }
                });
            }

            // 6. Insert Courses
            console.log(`📥 Restoring ${backupData.courses.length} courses...`);
            for (const item of backupData.courses) {
                await tx.course.create({ data: item });
            }

            // 7. Insert Instructors
            console.log(`📥 Restoring ${backupData.instructors.length} instructors...`);
            for (const item of backupData.instructors) {
                await tx.instructor.create({ data: item });
            }

            // 8. Insert Vehicles
            console.log(`📥 Restoring ${backupData.vehicles.length} vehicles...`);
            for (const item of backupData.vehicles) {
                await tx.vehicle.create({ data: item });
            }

            // 9. Insert YearlyPlans
            console.log(`📥 Restoring ${backupData.yearlyPlans.length} yearly plans...`);
            for (const item of backupData.yearlyPlans) {
                await tx.yearlyPlan.create({
                    data: {
                        ...item,
                        startDate: new Date(item.startDate),
                        endDate: new Date(item.endDate)
                    }
                });
            }

            // 10. Insert Registrations
            console.log(`📥 Restoring ${backupData.studentRegistrations.length} student registrations...`);
            for (const item of backupData.studentRegistrations) {
                await tx.studentRegistration.create({
                    data: {
                        ...item,
                        birthDate: new Date(item.birthDate),
                        submittedAt: new Date(item.submittedAt)
                    }
                });
            }
        });

        console.log('\n✅ Database restore completed successfully! Siteniz yedeklenen ana geri dondu.');
    } catch (error) {
        console.error('❌ Restore failed! Changes rolled back.', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
