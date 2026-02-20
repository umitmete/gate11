'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LuxuryCard, CardTitle } from '@/components/ui/card/LuxuryCard';
import { Check, Calendar, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from '@/lib/dayjs';

export default function CoursesPage() {
    const { t, language } = useLanguage();
    const [courseInfo, setCourseInfo] = useState<Record<string, { date: string, rawDate?: string, note?: string }>>({});
    const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const togglePackage = (index: number) => {
        setExpandedIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kurs paketlerini çek - Cache busting ile
                const packagesRes = await fetch(`/api/course-packages?type=DAY&lang=${language}&t=${Date.now()}`, {
                    cache: 'no-store',
                    headers: {
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    }
                });
                if (packagesRes.ok) {
                    const dbPackages = await packagesRes.json();
                    setPackages(dbPackages);
                } else {
                    setPackages(t.courses.packages);
                }

                // Kurs tarihlerini çek
                const plansRes = await fetch('/api/plans?type=DAY');
                if (plansRes.ok) {
                    const plans = await plansRes.json();
                    const infoMap: Record<string, { date: string, rawDate: string, note?: string }> = {};
                    plans.forEach((plan: any) => {
                        const cleanTitle = plan.title.replace(/\s*\(Abend\)\s*/gi, '').trim();
                        const key = cleanTitle.toUpperCase();
                        if (!infoMap[key]) {
                            const start = dayjs(plan.startDate).format('DD.MM.YYYY');
                            const end = dayjs(plan.endDate).format('DD.MM.YYYY');
                            infoMap[key] = {
                                date: `${start} – ${end}`,
                                rawDate: plan.startDate,
                                note: plan.description
                            };
                        }
                    });
                    setCourseInfo(infoMap);
                }
            } catch (err) {
                console.error("Veri alınamadı", err);
                setPackages(t.courses.packages);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [language, t.courses.packages]);

    return (
        <main className="min-h-screen bg-background text-foreground pt-20 md:pt-20 transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-6 pt-2 md:pt-4 pb-8 md:pb-12">
                <header className="mb-8 md:mb-12 text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
                    <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-serif">{t.courses.badge}</span>
                    <h1 className="text-3xl md:text-7xl font-serif font-bold text-foreground leading-tight">{t.courses.title}</h1>
                    <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed">
                        {t.courses.subtitle}
                    </p>
                </header>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-24">
                    {loading ? (
                        <div className="w-full text-center py-20">
                            <p className="text-muted-foreground">{t.courses.loading || "Yükleniyor..."}</p>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="w-full text-center py-20 flex flex-col items-center justify-center p-8 bg-black/5 dark:bg-white/5 border border-primary/20 rounded-2xl">
                            <span className="text-4xl mb-4">📭</span>
                            <p className="text-xl md:text-2xl font-serif text-muted-foreground font-light italic">
                                {t.courses.no_packages || "Derzeit sind keine Kurspakete verfügbar."}
                            </p>
                        </div>
                    ) : packages.map((pkg: any, index: number) => {
                        const isExpanded = expandedIndices.includes(index);
                        const info = courseInfo[pkg.title.trim().toUpperCase()];
                        const isToday = info?.rawDate ? dayjs(info.rawDate).isSame(dayjs(), 'day') : false;

                        return (
                            <div key={pkg.id || index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] flex shrink-0">
                                <LuxuryCard className={`relative overflow-hidden group p-6 md:p-8 flex flex-col w-full ${isToday ? 'border-primary/50 shadow-[0_0_30px_rgba(212,175,55,0.15)]' : ''}`}>
                                    {pkg.price && pkg.showPrice === true && (
                                        <div className="hidden md:block absolute top-0 right-0 rtl:right-auto rtl:left-0 pt-[44px] pr-3 rtl:pr-0 rtl:pl-3 -mr-[25px] rtl:-mr-0 rtl:-ml-[25px]">
                                            <div className="text-primary font-bold text-5xl font-serif drop-shadow-sm">{pkg.price}</div>
                                        </div>
                                    )}

                                    <div
                                        className="mb-4 md:mb-6 cursor-pointer md:cursor-default group/title"
                                        onClick={() => togglePackage(index)}
                                    >
                                        <div className="flex items-end justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-end justify-between gap-2 mb-1">
                                                    <CardTitle className="text-xl md:text-2xl font-serif leading-tight pr-2 rtl:pr-0 rtl:pl-2">{pkg.title}</CardTitle>
                                                    {pkg.price && pkg.showPrice === true && (
                                                        <div className="md:hidden text-primary font-bold text-2xl font-serif leading-none shrink-0">
                                                            {pkg.price}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em] leading-tight pr-4 rtl:pr-0 rtl:pl-4">
                                                    {pkg.tag}
                                                </p>
                                            </div>
                                            <div className="md:hidden p-1.5 bg-primary/5 rounded-lg shrink-0">
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ChevronDown className="w-5 h-5 text-primary" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features Section */}
                                    <div className="hidden md:block space-y-4 mb-8 flex-1">
                                        {pkg.features && pkg.features.map((feature: string, fIndex: number) => (
                                            <div key={fIndex} className="flex items-start gap-3 text-muted-foreground group-hover:text-foreground transition-colors group/item">
                                                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0 group-hover/item:scale-125 transition-transform" />
                                                <span className="text-xs tracking-wide leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="md:hidden overflow-hidden"
                                            >
                                                <div className="space-y-4 mb-8 pt-2">
                                                    {pkg.features && pkg.features.map((feature: string, fIndex: number) => (
                                                        <div key={fIndex} className="flex items-start gap-3 text-muted-foreground group-hover:text-foreground transition-colors group/item">
                                                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0 group-hover/item:scale-125 transition-transform" />
                                                            <span className="text-xs tracking-wide leading-relaxed">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {pkg.showDate !== false && (
                                        <div className={`mt-auto pt-6 border-t ${isToday ? 'border-primary/50' : 'border-primary/20'}`}>
                                            <div className="flex items-center justify-between mb-3 text-primary">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${isToday ? 'text-foreground animate-pulse' : ''}`} />
                                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t.courses.next_course}</span>
                                                </div>
                                                {isToday && (
                                                    <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded animate-pulse">
                                                        Heute
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`p-3 md:p-4 border-l-4 rtl:border-l-0 rtl:border-r-4 transition-all duration-500
                                                ${isToday
                                                    ? 'bg-green-500/10 border-green-500'
                                                    : 'bg-gradient-to-r from-primary/10 to-transparent border-primary'
                                                }
                                            `}>
                                                <p className={`text-lg md:text-2xl font-serif italic font-bold pr-2 rtl:pr-0 rtl:pl-2 ${isToday ? 'text-green-500' : 'text-foreground'}`}>
                                                    {info?.date || (t as any).courses.soon || "Bald verfügbar"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </LuxuryCard>
                            </div>
                        );
                    })}
                </div>

                {/* Externe Gebühren Notu */}
                <div className="max-w-5xl mx-auto mb-16 p-6 md:p-8 bg-primary/[0.02] border border-primary/10 rounded-2xl backdrop-blur-sm text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <h3 className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        Externe Gebühren
                        <span className="text-muted-foreground/60 normal-case tracking-normal font-normal ml-2 font-serif italic block md:inline mt-1 md:mt-0">
                            (nicht im Kurspreis enthalten)
                        </span>
                    </h3>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-x-6 gap-y-3 text-muted-foreground/80 text-xs md:text-sm">
                        <span className="whitespace-nowrap flex items-center gap-2">Ärztliche Untersuchung <strong className="text-foreground font-medium ml-1">ca. 35–50 €</strong></span>
                        <div className="w-1 h-1 rounded-full bg-primary/40 hidden md:block"></div>
                        <span className="whitespace-nowrap flex items-center gap-2">Erste-Hilfe-Kurs <strong className="text-foreground font-medium ml-1">ca. 70–90 €</strong></span>
                        <div className="w-1 h-1 rounded-full bg-primary/40 hidden md:block"></div>
                        <span className="whitespace-nowrap flex items-center gap-2">Führerscheingebühr (Verkehrsamt) <strong className="text-foreground font-medium ml-1">ca. 90 €</strong></span>
                        <div className="w-1 h-1 rounded-full bg-primary/40 hidden md:block"></div>
                        <span className="whitespace-nowrap flex items-center gap-2">Scheckkartengebühr <strong className="text-foreground font-medium ml-1">ca. 70–75 €</strong></span>
                    </div>
                </div>

                <div className="text-center pb-20">
                    <Link
                        href="/anmeldung"
                        className="inline-flex w-full sm:w-auto justify-center px-12 py-5 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)] text-center"
                    >
                        {t.courses.cta}
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
