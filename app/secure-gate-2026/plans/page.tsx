import { prisma } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { Calendar, Shield, Clock } from 'lucide-react';
import CreatePlanForm from "./CreatePlanForm";
import EditPlanForm from "./EditPlanForm";
import DeletePlanButton from "./DeletePlanButton";
import TogglePlanVisibility from "./TogglePlanVisibility";

export const dynamic = 'force-dynamic';

/**
 * Ruft alle aktuellen Kurspläne aus der Datenbank ab.
 * Sortiert zuerst nach Kursname, dann nach Startdatum.
 */
async function getAdminPlans() {
    try {
        return await prisma.yearlyPlan.findMany({
            orderBy: [
                { title: 'asc' },      // Zuerst nach Kursname
                { startDate: 'asc' }   // Dann nach Datum innerhalb des Kurses
            ],
        });
    } catch (error) {
        console.error('Admin Plans Fetch Error:', error);
        return [];
    }
}

/**
 * Ruft alle verfügbaren Kurspakete aus der Datenbank ab.
 */
async function getCoursePackages() {
    try {
        return await prisma.coursePackage.findMany({
            select: {
                title: true,
                courseType: true,
            },
            orderBy: {
                order: 'asc'
            }
        });
    } catch (error) {
        console.error('Course Packages Fetch Error:', error);
        return [];
    }
}

export default async function AdminPlansPage() {
    const plans = await getAdminPlans();
    const coursePackages = await getCoursePackages();
    const now = dayjs().utc();

    // Kurs verilerini form'a iletmek için structured olarak hazırla
    const uniqueCourses = Array.from(
        new Map(
            coursePackages.map(pkg => [
                pkg.title + pkg.courseType, // Benzersizlik için key
                { title: pkg.title, courseType: pkg.courseType }
            ])
        ).values()
    );

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic">Kurstermine</h2>
                    <p className="text-muted-foreground font-light text-sm md:text-base">Verwalten Sie die Termine für alle Kurse und Ausbildungsprogramme.</p>
                </div>
                <div className="w-full sm:w-auto">
                    <CreatePlanForm availableCourses={uniqueCourses} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {plans.map((plan: any) => {
                    const startDate = dayjs(plan.startDate);
                    const endDate = dayjs(plan.endDate);
                    const isExpired = endDate.isBefore(now);
                    const isUpcoming = startDate.isAfter(now);
                    const isActive = !isExpired && !isUpcoming && plan.isActive;

                    // Status und Farben festlegen
                    let statusColor = '';
                    let statusBg = '';
                    let statusText = '';
                    let statusLabel = '';

                    if (isExpired) {
                        statusColor = 'red-500';
                        statusBg = 'bg-red-500/10';
                        statusText = 'text-red-500';
                        statusLabel = 'Abgelaufen';
                    } else if (isActive) {
                        statusColor = 'green-500';
                        statusBg = 'bg-green-500/10';
                        statusText = 'text-green-500';
                        statusLabel = 'Aktiv';
                    } else if (isUpcoming) {
                        statusColor = 'blue-500';
                        statusBg = 'bg-blue-500/10';
                        statusText = 'text-blue-500';
                        statusLabel = 'Bevorstehend';
                    } else {
                        statusColor = 'gray-500';
                        statusBg = 'bg-gray-500/10';
                        statusText = 'text-gray-500';
                        statusLabel = 'Inaktiv';
                    }

                    return (
                        <div key={plan.id} className={`bg-[#0a0a0a] border p-8 group transition-all duration-500 ${isExpired ? 'border-red-500/20 hover:border-red-500/40' :
                            isActive ? 'border-green-500/20 hover:border-green-500/40' :
                                isUpcoming ? 'border-blue-500/20 hover:border-blue-500/40' :
                                    'border-gray-500/20 hover:border-gray-500/40'
                            }`}>
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 flex items-center justify-center ${statusBg} ${statusText}`}>
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif text-white italic">{plan.title}</h3>
                                    </div>
                                    <div className="flex flex-col gap-3 text-sm font-light text-muted-foreground">
                                        <div className="flex gap-8">
                                            <div className="flex items-center gap-2">
                                                <Clock className={`w-4 h-4 ${statusText}`} />
                                                Start: {startDate.format('DD.MM.YYYY')}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className={`w-4 h-4 ${statusText}`} />
                                                Ende: {endDate.format('DD.MM.YYYY')}
                                            </div>
                                        </div>
                                        {plan.description && (
                                            <div className="p-3 bg-white/5 border-l-2 border-[#D4AF37]/30 text-xs italic">
                                                <span className="text-[#D4AF37] not-italic font-bold mr-2">HINWEIS:</span>
                                                {plan.description}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-right space-y-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 block">Status</span>
                                        <span className={`inline-flex items-center px-4 py-1.5 ${statusBg} ${statusText} text-[10px] font-bold uppercase tracking-widest border border-${statusColor}/20`}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <TogglePlanVisibility planId={plan.id} isActive={plan.isActive} />
                                        <EditPlanForm plan={plan} />
                                        <DeletePlanButton planId={plan.id} planTitle={plan.title} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {plans.length === 0 && (
                    <div className="p-20 text-center bg-[#0a0a0a] border border-white/5">
                        <p className="text-muted-foreground font-serif italic text-xl">Noch keine Kurse gefunden. Erstellen Sie einen neuen Kurs.</p>
                    </div>
                )}
            </div>

            <div className="p-8 bg-blue-500/5 border border-blue-500/20 flex gap-6 items-start">
                <Shield className="w-6 h-6 text-blue-500 shrink-0" />
                <div className="space-y-2">
                    <h4 className="text-blue-500 font-bold uppercase tracking-widest text-xs">Automatisierungsinformationen</h4>
                    <p className="text-sm text-blue-500/70 font-light leading-relaxed">
                        Abgelaufene Kurse werden automatisch von der öffentlichen Website ausgeblendet, werden hier jedoch weiterhin mit dem Status „Abgelaufen“ angezeigt. Sie müssen die Kurse nicht manuell schließen, das System verwaltet sie automatisch basierend auf der Serverzeit (UTC).
                    </p>
                </div>
            </div>
        </div>
    );
}
