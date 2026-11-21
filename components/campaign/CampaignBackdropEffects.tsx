'use client';

import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Gift,
    Gauge,
    TreePine,
    Flame,
    Crown,
    Snowflake,
    Mountain,
    PartyPopper,
    Heart,
    Bike,
    Flower2,
    Sun,
    GraduationCap,
    Leaf,
    Zap,
    Moon,
} from 'lucide-react';
import type { CampaignEffectId } from '@/lib/campaign-effects';

const ChristmasLuxuryScene = dynamic(
    () => import('./effects/ChristmasLuxuryScene').then((mod) => mod.ChristmasLuxuryScene),
    { ssr: false }
);

const HybridLuxuryScene = dynamic(
    () => import('./effects/HybridLuxuryScene').then((mod) => mod.HybridLuxuryScene),
    { ssr: false }
);

export function CampaignBackdropEffects({ effectId }: { effectId: CampaignEffectId }) {
    if (effectId === 'none') return null;
    if (effectId === 'christmas') return <ChristmasLuxuryScene />;
    return <HybridLuxuryScene effectId={effectId} />;
}

const EMBLEM_ICONS: Partial<Record<CampaignEffectId, ComponentType<{ className?: string }>>> = {
    'exklusiv-aktion': Gift,
    'turbo-night': Gauge,
    'winter-flotte': TreePine,
    'biker-race': Flame,
    'wien-gala': Crown,
    'valentine-drive': Heart,
    'new-year': PartyPopper,
    semesterferien: Mountain,
    valentine: Heart,
    'motorrad-start': Bike,
    'easter-spring': Flower2,
    'summer-sun': Sun,
    'back-to-school': GraduationCap,
    'autumn-leaves': Leaf,
    'black-friday': Zap,
    christmas: Snowflake,
    'eid-crescent': Moon,
    'gold-gifts': Sparkles,
};

export function CampaignCardEmblem({ effectId }: { effectId: CampaignEffectId }) {
    if (effectId === 'none') return null;
    const Icon = EMBLEM_ICONS[effectId] || Sparkles;

    return (
        <motion.div
            initial={{ opacity: 0.9, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/15 border border-primary/35 shadow-[0_0_16px_rgba(212,175,55,0.2)] shrink-0"
        >
            <Icon className="w-4 h-4 text-primary" />
        </motion.div>
    );
}
