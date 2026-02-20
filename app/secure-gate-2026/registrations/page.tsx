import { prisma } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { Download, FileText, User, Mail, Calendar, MapPin } from 'lucide-react';
import DeleteRegistrationButton from './DeleteRegistrationButton';
import ApproveRegistrationButton from './ApproveRegistrationButton';
import EditRegistrationForm from './EditRegistrationForm';
import RegistrationDocuments from './RegistrationDocuments';

export const dynamic = 'force-dynamic';

async function getRegistrations() {
    try {
        // We use queryRaw because the Prisma Client might not be regenerated yet due to file locks
        // This allows us to access the new database columns immediately.
        return await prisma.$queryRaw`SELECT * FROM "StudentRegistration" ORDER BY "submittedAt" DESC` as any[];
    } catch (error) {
        console.error('Admin Registrations Fetch Error:', error);
        return [];
    }
}

export default async function AdminRegistrationsPage() {
    const registrations = await getRegistrations();

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <div className="flex flex-col gap-4 items-start lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic">Voranmeldungen</h2>
                    <p className="text-sm md:text-base text-muted-foreground font-light">Eingehende Schülerdaten und Dokumente verwalten.</p>
                </div>
                <div className="bg-[#D4AF37]/10 px-4 py-2 border border-[#D4AF37]/20 w-full lg:w-auto text-center lg:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Gesamt: {registrations.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {registrations.map((reg: any) => (
                    <div key={reg.id} className="bg-[#0a0a0a] border border-white/5 p-5 md:p-8 group hover:border-[#D4AF37]/30 transition-all duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                            {/* Student Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-serif italic text-xl shrink-0">
                                        {reg.firstName[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-base md:text-lg font-serif text-white truncate">{reg.firstName} {reg.lastName}</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-widest">{reg.courseType}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm font-light text-muted-foreground break-words">
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#D4AF37] shrink-0" /> <span className="truncate">{reg.email}</span></div>
                                    <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" /> {reg.city} {reg.zipCode}</div>
                                    <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D4AF37] shrink-0" /> Geb: {dayjs(reg.birthDate).format('DD.MM.YYYY')}</div>
                                </div>
                            </div>

                            {/* Status & Timing */}
                            <div className="flex flex-col justify-center space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Eingegangen am</span>
                                <div className="text-white font-serif italic">{dayjs(reg.submittedAt).format('DD.MM.YYYY HH:mm')}</div>
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                        {reg.status}
                                    </span>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="lg:col-span-2 space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 block mb-2">Dokumente & Status</span>
                                <RegistrationDocuments registration={reg} />

                                <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
                                    <ApproveRegistrationButton
                                        registrationId={reg.id}
                                        isApproved={reg.status === 'APPROVED'}
                                    />
                                    <EditRegistrationForm registration={reg} />
                                    <a
                                        href={`/api/registrations/${reg.id}/pdf`}
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10"
                                    >
                                        <Download className="w-3 h-3 md:w-4 md:h-4" /> PDF
                                    </a>
                                    <DeleteRegistrationButton
                                        registrationId={reg.id}
                                        studentName={`${reg.firstName} ${reg.lastName}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {registrations.length === 0 && (
                    <div className="p-20 text-center bg-[#0a0a0a] border border-white/5">
                        <p className="text-muted-foreground font-serif italic text-xl">Noch keine Voranmeldungen vorhanden.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
