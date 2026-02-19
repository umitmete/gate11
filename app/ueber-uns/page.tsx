'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LuxuryCard } from '@/components/ui/card/LuxuryCard';
import { motion } from 'framer-motion';
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function AboutPage() {
    const { t } = useLanguage();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    const logoSrc = mounted && currentTheme === 'light'
        ? "/Gate11_Logo_siyah.svg"
        : "/Gate11_Logo_beyaz.svg";

    return (
        <main className="min-h-screen bg-background text-foreground overflow-hidden pt-20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
                <div className="absolute inset-0 z-0 bg-zinc-900">
                    <img
                        src="/images/about_hero.png"
                        alt="GATE 11 Luxury Entrance"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60" />
                </div>

                <div className="container relative z-10 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] leading-tight">
                            {t.about.hero_title} <br className="md:hidden" />
                            <span className="text-primary italic border-b-2 border-primary/30 md:border-none pb-1 md:pb-0">{t.about.hero_italic}</span>
                        </h1>
                        <p className="text-base md:text-2xl text-white/90 max-w-2xl mx-auto font-light tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-relaxed">
                            {t.about.hero_desc}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-20 md:py-32 space-y-24 md:space-y-48">

                {/* Section 1: Philosophy with Image */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">{t.about.phil_title}</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                            {t.about.phil_h2}
                        </h2>
                        <div className="space-y-4 md:space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
                            <p>{t.about.phil_p1}</p>
                            <p>{t.about.phil_p2}</p>
                        </div>
                    </div>
                    <div className="relative group overflow-hidden">
                        <div className="absolute -inset-4 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img
                            src="/images/about_steering.png"
                            alt="Premium Interior"
                            className="relative z-10 w-full aspect-[4/3] md:aspect-auto object-cover rounded-none grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                        />
                    </div>
                </section>

                {/* Section 2: Values Grid */}
                <section>
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 flex items-center justify-center flex-wrap gap-x-3 md:gap-x-4 gap-y-2">
                            {t.about.values_title.split('GATE 11').map((part: string, index: number, array: string[]) => (
                                <span key={index} className="flex items-center gap-3 md:gap-4">
                                    {part}
                                    {index < array.length - 1 && (
                                        <img src={logoSrc} alt="GATE 11" className="h-8 md:h-12 w-auto object-contain" />
                                    )}
                                </span>
                            ))}
                        </h2>
                        <div className="w-16 md:w-24 h-1 bg-primary mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[0, 1, 2].map((i: number) => (
                            <LuxuryCard key={i} className="text-center p-8 md:p-10 hover:bg-primary/[0.02]">
                                <div className="text-2xl md:text-3xl text-primary mb-4 md:mb-6">{i === 0 ? "✦" : i === 1 ? "♛" : "⚡"}</div>
                                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 font-serif">{t.about.values[i].title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed font-light">{t.about.values[i].desc}</p>
                            </LuxuryCard>
                        ))}
                    </div>
                </section>

                {/* Section 3: The Mentors with Image */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="order-2 lg:order-1 relative group">
                        <img
                            src="/images/about_instructor.png"
                            alt="Professional Instructor"
                            className="w-full aspect-[4/3] md:aspect-auto object-cover rounded-none"
                        />
                        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 p-4 md:p-6 bg-background/80 backdrop-blur-md border border-primary/10 max-w-[200px] md:max-w-xs transition-colors">
                            <p className="text-primary text-[8px] md:text-[10px] uppercase font-bold tracking-widest mb-1">{t.about.quality_badge}</p>
                            <p className="text-foreground text-xs md:text-sm font-light italic leading-relaxed">{t.about.quality_quote}</p>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 space-y-6 md:space-y-8 text-center lg:text-left">
                        <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">{t.about.team_title}</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                            {t.about.team_h2}
                        </h2>
                        <div className="space-y-4 md:space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
                            <p>{t.about.team_p1}</p>
                            <p>{t.about.team_p2}</p>
                        </div>
                        <div className="pt-4 md:pt-6">
                            <a href="/Team" className="inline-block w-full md:w-auto px-10 py-4 border border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all text-center">
                                {t.about.team_cta}
                            </a>
                        </div>
                    </div>
                </section>

            </div>

            {/* Final CTA */}
            <section className="py-20 md:py-24 bg-primary/[0.02] border-y border-primary/10 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 md:mb-8 italic leading-tight">{t.about.cta_title}</h2>
                    <p className="text-base md:text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto font-light">
                        {t.about.cta_desc}
                    </p>
                    <a href="/kontakt" className="inline-block w-full md:w-auto px-12 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                        {t.about.cta_button}
                    </a>
                </div>
            </section>

            <Footer />
        </main >
    );
}
