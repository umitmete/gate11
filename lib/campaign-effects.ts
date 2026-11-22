/**
 * Modular Austrian/Viennese Fahrschule Campaign Backdrop Effects Registry
 *
 * Adding a new promotional effect takes 3 steps:
 *   1. Add the optimized 1920x1080 `.webp` scene image under `public/images/campaign-effects/`.
 *   2. Add the ID to `CampaignEffectId` and its metadata entry to `CAMPAIGN_EFFECTS` below.
 *   3. Register its scene configuration & 60fps canvas overlay inside
 *      `components/campaign/effects/HybridLuxuryScene.tsx` and emblem icon in `CampaignBackdropEffects.tsx`.
 *
 * The Admin UI picker, API persistence, and live preview automatically pick up entries added here.
 */

export type CampaignEffectId =
    | 'none'
    | 'geschenk-feuerwerk'
    | 'exklusiv-aktion'
    | 'turbo-night'
    | 'winter-flotte'
    | 'biker-race'
    | 'wien-gala'
    | 'valentine-drive'
    | 'new-year'
    | 'semesterferien'
    | 'valentine'
    | 'motorrad-start'
    | 'easter-spring'
    | 'summer-sun'
    | 'back-to-school'
    | 'autumn-leaves'
    | 'black-friday'
    | 'christmas'
    | 'eid-crescent'
    | 'gold-gifts';

export interface CampaignEffectDefinition {
    id: CampaignEffectId;
    label: string;
    shortLabel: string;
    description: string;
    emoji: string;
    previewBg: string;
    accentBorder: string;
    modalBorderClass: string;
    topBarClass: string;
    backdropImage?: string;
    overlayClass?: string;
}

