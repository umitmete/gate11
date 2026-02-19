import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db');
    console.log(`Reading from SQLite: ${sqlitePath}`);

    let db;
    try {
        db = new Database(sqlitePath, { readonly: true });
    } catch (error) {
        console.error(`Error opening SQLite DB: ${(error as Error).message}`);
        console.error('Make sure prisma/dev.db exists.');
        return;
    }

    console.log('Connected to SQLite. Starting migration...');

    // 1. AdminUser
    try {
        const admins = db.prepare('SELECT * FROM AdminUser').all() as any[];
        console.log(`Migrating ${admins.length} AdminUsers...`);
        for (const admin of admins) {
            await prisma.adminUser.upsert({
                where: { email: admin.email },
                update: {},
                create: {
                    id: admin.id,
                    email: admin.email,
                    password: admin.password,
                    name: admin.name,
                    role: admin.role,
                },
            });
        }
    } catch (e) {
        console.log('Skipping AdminUser (table might not exist in SQLite or empty)');
    }

    // 2. Course
    try {
        const courses = db.prepare('SELECT * FROM Course').all() as any[];
        console.log(`Migrating ${courses.length} Courses...`);
        for (const course of courses) {
            await prisma.course.upsert({
                where: { id: course.id },
                update: {},
                create: {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    price: course.price,
                    duration: course.duration,
                    imageUrl: course.imageUrl,
                    isVisible: Boolean(course.isVisible),
                    order: course.order,
                },
            });
        }
    } catch (e) {
        console.log('Skipping Course');
    }

    // 3. CoursePackage
    try {
        const packages = db.prepare('SELECT * FROM CoursePackage').all() as any[];
        console.log(`Migrating ${packages.length} CoursePackages...`);
        for (const pkg of packages) {
            await prisma.coursePackage.upsert({
                where: { id: pkg.id },
                update: {},
                create: {
                    id: pkg.id,
                    title: pkg.title,
                    tag: pkg.tag,
                    price: pkg.price,
                    courseType: pkg.courseType,
                    features: pkg.features,
                    titleDe: pkg.titleDe,
                    titleEn: pkg.titleEn,
                    titleTr: pkg.titleTr,
                    titleAr: pkg.titleAr,
                    titleFa: pkg.titleFa,
                    tagDe: pkg.tagDe,
                    tagEn: pkg.tagEn,
                    tagTr: pkg.tagTr,
                    tagAr: pkg.tagAr,
                    tagFa: pkg.tagFa,
                    featuresDe: pkg.featuresDe,
                    featuresEn: pkg.featuresEn,
                    featuresTr: pkg.featuresTr,
                    featuresAr: pkg.featuresAr,
                    featuresFa: pkg.featuresFa,
                    isVisible: Boolean(pkg.isVisible),
                    showDate: Boolean(pkg.showDate),
                    showPrice: Boolean(pkg.showPrice),
                    order: pkg.order,
                },
            });
        }
    } catch (e) {
        console.log('Skipping CoursePackage');
    }

    // 4. Instructor
    try {
        const instructors = db.prepare('SELECT * FROM Instructor').all() as any[];
        console.log(`Migrating ${instructors.length} Instructors...`);
        for (const inst of instructors) {
            await prisma.instructor.upsert({
                where: { id: inst.id },
                update: {},
                create: {
                    id: inst.id,
                    name: inst.name,
                    role: inst.role,
                    bio: inst.bio,
                    imageUrl: inst.imageUrl,
                    licenseTypes: inst.licenseTypes,
                    isVisible: Boolean(inst.isVisible),
                    order: inst.order,
                },
            });
        }
    } catch (e) {
        console.log('Skipping Instructor');
    }

    // 5. Vehicle
    try {
        const vehicles = db.prepare('SELECT * FROM Vehicle').all() as any[];
        console.log(`Migrating ${vehicles.length} Vehicles...`);
        for (const v of vehicles) {
            await prisma.vehicle.upsert({
                where: { id: v.id },
                update: {},
                create: {
                    id: v.id,
                    name: v.name,
                    brand: v.brand,
                    type: v.type,
                    category: v.category,
                    imageUrl: v.imageUrl,
                    features: v.features,
                    isVisible: Boolean(v.isVisible),
                },
            });
        }
    } catch (e) {
        console.log('Skipping Vehicle');
    }

    // 6. YearlyPlan
    try {
        const plans = db.prepare('SELECT * FROM YearlyPlan').all() as any[];
        console.log(`Migrating ${plans.length} YearlyPlans...`);
        for (const plan of plans) {
            await prisma.yearlyPlan.upsert({
                where: { id: plan.id },
                update: {},
                create: {
                    id: plan.id,
                    title: plan.title,
                    description: plan.description,
                    startDate: new Date(plan.startDate),
                    endDate: new Date(plan.endDate),
                    courseType: plan.courseType,
                    isActive: Boolean(plan.isActive),
                },
            });
        }
    } catch (e) {
        console.log('Skipping YearlyPlan');
    }

    // 7. CourseSchedule
    try {
        const schedules = db.prepare('SELECT * FROM CourseSchedule').all() as any[];
        console.log(`Migrating ${schedules.length} CourseSchedules...`);
        for (const s of schedules) {
            await prisma.courseSchedule.upsert({
                where: { id: s.id },
                update: {},
                create: {
                    id: s.id,
                    date: new Date(s.date),
                    time: s.time,
                    abbreviation: s.abbreviation,
                    topic: s.topic,
                    type: s.type,
                    isVisible: Boolean(s.isVisible),
                },
            });
        }
    } catch (e) {
        console.log('Skipping CourseSchedule');
    }

    // 8. StudentRegistration
    try {
        const registrations = db.prepare('SELECT * FROM StudentRegistration').all() as any[];
        console.log(`Migrating ${registrations.length} StudentRegistrations...`);
        for (const r of registrations) {
            await prisma.studentRegistration.upsert({
                where: { id: r.id },
                update: {},
                create: {
                    id: r.id,
                    salutation: r.salutation,
                    firstName: r.firstName,
                    lastName: r.lastName,
                    email: r.email,
                    phone: r.phone,
                    birthDate: new Date(r.birthDate),
                    birthPlace: r.birthPlace,
                    nationality: r.nationality,
                    street: r.street,
                    zipCode: r.zipCode,
                    city: r.city,
                    courseType: r.courseType,
                    licenseClass: r.licenseClass,
                    // Urls might be null
                    idCardUrl: r.idCardUrl,
                    passportUrl: r.passportUrl,
                    firstAidUrl: r.firstAidUrl,
                    residenceUrl: r.residenceUrl,
                    registrationPdfUrl: r.registrationPdfUrl,

                    bringIdLater: Boolean(r.bringIdLater),
                    bringPassportLater: Boolean(r.bringPassportLater),
                    bringResidenceLater: Boolean(r.bringResidenceLater),

                    status: r.status,
                    submittedAt: new Date(r.submittedAt),
                },
            });
        }
    } catch (e) {
        console.log('Skipping StudentRegistration', e);
    }

    console.log('Migration completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
