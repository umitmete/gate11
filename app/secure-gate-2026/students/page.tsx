import { prisma } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { Search } from 'lucide-react';
import StudentListClient from './StudentListClient';

export const dynamic = 'force-dynamic';

async function getData() {
    try {
        const students = await prisma.$queryRaw`
            SELECT * FROM "StudentRegistration" 
            WHERE "status" = 'APPROVED' 
            ORDER BY "submittedAt" DESC
        ` as any[];

        const plans = await prisma.yearlyPlan.findMany({
            where: { isActive: true },
            orderBy: { startDate: 'asc' }
        });

        return { students, plans };
    } catch (error) {
        console.error('Admin Students Data Fetch Error:', error);
        return { students: [], plans: [] };
    }
}

export default async function AdminStudentsPage() {
    const { students, plans } = await getData();

    // Group students by courseType + (Associated Plan or Submission Date)
    const groupedStudents = students.reduce((acc: any, student: any) => {
        // Try to find a matching plan for this student
        const studentSubmittedAt = dayjs(student.submittedAt);
        const matchingPlan = plans.find(p =>
            p.title.toLowerCase() === student.courseType.toLowerCase() &&
            (studentSubmittedAt.isBefore(dayjs(p.endDate).add(7, 'days'))) // Reasonable window
        ) || plans.find(p => p.title.toLowerCase() === student.courseType.toLowerCase());

        let groupKey = '';
        if (matchingPlan) {
            const start = dayjs(matchingPlan.startDate).format('DD.MM.YYYY');
            const end = dayjs(matchingPlan.endDate).format('DD.MM.YYYY');
            groupKey = `${student.courseType} (${start} - ${end})`;
        } else {
            const dateStr = studentSubmittedAt.format('DD.MM.YYYY');
            groupKey = `${student.courseType} - ${dateStr}`;
        }

        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(student);
        return acc;
    }, {});

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h2 className="text-4xl font-serif text-white italic">Schülerlisten</h2>
                    <p className="text-muted-foreground font-light">Listen der bestätigten Schüler nach Kursterminen.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 border border-primary/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Bestätigt Gesamt: {students.length}</span>
                </div>
            </div>

            {students.length > 0 ? (
                <StudentListClient groupedStudents={groupedStudents} />
            ) : (
                <div className="p-20 text-center bg-[#0a0a0a] border border-white/5">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                    <p className="text-muted-foreground font-serif italic text-xl">Noch keine bestätigten Schüler vorhanden.</p>
                    <p className="text-xs text-muted-foreground/40 uppercase tracking-widest mt-2">Sie können Schüler auf der Seite Voranmeldungen bestätigen.</p>
                </div>
            )}
        </div>
    );
}