export const CAMPAIGN_EFFECTS: CampaignEffectDefinition[] = [
    {
        id: 'none',
        label: 'Kein Effekt',
        shortLabel: 'Kein Effekt',
        description: 'Ruhige, puristische Darstellung ohne animierten Hintergrund.',
        emoji: '▫️',
        previewBg: 'from-neutral-900 to-neutral-950',
        accentBorder: 'border-white/15',
        modalBorderClass: 'border-primary/35 shadow-[0_0_60px_rgba(0,0,0,0.85)]',
        topBarClass: 'bg-gradient-to-r from-primary/30 via-primary to-primary/30',
    },
    {
        id: 'geschenk-feuerwerk',
        label: 'Geschenk-Feuerwerk',
        shortLabel: '🎈 Geschenk-Feuerwerk',
        description:
            'Transparenter Blur-Hintergrund über der Startseite mit großen Feuerwerken, Ballons, Geschenkboxen & Konfetti.',
        emoji: '🎈',
        previewBg: 'from-[#35050f] via-[#221706] to-[#0b0b0f]',
        accentBorder: 'border-amber-400/50',
        modalBorderClass:
            'border-primary/60 ring-1 ring-red-400/30 shadow-[0_0_95px_rgba(212,175,55,0.34),0_0_55px_rgba(229,4,18,0.26)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412] via-primary to-[#E50412]',
        overlayClass: 'bg-black/40 backdrop-blur-[5px]',
    },
    {
        id: 'exklusiv-aktion',
        label: 'Exklusiv-Aktion',
        shortLabel: '🎁 Exklusiv-Aktion',
        description:
            'Luxus-Geschenkboxen mit Rot- & Gold-Seidenbändern, Scheinwerfer-Silhouette & funkelndem Goldstaub.',
        emoji: '🎁',
        previewBg: 'from-[#2a060c] via-[#1c1306] to-black',
        accentBorder: 'border-red-500/45',
        modalBorderClass:
            'border-[#E50412]/55 ring-1 ring-primary/30 shadow-[0_0_95px_rgba(229,4,18,0.28),0_0_55px_rgba(212,175,55,0.22)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412] via-primary to-[#E50412]',
        backdropImage: '/images/campaign-effects/exklusiv-aktion-bg.webp',
    },
    {
        id: 'turbo-night',
        label: 'Turbo-Aktion',
        shortLabel: '🏎️ Turbo-Aktion',
        description:
            'Nächtliche Speed-Arena mit Sport-Golf, feuchtem Asphalt, Nebel & roten Lichtspuren.',
        emoji: '🏎️',
        previewBg: 'from-[#30040a] via-[#140709] to-black',
        accentBorder: 'border-red-500/45',
        modalBorderClass:
            'border-[#E50412]/60 ring-1 ring-white/15 shadow-[0_0_95px_rgba(229,4,18,0.34)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412] via-rose-400 to-[#E50412]',
        backdropImage: '/images/campaign-effects/turbo-night-bg.webp',
    },
    {
        id: 'winter-flotte',
        label: 'Winter-Special',
        shortLabel: '🎄 Winter-Special',
        description:
            'Festliche Winterstraße mit Auto & Motorrad, beleuchteten Tannenzweigen, Geschenken & Schneefall.',
        emoji: '🎄',
        previewBg: 'from-[#2b080d] via-[#171209] to-black',
        accentBorder: 'border-amber-400/45',
        modalBorderClass:
            'border-amber-300/50 ring-1 ring-[#E50412]/25 shadow-[0_0_95px_rgba(212,175,55,0.26),0_0_45px_rgba(229,4,18,0.22)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412]/70 via-primary to-[#E50412]/70',
        backdropImage: '/images/campaign-effects/winter-flotte-bg.webp',
    },
    {
        id: 'biker-race',
        label: 'Biker-Special',
        shortLabel: '🏁 Biker-Special',
        description:
            'Nächtliche Rennstrecke unter Flutlicht mit Sport-Motorrad, Asphalt-Nebel & roten Speed-Spuren.',
        emoji: '🏁',
        previewBg: 'from-[#2d050a] via-[#160b09] to-black',
        accentBorder: 'border-red-500/45',
        modalBorderClass:
            'border-[#E50412]/60 ring-1 ring-amber-300/25 shadow-[0_0_95px_rgba(229,4,18,0.34)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412] via-primary to-[#E50412]',
        backdropImage: '/images/campaign-effects/biker-race-bg.webp',
    },
    {
        id: 'wien-gala',
        label: 'Wien-Gala',
        shortLabel: '🥂 Wien-Gala',
        description:
            'Wiener Nachtpanorama mit Stephansdom & Riesenrad, Sportwagen, Gold-Konfetti & Feuerwerk.',
        emoji: '🥂',
        previewBg: 'from-[#241b06] via-[#0e121f] to-black',
        accentBorder: 'border-amber-400/45',
        modalBorderClass:
            'border-primary/55 ring-1 ring-amber-200/25 shadow-[0_0_95px_rgba(212,175,55,0.32)]',
        topBarClass: 'bg-gradient-to-r from-amber-300/50 via-primary to-amber-300/50',
        backdropImage: '/images/campaign-effects/wien-gala-bg.webp?v=2',
    },
    {
        id: 'valentine-drive',
        label: 'Valentinstag Drive',
        shortLabel: '❤️ Valentinstag Drive',
        description:
            'Nächtliche Fahrt mit Sport-Golf, leuchtendem Neon-Herz, roten Lichtspuren & Rosenblättern.',
        emoji: '❤️',
        previewBg: 'from-[#33040e] via-[#1c050a] to-black',
        accentBorder: 'border-rose-500/50',
        modalBorderClass:
            'border-[#E50412]/60 ring-1 ring-rose-400/30 shadow-[0_0_95px_rgba(229,4,18,0.34),0_0_45px_rgba(244,63,94,0.22)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412] via-rose-400 to-[#E50412]',
        backdropImage: '/images/campaign-effects/valentine-drive-bg.webp?v=2',
    },
    {
        id: 'new-year',
        label: 'Silvester',
        shortLabel: '🎆 Silvester',
        description:
            'Wiener Nachtskyline mit GATE 11 Fuhrpark, festlichem Gold- & Rot-Feuerwerk und Champagner-Funken.',
        emoji: '🎆',
        previewBg: 'from-[#281e06] via-[#1a0910] to-black',
        accentBorder: 'border-yellow-400/40',
        modalBorderClass: 'border-yellow-400/55 ring-1 ring-primary/30 shadow-[0_0_95px_rgba(250,204,21,0.3)]',
        topBarClass: 'bg-gradient-to-r from-yellow-300/45 via-primary to-red-500/45',
        backdropImage: '/images/campaign-effects/new-year-bg.webp',
    },
    {
        id: 'semesterferien',
        label: 'Semesterferien',
        shortLabel: '🏔️ Semesterferien',
        description:
            'Alpine Winterstraße in der Dämmerung mit feinem Kristallschnee und dynamischen Silber-Gold-Lichtlinien.',
        emoji: '🏔️',
        previewBg: 'from-[#0d1b2e] via-[#101827] to-black',
        accentBorder: 'border-sky-300/40',
        modalBorderClass: 'border-sky-300/45 ring-1 ring-primary/25 shadow-[0_0_90px_rgba(125,211,252,0.24)]',
        topBarClass: 'bg-gradient-to-r from-sky-300/45 via-primary to-sky-300/45',
        backdropImage: '/images/campaign-effects/semesterferien-bg.webp',
    },
    {
        id: 'valentine',
        label: 'Valentinstag',
        shortLabel: '🌹 Valentinstag',
        description:
            'Dunkler Samt-Luxus mit tiefroten Rosenblättern und warmem Kerzenschein-Bokeh.',
        emoji: '🌹',
        previewBg: 'from-[#300816] via-[#210912] to-black',
        accentBorder: 'border-rose-400/40',
        modalBorderClass: 'border-rose-400/50 ring-1 ring-amber-300/20 shadow-[0_0_90px_rgba(225,29,72,0.28)]',
        topBarClass: 'bg-gradient-to-r from-rose-400/45 via-primary to-rose-400/45',
        backdropImage: '/images/campaign-effects/valentine-bg.webp',
    },
    {
        id: 'motorrad-start',
        label: 'Motorrad-Start',
        shortLabel: '🏍️ Motorrad-Start',
        description:
            'Nächtlicher Asphalt mit Scheinwerfer-Atmosphäre, Nebelschwaden und schnellen GATE 11 Glut-Funken.',
        emoji: '🏍️',
        previewBg: 'from-[#2a060b] via-[#150c0f] to-black',
        accentBorder: 'border-red-500/45',
        modalBorderClass: 'border-[#E50412]/55 ring-1 ring-amber-400/25 shadow-[0_0_95px_rgba(229,4,18,0.32)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412]/60 via-primary to-[#E50412]/60',
        backdropImage: '/images/campaign-effects/motorrad-start-bg.webp',
    },
    {
        id: 'easter-spring',
        label: 'Osterferien',
        shortLabel: '🌸 Osterferien',
        description:
            'Abendliche Kirschblüten im Frühlingswind mit zart schwebenden Blütenblättern und warmem Licht.',
        emoji: '🌸',
        previewBg: 'from-[#26161d] via-[#1a180d] to-black',
        accentBorder: 'border-rose-300/35',
        modalBorderClass: 'border-rose-200/40 ring-1 ring-amber-200/20 shadow-[0_0_90px_rgba(244,182,194,0.22)]',
        topBarClass: 'bg-gradient-to-r from-rose-200/45 via-primary to-rose-200/45',
        backdropImage: '/images/campaign-effects/easter-spring-bg.webp',
    },
    {
        id: 'summer-sun',
        label: 'Sommerferien',
        shortLabel: '☀️ Sommerferien',
        description:
            'Goldene Küsten-Dämmerung mit volumetrischen Sonnenstrahlen, Lichtstaub und warmen Linsenreflexen.',
        emoji: '☀️',
        previewBg: 'from-[#332104] via-[#1f1303] to-black',
        accentBorder: 'border-amber-400/40',
        modalBorderClass: 'border-amber-400/50 ring-1 ring-orange-300/25 shadow-[0_0_95px_rgba(245,158,11,0.32)]',
        topBarClass: 'bg-gradient-to-r from-amber-300/50 via-primary to-orange-400/45',
        backdropImage: '/images/campaign-effects/summer-sun-bg.webp',
    },
    {
        id: 'back-to-school',
        label: 'Schul- & Uni-Start',
        shortLabel: '🎓 Schul- & Uni-Start',
        description:
            'Nächtliche Wiener Akademie-Architektur mit präzisen Linien und Gold-Saphir-Lichtimpulsen.',
        emoji: '🎓',
        previewBg: 'from-[#0b1322] via-[#1a1508] to-black',
        accentBorder: 'border-sky-400/35',
        modalBorderClass: 'border-primary/45 ring-1 ring-sky-400/20 shadow-[0_0_90px_rgba(56,189,248,0.2)]',
        topBarClass: 'bg-gradient-to-r from-sky-400/45 via-primary to-sky-400/45',
        backdropImage: '/images/campaign-effects/back-to-school-bg.webp',
    },
    {
        id: 'autumn-leaves',
        label: 'Herbstferien',
        shortLabel: '🍂 Herbstferien',
        description:
            'Stimmungsvolle Herbstallee am Abend mit taumelndem Ahornlaub in Gold & Kupfer und warmem Bokeh.',
        emoji: '🍂',
        previewBg: 'from-[#2e1606] via-[#1f1205] to-black',
        accentBorder: 'border-orange-500/35',
        modalBorderClass: 'border-orange-400/45 ring-1 ring-amber-500/25 shadow-[0_0_90px_rgba(249,115,22,0.25)]',
        topBarClass: 'bg-gradient-to-r from-orange-400/45 via-primary to-amber-500/45',
        backdropImage: '/images/campaign-effects/autumn-leaves-bg.webp',
    },
    {
        id: 'black-friday',
        label: 'Black Week',
        shortLabel: '⚡ Black Week',
        description:
            'Dunkler Speed-Tunnel mit Hochgeschwindigkeits-Lichtstreifen in GATE 11 Rot & Flüssiggold.',
        emoji: '⚡',
        previewBg: 'from-[#33040a] via-[#1a1204] to-black',
        accentBorder: 'border-red-500/45',
        modalBorderClass: 'border-[#E50412]/60 ring-1 ring-primary/30 shadow-[0_0_95px_rgba(229,4,18,0.35)]',
        topBarClass: 'bg-gradient-to-r from-[#E50412]/70 via-primary to-[#E50412]/70',
        backdropImage: '/images/campaign-effects/black-friday-bg.webp',
    },
    {
        id: 'christmas',
        label: 'Weihnachten',
        shortLabel: '❄️ Weihnachten',
        description:
            'Kinoreife Winterlandschaft mit Schneefall, Tannenbäumen, Schneemann, Geschenken & Feuerwerk.',
        emoji: '❄️',
        previewBg: 'from-[#0d1c24] via-[#1b150c] to-[#06090c]',
        accentBorder: 'border-sky-300/35',
        modalBorderClass:
            'border-amber-300/45 ring-1 ring-sky-200/20 shadow-[0_0_95px_rgba(212,175,55,0.25),0_0_55px_rgba(186,230,253,0.16)]',
        topBarClass: 'bg-gradient-to-r from-sky-200/45 via-primary to-sky-200/45',
        backdropImage: '/images/campaign-effects/christmas-bg.webp',
    },
    {
        id: 'eid-crescent',
        label: 'Ramadan & Bayram',
        shortLabel: '🌙 Ramadan & Bayram',
        description:
            'Orientalische Laternen-Atmosphäre bei Nacht mit funkelndem Sternenhimmel & Sternschnuppen.',
        emoji: '🌙',
        previewBg: 'from-[#0d1426] via-[#241b06] to-black',
        accentBorder: 'border-amber-300/40',
        modalBorderClass: 'border-primary/50 ring-1 ring-amber-200/20 shadow-[0_0_95px_rgba(212,175,55,0.32)]',
        topBarClass: 'bg-gradient-to-r from-amber-200/40 via-primary to-amber-200/40',
        backdropImage: '/images/campaign-effects/eid-crescent-bg.webp',
    },
    {
        id: 'gold-gifts',
        label: 'GATE 11 VIP',
        shortLabel: '✨ GATE 11 VIP',
        description:
            'Exklusiver dunkler Luxus-Showroom mit optischem Champagner-Gold-Bokeh & edlen Lichtreflexen.',
        emoji: '✨',
        previewBg: 'from-[#2a2109] via-[#120e04] to-black',
        accentBorder: 'border-amber-500/35',
        modalBorderClass: 'border-primary/45 ring-1 ring-primary/20 shadow-[0_0_90px_rgba(212,175,55,0.28)]',
        topBarClass: 'bg-gradient-to-r from-primary/35 via-primary to-primary/35',
        backdropImage: '/images/campaign-effects/gold-gifts-bg.webp',
    },
];

const EFFECT_MAP = new Map<string, CampaignEffectDefinition>(
    CAMPAIGN_EFFECTS.map((effect) => [effect.id, effect])
);

const LEGACY_EFFECT_ALIASES: Record<string, CampaignEffectId> = {
    'balloons-confetti': 'gold-gifts',
    osterferien: 'easter-spring',
};

export function resolveCampaignEffect(
    effectType?: string | null,
    showEffects?: boolean
): CampaignEffectId {
    if (effectType && EFFECT_MAP.has(effectType)) {
        return effectType as CampaignEffectId;
    }
    if (effectType && LEGACY_EFFECT_ALIASES[effectType]) {
        return LEGACY_EFFECT_ALIASES[effectType];
    }
    return showEffects === false ? 'none' : 'gold-gifts';
}

export function getCampaignEffectMeta(effectId: CampaignEffectId): CampaignEffectDefinition {
    return EFFECT_MAP.get(effectId) || EFFECT_MAP.get('none')!;
}
