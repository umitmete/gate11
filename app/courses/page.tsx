'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LuxuryCard, CardTitle } from '@/components/ui/card/LuxuryCard';
import { Check, Calendar, ChevronDown, Scale } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from '@/lib/dayjs';
import { EinzelpreiseModal } from '@/components/courses/EinzelpreiseModal';
import { fetchWithCache, getCachedData } from '@/lib/client-cache';

export default function CoursesPage() {
    const { t, language } = useLanguage();
    const [courseInfo, setCourseInfo] = useState<Record<string, { date: string, rawDate?: string, note?: string }>>({});
    const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [isEinzelpreiseOpen, setIsEinzelpreiseOpen] = useState(false);

    const togglePackage = (index: number) => {
        setExpandedIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            const pkgUrl = `/api/course-packages?type=DAY&lang=${language}`;
            const catUrl = '/api/admin/package-categories';
            const plansUrl = '/api/plans?type=DAY';

            // 1. Instant Cache Check: If pre-fetched, render immediately with 0ms wait
            const cachedPkgs = getCachedData<any[]>(pkgUrl);
            const cachedCats = getCachedData<any[]>(catUrl);
            const cachedPlans = getCachedData<any[]>(plansUrl);

            if (cachedPkgs && isMounted && Array.isArray(cachedPkgs)) {
                setPackages(cachedPkgs);
                setLoading(false);
            }
            if (cachedCats && isMounted && Array.isArray(cachedCats)) {
                setCategories(cachedCats);
            }
            if (cachedPlans && isMounted && Array.isArray(cachedPlans)) {
                const infoMap: Record<string, { date: string, rawDate: string, note?: string }> = {};
                cachedPlans.forEach((plan: any) => {
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

            // 2. Network/Revalidation
            try {
                const [dbPackages, dbCategories, plans] = await Promise.all([
                    fetchWithCache<any[]>(pkgUrl).catch(() => t.courses.packages),
                    fetchWithCache<any[]>(catUrl).catch(() => []),
                    fetchWithCache<any[]>(plansUrl).catch(() => [])
                ]);

                if (!isMounted) return;

                if (Array.isArray(dbPackages)) {
                    setPackages(dbPackages);
                } else {
                    setPackages(t.courses.packages);
                }

                if (Array.isArray(dbCategories)) {
                    setCategories(dbCategories);
                }

                if (Array.isArray(plans)) {
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
                if (isMounted) setPackages(t.courses.packages);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
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

                    {/* Gesetzliche Preisauszeichnung / Einzelpreise Link */}
                    <div className="pt-1 md:pt-2">
                        <button
                            type="button"
                            onClick={() => setIsEinzelpreiseOpen(true)}
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-primary hover:text-foreground transition-all py-1.5 px-4 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/25 hover:border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.08)] group cursor-pointer"
                        >
                            <Scale className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="underline underline-offset-4 decoration-primary/40 group-hover:decoration-primary font-medium">
                                {language === 'tr' ? 'Tekil Fiyatlar & Ek Ücretler Tarifesi' :
                                 language === 'en' ? 'Overview of Individual Prices & Additional Fees' :
                                 language === 'ar' ? 'عرض الأسعار الفردية والرسوم الإضافية' :
                                 language === 'fa' ? 'مشاهده قیمت‌های تکی و هزینه‌های جانبی' :
                                 'Einzelpreise & Zusatzgebühren einsehen'}
                            </span>
                            <span className="text-[10px] md:text-xs text-muted-foreground/80 font-normal">
                                {language === 'tr' ? '(Yasal Fiyat Bildirimi - § 111 KFG)' :
                                 language === 'en' ? '(Statutory Price Specification - § 111 KFG)' :
                                 language === 'ar' ? '(بيان الأسعار القانوني - § 111 KFG)' :
                                 language === 'fa' ? '(تعرفه قانونی - § 111 KFG)' :
                                 '(Gesetzliche Preisauszeichnung gem. § 111 KFG)'}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-12">
                        <button
                            onClick={() => setSelectedTab('all')}
                            className={`px-6 py-2 border text-xs md:text-sm font-bold uppercase tracking-widest transition-all
                                ${selectedTab === 'all'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {t.courses.all_packages || "ALLE PAKETE"}
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedTab(cat.id)}
                                className={`px-6 py-2 border text-xs md:text-sm font-bold uppercase tracking-widest transition-all
                                    ${selectedTab === cat.id
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

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
                    ) : packages.filter(pkg => {
                        if (selectedTab === 'all') return true;
                        if (pkg.categoryIds) {
                            try {
                                const ids = JSON.parse(pkg.categoryIds);
                                if (Array.isArray(ids) && ids.includes(selectedTab)) {
                                    return true;
                                }
                            } catch (e) {}
                        }
                        return pkg.categoryId === selectedTab;
                    }).map((pkg: any, index: number) => {
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
                <div className="w-full max-w-7xl mx-auto mb-16 p-6 md:px-12 md:py-8 bg-primary/[0.02] border border-primary/10 rounded-2xl backdrop-blur-sm text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <h3 className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        {t.courses.external_fees || "Externe Gebühren"}
                        <span className="text-muted-foreground/60 normal-case tracking-normal font-normal ml-2 font-serif italic block md:inline mt-1 md:mt-0">
                            {t.courses.not_included || "(nicht im Kurspreis enthalten)"}
                        </span>
                    </h3>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-x-3 lg:gap-x-6 gap-y-3 text-muted-foreground/80 text-xs md:text-[13px] lg:text-sm">
                        <span className="whitespace-nowrap flex items-center gap-2">{t.courses.medical_check || "Ärztliche Untersuchung"} <strong className="text-foreground font-medium ml-1">{t.courses.approx || "ca."} 35–50 €</strong></span>
                        <div className="w-1 h-1 rounded-full bg-primary/40 hidden md:block"></div>
                        <span className="whitespace-nowrap flex items-center gap-2">{t.courses.first_aid || "Erste-Hilfe-Kurs"} <strong className="text-foreground font-medium ml-1">{t.courses.approx || "ca."} 70–90 €</strong></span>
                        <div className="w-1 h-1 rounded-full bg-primary/40 hidden md:block"></div>
                        <span className="whitespace-nowrap flex items-center gap-2">{t.courses.license_fee || "Führerscheingebühr (Verkehrsamt)"} <strong className="text-foreground font-medium ml-1">{t.courses.approx || "ca."} 90 €</strong></span>
                        <div className="w-1 h-1 rounded-full bg-primary/40 hidden md:block"></div>
                        <span className="whitespace-nowrap flex items-center gap-2">{t.courses.card_fee || "Scheckkartengebühr"} <strong className="text-foreground font-medium ml-1">{t.courses.approx || "ca."} 70–75 €</strong></span>
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

            <EinzelpreiseModal
                isOpen={isEinzelpreiseOpen}
                onClose={() => setIsEinzelpreiseOpen(false)}
                language={language}
            />

            <Footer />
        </main>
    );
}
