'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getCampaignEffectMeta, resolveCampaignEffect } from '@/lib/campaign-effects';
import { CampaignBackdropEffects, CampaignCardEmblem } from './CampaignBackdropEffects';

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
    effectType?: string | null;
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

    const activeEffect = resolveCampaignEffect(activeCampaign.effectType, activeCampaign.showEffects);
    const effectMeta = getCampaignEffectMeta(activeEffect);

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
                    className={`fixed inset-0 z-[9999] overflow-y-auto ${effectMeta.overlayClass || 'bg-black/90 backdrop-blur-md'} flex items-center justify-center p-3 sm:p-4 cursor-pointer`}
                >
                    {/* Animated Seasonal & Promotional Backdrop (Configurable per campaign) */}
                    <CampaignBackdropEffects effectId={activeEffect} />

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
                            className={`relative z-10 w-full max-w-lg bg-[#0d0d0d] rounded-3xl overflow-hidden cursor-default border ${effectMeta.modalBorderClass}`}
                        >
                            {/* Top Accent Bar */}
                            <div className={`h-1 ${effectMeta.topBarClass}`} />

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
                                        {/* Floating Effect Emblem + Badge Row */}
                                        {(activeEffect !== 'none' || displayBadge) && (
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <CampaignCardEmblem effectId={activeEffect} />
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
