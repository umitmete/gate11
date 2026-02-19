'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/translations/index';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { getMapUrl } from '@/lib/utils/map-helper';

export function Footer() {
    const { t, language, setLanguage } = useLanguage();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [modalContent, setModalContent] = useState<string | null>(null);

    useEffect(() => setMounted(true), []);

    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    const logoSrc = mounted && currentTheme === 'light'
        ? "/Gate11_Logo_siyah.svg"
        : "/Gate11_Logo_beyaz.svg";

    const year = new Date().getFullYear();

    const openModal = (type: string) => setModalContent(type);
    const closeModal = () => setModalContent(null);

    const langs: { id: Language; label: string }[] = [
        { id: 'de', label: 'DE' },
        { id: 'en', label: 'EN' },
        { id: 'tr', label: 'TR' },
        { id: 'ar', label: 'AR' },
        { id: 'fa', label: 'FA' }
    ];

    // Modal içerik verileri
    const modalData: Record<string, { title: string; content: React.ReactNode }> = {
        impressum: {
            title: (t as any).impressum?.title || 'Impressum',
            content: (
                <div className="space-y-8 py-4 text-xs md:text-sm">
                    {(t as any).impressum?.sections.map((section: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="text-foreground font-bold flex items-center gap-2">
                                <span className="text-primary text-[10px] font-mono opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                                {section.title}
                            </h3>
                            <div className="text-muted-foreground/80 leading-relaxed whitespace-pre-wrap ps-6 border-s border-primary/10">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        privacy: {
            title: (t as any).privacy?.title || 'Datenschutz',
            content: (
                <div className="space-y-8 py-4 text-xs md:text-sm">
                    {(t as any).privacy?.sections.map((section: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="text-foreground font-bold flex items-center gap-2">
                                <span className="text-primary text-[10px] font-mono opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                                {section.title}
                            </h3>
                            <div className="text-muted-foreground/80 leading-relaxed whitespace-pre-wrap ps-6 border-s border-primary/10">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        agb: {
            title: (t as any).agb?.title || 'AGB',
            content: (
                <div className="space-y-8 py-4 text-xs md:text-sm">
                    {(t as any).agb?.sections.map((section: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="text-foreground font-bold flex items-center gap-2">
                                <span className="text-primary text-[10px] font-mono opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                                {section.title}
                            </h3>
                            <div className="text-muted-foreground/80 leading-relaxed whitespace-pre-wrap ps-6 border-s border-primary/10">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        cookies: {
            title: (t as any).cookies?.title || 'Cookie-Richtlinie',
            content: (
                <div className="space-y-8 py-4 text-xs md:text-sm">
                    {(t as any).cookies?.sections.map((section: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="text-foreground font-bold flex items-center gap-2">
                                <span className="text-primary text-[10px] font-mono opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                                {section.title}
                            </h3>
                            <div className="text-muted-foreground/80 leading-relaxed whitespace-pre-wrap ps-6 border-s border-primary/10">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    };

    return (
        <footer className="bg-background border-t border-primary/10 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 items-start text-center sm:text-left">

                    {/* 1. Sol bölüm: Logo, slogan, telif hakkı */}
                    <div className="space-y-4 flex flex-col items-center sm:items-start">
                        <Link href="/">
                            <img src={logoSrc} alt="GATE 11 Logo" className="h-14 md:h-16 w-auto object-contain transition-opacity duration-300" />
                        </Link>
                        <p className="text-muted-foreground/80 font-serif italic text-sm tracking-wide leading-relaxed max-w-[250px]">
                            {t.footer.slogan}
                        </p>
                        <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground/60">
                            &copy; {year} GATE 11
                        </p>
                    </div>

                    {/* 2. Orta-sol bölüm: İletişim bilgileri */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-black uppercase tracking-[0.2em] text-xs opacity-50">{t.footer.contact}</h4>
                        <ul className="space-y-2 text-sm font-light text-muted-foreground">
                            <li>
                                <div className="flex flex-col items-center sm:items-start">
                                    <span>{t.footer.addressLine}</span>
                                    <span>{t.footer.cityLine}</span>
                                </div>
                            </li>
                            <li className="flex items-center justify-center sm:justify-start gap-2">
                                <span dir="ltr">+43 1 767 32 87</span>
                            </li>
                            <li className="flex items-center justify-center sm:justify-start gap-2 text-primary/80">drive@fahrschulegate11.at</li>
                        </ul>
                    </div>

                    {/* 3. Orta-sağ bölüm: Çalışma saatleri */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-black uppercase tracking-[0.2em] text-xs opacity-50">{t.footer.hours}</h4>
                        <ul className="space-y-2 text-sm font-light text-muted-foreground max-w-[220px] mx-auto sm:mx-0">
                            <li className="flex justify-between gap-4"><span>{t.footer.schedule.monThu}</span> <span className="text-foreground/80" dir="ltr">09:00 - 18:00</span></li>
                            <li className="flex justify-between gap-4"><span>{t.footer.schedule.fri}</span> <span className="text-foreground/80" dir="ltr">09:00 - 17:00</span></li>
                            <li className="flex justify-between opacity-40"><span>{t.footer.schedule.satSun}</span> <span>{t.footer.schedule.closed}</span></li>
                        </ul>
                    </div>

                    {/* 4. Sağ bölüm: Kalite standartları ve dil seçimi */}
                    <div className="space-y-4 flex flex-col items-center sm:items-start">
                        <h4 className="text-foreground font-black uppercase tracking-[0.2em] text-xs opacity-50">{t.footer.standards.title}</h4>
                        <div className="space-y-6 w-full">
                            <ul className="space-y-2 text-xs font-light text-muted-foreground italic">
                                <li>✦ {t.footer.standards.certified}</li>
                                <li>✦ {t.footer.standards.austrian}</li>
                            </ul>

                            {/* Dil seçici */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-full w-full sm:w-fit">
                                {langs.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => setLanguage(l.id)}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-xl md:rounded-full text-[10px] font-bold tracking-widest transition-all ${language === l.id
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                            : 'text-muted-foreground/60 hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt bölüm: Yasal bilgilendirme linkleri */}
                <div className="border-t border-primary/5 pt-8">
                    <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-6 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50">
                        <button onClick={() => openModal('impressum')} className="hover:text-primary transition-colors">{t.footer.legal.impressum}</button>
                        <button onClick={() => openModal('privacy')} className="hover:text-primary transition-colors">{t.footer.legal.privacy}</button>
                        <button onClick={() => openModal('agb')} className="hover:text-primary transition-colors">{t.footer.legal.agb}</button>
                        <button onClick={() => openModal('cookies')} className="hover:text-primary transition-colors">{t.footer.legal.cookies}</button>
                    </div>
                </div>
            </div>

            {/* Yasal bilgi modalı */}
            <AnimatePresence>
                {modalContent && (
                    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-background/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 100 }}
                            className={`relative w-full ${['privacy', 'agb', 'cookies', 'impressum'].includes(modalContent || '') ? 'max-w-3xl' : 'max-w-lg'} bg-card border border-primary/20 p-6 md:p-10 rounded-3xl shadow-2xl overflow-hidden mb-4 sm:mb-0`}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-primary/10 text-muted-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6 uppercase tracking-tight">
                                {modalData[modalContent].title}
                            </h2>
                            <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-muted-foreground text-sm leading-relaxed">
                                {modalData[modalContent].content}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    );
}
