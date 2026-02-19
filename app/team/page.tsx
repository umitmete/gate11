'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LuxuryCard, CardTitle } from '@/components/ui/card/LuxuryCard';
import { useLanguage } from "@/components/providers/LanguageProvider";
import { User } from 'lucide-react';

export default function InstructorsPage() {
    const { t, language } = useLanguage();
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // Public API endpoint (admin olmayan)
                const res = await fetch(`/api/instructors?lang=${language}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setTeam(data);
                }
            } catch (err) {
                console.error("Team verisi alınamadı", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [language]);

    return (
        <main className="min-h-screen bg-background text-foreground pt-24">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <header className="mb-12 text-center max-w-3xl mx-auto space-y-6">
                    <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] font-serif">{t.team.badge}</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
                        {t.team.title}
                    </h1>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                        {t.team.subtitle}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-white/5 h-[400px] rounded-2xl"></div>
                        ))
                    ) : team.length > 0 ? (
                        team.map((member: any, i: number) => (
                            <LuxuryCard key={member.id || i} className="text-center group p-10 flex flex-col items-center">
                                <div className="w-40 h-40 mx-auto mb-8 bg-primary/[0.03] border border-primary/10 rounded-full flex items-center justify-center overflow-hidden group-hover:border-primary transition-all duration-500 relative">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="text-5xl text-primary font-serif font-bold group-hover:scale-110 transition-transform duration-500">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-2xl mb-2 font-serif">{member.name}</CardTitle>
                                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">{member.role}</p>
                                <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 max-w-[280px]">
                                    {member.bio}
                                </p>
                                <div className="mt-auto flex flex-wrap justify-center gap-3">
                                    {member.license && member.license.split(',').map((lic: string, idx: number) => (
                                        <span key={idx} className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 px-2 py-1 border border-white/5 rounded">
                                            {lic.trim()}
                                        </span>
                                    ))}
                                </div>
                            </LuxuryCard>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-muted-foreground italic font-light">
                            {t.team.noMembers}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
