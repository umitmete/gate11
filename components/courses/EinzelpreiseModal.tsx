'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Info } from 'lucide-react';
import { einzelpreiseTranslations } from '@/lib/translations/einzelpreise';

interface EinzelpreiseModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: string;
}

export function EinzelpreiseModal({ isOpen, onClose, language }: EinzelpreiseModalProps) {
    const data = einzelpreiseTranslations[language] || einzelpreiseTranslations['de'];
    const isRtl = language === 'ar' || language === 'fa';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                /* Native Full-Viewport Scroll Container - Clicking backdrop/outside closes modal */
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/85 backdrop-blur-md cursor-pointer"
                    dir={isRtl ? 'rtl' : 'ltr'}
                >
                    {/* Centering wrapper that naturally expands if content is long */}
                    <div className="flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6">
                        {/* Modal Dialog Card - Stop propagation so clicking inside does not close */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl my-4 sm:my-8 bg-background border border-primary/30 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col z-10 cursor-default"
                        >
                            {/* Sticky Header - Always visible at top */}
                            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md p-4 sm:p-6 border-b border-primary/20 rounded-t-2xl flex items-start justify-between gap-4 shadow-sm">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/25">
                                            <Scale className="w-3 h-3 text-primary shrink-0" />
                                            {data.legal_badge}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
                                        {data.modal_title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-2xl">
                                        {data.modal_subtitle}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        aria-label={data.close}
                                        className="p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-background">
                                {/* Categories Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {data.categories.map((cat, cIdx) => (
                                        <div
                                            key={cIdx}
                                            className="bg-primary/[0.02] border border-primary/15 rounded-xl p-4 sm:p-5 flex flex-col justify-start shadow-sm hover:border-primary/30 transition-colors"
                                        >
                                            {/* Category Title Header - Directly at top of card */}
                                            <div className="mb-3 pb-2 border-b border-primary/10 flex items-center justify-between shrink-0">
                                                <h3 className="text-sm sm:text-base font-serif font-bold text-foreground flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                    {cat.title}
                                                </h3>
                                                <span className="text-[10px] tracking-wider uppercase text-muted-foreground/60 font-mono">
                                                    {data.th_price}
                                                </span>
                                            </div>

                                            {/* Items List - Starts immediately beneath header */}
                                            <div className="space-y-2 divide-y divide-primary/5">
                                                {cat.items.map((item, iIdx) => (
                                                    <div
                                                        key={iIdx}
                                                        className="pt-2 first:pt-0 flex items-baseline justify-between gap-3 text-xs sm:text-[13px]"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground/90 leading-snug">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground font-light mt-0.5">
                                                                {item.unit}
                                                            </span>
                                                        </div>

                                                        <span className={`font-semibold shrink-0 tabular-nums ${
                                                            item.price.startsWith('+')
                                                                ? 'text-amber-500 font-bold'
                                                                : 'text-primary'
                                                        }`}>
                                                            {item.price}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Space stays cleanly at the bottom */}
                                            <div className="mt-auto" />
                                        </div>
                                    ))}
                                </div>

                                {/* VAT & Legal Price Note */}
                                <div className="p-4 sm:p-5 rounded-xl bg-primary/[0.03] border border-primary/20 space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                                        <Info className="w-4 h-4 shrink-0" />
                                        <span>{data.price_notes_title}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground/90 leading-relaxed">
                                        {data.price_notes_content}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/70 italic pt-1 border-t border-primary/10">
                                        {data.vat_included}
                                    </p>
                                </div>
                            </div>

                            {/* Sticky Footer - Always visible at bottom */}
                            <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur-md p-3 sm:p-4 border-t border-primary/20 rounded-b-2xl flex items-center justify-between text-xs text-muted-foreground shadow-sm">
                                <span className="text-[11px] font-serif italic text-muted-foreground/80">
                                    Fahrschule Gate 11 • Simmeringer Hauptstraße 179, 1110 Wien
                                </span>
                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="px-5 py-2 bg-primary text-primary-foreground font-bold tracking-wider uppercase rounded-lg hover:bg-foreground hover:text-background transition-all text-xs cursor-pointer shadow-md"
                                >
                                    {data.close}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
