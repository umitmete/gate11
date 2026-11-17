'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Gift, Percent, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

export interface CampaignData {
    id: string;
    title: string;
    subtitle: string | null;
    badge: string | null;
    description: string;
    imageUrl: string | null;
    buttonText: string | null;
    buttonLink: string | null;
    isActive: boolean;
    showEffects?: boolean;
    translations?: string | null;
    updatedAt?: string;
}

interface CampaignModalProps {
    campaign?: CampaignData | null;
    campaigns?: CampaignData[];
    isOpen: boolean;
    onClose: () => void;
}

const modalLabels: Record<string, { cta: string; close: string }> = {
    de: { cta: 'Zu den Paketen', close: 'Schließen' },
    tr: { cta: 'Paketleri İncele', close: 'Kapat' },
    en: { cta: 'View Packages', close: 'Close' },
    ar: { cta: 'عرض الباقات', close: 'إغلاق' },
    fa: { cta: 'مشاهده بسته‌ها', close: 'بستن' },
};

const FLOATING_ORBS = [
    {
        id: 'left-top',
        Icon: Gift,
        position: 'top-[8%] left-[4%] md:top-[12%] md:left-[8%]',
        visibility: 'flex',
        size: 'w-6 h-6 md:w-7 md:h-7',
        yRange: [0, -14, 0],
        rotateRange: [-6, 6, -6],
        duration: 4.2,
        delay: 0,
    },
    {
        id: 'left-middle',
        Icon: Percent,
        position: 'top-[46%] left-[3%] md:left-[6%]',
        visibility: 'hidden md:flex',
        size: 'w-6 h-6',
        yRange: [0, 12, 0],
        rotateRange: [5, -5, 5],
        duration: 4.8,
        delay: 0.4,
    },
    {
        id: 'left-bottom',
        Icon: Sparkles,
        position: 'bottom-[8%] left-[5%] md:bottom-[14%] md:left-[10%]',
        visibility: 'flex',
        size: 'w-5 h-5 md:w-6 md:h-6',
        yRange: [0, -10, 0],
        rotateRange: [-4, 8, -4],
        duration: 3.6,
        delay: 0.8,
    },
    {
        id: 'right-top',
        Icon: Award,
        position: 'top-[10%] right-[4%] md:top-[14%] md:right-[8%]',
        visibility: 'flex',
        size: 'w-6 h-6 md:w-7 md:h-7',
        yRange: [0, 14, 0],
        rotateRange: [6, -6, 6],
        duration: 4.5,
        delay: 0.2,
    },
    {
        id: 'right-middle',
        Icon: Gift,
        position: 'top-[48%] right-[3%] md:right-[6%]',
        visibility: 'hidden md:flex',
        size: 'w-6 h-6',
        yRange: [0, -12, 0],
        rotateRange: [-7, 5, -7],
        duration: 3.9,
        delay: 0.6,
    },
    {
        id: 'right-bottom',
        Icon: Star,
        position: 'bottom-[9%] right-[5%] md:bottom-[15%] md:right-[10%]',
        visibility: 'flex',
        size: 'w-5 h-5 md:w-6 md:h-6',
        yRange: [0, 10, 0],
        rotateRange: [4, -8, 4],
        duration: 4.4,
        delay: 1.0,
    },
];

const BOKEH_PARTICLES = [
    { top: '12%', left: '22%', size: 6, duration: 3.4, delay: 0.1, isStar: true },
    { top: '24%', left: '14%', size: 4, duration: 4.2, delay: 0.7, isStar: false },
    { top: '34%', left: '84%', size: 7, duration: 3.8, delay: 0.3, isStar: true },
    { top: '18%', left: '74%', size: 5, duration: 4.5, delay: 1.1, isStar: false },
    { top: '65%', left: '16%', size: 7, duration: 3.6, delay: 0.5, isStar: true },
    { top: '78%', left: '26%', size: 4, duration: 4.9, delay: 1.3, isStar: false },
    { top: '68%', left: '82%', size: 5, duration: 3.9, delay: 0.2, isStar: false },
    { top: '82%', left: '72%', size: 6, duration: 4.1, delay: 0.9, isStar: true },
    { top: '6%', left: '52%', size: 5, duration: 4.7, delay: 0.4, isStar: false },
    { top: '90%', left: '48%', size: 6, duration: 3.5, delay: 0.8, isStar: true },
    { top: '42%', left: '19%', size: 4, duration: 4.3, delay: 1.4, isStar: false },
    { top: '56%', left: '88%', size: 5, duration: 3.7, delay: 0.6, isStar: false },
    { top: '28%', left: '88%', size: 4, duration: 5.0, delay: 1.2, isStar: false },
    { top: '74%', left: '11%', size: 6, duration: 4.0, delay: 0.3, isStar: true },
];

