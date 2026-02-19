import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        const [registrations, plans] = await Promise.all([
            prisma.studentRegistration.count(),
            prisma.yearlyPlan.count({ where: { isActive: true } })
        ]);
        return { registrations, plans, error: null };
    } catch (error) {
        console.error('Admin Dashboard Stats Error:', error);
        return { registrations: 0, plans: 0, error: 'Database Connection Error' };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8 md:space-y-12 animate-fade-in">
            <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif text-white italic">Übersicht</h2>
                <p className="text-sm md:text-base text-muted-foreground font-light">Willkommen im sicheren Verwaltungsbereich der Fahrschule GATE 11.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {/* Stats Cards */}
                <div className="p-6 md:p-8 bg-[#0a0a0a] border border-white/5 relative group hover:border-[#D4AF37]/30 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-[#D4AF37] group-hover:h-full transition-all duration-500" />
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-4">Offene Voranmeldungen</h3>
                    <p className="text-4xl md:text-6xl font-serif text-[#D4AF37] italic">{stats.registrations}</p>
                </div>

                <div className="p-6 md:p-8 bg-[#0a0a0a] border border-white/5 relative group hover:border-[#D4AF37]/30 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-[#D4AF37] group-hover:h-full transition-all duration-500" />
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-4">Aktive Jahrespläne</h3>
                    <p className="text-4xl md:text-6xl font-serif text-[#D4AF37] italic">{stats.plans}</p>
                </div>

                <div className="p-6 md:p-8 bg-[#0a0a0a] border border-white/5 relative group hover:border-[#D4AF37]/30 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-[#D4AF37] group-hover:h-full transition-all duration-500" />
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-4">System Status</h3>
                    <p className={`text-4xl md:text-6xl font-serif italic ${stats.error ? 'text-red-500' : 'text-green-500'}`}>
                        {stats.error ? 'Error' : 'Online'}
                    </p>
                </div>
            </div>

            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
                    <span className="text-6xl md:text-9xl font-serif italic text-[#D4AF37]">!</span>
                </div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs">Sicherheitshinweis</h4>
                    <p className="text-xs md:text-sm text-[#D4AF37]/80 font-light max-w-2xl leading-relaxed">
                        Sie befinden sich in einem geschützten Bereich. Alle Systemzugriffe und Änderungen an Schülerdaten oder Jahresplänen werden protokolliert. Bitte achten Sie auf die Einhaltung der Datenschutzgrundverordnung (DSGVO).
                    </p>
                </div>
            </div>
        </div>
    );
}
