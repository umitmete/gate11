import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting full database backup from production Neon database...');
    
    try {
        const backupData = {
            timestamp: new Date().toISOString(),
            packageCategories: await prisma.packageCategory.findMany(),
            coursePackages: await prisma.coursePackage.findMany(),
            adminUsers: await prisma.adminUser.findMany(),
            courseSchedules: await prisma.courseSchedule.findMany(),
            courses: await prisma.course.findMany(),
            instructors: await prisma.instructor.findMany(),
            vehicles: await prisma.vehicle.findMany(),
            yearlyPlans: await prisma.yearlyPlan.findMany(),
            studentRegistrations: await prisma.studentRegistration.findMany()
        };

        const backupPath = path.join(process.cwd(), 'database-backup.json');
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
        
        console.log(`\n✅ Backup completed successfully!`);
        console.log(`📁 File saved to: ${backupPath}`);
        console.log(`📊 Backup Stats:`);
        console.log(`   - Categories: ${backupData.packageCategories.length}`);
        console.log(`   - Course Packages: ${backupData.coursePackages.length}`);
        console.log(`   - Admin Users: ${backupData.adminUsers.length}`);
        console.log(`   - Course Schedules: ${backupData.courseSchedules.length}`);
        console.log(`   - Courses: ${backupData.courses.length}`);
        console.log(`   - Instructors: ${backupData.instructors.length}`);
        console.log(`   - Vehicles: ${backupData.vehicles.length}`);
        console.log(`   - Yearly Plans: ${backupData.yearlyPlans.length}`);
        console.log(`   - Student Registrations: ${backupData.studentRegistrations.length}`);
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
