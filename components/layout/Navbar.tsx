'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

export function Navbar() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    const logoSrc = mounted && currentTheme === 'light'
        ? "/Gate11_Logo_siyah.svg"
        : "/Gate11_Logo_beyaz.svg";

    const navLinks = [
        { href: '/', label: t.nav.start },
        { href: '/Fahrakademie', label: t.nav.courses },
        { href: '/kurse', label: t.nav.kurstermine },
        { href: '/fahrzeuge', label: t.nav.vehicles },
        { href: '/ueber-uns', label: t.nav.about },
        { href: '/kontakt', label: t.nav.contact },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 xl:left-20 right-0 z-[100] bg-background/80 backdrop-blur-xl border-b border-white/5 h-20">
                <div className="container mx-auto px-6 h-full flex items-center relative">
                    {/* Logo bölümü - Sol */}
                    <div className="flex-1 flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Link
                                href="/"
                                onClick={(e) => {
                                    if (pathname === '/') {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                            >
                                <img src={logoSrc} alt="GATE 11 Logo" className="h-12 w-auto object-contain transition-opacity duration-300" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Masaüstü link bölümü - Orta (mutlak ortalanmış) */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4 xl:gap-6 text-[11px] xl:text-xs font-bold tracking-[0.15em] xl:tracking-[0.18em] uppercase whitespace-nowrap">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => {
                                        if (pathname === link.href) {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    className={`relative py-4 transition-colors duration-300 ${isActive ? 'text-primary' : 'hover:text-primary'}`}
                                >
                                    <span>{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute bottom-2 left-0 right-0 h-[2px] bg-primary"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* İşlem bölümü - Sağ */}
                    <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
                        <div className="hidden sm:flex items-center gap-4">
                            <LanguageSelector />
                            <ThemeToggle />
                        </div>

                        <Link
                            href="/anmeldung"
                            className={`hidden md:flex px-8 py-2.5 font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 shadow-lg ${pathname === '/anmeldung'
                                ? 'bg-foreground text-background shadow-primary/40'
                                : 'bg-primary text-primary-foreground hover:bg-white hover:text-black shadow-primary/20'
                                }`}
                        >
                            {t.nav.register}
                        </Link>

                        {/* Mobil menü butonu */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-all active:scale-90"
                            aria-label="Menüyü Aç"
                        >
                            <Menu className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobil menü katmanı */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[9999] lg:hidden">
                        {/* Arka plan karartma */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Menü paneli */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 250 }}
                            className="absolute top-0 right-0 bottom-0 w-[80vw] sm:w-[50vw] bg-background shadow-[-25px_0_60px_rgba(0,0,0,0.6)] flex flex-col border-l border-white/5"
                        >
                            {/* Başlık: Kapat butonu + tema/dil kontrolleri */}
                            <div className="px-6 pt-4 pb-2 border-b border-black/5 dark:border-white/5">
                                <div className="flex justify-end mb-2">
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 bg-primary/10 rounded-full text-foreground hover:text-primary transition-all active:scale-95"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center gap-10 bg-black/5 dark:bg-white/5 px-8 py-3 rounded-2xl mx-auto w-fit">
                                    <LanguageSelector />
                                    <ThemeToggle />
                                </div>
                            </div>

                            {/* Navigasyon linkleri */}
                            <div className="flex-1 flex flex-col gap-2 px-6 pt-1 pb-4 overflow-y-auto custom-scrollbar">
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={(e) => {
                                                    if (pathname === link.href) {
                                                        e.preventDefault();
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        setIsMenuOpen(false);
                                                    }
                                                }}
                                                className={`flex items-center justify-between text-lg font-serif font-bold italic tracking-tight py-3 px-4 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                                            >
                                                {link.label}
                                                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground/30'}`} />
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="pt-4"
                                >
                                    <Link
                                        href="/anmeldung"
                                        className="w-full flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-black text-xs tracking-[0.25em] uppercase shadow-lg shadow-primary/30 rounded-xl"
                                    >
                                        {t.nav.register}
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Alt bilgi */}
                            <div className="p-6 border-t border-black/5 dark:border-white/5">
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Gate11 Excellence
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
