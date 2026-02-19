import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    // Hem kök dizindeki dev.db hem de prisma/dev.db kontrol et
    let sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db');
    let db;
    try {
        db = new Database(sqlitePath, { readonly: true });
    } catch {
        sqlitePath = path.join(process.cwd(), 'dev.db');
        try {
            db = new Database(sqlitePath, { readonly: true });
        } catch {
            console.error('dev.db bulunamadı!');
            return;
        }
    }
    console.log(`SQLite: ${sqlitePath}`);

    // Tüm tabloları listele
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'").all() as any[];
    console.log('SQLite tabloları:', tables.map((t: any) => t.name));

    // Her tabloyu kontrol et
    for (const table of tables) {
        const rows = db.prepare(`SELECT * FROM "${table.name}"`).all();
        console.log(`\n=== ${table.name} (${rows.length} kayıt) ===`);
        if (rows.length > 0) {
            console.log(JSON.stringify(rows[0], null, 2).substring(0, 500));
        }
    }

    // Neon'daki durumu kontrol et
    console.log('\n\n=== NEON DURUMU ===');
    const neonPkgs = await prisma.coursePackage.count();
    const neonCourses = await prisma.course.count();
    const neonSchedules = await prisma.courseSchedule.count();
    const neonPlans = await prisma.yearlyPlan.count();
    const neonAdmins = await prisma.adminUser.count();
    const neonInstructors = await prisma.instructor.count();
    const neonVehicles = await prisma.vehicle.count();
    console.log(`CoursePackage: ${neonPkgs}`);
    console.log(`Course: ${neonCourses}`);
    console.log(`CourseSchedule: ${neonSchedules}`);
    console.log(`YearlyPlan: ${neonPlans}`);
    console.log(`AdminUser: ${neonAdmins}`);
    console.log(`Instructor: ${neonInstructors}`);
    console.log(`Vehicle: ${neonVehicles}`);

    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