export function CampaignModal({ campaign, campaigns, isOpen, onClose }: CampaignModalProps) {
    const { language } = useLanguage();
    const labels = modalLabels[language] || modalLabels.de;
    const isRtl = language === 'ar' || language === 'fa';
    const [mounted, setMounted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const campaignList: CampaignData[] =
        campaigns && campaigns.length > 0
            ? campaigns
            : campaign
            ? [campaign]
            : [];

    const hasMultiple = campaignList.length > 1;
    const safeIndex = currentIndex < campaignList.length ? currentIndex : 0;
    const activeCampaign = campaignList[safeIndex] || null;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            setDirection(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (currentIndex >= campaignList.length && campaignList.length > 0) {
            setCurrentIndex(0);
        }
    }, [currentIndex, campaignList.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (campaignList.length > 1 && e.key === 'ArrowLeft') {
                setDirection(-1);
                setCurrentIndex((prev) => (prev - 1 + campaignList.length) % campaignList.length);
            } else if (campaignList.length > 1 && e.key === 'ArrowRight') {
                setDirection(1);
                setCurrentIndex((prev) => (prev + 1) % campaignList.length);
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, campaignList.length]);

    useEffect(() => {
        if (!isOpen || !hasMultiple || isHovered) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % campaignList.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [isOpen, hasMultiple, isHovered, campaignList.length]);

    const goToPrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!hasMultiple) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + campaignList.length) % campaignList.length);
    };

    const goToNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!hasMultiple) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % campaignList.length);
    };

    if (!mounted || !activeCampaign) return null;

    const showEffects = activeCampaign.showEffects !== false;

    let localized: { title?: string; subtitle?: string; badge?: string; description?: string } | null = null;
    if (language !== 'de' && activeCampaign.translations) {
        try {
            const parsed = JSON.parse(activeCampaign.translations);
            localized = parsed?.[language] || null;
        } catch {
            localized = null;
        }
    }

    const displayBadge = (localized?.badge && localized.badge.trim()) ? localized.badge : activeCampaign.badge;
    const displayTitle = (localized?.title && localized.title.trim()) ? localized.title : activeCampaign.title;
    const displaySubtitle = (localized?.subtitle && localized.subtitle.trim()) ? localized.subtitle : activeCampaign.subtitle;
    const displayDescription = (localized?.description && localized.description.trim()) ? localized.description : activeCampaign.description;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    onClick={onClose}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 cursor-pointer"
                >
                    {/* Animated Luxury Black & Gold Celebratory Backdrop (Optional per campaign) */}
                    {showEffects && (
                        <div
                            aria-hidden="true"
                            className="pointer-events-none select-none fixed inset-0 overflow-hidden z-0"
                        >
                            {/* Subtle Golden Luxury Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />

                            {/* Ambient Pulsing Gold Spotlights */}
                            <motion.div
                                animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.08, 0.95] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-primary/15 blur-[130px] rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.12, 1] }}
                                transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                                className="absolute -top-24 -left-24 w-96 h-96 bg-primary/15 blur-[130px] rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.25, 0.55, 0.25], scale: [1.05, 0.95, 1.05] }}
                                transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                                className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/15 blur-[130px] rounded-full"
                            />

                            {/* Twinkling Golden Particles / Bokeh Sparkles */}
                            {BOKEH_PARTICLES.map((particle, idx) => (
                                <motion.div
                                    key={idx}
                                    style={{ top: particle.top, left: particle.left }}
                                    animate={{
                                        y: [0, -18, 0],
                                        opacity: [0.2, 0.9, 0.2],
                                        scale: [0.85, 1.25, 0.85],
                                    }}
                                    transition={{
                                        duration: particle.duration,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: particle.delay,
                                    }}
                                    className="absolute"
                                >
                                    {particle.isStar ? (
                                        <Sparkles
                                            style={{ width: particle.size * 2.2, height: particle.size * 2.2 }}
                                            className="text-primary/70 drop-shadow-[0_0_8px_rgba(212,175,55,0.75)]"
                                        />
                                    ) : (
                                        <div
                                            style={{ width: particle.size, height: particle.size }}
                                            className="rounded-full bg-primary/80 shadow-[0_0_12px_rgba(212,175,55,0.9)]"
                                        />
                                    )}
                                </motion.div>
                            ))}

                            {/* Floating Luxury Gift & Campaign Orbs */}
                            {FLOATING_ORBS.map(({ id, Icon, position, visibility, size, yRange, rotateRange, duration, delay }) => (
                                <motion.div
                                    key={id}
                                    animate={{
                                        y: yRange,
                                        rotate: rotateRange,
                                        scale: [1, 1.06, 1],
                                    }}
                                    transition={{
                                        duration,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay,
                                    }}
                                    className={`absolute ${position} ${visibility} items-center justify-center bg-[#110f08]/80 backdrop-blur-md border border-primary/40 shadow-[0_0_35px_rgba(212,175,55,0.3)] rounded-2xl p-3.5 md:p-4`}
                                >
                                    <Icon className={`${size} text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.65)]`} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Modal Card + Outside Carousel Arrows Container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="relative z-10 w-full max-w-[39rem] px-11 sm:px-14 my-8 flex items-center justify-center"
                    >
                        {/* Prev / Next Navigation Arrows (Outside Modal Frame) */}
                        {hasMultiple && (
                            <>
                                <button
                                    type="button"
                                    onClick={goToPrev}
                                    aria-label="Previous campaign"
                                    className="absolute top-1/2 -translate-y-1/2 left-0 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-black/80 hover:bg-primary text-primary hover:text-black border border-primary/50 shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-md transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={goToNext}
                                    aria-label="Next campaign"
                                    className="absolute top-1/2 -translate-y-1/2 right-0 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-black/80 hover:bg-primary text-primary hover:text-black border border-primary/50 shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-md transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className={`relative z-10 w-full max-w-lg bg-[#0d0d0d] rounded-3xl overflow-hidden cursor-default border ${
                                showEffects
                                    ? 'border-primary/45 ring-1 ring-primary/20 shadow-[0_0_90px_rgba(212,175,55,0.28)]'
                                    : 'border-primary/35 shadow-[0_0_60px_rgba(0,0,0,0.85)]'
                            }`}
                        >
                            {/* Top Accent Gold Bar */}
                            <div className="h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

                            {/* Slide Counter Pill */}
                            {hasMultiple && (
                                <div
                                    className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-20 px-3 py-1 rounded-full bg-black/70 border border-primary/40 text-[11px] font-bold tracking-widest text-primary backdrop-blur-md`}
                                >
                                    {safeIndex + 1} / {campaignList.length}
                                </div>
                            )}

                            {/* Close 'X' Button */}
                            <button
                                onClick={onClose}
                                type="button"
                                aria-label={labels.close}
                                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-20 p-2 rounded-full bg-black/60 hover:bg-black text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer`}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Animated Slide Transition */}
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={activeCampaign.id}
                                    initial={{ opacity: 0, x: direction >= 0 ? 28 : -28 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction >= 0 ? -28 : 28 }}
                                    transition={{ duration: 0.22, ease: 'easeOut' }}
                                >
                                    {/* Campaign Image Banner */}
                                    {activeCampaign.imageUrl && (
                                        <div className="w-full h-52 bg-neutral-900 overflow-hidden relative">
                                            <img
                                                src={activeCampaign.imageUrl}
                                                alt={displayTitle}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30" />
                                        </div>
                                    )}

                                    {/* Slide Text Area */}
                                    <div className="px-6 pt-6 sm:px-8 sm:pt-8 space-y-4">
                                        {/* Floating Gift Emblem + Badge Row */}
                                        {(showEffects || displayBadge) && (
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                {showEffects && (
                                                    <motion.div
                                                        animate={{ rotate: [-5, 5, -5], scale: [1, 1.08, 1] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 shadow-[0_0_18px_rgba(212,175,55,0.25)] shrink-0"
                                                    >
                                                        <Gift className="w-4 h-4 text-primary" />
                                                    </motion.div>
                                                )}
                                                {displayBadge && (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                                                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        <span>{displayBadge}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                                                {displayTitle}
                                            </h3>
                                            {displaySubtitle && (
                                                <p className="text-xs sm:text-sm font-medium text-primary mt-1">
                                                    {displaySubtitle}
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-light">
                                            {displayDescription}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* CTA Buttons & Bottom Pagination Dots */}
                            <div className="px-6 pb-6 sm:px-8 sm:pb-7 pt-5 space-y-5">
                                {/* Buttons - Always navigates to /Fahrakademie */}
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <Link
                                        href="/Fahrakademie"
                                        onClick={onClose}
                                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-widest text-center hover:bg-[#c49f27] transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group cursor-pointer"
                                    >
                                        <span>{labels.cta}</span>
                                        <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                        {labels.close}
                                    </button>
                                </div>

                                {/* Pagination Dots at the Bottom */}
                                {hasMultiple && (
                                    <div className="flex items-center justify-center gap-2 pt-1">
                                        {campaignList.map((c, idx) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => {
                                                    setDirection(idx > safeIndex ? 1 : -1);
                                                    setCurrentIndex(idx);
                                                }}
                                                aria-label={`Kampagne ${idx + 1}`}
                                                className={`transition-all cursor-pointer ${
                                                    idx === safeIndex
                                                        ? 'w-7 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                                                        : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
