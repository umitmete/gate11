'use client';

import { useEffect, useRef, useState } from 'react';
import type { CampaignEffectId } from '@/lib/campaign-effects';

export type HybridEffectId = Exclude<CampaignEffectId, 'none' | 'christmas'>;

interface Point2D {
    x: number;
    y: number;
}

interface SceneInstance {
    resize?: (width: number, height: number) => void;
    render: (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        dt: number,
        time: number,
        isMobile: boolean
    ) => void;
}

type SceneFactory = (width: number, height: number, densityScale: number) => SceneInstance;

function createPrng(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
}

function scaledCount(base: number, densityScale: number, min = 4) {
    return Math.max(min, Math.round(base * densityScale));
}

function drawBokehDisc(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    rgb: string,
    alpha: number,
    rimRatio = 1.45
) {
    if (alpha <= 0.005 || radius <= 0.5) return;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(${rgb}, ${(alpha * 0.35).toFixed(4)})`);
    grad.addColorStop(0.68, `rgba(${rgb}, ${(alpha * 0.55).toFixed(4)})`);
    grad.addColorStop(0.9, `rgba(${rgb}, ${clamp(alpha * rimRatio, 0, 1).toFixed(4)})`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawOpticalGlint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    alpha: number,
    rgb: string
) {
    if (alpha <= 0.015) return;
    ctx.save();
    ctx.translate(x, y);

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    glow.addColorStop(0, `rgba(255, 253, 240, ${alpha.toFixed(4)})`);
    glow.addColorStop(0.32, `rgba(${rgb}, ${(alpha * 0.65).toFixed(4)})`);
    glow.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    for (const angle of [0, Math.PI / 2]) {
        ctx.save();
        ctx.rotate(angle);
        const len = radius * 1.3;
        const beam = ctx.createLinearGradient(-len, 0, len, 0);
        beam.addColorStop(0, `rgba(${rgb}, 0)`);
        beam.addColorStop(0.5, `rgba(255, 250, 228, ${(alpha * 0.75).toFixed(4)})`);
        beam.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = beam;
        ctx.fillRect(-len, -0.65, len * 2, 1.3);
        ctx.restore();
    }

    ctx.restore();
}

function drawPetalPath(ctx: CanvasRenderingContext2D, size: number) {
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.56);
    ctx.bezierCurveTo(size * 0.62, -size * 0.35, size * 0.54, size * 0.46, 0, size * 0.62);
    ctx.bezierCurveTo(-size * 0.54, size * 0.46, -size * 0.62, -size * 0.35, 0, -size * 0.56);
    ctx.closePath();
}

function drawLeafPath(ctx: CanvasRenderingContext2D, size: number) {
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.72);
    ctx.bezierCurveTo(size * 0.22, -size * 0.36, size * 0.62, -size * 0.42, size * 0.68, -size * 0.08);
    ctx.bezierCurveTo(size * 0.44, size * 0.08, size * 0.55, size * 0.42, size * 0.24, size * 0.52);
    ctx.lineTo(0.05, size * 0.34);
    ctx.lineTo(0, size * 0.78);
    ctx.lineTo(-0.05, size * 0.34);
    ctx.lineTo(-size * 0.24, size * 0.52);
    ctx.bezierCurveTo(-size * 0.55, size * 0.42, -size * 0.44, size * 0.08, -size * 0.68, -size * 0.08);
    ctx.bezierCurveTo(-size * 0.62, -size * 0.42, -size * 0.22, -size * 0.36, 0, -size * 0.72);
    ctx.closePath();
}

// =====================================================================
// SHARED BALLISTIC FIREWORKS ENGINE (USED BY NEW YEAR & WIEN GALA)
// =====================================================================
function createBallisticFireworks(
    rand: () => number,
    width: number,
    height: number,
    densityScale: number,
    options: {
        palette: string[];
        outerOnly?: boolean;
        allowGrand?: boolean;
        maxDesktop?: number;
        maxMobile?: number;
        spawnInterval?: [number, number];
        brocadeScale?: number;
        trailLength?: number;
        brocadePhysics?: boolean;
        launchY?: number;
        immediateBursts?: Array<{
            xRatio: number;
            yRatio: number;
            tier: 'small' | 'medium' | 'grand';
        }>;
    }
) {
    type Tier = 'small' | 'medium' | 'grand';

    const rockets: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        targetY: number;
        rgb: string;
        tier: Tier;
        isWillow: boolean;
        trail: Point2D[];
    }> = [];

    const sparks: Array<{
        x: number;
        y: number;
        history: Point2D[];
        vx: number;
        vy: number;
        life: number;
        maxLife: number;
        rgb: string;
        size: number;
        drag: number;
        gravity: number;
        glitter: boolean;
    }> = [];

    const flashes: Array<{
        x: number;
        y: number;
        radius: number;
        rgb: string;
        life: number;
        maxLife: number;
    }> = [];

    let fwTimer = options.immediateBursts?.length ? 0.45 : 0.2;
    let lastWidth = width;
    const maxHistory = options.trailLength ?? 7;

    const spawnRocket = (w: number, h: number, forcedTier?: Tier) => {
        const roll = rand();
        const allowGrand = options.allowGrand !== false;
        const tier: Tier =
            forcedTier ||
            (allowGrand
                ? options.brocadePhysics
                    ? roll < 0.2
                        ? 'small'
                        : roll < 0.58
                        ? 'medium'
                        : 'grand'
                    : roll < 0.25
                    ? 'small'
                    : roll < 0.68
                    ? 'medium'
                    : 'grand'
                : roll < 0.45
                ? 'small'
                : 'medium');

        const zone = rand();
        let rx: number;
        if (options.outerOnly) {
            rx = zone < 0.5 ? (0.07 + rand() * 0.18) * w : (0.75 + rand() * 0.18) * w;
        } else {
            rx =
                zone < 0.38
                    ? (0.1 + rand() * 0.22) * w
                    : zone < 0.76
                    ? (0.68 + rand() * 0.22) * w
                    : (0.36 + rand() * 0.28) * w;
        }

        const ry = h * (options.launchY ?? 0.54);
        const ty =
            tier === 'grand'
                ? (0.09 + rand() * 0.13) * h
                : tier === 'medium'
                ? (0.12 + rand() * 0.17) * h
                : (0.2 + rand() * 0.16) * h;
        const t =
            tier === 'grand'
                ? 0.68 + rand() * 0.22
                : tier === 'medium'
                ? 0.54 + rand() * 0.2
                : 0.42 + rand() * 0.18;
        const g = 240;
        const vy = -(ry - ty) / t - 0.5 * g * t;

        rockets.push({
            x: rx,
            y: ry,
            vx: (rand() - 0.5) * 65,
            vy,
            targetY: ty,
            rgb: options.palette[Math.floor(rand() * options.palette.length)],
            tier,
            isWillow: tier === 'grand' || rand() > 0.35,
            trail: [],
        });
    };

    const detonate = (r: (typeof rockets)[number], currentW = lastWidth) => {
        const sizeScale = options.brocadePhysics
            ? (options.brocadeScale ?? 1) * clamp(currentW / 1440, 0.52, 1.26)
            : 1;

        flashes.push({
            x: r.x,
            y: r.y,
            radius: (r.tier === 'grand' ? 350 : r.tier === 'medium' ? 230 : 130) * sizeScale,
            rgb: r.rgb,
            life: 0,
            maxLife: r.tier === 'grand' ? (options.brocadePhysics ? 0.76 : 0.62) : 0.48,
        });

        const addRing = (
            count: number,
            speedBase: number,
            ringRgb: string,
            altRgb: string,
            maxLifeBase: number,
            sizeBase: number,
            dragVal: number,
            gravityVal: number
        ) => {
            const actualCount = scaledCount(count, densityScale, 18);
            for (let i = 0; i < actualCount; i++) {
                const theta = rand() * Math.PI * 2;
                const phi = Math.acos(2 * rand() - 1);
                const spd = (0.38 + 0.68 * Math.sin(phi)) * speedBase * (0.82 + rand() * 0.34);
                sparks.push({
                    x: r.x,
                    y: r.y,
                    history: [{ x: r.x, y: r.y }],
                    vx: Math.cos(theta) * Math.sin(phi) * spd,
                    vy: Math.sin(theta) * Math.sin(phi) * spd * 0.85,
                    life: 0,
                    maxLife: maxLifeBase + rand() * 0.68,
                    rgb: i % 4 === 0 ? altRgb : ringRgb,
                    size: sizeBase + rand() * 1.1,
                    drag: dragVal,
                    gravity: gravityVal,
                    glitter: r.isWillow || rand() > 0.58,
                });
            }
        };

        const secondary = rand() > 0.5 ? '255, 248, 224' : '212, 175, 55';
        if (options.brocadePhysics) {
            // Layered golden brocade chrysanthemum shells scaled for panoramic Vienna skyline
            if (r.tier === 'grand') {
                addRing(138, 345 * sizeScale, r.rgb, '255, 250, 232', 1.85, 2.0, 0.967, 108);
                addRing(82, 220 * sizeScale, '252, 226, 152', r.rgb, 1.45, 1.65, 0.964, 120);
                addRing(48, 115 * sizeScale, '255, 250, 234', '252, 226, 152', 1.05, 1.5, 0.962, 128);
            } else if (r.tier === 'medium') {
                addRing(96, 265 * sizeScale, r.rgb, '255, 248, 224', 1.48, 1.72, 0.966, 118);
                addRing(42, 122 * sizeScale, '255, 250, 234', secondary, 1.02, 1.4, 0.963, 130);
            } else {
                addRing(56, 168 * sizeScale, r.rgb, secondary, 1.05, 1.32, 0.966, 132);
            }
            return;
        }

        if (r.tier === 'grand') {
            addRing(96, 290, r.rgb, secondary, 1.48, 1.7, 0.958, 122);
            const coreRgb = r.rgb === '229, 4, 18' ? '252, 226, 152' : '229, 4, 18';
            addRing(50, 136, coreRgb, '255, 250, 235', 1.1, 1.42, 0.962, 138);
        } else if (r.tier === 'medium') {
            addRing(84, 215, r.rgb, secondary, 1.2, 1.4, 0.963, 142);
        } else {
            addRing(46, 126, r.rgb, secondary, 0.8, 1.1, 0.968, 162);
        }
    };

    if (options.immediateBursts?.length) {
        options.immediateBursts.forEach((burst, idx) => {
            detonate(
                {
                    x: width * burst.xRatio,
                    y: height * burst.yRatio,
                    vx: 0,
                    vy: 0,
                    targetY: height * burst.yRatio,
                    rgb: options.palette[idx % options.palette.length],
                    tier: burst.tier,
                    isWillow: true,
                    trail: [],
                },
                width
            );
        });
        spawnRocket(width, height, 'medium');
    } else {
        spawnRocket(width, height, options.allowGrand === false ? 'medium' : 'grand');
        spawnRocket(width, height, 'medium');
    }

    const [minGap, gapRange] = options.spawnInterval || [0.68, 0.82];

    return {
        render(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, time: number, isMobile: boolean) {
            lastWidth = w;
            const maxRockets = isMobile ? (options.maxMobile ?? 3) : (options.maxDesktop ?? 5);
            fwTimer -= dt;
            if (fwTimer <= 0 && rockets.length < maxRockets) {
                spawnRocket(w, h);
                if (!isMobile && rand() < (options.brocadePhysics ? 0.52 : 0.35)) {
                    spawnRocket(w, h, options.brocadePhysics ? 'medium' : 'small');
                }
                fwTimer = minGap + rand() * gapRange;
            }

            for (let i = flashes.length - 1; i >= 0; i--) {
                const fl = flashes[i];
                fl.life += dt;
                if (fl.life >= fl.maxLife) {
                    flashes.splice(i, 1);
                    continue;
                }
                const flashPeak = options.brocadePhysics ? 0.34 : 0.25;
                const alpha = (1 - fl.life / fl.maxLife) * flashPeak;
                const g = ctx.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, fl.radius);
                g.addColorStop(0, `rgba(255, 250, 234, ${(alpha * 1.4).toFixed(4)})`);
                g.addColorStop(0.35, `rgba(${fl.rgb}, ${alpha.toFixed(4)})`);
                g.addColorStop(1, `rgba(${fl.rgb}, 0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(fl.x, fl.y, fl.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            for (let i = rockets.length - 1; i >= 0; i--) {
                const r = rockets[i];
                r.trail.push({ x: r.x, y: r.y });
                if (r.trail.length > 12) r.trail.shift();
                r.vy += 240 * dt;
                r.x += r.vx * dt;
                r.y += r.vy * dt;

                for (let j = 1; j < r.trail.length; j++) {
                    const p0 = r.trail[j - 1];
                    const p1 = r.trail[j];
                    const prog = j / r.trail.length;
                    ctx.strokeStyle = `rgba(${r.rgb}, ${(prog * 0.85).toFixed(4)})`;
                    ctx.lineWidth = prog * 2.1;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.stroke();
                }

                if (r.vy >= -20 || r.y <= r.targetY) {
                    detonate(r, w);
                    rockets.splice(i, 1);
                }
            }

            for (let i = sparks.length - 1; i >= 0; i--) {
                const sp = sparks[i];
                sp.life += dt;
                if (sp.life >= sp.maxLife) {
                    sparks.splice(i, 1);
                    continue;
                }
                sp.history.push({ x: sp.x, y: sp.y });
                if (sp.history.length > maxHistory) sp.history.shift();

                const dragF = Math.pow(sp.drag, dt * 60);
                sp.vx *= dragF;
                sp.vy = sp.vy * dragF + sp.gravity * dt;
                sp.x += sp.vx * dt;
                sp.y += sp.vy * dt;

                const t = sp.life / sp.maxLife;
                let a = t < 0.15 ? 1 : Math.pow(1 - (t - 0.15) / 0.85, 1.5);
                if (sp.glitter && t > 0.54) {
                    a *= 0.3 + 0.7 * Math.abs(Math.sin(time * 26 + i * 2.9));
                }
                const rgb = t < 0.14 ? '255, 252, 238' : sp.rgb;

                for (let hIdx = 1; hIdx < sp.history.length; hIdx++) {
                    const p0 = sp.history[hIdx - 1];
                    const p1 = sp.history[hIdx];
                    const segProg = hIdx / sp.history.length;
                    ctx.strokeStyle = `rgba(${rgb}, ${clamp(a * segProg, 0, 1).toFixed(4)})`;
                    ctx.lineWidth = Math.max(0.5, sp.size * segProg * (1 - t * 0.35));
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.stroke();
                }

                if (t < (options.brocadePhysics ? 0.62 : 0.45)) {
                    ctx.fillStyle = `rgba(255, 252, 240, ${clamp(a * 0.85, 0, 1).toFixed(4)})`;
                    ctx.beginPath();
                    ctx.arc(sp.x, sp.y, sp.size * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
    };
}

// =====================================================================
// 1. SILVESTER & NEUJAHR — MULTI-SCALE BALLISTIC FIREWORKS & EMBERS
// =====================================================================
const createNewYearScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(202601);
    const fireworks = createBallisticFireworks(rand, width, height, densityScale, {
        palette: ['212, 175, 55', '252, 226, 152', '229, 4, 18', '241, 245, 249'],
        allowGrand: true,
        maxDesktop: 5,
        maxMobile: 3,
    });

    const risingEmbers = Array.from({ length: scaledCount(36, densityScale, 12) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        vy: -(18 + rand() * 28),
        vx: (rand() - 0.5) * 14,
        r: 1.1 + rand() * 2.1,
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '229, 4, 18' : i % 2 === 0 ? '252, 226, 152' : '212, 175, 55',
    }));

    return {
        render(ctx, w, h, dt, time, isMobile) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (const em of risingEmbers) {
                em.y += em.vy * dt;
                em.x += (em.vx + Math.sin(time * 0.8 + em.phase) * 10) * dt;
                if (em.y < -20) {
                    em.y = h + 20;
                    em.x = rand() * w;
                }
                const pulse = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(time * 2.4 + em.phase), 2);
                drawBokehDisc(ctx, em.x, em.y, em.r * 2.4, em.rgb, 0.42 * pulse);
            }

            fireworks.render(ctx, w, h, dt, time, isMobile);
            ctx.restore();
        },
    };
};

// =====================================================================
// 2. SEMESTERFERIEN — CRISP CRYSTAL SNOWFALL + SILVER-GOLD SPEED LINES
// =====================================================================
const createSemesterferienScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(202602);
    const flakes = Array.from({ length: scaledCount(155, densityScale, 40) }, (_, i) => {
        const layer = i % 10 < 4 ? 0 : i % 10 < 8 ? 1 : 2;
        const radius =
            layer === 0 ? 1.0 + rand() * 1.1 : layer === 1 ? 2.0 + rand() * 2.0 : 5.5 + rand() * 7.5;
        return {
            x: rand() * width,
            y: rand() * height,
            radius,
            layer,
            vy: layer === 0 ? 22 + rand() * 16 : layer === 1 ? 45 + rand() * 30 : 85 + rand() * 44,
            swayAmp: layer === 0 ? 7 + rand() * 8 : layer === 1 ? 15 + rand() * 16 : 24 + rand() * 20,
            swayFreq: 0.45 + rand() * 0.8,
            phase: rand() * Math.PI * 2,
            alpha: layer === 0 ? 0.28 + rand() * 0.22 : layer === 1 ? 0.56 + rand() * 0.28 : 0.18 + rand() * 0.14,
            iceTint: rand() > 0.35,
        };
    });

    const streaks = Array.from({ length: scaledCount(12, densityScale, 4) }, (_, i) => ({
        x: rand() * width,
        y: (i % 2 === 0 ? 0.08 + rand() * 0.22 : 0.72 + rand() * 0.22) * height,
        len: 110 + rand() * 170,
        speed: (i % 2 === 0 ? 1 : -1) * (180 + rand() * 190),
        rgb: i % 3 === 0 ? '212, 175, 55' : '186, 230, 253',
        alpha: 0.2 + rand() * 0.24,
    }));

    const frostGlints = Array.from({ length: scaledCount(14, densityScale, 4) }, (_, i) => ({
        xRatio: i % 2 === 0 ? 0.05 + rand() * 0.25 : 0.7 + rand() * 0.25,
        yRatio: 0.1 + rand() * 0.8,
        size: 8 + rand() * 11,
        speed: 1.4 + rand() * 1.6,
        phase: rand() * Math.PI * 2,
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (const s of streaks) {
                s.x += s.speed * dt;
                if (s.speed > 0 && s.x > w + s.len) s.x = -s.len;
                if (s.speed < 0 && s.x < -s.len) s.x = w + s.len;

                const grad = ctx.createLinearGradient(s.x - s.len * 0.5, s.y, s.x + s.len * 0.5, s.y);
                grad.addColorStop(0, `rgba(${s.rgb}, 0)`);
                grad.addColorStop(0.5, `rgba(${s.rgb}, ${s.alpha.toFixed(4)})`);
                grad.addColorStop(1, `rgba(${s.rgb}, 0)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(s.x - s.len * 0.5, s.y);
                ctx.lineTo(s.x + s.len * 0.5, s.y);
                ctx.stroke();
            }

            for (const fg of frostGlints) {
                const wave = Math.max(0, Math.sin(time * fg.speed + fg.phase));
                drawOpticalGlint(ctx, fg.xRatio * w, fg.yRatio * h, fg.size, Math.pow(wave, 2.5) * 0.68, '186, 230, 253');
            }
            ctx.restore();

            const wind = Math.sin(time * 0.25) * 18 + Math.sin(time * 0.55) * 8;
            for (const f of flakes) {
                const sway = Math.sin(time * f.swayFreq + f.phase) * f.swayAmp;
                f.y += f.vy * dt;
                f.x += (wind * (0.4 + f.layer * 0.32) + sway) * dt;
                if (f.y > h + f.radius * 3) {
                    f.y = -f.radius * 3;
                    f.x = rand() * w;
                }
                if (f.x > w + f.radius * 3) f.x = -f.radius * 3;
                if (f.x < -f.radius * 3) f.x = w + f.radius * 3;

                const rgb = f.iceTint ? '218, 240, 255' : '255, 248, 232';
                const rScale = f.layer === 2 ? f.radius : f.radius * 1.45;
                const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rScale);
                grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha.toFixed(4)})`);
                grad.addColorStop(0.55, `rgba(${rgb}, ${(f.alpha * 0.65).toFixed(4)})`);
                grad.addColorStop(1, `rgba(${rgb}, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(f.x, f.y, rScale, 0, Math.PI * 2);
                ctx.fill();
            }
        },
    };
};

// =====================================================================
// 3. VALENTINSTAG & BRING-A-FRIEND — 3D ROSE PETALS & CANDLELIGHT BOKEH
// =====================================================================
const createValentineScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(2142026);
    const candleBokeh = Array.from({ length: scaledCount(26, densityScale, 8) }, (_, i) => ({
        x: (i % 2 === 0 ? 0.04 + rand() * 0.25 : 0.71 + rand() * 0.25) * width,
        y: rand() * height,
        r: 18 + rand() * 36,
        vy: -(10 + rand() * 15),
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '244, 63, 94' : i % 3 === 1 ? '251, 191, 146' : '212, 175, 55',
        alpha: 0.09 + rand() * 0.1,
    }));

    const petals = Array.from({ length: scaledCount(42, densityScale, 14) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        size: 7 + rand() * 9,
        vy: 26 + rand() * 24,
        rot: rand() * Math.PI * 2,
        vRot: (rand() - 0.5) * 1.4,
        pitch: rand() * Math.PI * 2,
        vPitch: 1.2 + rand() * 1.7,
        alpha: 0.38 + rand() * 0.36,
        rgb: i % 3 === 0 ? '190, 18, 60' : i % 3 === 1 ? '225, 29, 72' : '159, 18, 57',
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const b of candleBokeh) {
                b.y += b.vy * dt;
                if (b.y < -b.r * 2) b.y = h + b.r * 2;
                const flicker = 0.76 + 0.24 * Math.sin(time * 2.2 + b.phase);
                drawBokehDisc(ctx, b.x + Math.sin(time * 0.5 + b.phase) * 10, b.y, b.r, b.rgb, b.alpha * flicker);
            }
            ctx.restore();

            for (const p of petals) {
                p.y += p.vy * dt;
                p.x += (12 + Math.sin(time * 0.8 + p.pitch) * 18) * dt;
                p.rot += p.vRot * dt;
                p.pitch += p.vPitch * dt;
                if (p.y > h + 28) {
                    p.y = -28;
                    p.x = rand() * w;
                }
                if (p.x > w + 28) p.x = -28;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.scale(Math.cos(p.pitch) * 0.5 + 0.5, Math.sin(p.pitch * 0.7) * 0.4 + 0.6);

                const g = ctx.createRadialGradient(0, -p.size * 0.2, 0, 0, 0, p.size);
                g.addColorStop(0, `rgba(255, 165, 185, ${p.alpha.toFixed(4)})`);
                g.addColorStop(0.65, `rgba(${p.rgb}, ${(p.alpha * 0.88).toFixed(4)})`);
                g.addColorStop(1, 'rgba(95, 8, 28, 0)');
                ctx.fillStyle = g;
                drawPetalPath(ctx, p.size);
                ctx.fill();
                ctx.restore();
            }
        },
    };
};

// =====================================================================
// 4. MOTORRAD-SAISONSTART — ASPHALT MIST, HEADLIGHT FLARE & CRIMSON EMBERS
// =====================================================================
const createMotorradScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(1112026);
    const mistWisps = Array.from({ length: scaledCount(6, densityScale, 3) }, (_, i) => ({
        x: (i / 5) * width,
        yRatio: 0.78 + (i % 3) * 0.06,
        rx: 260 + rand() * 220,
        ry: 30 + rand() * 22,
        vx: 18 + rand() * 20,
        alpha: 0.045 + rand() * 0.04,
    }));

    const embers = Array.from({ length: scaledCount(58, densityScale, 18) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        vx: 140 + rand() * 240,
        vy: -(18 + rand() * 42),
        size: 1.2 + rand() * 2.2,
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '229, 4, 18' : i % 2 === 0 ? '245, 158, 11' : '252, 224, 150',
    }));

    const streaks = Array.from({ length: scaledCount(14, densityScale, 5) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        len: 100 + rand() * 190,
        speed: 320 + rand() * 420,
        isRed: i % 2 === 0,
        alpha: 0.2 + rand() * 0.3,
    }));

    return {
        render(ctx, w, h, dt, time) {
            for (const m of mistWisps) {
                m.x += m.vx * dt;
                if (m.x > w + m.rx) m.x = -m.rx;
                const my = m.yRatio * h;
                const mg = ctx.createRadialGradient(m.x, my, 0, m.x, my, m.rx);
                mg.addColorStop(0, `rgba(210, 220, 235, ${m.alpha.toFixed(4)})`);
                mg.addColorStop(1, 'rgba(210, 220, 235, 0)');
                ctx.save();
                ctx.translate(m.x, my);
                ctx.scale(1, m.ry / m.rx);
                ctx.fillStyle = mg;
                ctx.beginPath();
                ctx.arc(0, 0, m.rx, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Subtle pulsing golden-white headlight halo aligned over motorcycle flank
            const pulse = 0.85 + 0.15 * Math.sin(time * 2.8);
            const hlX = w * 0.7;
            const hlY = h * 0.25;
            drawBokehDisc(ctx, hlX, hlY, 95 * pulse, '255, 230, 175', 0.14 * pulse, 1.1);
            drawOpticalGlint(ctx, hlX, hlY, 34 * pulse, 0.42 * pulse, '255, 236, 190');

            // Diagonal nocturnal asphalt streaks
            const cos = Math.cos(-0.24);
            const sin = Math.sin(-0.24);
            for (const s of streaks) {
                s.x += cos * s.speed * dt;
                s.y += sin * s.speed * dt;
                if (s.x > w + s.len || s.y < -s.len) {
                    s.x = -s.len;
                    s.y = (0.15 + rand() * 0.85) * h;
                }
                const x2 = s.x - cos * s.len;
                const y2 = s.y - sin * s.len;
                const rgb = s.isRed ? '229, 4, 18' : '245, 180, 72';
                const g = ctx.createLinearGradient(x2, y2, s.x, s.y);
                g.addColorStop(0, `rgba(${rgb}, 0)`);
                g.addColorStop(1, `rgba(${rgb}, ${s.alpha.toFixed(4)})`);
                ctx.strokeStyle = g;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();
            }

            // Rising highway spark embers
            for (const em of embers) {
                em.x += em.vx * dt;
                em.y += (em.vy + Math.sin(time * 3 + em.phase) * 20) * dt;
                if (em.x > w + 20 || em.y < -20) {
                    em.x = -20;
                    em.y = (0.35 + rand() * 0.65) * h;
                }
                const a = 0.45 + 0.45 * Math.sin(time * 7 + em.phase);
                drawBokehDisc(ctx, em.x, em.y, em.size * 2.2, em.rgb, a * 0.55);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 5. OSTERFERIEN & FRÜHLING — 3D CHERRY BLOSSOMS & GOLDEN POLLEN WIND
// =====================================================================
const createSpringBlossomsScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(3042026);
    const petals = Array.from({ length: scaledCount(68, densityScale, 20) }, (_, i) => {
        const layer = i % 10 < 4 ? 0 : i % 10 < 8 ? 1 : 2;
        const colors = ['255, 224, 232', '252, 200, 214', '255, 246, 240', '246, 226, 168'];
        return {
            x: rand() * width,
            y: rand() * height,
            size: layer === 0 ? 5 + rand() * 3 : layer === 1 ? 8 + rand() * 5 : 13 + rand() * 6,
            vy: layer === 0 ? 22 + rand() * 14 : layer === 1 ? 38 + rand() * 20 : 58 + rand() * 24,
            vx: 14 + rand() * 22,
            rot: rand() * Math.PI * 2,
            vRot: (rand() - 0.5) * 1.8,
            pitch: rand() * Math.PI * 2,
            vPitch: 1.4 + rand() * 2.1,
            alpha: layer === 0 ? 0.36 : layer === 1 ? 0.66 : 0.44,
            rgb: colors[i % colors.length],
        };
    });

    const motes = Array.from({ length: scaledCount(32, densityScale, 10) }, () => ({
        x: rand() * width,
        y: rand() * height,
        r: 1.4 + rand() * 2.2,
        phase: rand() * Math.PI * 2,
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const m of motes) {
                const alpha = 0.25 + 0.35 * Math.sin(time * 1.8 + m.phase);
                drawBokehDisc(ctx, m.x + Math.sin(time + m.phase) * 8, m.y, m.r * 2.5, '255, 235, 195', alpha * 0.45);
            }
            ctx.restore();

            const breeze = 18 + Math.sin(time * 0.35) * 16;
            for (const p of petals) {
                p.y += p.vy * dt;
                p.x += (p.vx + breeze + Math.sin(time * 1.1 + p.pitch) * 14) * dt;
                p.rot += p.vRot * dt;
                p.pitch += p.vPitch * dt;
                if (p.y > h + 30) {
                    p.y = -30;
                    p.x = rand() * w;
                }
                if (p.x > w + 30) p.x = -30;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.scale(Math.cos(p.pitch) * 0.55 + 0.45, Math.sin(p.pitch * 0.8) * 0.45 + 0.55);

                const g = ctx.createRadialGradient(0, -p.size * 0.15, 0, 0, 0, p.size);
                g.addColorStop(0, `rgba(255, 252, 250, ${p.alpha.toFixed(4)})`);
                g.addColorStop(0.7, `rgba(${p.rgb}, ${(p.alpha * 0.84).toFixed(4)})`);
                g.addColorStop(1, `rgba(${p.rgb}, 0)`);
                ctx.fillStyle = g;
                drawPetalPath(ctx, p.size);
                ctx.fill();
                ctx.restore();
            }
        },
    };
};

// =====================================================================
// 6. SOMMERFERIEN & L17 — VOLUMETRIC GOLDEN SUNBEAMS & LENS BOKEH
// =====================================================================
const createSummerSunScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(7072026);
    const rays = Array.from({ length: 7 }, (_, i) => ({
        angle: -0.35 + i * 0.14,
        width: 0.08 + rand() * 0.1,
        speed: 0.25 + rand() * 0.3,
        phase: rand() * Math.PI * 2,
        alpha: 0.036 + rand() * 0.03,
    }));

    const lensBokeh = Array.from({ length: scaledCount(26, densityScale, 8) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        r: 10 + rand() * 34,
        vy: -(8 + rand() * 14),
        vx: (rand() - 0.5) * 8,
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '253, 224, 71' : i % 3 === 1 ? '251, 146, 60' : '245, 196, 81',
        alpha: 0.08 + rand() * 0.1,
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            const srcX = w * 0.8;
            const srcY = -h * 0.12;
            const maxLen = Math.hypot(w, h) * 1.25;

            for (const r of rays) {
                const pulse = 0.65 + 0.35 * Math.sin(time * r.speed + r.phase);
                const sweep = Math.sin(time * 0.15 + r.phase) * 0.05;
                const a1 = r.angle + sweep;
                const a2 = a1 + r.width;

                const grad = ctx.createRadialGradient(srcX, srcY, 20, srcX, srcY, maxLen * 0.9);
                grad.addColorStop(0, `rgba(255, 232, 163, ${(r.alpha * pulse * 2.2).toFixed(4)})`);
                grad.addColorStop(0.45, `rgba(245, 180, 50, ${(r.alpha * pulse).toFixed(4)})`);
                grad.addColorStop(1, 'rgba(245, 180, 50, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(srcX, srcY);
                ctx.lineTo(srcX + Math.sin(a1) * maxLen, srcY + Math.cos(a1) * maxLen);
                ctx.lineTo(srcX + Math.sin(a2) * maxLen, srcY + Math.cos(a2) * maxLen);
                ctx.closePath();
                ctx.fill();
            }

            for (const b of lensBokeh) {
                b.y += b.vy * dt;
                b.x += b.vx * dt;
                if (b.y < -b.r * 2) {
                    b.y = h + b.r * 2;
                    b.x = rand() * w;
                }
                const pulse = 0.75 + 0.25 * Math.sin(time * 1.2 + b.phase);
                drawBokehDisc(ctx, b.x, b.y, b.r, b.rgb, b.alpha * pulse);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 7. SCHULSTART & UNI — ARCHITECTURAL PRECISION LINES & LIGHT IMPULSES
// =====================================================================
const createBackToSchoolScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(9092026);
    const pulses = Array.from({ length: scaledCount(18, densityScale, 6) }, (_, i) => ({
        horizontal: i % 2 === 0,
        trackIndex: Math.floor(rand() * 14),
        pos: rand() * Math.max(width, height),
        speed: (rand() > 0.5 ? 1 : -1) * (130 + rand() * 150),
        length: 90 + rand() * 120,
        rgb: i % 3 === 0 ? '125, 211, 252' : '212, 175, 55',
    }));

    return {
        render(ctx, w, h, dt) {
            const step = 88;
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= w; x += step) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
            }
            for (let y = 0; y <= h; y += step) {
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
            }
            ctx.stroke();

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const p of pulses) {
                p.pos += p.speed * dt;
                if (p.horizontal) {
                    const y = ((p.trackIndex * step) % h) || step;
                    if (p.pos > w + p.length) p.pos = -p.length;
                    if (p.pos < -p.length) p.pos = w + p.length;
                    const grad = ctx.createLinearGradient(p.pos - p.length, y, p.pos + p.length, y);
                    grad.addColorStop(0, `rgba(${p.rgb}, 0)`);
                    grad.addColorStop(0.5, `rgba(${p.rgb}, 0.52)`);
                    grad.addColorStop(1, `rgba(${p.rgb}, 0)`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.moveTo(p.pos - p.length, y);
                    ctx.lineTo(p.pos + p.length, y);
                    ctx.stroke();
                    drawBokehDisc(ctx, p.pos, y, 5, p.rgb, 0.48);
                } else {
                    const x = ((p.trackIndex * step) % w) || step;
                    if (p.pos > h + p.length) p.pos = -p.length;
                    if (p.pos < -p.length) p.pos = h + p.length;
                    const grad = ctx.createLinearGradient(x, p.pos - p.length, x, p.pos + p.length);
                    grad.addColorStop(0, `rgba(${p.rgb}, 0)`);
                    grad.addColorStop(0.5, `rgba(${p.rgb}, 0.52)`);
                    grad.addColorStop(1, `rgba(${p.rgb}, 0)`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.moveTo(x, p.pos - p.length);
                    ctx.lineTo(x, p.pos + p.length);
                    ctx.stroke();
                    drawBokehDisc(ctx, x, p.pos, 5, p.rgb, 0.48);
                }
            }
            ctx.restore();
        },
    };
};

// =====================================================================
// 8. HERBSTFERIEN — 3D MAPLE LEAVES IN AUTUMN WIND & AMBER BOKEH
// =====================================================================
const createAutumnLeavesScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(10102026);
    const leaves = Array.from({ length: scaledCount(56, densityScale, 18) }, (_, i) => {
        const layer = i % 10 < 4 ? 0 : i % 10 < 8 ? 1 : 2;
        const colors = ['212, 145, 42', '217, 95, 38', '185, 45, 35', '245, 185, 66'];
        return {
            x: rand() * width,
            y: rand() * height,
            size: layer === 0 ? 7 + rand() * 4 : layer === 1 ? 11 + rand() * 5 : 17 + rand() * 6,
            vy: layer === 0 ? 28 + rand() * 18 : layer === 1 ? 45 + rand() * 26 : 70 + rand() * 30,
            vx: 16 + rand() * 24,
            rot: rand() * Math.PI * 2,
            vRot: (rand() - 0.5) * 2.2,
            pitch: rand() * Math.PI * 2,
            vPitch: 1.2 + rand() * 2.0,
            alpha: layer === 0 ? 0.4 : layer === 1 ? 0.68 : 0.46,
            rgb: colors[i % colors.length],
        };
    });

    const embers = Array.from({ length: scaledCount(24, densityScale, 8) }, () => ({
        x: rand() * width,
        y: rand() * height,
        r: 2 + rand() * 3,
        phase: rand() * Math.PI * 2,
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const e of embers) {
                const alpha = 0.28 + 0.35 * Math.sin(time * 1.4 + e.phase);
                drawBokehDisc(ctx, e.x, e.y + Math.sin(time + e.phase) * 10, e.r * 3, '245, 158, 45', alpha * 0.45);
            }
            ctx.restore();

            const gust = 22 + Math.sin(time * 0.4) * 20;
            for (const l of leaves) {
                l.y += l.vy * dt;
                l.x += (l.vx + gust + Math.sin(time * 1.3 + l.pitch) * 16) * dt;
                l.rot += l.vRot * dt;
                l.pitch += l.vPitch * dt;
                if (l.y > h + 32) {
                    l.y = -32;
                    l.x = rand() * w;
                }
                if (l.x > w + 32) l.x = -32;

                ctx.save();
                ctx.translate(l.x, l.y);
                ctx.rotate(l.rot);
                ctx.scale(Math.cos(l.pitch) * 0.5 + 0.5, Math.sin(l.pitch * 0.7) * 0.35 + 0.65);

                const g = ctx.createLinearGradient(0, -l.size, 0, l.size);
                g.addColorStop(0, `rgba(${l.rgb}, ${l.alpha.toFixed(4)})`);
                g.addColorStop(1, `rgba(120, 42, 16, ${(l.alpha * 0.85).toFixed(4)})`);
                ctx.fillStyle = g;
                drawLeafPath(ctx, l.size);
                ctx.fill();
                ctx.restore();
            }
        },
    };
};

// =====================================================================
// 9. BLACK WEEK — SUPERCAR VELOCITY STREAKS & CRIMSON/GOLD EMBERS
// =====================================================================
const createBlackFridayScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(11112026);
    const streaks = Array.from({ length: scaledCount(26, densityScale, 8) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        len: 140 + rand() * 260,
        speed: 440 + rand() * 520,
        thickness: 1 + rand() * 2.2,
        isGold: i % 3 === 0,
        alpha: 0.3 + rand() * 0.45,
    }));

    const sparks = Array.from({ length: scaledCount(50, densityScale, 16) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        speed: 220 + rand() * 340,
        size: 1.2 + rand() * 2,
        isGold: i % 2 === 0,
        phase: rand() * Math.PI * 2,
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            const glowPulse = 0.7 + 0.3 * Math.sin(time * 2.2);
            drawBokehDisc(ctx, w * 0.14, h * 0.72, 260, '212, 175, 55', 0.08 * glowPulse, 1);
            drawBokehDisc(ctx, w * 0.86, h * 0.72, 260, '229, 4, 18', 0.09 * glowPulse, 1);

            const angle = -0.32;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            for (const s of streaks) {
                s.x += cos * s.speed * dt;
                s.y += sin * s.speed * dt;
                if (s.x > w + s.len || s.y < -s.len) {
                    if (rand() < 0.5) {
                        s.x = -s.len;
                        s.y = rand() * h * 1.2;
                    } else {
                        s.x = rand() * w * 0.8;
                        s.y = h + s.len;
                    }
                }
                const x2 = s.x - cos * s.len;
                const y2 = s.y - sin * s.len;
                const rgb = s.isGold ? '248, 212, 104' : '229, 4, 18';
                const grad = ctx.createLinearGradient(x2, y2, s.x, s.y);
                grad.addColorStop(0, `rgba(${rgb}, 0)`);
                grad.addColorStop(0.75, `rgba(${rgb}, ${(s.alpha * 0.7).toFixed(4)})`);
                grad.addColorStop(1, `rgba(255, 250, 240, ${s.alpha.toFixed(4)})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = s.thickness;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();
            }

            for (const sp of sparks) {
                sp.x += cos * sp.speed * dt;
                sp.y += sin * sp.speed * dt;
                if (sp.x > w + 20 || sp.y < -20) {
                    sp.x = -20;
                    sp.y = rand() * h * 1.15;
                }
                const alpha = 0.45 + 0.45 * Math.sin(time * 8 + sp.phase);
                const rgb = sp.isGold ? '248, 224, 150' : '255, 75, 85';
                drawBokehDisc(ctx, sp.x, sp.y, sp.size * 2, rgb, alpha * 0.5);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 10. RAMADAN & BAYRAM — TWINKLING STARFIELD, LANTERN PULSE & SHOOTING STARS
// =====================================================================
const createEidCrescentScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(9992026);
    const stars = Array.from({ length: scaledCount(125, densityScale, 40) }, () => ({
        xRatio: rand(),
        yRatio: rand() * 0.78,
        size: 0.7 + rand() * 1.7,
        speed: 0.8 + rand() * 2.2,
        phase: rand() * Math.PI * 2,
        isGold: rand() > 0.35,
    }));

    const shootingStars: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        len: number;
        life: number;
        maxLife: number;
    }> = [];
    let nextShoot = 0.85;

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Warm lantern glow pulse over right flank lantern
            const lanternFlicker = 0.82 + 0.18 * Math.sin(time * 3.1) * Math.cos(time * 1.9);
            drawBokehDisc(ctx, w * 0.69, h * 0.56, 130 * lanternFlicker, '251, 191, 36', 0.12 * lanternFlicker, 1.1);

            for (const st of stars) {
                const tw = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(time * st.speed + st.phase), 2);
                const rgb = st.isGold ? '248, 229, 168' : '226, 236, 255';
                ctx.fillStyle = `rgba(${rgb}, ${tw.toFixed(4)})`;
                ctx.beginPath();
                ctx.arc(st.xRatio * w, st.yRatio * h, st.size, 0, Math.PI * 2);
                ctx.fill();
            }

            nextShoot -= dt;
            if (nextShoot <= 0) {
                shootingStars.push({
                    x: (0.08 + rand() * 0.55) * w,
                    y: (0.06 + rand() * 0.34) * h,
                    vx: 460 + rand() * 240,
                    vy: 190 + rand() * 120,
                    len: 110 + rand() * 70,
                    life: 0,
                    maxLife: 0.75 + rand() * 0.3,
                });
                nextShoot = 2.2 + rand() * 2.4;
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.life += dt;
                if (s.life >= s.maxLife) {
                    shootingStars.splice(i, 1);
                    continue;
                }
                s.x += s.vx * dt;
                s.y += s.vy * dt;
                const p = s.life / s.maxLife;
                const alpha = Math.sin(p * Math.PI);
                const norm = Math.hypot(s.vx, s.vy);
                const tx = s.x - (s.vx / norm) * s.len;
                const ty = s.y - (s.vy / norm) * s.len;
                const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
                grad.addColorStop(0, 'rgba(248, 229, 168, 0)');
                grad.addColorStop(1, `rgba(255, 252, 238, ${(alpha * 0.9).toFixed(4)})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.6;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 11. GATE 11 VIP — STUDIO CHAMPAGNE GOLD BOKEH & OPTICAL GLINTS
// =====================================================================
const createGoldVipScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(11012026);
    const orbs = Array.from({ length: scaledCount(42, densityScale, 14) }, (_, i) => {
        const layer = i % 10 < 4 ? 0 : i % 10 < 8 ? 1 : 2;
        const radius =
            layer === 0 ? 5 + rand() * 8 : layer === 1 ? 14 + rand() * 18 : 34 + rand() * 44;
        const palette = ['212, 175, 55', '246, 226, 168', '184, 134, 34', '255, 244, 214'];
        return {
            x: rand() * width,
            y: rand() * height,
            radius,
            vy: -(10 + layer * 10 + rand() * 14),
            vx: (rand() - 0.5) * 10,
            phase: rand() * Math.PI * 2,
            alpha: layer === 0 ? 0.36 + rand() * 0.25 : layer === 1 ? 0.16 + rand() * 0.14 : 0.08 + rand() * 0.08,
            rgb: palette[i % palette.length],
        };
    });

    const glints = Array.from({ length: scaledCount(16, densityScale, 5) }, (_, i) => ({
        xRatio: rand() < 0.5 ? 0.05 + rand() * 0.24 : 0.71 + rand() * 0.24,
        yRatio: 0.08 + rand() * 0.84,
        size: 10 + rand() * 18,
        speed: 0.7 + rand() * 1.1,
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '248, 229, 168' : '212, 175, 55',
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (const o of orbs) {
                o.y += o.vy * dt;
                o.x += (o.vx + Math.sin(time * 0.55 + o.phase) * 8) * dt;
                if (o.y < -o.radius * 2) {
                    o.y = h + o.radius * 2;
                    o.x = rand() * w;
                }
                if (o.x < -o.radius * 2) o.x = w + o.radius * 2;
                if (o.x > w + o.radius * 2) o.x = -o.radius * 2;

                const pulse = 0.82 + 0.18 * Math.sin(time * 1.1 + o.phase);
                drawBokehDisc(ctx, o.x, o.y, o.radius, o.rgb, o.alpha * pulse);
            }

            for (const g of glints) {
                const wave = Math.max(0, Math.sin(time * g.speed + g.phase));
                const alpha = Math.pow(wave, 3.2) * 0.78;
                drawOpticalGlint(ctx, g.xRatio * w, g.yRatio * h, g.size * (0.75 + 0.45 * wave), alpha, g.rgb);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 12. EXKLUSIV-AKTION — LUXURY SPOTLIGHTS, HEADLIGHT FLARES & GOLD STARDUST
// =====================================================================
const createExklusivAktionScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(1122026);

    const stardust = Array.from({ length: scaledCount(95, densityScale, 32) }, (_, i) => {
        const fromLeft = i % 2 === 0;
        return {
            t: rand(),
            speed: 0.04 + rand() * 0.065,
            spread: (rand() - 0.5) * 90,
            freq: 1.5 + rand() * 2.5,
            phase: rand() * Math.PI * 2,
            size: 1.0 + rand() * 2.1,
            fromLeft,
            rgb: i % 4 === 0 ? '255, 248, 224' : i % 3 === 0 ? '248, 224, 150' : '212, 175, 55',
        };
    });

    const floorGlints = Array.from({ length: scaledCount(22, densityScale, 8) }, (_, i) => {
        const isRibbonAnchor = i < 6;
        const leftSide = i % 2 === 0;
        const xRatio = isRibbonAnchor
            ? leftSide
                ? 0.08 + rand() * 0.16
                : 0.76 + rand() * 0.16
            : leftSide
            ? 0.14 + rand() * 0.24
            : 0.62 + rand() * 0.24;
        const yRatio = isRibbonAnchor ? 0.42 + rand() * 0.24 : 0.72 + rand() * 0.22;
        return {
            xRatio,
            yRatio,
            size: 7 + rand() * 11,
            speed: 1.4 + rand() * 1.9,
            phase: rand() * Math.PI * 2,
            rgb: leftSide ? '255, 232, 165' : '255, 248, 220',
        };
    });

    const flankBokeh = Array.from({ length: scaledCount(10, densityScale, 4) }, (_, i) => ({
        xRatio: i % 2 === 0 ? 0.04 + rand() * 0.14 : 0.82 + rand() * 0.14,
        yRatio: 0.14 + rand() * 0.68,
        r: 22 + rand() * 34,
        phase: rand() * Math.PI * 2,
        rgb: i % 2 === 0 ? '229, 4, 18' : '212, 175, 55',
    }));

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // 1. Dual subtle volumetric golden spotlight beams matching studio background
            const spotPulseL = 0.78 + 0.22 * Math.sin(time * 0.8);
            const spotPulseR = 0.78 + 0.22 * Math.cos(time * 0.72);
            const maxLen = Math.hypot(w, h) * 0.62;

            for (const beam of [
                { sx: w * 0.23, sy: -h * 0.06, a: 0.42, wAngle: 0.24, p: spotPulseL },
                { sx: w * 0.96, sy: h * 0.04, a: -0.58, wAngle: 0.22, p: spotPulseR },
            ]) {
                const sg = ctx.createRadialGradient(beam.sx, beam.sy, 10, beam.sx, beam.sy, maxLen);
                sg.addColorStop(0, `rgba(255, 236, 178, ${(0.095 * beam.p).toFixed(4)})`);
                sg.addColorStop(0.5, `rgba(212, 175, 55, ${(0.045 * beam.p).toFixed(4)})`);
                sg.addColorStop(1, 'rgba(212, 175, 55, 0)');
                ctx.fillStyle = sg;
                ctx.beginPath();
                ctx.moveTo(beam.sx, beam.sy);
                ctx.lineTo(beam.sx + Math.sin(beam.a) * maxLen, beam.sy + Math.cos(beam.a) * maxLen);
                ctx.lineTo(
                    beam.sx + Math.sin(beam.a + beam.wAngle) * maxLen,
                    beam.sy + Math.cos(beam.a + beam.wAngle) * maxLen
                );
                ctx.closePath();
                ctx.fill();
            }

            // 2. Subtle breathing optical headlight flares above the modal
            const hlPulse = 0.82 + 0.18 * Math.sin(time * 1.9);
            for (const hxRatio of [0.312, 0.688]) {
                const hx = w * hxRatio;
                const hy = h * 0.242;
                drawBokehDisc(ctx, hx, hy, 54 * hlPulse, '255, 232, 178', 0.14 * hlPulse, 1.1);
                drawOpticalGlint(ctx, hx, hy, 22 * hlPulse, 0.36 * hlPulse, '255, 240, 200');
            }

            // 3. Outer subtle luxury bokeh accents
            for (const fb of flankBokeh) {
                const a = (0.045 + 0.03 * Math.sin(time * 1.1 + fb.phase));
                drawBokehDisc(ctx, fb.xRatio * w, fb.yRatio * h, fb.r, fb.rgb, a, 1.2);
            }

            // 4. Sweeping golden stardust streams framing left & right flanks
            for (const sd of stardust) {
                sd.t = (sd.t + sd.speed * dt) % 1;
                const u = sd.t;
                const x = sd.fromLeft ? w * (0.06 + u * 0.31) : w * (0.94 - u * 0.31);
                const baseCurveY = h * (0.24 + u * 0.56 - Math.sin(u * Math.PI) * 0.12);
                const y = baseCurveY + sd.spread * (0.4 + u * 0.5) + Math.sin(time * sd.freq + sd.phase) * 10;
                const envelope = Math.sin(u * Math.PI);
                const twinkle = 0.4 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(time * sd.freq * 2 + sd.phase), 2);
                drawBokehDisc(ctx, x, y, sd.size * 2.2, sd.rgb, envelope * twinkle * 0.58);
            }

            // 5. Crisp optical glitter glints on gift bows & wet marble floor
            for (const gl of floorGlints) {
                const wave = Math.max(0, Math.sin(time * gl.speed + gl.phase));
                const alpha = Math.pow(wave, 2.8) * 0.82;
                drawOpticalGlint(ctx, gl.xRatio * w, gl.yRatio * h, gl.size * (0.7 + 0.4 * wave), alpha, gl.rgb);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 13. TURBO-AKTION — RACING CRIMSON LASER TRAILS, TIRE MIST & LED HEADLIGHTS
// =====================================================================
const createTurboNightScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(5529);

    const laserStreaks = Array.from({ length: scaledCount(20, densityScale, 7) }, (_, i) => ({
        x: rand() * width,
        y: (i % 3 === 0 ? 0.22 + rand() * 0.22 : 0.64 + rand() * 0.3) * height,
        len: 160 + rand() * 280,
        speed: 440 + rand() * 520,
        thickness: 1.1 + rand() * 2.2,
        isWhiteCore: i % 4 === 0,
        alpha: 0.34 + rand() * 0.42,
    }));

    const tireMist = Array.from({ length: scaledCount(6, densityScale, 3) }, (_, i) => ({
        x: (0.04 + (i / 5) * 0.28) * width,
        yRatio: 0.56 + (i % 3) * 0.08,
        rx: 150 + rand() * 140,
        ry: 32 + rand() * 22,
        vx: -14 - rand() * 16,
        alpha: 0.042 + rand() * 0.032,
    }));

    const sparks = Array.from({ length: scaledCount(36, densityScale, 12) }, () => ({
        x: rand() * width,
        y: (0.6 + rand() * 0.36) * height,
        vx: 260 + rand() * 340,
        vy: -30 - rand() * 45,
        size: 1.1 + rand() * 1.9,
        phase: rand() * Math.PI * 2,
    }));

    return {
        render(ctx, w, h, dt, time) {
            // Subtle curling smoke behind left sport Golf
            for (const m of tireMist) {
                m.x += m.vx * dt;
                if (m.x < -m.rx) m.x = w * 0.34;
                const my = m.yRatio * h;
                const mg = ctx.createRadialGradient(m.x, my, 0, m.x, my, m.rx);
                mg.addColorStop(0, `rgba(215, 220, 232, ${m.alpha.toFixed(4)})`);
                mg.addColorStop(1, 'rgba(215, 220, 232, 0)');
                ctx.save();
                ctx.translate(m.x, my);
                ctx.scale(1, m.ry / m.rx);
                ctx.fillStyle = mg;
                ctx.beginPath();
                ctx.arc(0, 0, m.rx, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Pulsing crisp LED headlights on left car
            const hlPulse = 0.82 + 0.18 * Math.sin(time * 2.2);
            for (const hx of [0.165, 0.285]) {
                drawBokehDisc(ctx, w * hx, h * 0.565, 36 * hlPulse, '240, 248, 255', 0.14 * hlPulse, 1.1);
                drawOpticalGlint(ctx, w * hx, h * 0.565, 16 * hlPulse, 0.42 * hlPulse, '255, 255, 255');
            }

            // Sweeping GATE 11 racing crimson velocity trails across wet tarmac
            const cos = Math.cos(-0.1);
            const sin = Math.sin(-0.1);
            for (const s of laserStreaks) {
                s.x += cos * s.speed * dt;
                s.y += sin * s.speed * dt;
                if (s.x > w + s.len) {
                    s.x = -s.len;
                    s.y = (0.58 + rand() * 0.38) * h;
                }
                const x2 = s.x - cos * s.len;
                const y2 = s.y - sin * s.len;
                const rgb = s.isWhiteCore ? '255, 135, 145' : '229, 4, 18';
                const g = ctx.createLinearGradient(x2, y2, s.x, s.y);
                g.addColorStop(0, `rgba(${rgb}, 0)`);
                g.addColorStop(0.7, `rgba(${rgb}, ${(s.alpha * 0.72).toFixed(4)})`);
                g.addColorStop(1, `rgba(255, 232, 235, ${s.alpha.toFixed(4)})`);
                ctx.strokeStyle = g;
                ctx.lineWidth = s.thickness;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();
            }

            for (const sp of sparks) {
                sp.x += sp.vx * dt;
                sp.y += (sp.vy + Math.sin(time * 4 + sp.phase) * 14) * dt;
                if (sp.x > w + 20 || sp.y < h * 0.45) {
                    sp.x = rand() * w * 0.3;
                    sp.y = (0.72 + rand() * 0.25) * h;
                }
                const a = 0.45 + 0.45 * Math.sin(time * 9 + sp.phase);
                drawBokehDisc(ctx, sp.x, sp.y, sp.size * 2.1, '255, 70, 82', a * 0.55);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 14. WINTER-SPECIAL — DEPTH SNOWFALL, PINE FAIRY LIGHTS & DUAL HEADLIGHTS
// =====================================================================
const createWinterFlotteScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(12252026);
    const flakes = Array.from({ length: scaledCount(170, densityScale, 55) }, (_, i) => {
        const layer = i % 10 < 4 ? 0 : i % 10 < 8 ? 1 : 2;
        const radius =
            layer === 0 ? 1.0 + rand() * 1.1 : layer === 1 ? 2.0 + rand() * 2.0 : 5.5 + rand() * 7.5;
        return {
            x: rand() * width,
            y: rand() * height,
            radius,
            layer,
            vy: layer === 0 ? 22 + rand() * 15 : layer === 1 ? 44 + rand() * 28 : 82 + rand() * 44,
            swayAmp: layer === 0 ? 7 + rand() * 7 : layer === 1 ? 15 + rand() * 15 : 24 + rand() * 20,
            swayFreq: 0.45 + rand() * 0.8,
            phase: rand() * Math.PI * 2,
            alpha: layer === 0 ? 0.3 + rand() * 0.22 : layer === 1 ? 0.58 + rand() * 0.28 : 0.18 + rand() * 0.14,
            warmHint: rand() > 0.72,
        };
    });

    const boughTwinkles = Array.from({ length: scaledCount(16, densityScale, 6) }, (_, i) => {
        const left = i % 2 === 0;
        const isGiftBow = i >= 12;
        return {
            xRatio: isGiftBow
                ? left
                    ? 0.06 + rand() * 0.12
                    : 0.84 + rand() * 0.12
                : left
                ? 0.04 + rand() * 0.26
                : 0.7 + rand() * 0.26,
            yRatio: isGiftBow ? 0.64 + rand() * 0.14 : 0.04 + rand() * 0.19,
            size: 7 + rand() * 10,
            speed: 1.6 + rand() * 1.8,
            phase: rand() * Math.PI * 2,
            rgb: i % 3 === 0 ? '255, 240, 198' : '248, 214, 122',
        };
    });

    return {
        render(ctx, w, h, dt, time) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (const tw of boughTwinkles) {
                const wave = Math.max(0, Math.sin(time * tw.speed + tw.phase));
                drawOpticalGlint(ctx, tw.xRatio * w, tw.yRatio * h, tw.size, Math.pow(wave, 2.3) * 0.76, tw.rgb);
            }

            // Gentle breathing headlights on left car & right motorcycle
            const hlPulse = 0.85 + 0.15 * Math.sin(time * 1.8);
            for (const hl of [
                { x: 0.185, y: 0.53, r: 44 },
                { x: 0.915, y: 0.50, r: 40 },
            ]) {
                drawBokehDisc(ctx, w * hl.x, h * hl.y, hl.r * hlPulse, '255, 240, 200', 0.13 * hlPulse, 1.1);
            }
            ctx.restore();

            const wind = Math.sin(time * 0.22) * 18 + Math.sin(time * 0.56) * 8;
            for (const f of flakes) {
                const sway = Math.sin(time * f.swayFreq + f.phase) * f.swayAmp;
                f.y += f.vy * dt;
                f.x += (wind * (0.4 + f.layer * 0.32) + sway) * dt;
                if (f.y > h + f.radius * 3) {
                    f.y = -f.radius * 3;
                    f.x = rand() * w;
                }
                if (f.x > w + f.radius * 3) f.x = -f.radius * 3;
                if (f.x < -f.radius * 3) f.x = w + f.radius * 3;

                const rgb = f.warmHint ? '255, 244, 220' : '236, 246, 255';
                const rScale = f.layer === 2 ? f.radius : f.radius * 1.45;
                const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rScale);
                grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha.toFixed(4)})`);
                grad.addColorStop(0.55, `rgba(${rgb}, ${(f.alpha * 0.68).toFixed(4)})`);
                grad.addColorStop(1, `rgba(${rgb}, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(f.x, f.y, rScale, 0, Math.PI * 2);
                ctx.fill();
            }
        },
    };
};

// =====================================================================
// 15. BIKER-SPECIAL — FLOODLIT RACETRACK MIST, TWIN LEDs & CRIMSON TRAILS
// =====================================================================
const createBikerRaceScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(4762);

    const trackMist = Array.from({ length: scaledCount(7, densityScale, 3) }, (_, i) => ({
        x: (0.42 + (i / 6) * 0.56) * width,
        yRatio: 0.66 + (i % 3) * 0.08,
        rx: 180 + rand() * 170,
        ry: 28 + rand() * 20,
        vx: -16 - rand() * 18,
        alpha: 0.045 + rand() * 0.035,
    }));

    const curveStreaks = Array.from({ length: scaledCount(18, densityScale, 6) }, (_, i) => ({
        t: rand(),
        speed: 0.28 + rand() * 0.34,
        len: 0.08 + rand() * 0.1,
        lane: (i % 5) / 4,
        alpha: 0.32 + rand() * 0.42,
        thickness: 1.1 + rand() * 1.8,
    }));

    const sparks = Array.from({ length: scaledCount(34, densityScale, 12) }, (_, i) => ({
        x: rand() * width * 0.55,
        y: (0.48 + rand() * 0.48) * height,
        vx: 180 + rand() * 260,
        vy: -14 - rand() * 30,
        size: 1.1 + rand() * 2,
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '252, 224, 150' : '229, 4, 18',
    }));

    return {
        render(ctx, w, h, dt, time) {
            // Drifting low mist around sport motorcycle wheels
            for (const m of trackMist) {
                m.x += m.vx * dt;
                if (m.x < w * 0.34) m.x = w + m.rx * 0.5;
                const my = m.yRatio * h;
                const mg = ctx.createRadialGradient(m.x, my, 0, m.x, my, m.rx);
                mg.addColorStop(0, `rgba(215, 225, 238, ${m.alpha.toFixed(4)})`);
                mg.addColorStop(1, 'rgba(215, 225, 238, 0)');
                ctx.save();
                ctx.translate(m.x, my);
                ctx.scale(1, m.ry / m.rx);
                ctx.fillStyle = mg;
                ctx.beginPath();
                ctx.arc(0, 0, m.rx, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Breathing stadium floodlight glares & aggressive twin LED bike headlights
            const pulse = 0.84 + 0.16 * Math.sin(time * 2.1);
            for (const fl of [
                { x: 0.115, y: 0.165, r: 52, gl: 22, rgb: '255, 226, 170' },
                { x: 0.255, y: 0.325, r: 34, gl: 14, rgb: '255, 226, 170' },
                { x: 0.935, y: 0.06, r: 60, gl: 26, rgb: '255, 234, 190' },
                { x: 0.892, y: 0.36, r: 38, gl: 18, rgb: '235, 245, 255' },
                { x: 0.925, y: 0.37, r: 38, gl: 18, rgb: '235, 245, 255' },
            ]) {
                drawBokehDisc(ctx, w * fl.x, h * fl.y, fl.r * pulse, fl.rgb, 0.13 * pulse, 1.1);
                drawOpticalGlint(ctx, w * fl.x, h * fl.y, fl.gl * pulse, 0.42 * pulse, fl.rgb);
            }

            // Curved crimson racing streaks sweeping around left wet corner
            for (const cs of curveStreaks) {
                cs.t = (cs.t + cs.speed * dt) % 1;
                const u1 = cs.t;
                const u0 = Math.max(0, u1 - cs.len);
                const pt = (u: number) => {
                    const x = w * (0.0 + u * (0.48 + cs.lane * 0.28));
                    const y = h * (0.42 + cs.lane * 0.14 + Math.pow(u, 1.15) * (0.44 - cs.lane * 0.08));
                    return { x, y };
                };
                const p0 = pt(u0);
                const p1 = pt(u1);
                const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
                grad.addColorStop(0, 'rgba(229, 4, 18, 0)');
                grad.addColorStop(1, `rgba(255, 110, 120, ${cs.alpha.toFixed(4)})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = cs.thickness;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
            }

            for (const sp of sparks) {
                sp.x += sp.vx * dt;
                sp.y += (sp.vy + Math.sin(time * 4 + sp.phase) * 16) * dt;
                if (sp.x > w * 0.65 || sp.y < h * 0.42) {
                    sp.x = rand() * w * 0.15;
                    sp.y = (0.58 + rand() * 0.36) * h;
                }
                const a = 0.42 + 0.48 * Math.sin(time * 8 + sp.phase);
                drawBokehDisc(ctx, sp.x, sp.y, sp.size * 2, sp.rgb, a * 0.55);
            }

            ctx.restore();
        },
    };
};

// =====================================================================
// 16. WIEN-GALA — VIENNA SKYLINE FIREWORKS, 3D GOLD CONFETTI & SHIMMER
// =====================================================================
const createWienGalaScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(7943);
    const fireworks = createBallisticFireworks(rand, width, height, densityScale, {
        palette: ['248, 224, 150', '212, 175, 55', '255, 248, 224', '224, 162, 56'],
        outerOnly: true,
        allowGrand: true,
        brocadeScale: 1.18,
        trailLength: 11,
        brocadePhysics: true,
        launchY: 0.48,
        maxDesktop: 6,
        maxMobile: 3,
        spawnInterval: [0.42, 0.56],
        immediateBursts: [
            { xRatio: 0.16, yRatio: 0.17, tier: 'grand' },
            { xRatio: 0.87, yRatio: 0.18, tier: 'grand' },
            { xRatio: 0.08, yRatio: 0.32, tier: 'medium' },
        ],
    });

    const palette: Array<[number, number, number]> = [
        [212, 175, 55],
        [248, 229, 168],
        [255, 246, 214],
        [184, 134, 34],
    ];

    const foils = Array.from({ length: scaledCount(42, densityScale, 16) }, (_, i) => {
        const left = i % 2 === 0;
        return {
            x: (left ? 0.04 + rand() * 0.28 : 0.68 + rand() * 0.28) * width,
            y: rand() * height,
            vx: (rand() - 0.5) * 24,
            vy: 34 + rand() * 44,
            w: 6 + rand() * 6,
            h: 3.5 + rand() * 4,
            rot: rand() * Math.PI * 2,
            vRot: (rand() - 0.5) * 3.8,
            tilt: rand() * Math.PI * 2,
            vTilt: 3 + rand() * 4.5,
            color: palette[i % palette.length],
        };
    });

    const reflectionGlints = Array.from({ length: scaledCount(14, densityScale, 5) }, (_, i) => ({
        xRatio: i % 2 === 0 ? 0.66 + rand() * 0.28 : 0.14 + rand() * 0.18,
        yRatio: i % 2 === 0 ? 0.6 + rand() * 0.18 : 0.78 + rand() * 0.16,
        size: 6 + rand() * 9,
        speed: 1.5 + rand() * 1.8,
        phase: rand() * Math.PI * 2,
    }));

    return {
        render(ctx, w, h, dt, time, isMobile) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Outer fireworks flanking Riesenrad & Stephansdom
            fireworks.render(ctx, w, h, dt, time, isMobile);

            // Subtle left car headlight breath & warm skyline reflection glints
            const hlPulse = 0.85 + 0.15 * Math.sin(time * 2.0);
            drawBokehDisc(ctx, w * 0.15, h * 0.61, 44 * hlPulse, '255, 236, 185', 0.13 * hlPulse, 1.1);

            for (const rg of reflectionGlints) {
                const wave = Math.max(0, Math.sin(time * rg.speed + rg.phase));
                drawOpticalGlint(ctx, rg.xRatio * w, rg.yRatio * h, rg.size, Math.pow(wave, 2.5) * 0.7, '248, 224, 150');
            }
            ctx.restore();

            // 3D tumbling champagne gold gala confetti framing left & right
            for (const f of foils) {
                f.x += (f.vx + Math.sin(time * 1.4 + f.tilt) * 18) * dt;
                f.y += f.vy * dt;
                f.rot += f.vRot * dt;
                f.tilt += f.vTilt * dt;
                if (f.y > h + 20) {
                    f.y = -20;
                    f.x = (rand() < 0.5 ? 0.04 + rand() * 0.28 : 0.68 + rand() * 0.28) * w;
                }
                const shimmer = Math.abs(Math.cos(f.tilt));
                const spec = Math.pow(shimmer, 4) * 0.65;
                const r = Math.round(f.color[0] + (255 - f.color[0]) * spec);
                const g = Math.round(f.color[1] + (255 - f.color[1]) * spec);
                const b = Math.round(f.color[2] + (255 - f.color[2]) * spec);

                ctx.save();
                ctx.translate(f.x, f.y);
                ctx.rotate(f.rot);
                ctx.scale(1, Math.max(0.15, shimmer));
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.88)`;
                ctx.fillRect(-f.w * 0.5, -f.h * 0.5, f.w, f.h);
                ctx.restore();
            }
        },
    };
};

// =====================================================================
// 17. VALENTINSTAG DRIVE — SELF-DRAWING NEON HEART, TRAILS & ROSE PETALS
// =====================================================================
interface HeartSamplePoint {
    x: number;
    y: number;
    nx: number;
    ny: number;
    u: number;
}

interface HeartGeometryCache {
    w: number;
    h: number;
    scale: number;
    isPortrait: boolean;
    points: HeartSamplePoint[];
    apexPt: Point2D;
    apexU: number;
    cleftU: number;
    horizonExit: Point2D[];
}

function evalCubicBezier(p0: Point2D, c1: Point2D, c2: Point2D, p1: Point2D, t: number): Point2D {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    return {
        x: mt2 * mt * p0.x + 3 * mt2 * t * c1.x + 3 * mt * t2 * c2.x + t2 * t * p1.x,
        y: mt2 * mt * p0.y + 3 * mt2 * t * c1.y + 3 * mt * t2 * c2.y + t2 * t * p1.y,
    };
}

function buildValentineHeartCache(w: number, h: number): HeartGeometryCache {
    const isPortrait = w < h;
    const cx = isPortrait ? w * 0.54 : w * 0.805;
    const cy = isPortrait ? h * 0.165 : h * 0.315;
    const scale = isPortrait ? Math.min(w * 0.46, h * 0.24) : Math.min(w * 0.34, h * 0.56);

    const mapPt = (nx: number, ny: number): Point2D => ({
        x: cx + nx * scale,
        y: cy + ny * scale,
    });

    // Multi-segment tilted calligraphic neon heart framing right sky / portrait top
    const leadInX = isPortrait ? -0.44 : -0.54;
    const segments: Array<[Point2D, Point2D, Point2D, Point2D, string]> = [
        // 0: Silky lead-in sweep into left crest
        [
            mapPt(leadInX, -0.14),
            mapPt(leadInX + 0.08, -0.28),
            mapPt(-0.36, -0.34),
            mapPt(-0.23, -0.31),
            'lead',
        ],
        // 1: Left crest down to center cleft
        [
            mapPt(-0.23, -0.31),
            mapPt(-0.12, -0.28),
            mapPt(-0.06, -0.21),
            mapPt(-0.03, -0.13),
            'cleftEnd',
        ],
        // 2: Center cleft rising into tall tilted right crest
        [
            mapPt(-0.03, -0.13),
            mapPt(0.04, -0.32),
            mapPt(0.17, -0.49),
            mapPt(0.31, -0.46),
            'rightPeak',
        ],
        // 3a: Upper-right outer sweep
        [
            mapPt(0.31, -0.46),
            mapPt(0.46, -0.42),
            mapPt(0.52, -0.22),
            mapPt(0.45, -0.02),
            'rightBelly',
        ],
        // 3b: Lower-right curve plunging to sharp bottom apex on guardrail
        [
            mapPt(0.45, -0.02),
            mapPt(0.38, 0.18),
            mapPt(0.14, 0.34),
            mapPt(-0.10, 0.45),
            'apexEnd',
        ],
        // 4a: Sharp apex sweeping smoothly up outer-left belly
        [
            mapPt(-0.10, 0.45),
            mapPt(-0.31, 0.30),
            mapPt(-0.45, 0.10),
            mapPt(-0.43, -0.11),
            'leftBelly',
        ],
        // 4b: Left belly closing gracefully past left crest
        [
            mapPt(-0.43, -0.11),
            mapPt(-0.41, -0.26),
            mapPt(-0.31, -0.34),
            mapPt(-0.17, -0.30),
            'close',
        ],
    ];

    const raw: Array<{ x: number; y: number; dist: number; tag?: string }> = [];
    let totalLen = 0;
    let cleftDist = 0;
    let apexDist = 0;
    const stepsPerSeg = 96;

    for (const [p0, c1, c2, p1, tag] of segments) {
        for (let s = raw.length === 0 ? 0 : 1; s <= stepsPerSeg; s++) {
            const pt = evalCubicBezier(p0, c1, c2, p1, s / stepsPerSeg);
            if (raw.length > 0) {
                const prev = raw[raw.length - 1];
                totalLen += Math.hypot(pt.x - prev.x, pt.y - prev.y);
            }
            const segEndTag = s === stepsPerSeg ? tag : undefined;
            if (segEndTag === 'cleftEnd') cleftDist = totalLen;
            if (segEndTag === 'apexEnd') apexDist = totalLen;
            raw.push({ x: pt.x, y: pt.y, dist: totalLen, tag: segEndTag });
        }
    }

    const SAMPLE_COUNT = 240;
    const points: HeartSamplePoint[] = [];
    let rawIdx = 0;
    for (let i = 0; i < SAMPLE_COUNT; i++) {
        const u = i / (SAMPLE_COUNT - 1);
        const targetDist = u * totalLen;
        while (rawIdx < raw.length - 2 && raw[rawIdx + 1].dist < targetDist) {
            rawIdx++;
        }
        const a = raw[rawIdx];
        const b = raw[Math.min(raw.length - 1, rawIdx + 1)];
        const segSpan = Math.max(0.0001, b.dist - a.dist);
        const localT = clamp((targetDist - a.dist) / segSpan, 0, 1);
        points.push({
            x: a.x + (b.x - a.x) * localT,
            y: a.y + (b.y - a.y) * localT,
            nx: 0,
            ny: -1,
            u,
        });
    }

    // Smooth tangent normals along resampled lookup table
    for (let i = 0; i < SAMPLE_COUNT; i++) {
        const pPrev = points[Math.max(0, i - 1)];
        const pNext = points[Math.min(SAMPLE_COUNT - 1, i + 1)];
        const dx = pNext.x - pPrev.x;
        const dy = pNext.y - pPrev.y;
        const len = Math.max(0.0001, Math.hypot(dx, dy));
        points[i].nx = -dy / len;
        points[i].ny = dx / len;
    }

    const apexPt = mapPt(-0.10, 0.45);
    const exitLen = w * 0.14;
    const horizonExit: Point2D[] = Array.from({ length: 18 }, (_, i) => {
        const t = i / 17;
        return {
            x: apexPt.x - exitLen * t,
            y: apexPt.y + Math.sin(t * Math.PI * 0.5) * scale * 0.018,
        };
    });

    return {
        w,
        h,
        scale,
        isPortrait,
        points,
        apexPt,
        apexU: totalLen > 0 ? apexDist / totalLen : 0.68,
        cleftU: totalLen > 0 ? cleftDist / totalLen : 0.18,
        horizonExit,
    };
}

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const createValentineDriveScene: SceneFactory = (width, height, densityScale) => {
    const rand = createPrng(2147325);
    let heartCache = buildValentineHeartCache(width, height);

    const maxDrawSparks = scaledCount(64, densityScale, 20);
    const drawSparks: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        maxLife: number;
        size: number;
        phase: number;
        rgb: string;
    }> = [];
    let lastHeadU = 0;
    let sparkAccumulator = 0;

    const heartSparks = Array.from({ length: scaledCount(48, densityScale, 16) }, (_, i) => ({
        t: rand(),
        speed: 0.24 + rand() * 0.28,
        spread: (rand() - 0.5) * 28,
        size: 1.2 + rand() * 2.0,
        phase: rand() * Math.PI * 2,
        rgb: i % 3 === 0 ? '255, 224, 230' : i % 2 === 0 ? '255, 70, 95' : '229, 4, 18',
    }));

    const petals = Array.from({ length: scaledCount(36, densityScale, 12) }, (_, i) => ({
        x: rand() * width,
        y: rand() * height,
        size: 6.5 + rand() * 8.5,
        vy: 24 + rand() * 22,
        rot: rand() * Math.PI * 2,
        vRot: (rand() - 0.5) * 1.4,
        pitch: rand() * Math.PI * 2,
        vPitch: 1.2 + rand() * 1.6,
        alpha: 0.38 + rand() * 0.34,
        rgb: i % 3 === 0 ? '225, 29, 72' : i % 2 === 0 ? '229, 4, 18' : '190, 18, 60',
    }));

    const sampleHeartAt = (u: number): HeartSamplePoint => {
        const pts = heartCache.points;
        const fIdx = clamp(u, 0, 1) * (pts.length - 1);
        const i0 = Math.floor(fIdx);
        const i1 = Math.min(pts.length - 1, i0 + 1);
        const frac = fIdx - i0;
        const a = pts[i0];
        const b = pts[i1];
        return {
            x: a.x + (b.x - a.x) * frac,
            y: a.y + (b.y - a.y) * frac,
            nx: a.nx + (b.nx - a.nx) * frac,
            ny: a.ny + (b.ny - a.ny) * frac,
            u,
        };
    };

    return {
        resize(newW, newH) {
            if (Math.abs(newW - heartCache.w) > 1 || Math.abs(newH - heartCache.h) > 1) {
                heartCache = buildValentineHeartCache(newW, newH);
            }
        },
        render(ctx, w, h, dt, time) {
            if (Math.abs(w - heartCache.w) > 1 || Math.abs(h - heartCache.h) > 1) {
                heartCache = buildValentineHeartCache(w, h);
            }

            // 4-phase 9.0s loop offset by +0.35s so drawing begins visibly on frame 1
            const CYCLE = 9.0;
            const phaseTime = (time + 0.35) % CYCLE;
            let tailU = 0;
            let headU = 0;
            let heartAlpha = 0;
            let isDrawing = false;
            let isHold = false;

            if (phaseTime < 3.4) {
                isDrawing = true;
                const p = phaseTime / 3.4;
                headU = easeInOutCubic(p);
                tailU = 0;
                heartAlpha = clamp(p * 4.5, 0.35, 1);
            } else if (phaseTime < 6.8) {
                isHold = true;
                tailU = 0;
                headU = 1;
                const holdP = phaseTime - 3.4;
                const hbCycle = (holdP * 1.45) % (Math.PI * 2);
                const beat1 = Math.pow(Math.max(0, Math.sin(hbCycle)), 6);
                const beat2 = Math.pow(Math.max(0, Math.sin(hbCycle - 0.58)), 6);
                heartAlpha = 0.84 + 0.16 * (beat1 * 0.85 + beat2 * 0.6);
            } else if (phaseTime < 8.4) {
                const p = (phaseTime - 6.8) / 1.6;
                tailU = easeInOutCubic(p);
                headU = 1;
                heartAlpha = Math.pow(1 - p, 1.25);
            }

            const pts = heartCache.points;
            const totalPts = pts.length;
            const startIdx = Math.max(0, Math.floor(tailU * (totalPts - 1)));
            const endIdx = Math.min(totalPts - 1, Math.ceil(headU * (totalPts - 1)));
            const strokeScale = clamp(heartCache.scale / 580, 0.52, 1.15);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            if (heartAlpha > 0.01 && endIdx > startIdx + 1) {
                const traceMainSlice = () => {
                    ctx.beginPath();
                    ctx.moveTo(pts[startIdx].x, pts[startIdx].y);
                    for (let i = startIdx + 1; i <= endIdx; i++) {
                        ctx.lineTo(pts[i].x, pts[i].y);
                    }
                };

                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Pass 1: Wide ruby atmospheric aura
                traceMainSlice();
                ctx.strokeStyle = `rgba(229, 4, 18, ${(0.1 * heartAlpha).toFixed(4)})`;
                ctx.lineWidth = 24 * strokeScale;
                ctx.stroke();

                // Pass 2: Mid crimson-rose neon bloom
                traceMainSlice();
                ctx.strokeStyle = `rgba(244, 24, 72, ${(0.3 * heartAlpha).toFixed(4)})`;
                ctx.lineWidth = 11 * strokeScale;
                ctx.stroke();

                // Pass 3: 3 braided silk light-painting filaments pinching smoothly at cleft & bottom apex
                const strands = [
                    { phaseOff: 0.0, freq: 14, baseAmp: 7.4, lw: 2.0, color: '255, 115, 150', alpha: 0.68 },
                    { phaseOff: 2.1, freq: 19, baseAmp: 5.6, lw: 1.5, color: '255, 175, 198', alpha: 0.62 },
                    { phaseOff: 4.2, freq: 11, baseAmp: 8.6, lw: 1.35, color: '255, 236, 242', alpha: 0.85 },
                ];

                for (const st of strands) {
                    ctx.beginPath();
                    for (let i = startIdx; i <= endIdx; i++) {
                        const pt = pts[i];
                        const distCleft = Math.abs(pt.u - heartCache.cleftU);
                        const distApex = Math.abs(pt.u - heartCache.apexU);
                        const pinch =
                            clamp(Math.min(distCleft, distApex) * 9.5, 0.12, 1) *
                            (0.25 + 0.75 * Math.sin(pt.u * Math.PI));
                        const disp =
                            Math.sin(pt.u * st.freq + time * 1.4 + st.phaseOff) *
                            st.baseAmp *
                            strokeScale *
                            pinch;
                        const sx = pt.x + pt.nx * disp;
                        const sy = pt.y + pt.ny * disp;
                        if (i === startIdx) ctx.moveTo(sx, sy);
                        else ctx.lineTo(sx, sy);
                    }
                    ctx.strokeStyle = `rgba(${st.color}, ${(st.alpha * heartAlpha).toFixed(4)})`;
                    ctx.lineWidth = st.lw * strokeScale;
                    ctx.stroke();
                }

                // Pass 4: Incandescent primary neon core
                traceMainSlice();
                ctx.strokeStyle = `rgba(255, 244, 248, ${(0.94 * heartAlpha).toFixed(4)})`;
                ctx.lineWidth = 2.4 * strokeScale;
                ctx.stroke();

                // Phase 2 electric energy comets continuously orbiting contour
                if (isHold) {
                    for (const cometOff of [0, 0.5]) {
                        const cHeadU = (phaseTime * 0.42 + cometOff) % 1;
                        const span = 0.11;
                        const steps = 14;
                        ctx.beginPath();
                        for (let s = 0; s <= steps; s++) {
                            const sampleU = Math.max(0.02, cHeadU - span * (1 - s / steps));
                            const cp = sampleHeartAt(sampleU);
                            if (s === 0) ctx.moveTo(cp.x, cp.y);
                            else ctx.lineTo(cp.x, cp.y);
                        }
                        ctx.strokeStyle = `rgba(255, 246, 250, ${(0.72 * heartAlpha).toFixed(4)})`;
                        ctx.lineWidth = 3.2 * strokeScale;
                        ctx.stroke();

                        const headPt = sampleHeartAt(Math.max(0.02, cHeadU));
                        drawBokehDisc(ctx, headPt.x, headPt.y, 16 * strokeScale, '255, 220, 232', 0.42 * heartAlpha, 1.1);
                    }
                }
            }

            // Horizon guardrail exit flare trail gliding left once head passes bottom apex
            if (headU >= heartCache.apexU && tailU < heartCache.apexU + 0.22 && heartAlpha > 0.02) {
                const exitProg = clamp((headU - heartCache.apexU) / 0.16, 0, 1);
                const exitAlpha =
                    heartAlpha *
                    (tailU > heartCache.apexU ? clamp(1 - (tailU - heartCache.apexU) / 0.22, 0, 1) : 1);
                const exitCount = Math.max(2, Math.round(exitProg * heartCache.horizonExit.length));
                ctx.lineCap = 'round';
                ctx.beginPath();
                for (let i = 0; i < exitCount; i++) {
                    const ep = heartCache.horizonExit[i];
                    if (i === 0) ctx.moveTo(ep.x, ep.y);
                    else ctx.lineTo(ep.x, ep.y);
                }
                ctx.strokeStyle = `rgba(244, 48, 86, ${(0.42 * exitAlpha).toFixed(4)})`;
                ctx.lineWidth = 5.5 * strokeScale;
                ctx.stroke();

                ctx.beginPath();
                for (let i = 0; i < exitCount; i++) {
                    const ep = heartCache.horizonExit[i];
                    if (i === 0) ctx.moveTo(ep.x, ep.y);
                    else ctx.lineTo(ep.x, ep.y);
                }
                ctx.strokeStyle = `rgba(255, 240, 245, ${(0.82 * exitAlpha).toFixed(4)})`;
                ctx.lineWidth = 1.6 * strokeScale;
                ctx.stroke();
            }

            // Sparkler brush head + live particle trail during Phase 1 drawing
            if (isDrawing && headU > 0.01 && headU < 0.995) {
                const headPt = sampleHeartAt(headU);
                const prevPt = sampleHeartAt(Math.max(0, lastHeadU));
                const moveDx = headPt.x - prevPt.x;
                const moveDy = headPt.y - prevPt.y;

                drawBokehDisc(ctx, headPt.x, headPt.y, 26 * strokeScale, '255, 195, 210', 0.55, 1.15);
                drawOpticalGlint(ctx, headPt.x, headPt.y, 24 * strokeScale, 0.92, '255, 145, 172');

                sparkAccumulator += dt * 42;
                while (sparkAccumulator >= 1 && drawSparks.length < maxDrawSparks) {
                    sparkAccumulator -= 1;
                    const speed = 28 + rand() * 72;
                    const ang = rand() * Math.PI * 2;
                    drawSparks.push({
                        x: headPt.x + (rand() - 0.5) * 4,
                        y: headPt.y + (rand() - 0.5) * 4,
                        vx: Math.cos(ang) * speed - moveDx * 1.4,
                        vy: Math.sin(ang) * speed - moveDy * 1.4,
                        life: 0,
                        maxLife: 0.42 + rand() * 0.44,
                        size: 1.1 + rand() * 1.9,
                        phase: rand() * Math.PI * 2,
                        rgb: rand() > 0.35 ? '255, 190, 206' : '255, 92, 124',
                    });
                }
            } else {
                sparkAccumulator = 0;
            }
            lastHeadU = headU;

            for (let i = drawSparks.length - 1; i >= 0; i--) {
                const sp = drawSparks[i];
                sp.life += dt;
                if (sp.life >= sp.maxLife) {
                    drawSparks.splice(i, 1);
                    continue;
                }
                const drag = Math.pow(0.92, dt * 60);
                sp.vx *= drag;
                sp.vy = sp.vy * drag + 48 * dt;
                sp.x += sp.vx * dt;
                sp.y += sp.vy * dt;

                const prog = sp.life / sp.maxLife;
                const tw = 0.5 + 0.5 * Math.sin(time * 24 + sp.phase);
                const a = Math.pow(1 - prog, 1.45) * tw * 0.9;
                drawBokehDisc(ctx, sp.x, sp.y, sp.size * 2.2 * strokeScale, sp.rgb, a);
            }

            // Synchronized apex starburst on guardrail + wet-road ambient crimson glow
            const drawProgressGlow = clamp((headU - 0.28) / 0.72, 0, 1);
            const ambientGlow = heartAlpha * (0.28 + 0.72 * drawProgressGlow);
            if (ambientGlow > 0.02) {
                const reflX = heartCache.isPortrait ? heartCache.apexPt.x : w * 0.78;
                const reflY = heartCache.isPortrait ? Math.min(h * 0.88, heartCache.apexPt.y + h * 0.18) : h * 0.73;
                drawBokehDisc(ctx, reflX, reflY, 175 * strokeScale, '229, 4, 18', 0.085 * ambientGlow, 1.0);
            }

            if (headU >= heartCache.apexU && tailU < heartCache.apexU + 0.14 && heartAlpha > 0.05) {
                const apexFade = tailU > heartCache.apexU ? clamp(1 - (tailU - heartCache.apexU) / 0.14, 0, 1) : 1;
                const apexBurst = heartAlpha * apexFade * (0.85 + 0.15 * Math.sin(time * 4.2));
                drawBokehDisc(
                    ctx,
                    heartCache.apexPt.x,
                    heartCache.apexPt.y,
                    58 * strokeScale * apexBurst,
                    '255, 195, 205',
                    0.26 * apexBurst,
                    1.1
                );
                drawOpticalGlint(
                    ctx,
                    heartCache.apexPt.x,
                    heartCache.apexPt.y,
                    32 * strokeScale,
                    0.78 * apexBurst,
                    '255, 160, 175'
                );
            }

            // Subtle Golf LED headlight breathing glints on left flank
            const hlPulse = 0.85 + 0.15 * Math.cos(time * 1.9);
            for (const hl of [
                { x: 0.212, y: 0.48 },
                { x: 0.308, y: 0.505 },
            ]) {
                drawBokehDisc(ctx, w * hl.x, h * hl.y, 40 * hlPulse, '255, 232, 224', 0.14 * hlPulse, 1.1);
                drawOpticalGlint(ctx, w * hl.x, h * hl.y, 17 * hlPulse, 0.38 * hlPulse, '255, 245, 240');
            }

            // Flowing luminous crimson embers sweeping along lower road ribbon toward neon heart
            for (const sp of heartSparks) {
                sp.t = (sp.t + sp.speed * dt) % 1;
                const u = sp.t;
                const x = w * (0.04 + u * 0.74);
                const y = h * (0.68 + Math.sin(u * Math.PI * 0.9) * 0.24 - u * 0.14) + sp.spread;
                const env = Math.sin(u * Math.PI);
                const tw = 0.45 + 0.55 * Math.sin(time * 6 + sp.phase);
                drawBokehDisc(ctx, x, y, sp.size * 2.1, sp.rgb, env * tw * 0.52);
            }
            ctx.restore();

            // 3D tumbling crimson rose petals framing left & right
            for (const p of petals) {
                p.y += p.vy * dt;
                p.x += (10 + Math.sin(time * 0.8 + p.pitch) * 16) * dt;
                p.rot += p.vRot * dt;
                p.pitch += p.vPitch * dt;
                if (p.y > h + 28) {
                    p.y = -28;
                    p.x = rand() * w;
                }
                if (p.x > w + 28) p.x = -28;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.scale(Math.cos(p.pitch) * 0.5 + 0.5, Math.sin(p.pitch * 0.7) * 0.4 + 0.6);

                const g = ctx.createRadialGradient(0, -p.size * 0.2, 0, 0, 0, p.size);
                g.addColorStop(0, `rgba(255, 165, 185, ${p.alpha.toFixed(4)})`);
                g.addColorStop(0.65, `rgba(${p.rgb}, ${(p.alpha * 0.88).toFixed(4)})`);
                g.addColorStop(1, 'rgba(95, 8, 28, 0)');
                ctx.fillStyle = g;
                drawPetalPath(ctx, p.size);
                ctx.fill();
                ctx.restore();
            }
        },
    };
};

interface HybridSceneConfig {
    baseBg: string;
    image: string;
    vignetteClass: string;
    factory: SceneFactory;
}

const SCENE_CONFIG: Record<HybridEffectId, HybridSceneConfig> = {
    'exklusiv-aktion': {
        baseBg: 'bg-[#050304]',
        image: '/images/campaign-effects/exklusiv-aktion-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(5,3,3,0.18)_0%,rgba(4,2,3,0.06)_56%,rgba(3,2,3,0.34)_100%)]',
        factory: createExklusivAktionScene,
    },
    'turbo-night': {
        baseBg: 'bg-[#050506]',
        image: '/images/campaign-effects/turbo-night-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(5,5,6,0.2)_0%,rgba(4,3,4,0.08)_56%,rgba(2,2,3,0.36)_100%)]',
        factory: createTurboNightScene,
    },
    'winter-flotte': {
        baseBg: 'bg-[#050506]',
        image: '/images/campaign-effects/winter-flotte-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(5,5,6,0.18)_0%,rgba(4,3,4,0.08)_56%,rgba(2,2,3,0.36)_100%)]',
        factory: createWinterFlotteScene,
    },
    'biker-race': {
        baseBg: 'bg-[#050506]',
        image: '/images/campaign-effects/biker-race-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(5,5,6,0.2)_0%,rgba(4,3,4,0.08)_56%,rgba(2,2,3,0.36)_100%)]',
        factory: createBikerRaceScene,
    },
    'wien-gala': {
        baseBg: 'bg-[#020304]',
        image: '/images/campaign-effects/wien-gala-bg.webp?v=2',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(3,3,5,0.18)_0%,rgba(2,3,5,0.06)_56%,rgba(2,2,4,0.34)_100%)]',
        factory: createWienGalaScene,
    },
    'valentine-drive': {
        baseBg: 'bg-[#050304]',
        image: '/images/campaign-effects/valentine-drive-bg.webp?v=2',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(5,3,4,0.18)_0%,rgba(4,2,3,0.06)_56%,rgba(3,2,3,0.34)_100%)]',
        factory: createValentineDriveScene,
    },
    'new-year': {
        baseBg: 'bg-[#04060d]',
        image: '/images/campaign-effects/new-year-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(3,5,12,0.34)_0%,rgba(2,4,10,0.14)_56%,rgba(2,4,10,0.46)_100%)]',
        factory: createNewYearScene,
    },
    semesterferien: {
        baseBg: 'bg-[#050a14]',
        image: '/images/campaign-effects/semesterferien-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(4,8,18,0.32)_0%,rgba(3,6,14,0.12)_56%,rgba(2,5,12,0.44)_100%)]',
        factory: createSemesterferienScene,
    },
    valentine: {
        baseBg: 'bg-[#0b0306]',
        image: '/images/campaign-effects/valentine-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(12,3,7,0.36)_0%,rgba(8,2,5,0.16)_56%,rgba(5,1,4,0.48)_100%)]',
        factory: createValentineScene,
    },
    'motorrad-start': {
        baseBg: 'bg-[#060406]',
        image: '/images/campaign-effects/motorrad-start-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(5,4,8,0.32)_0%,rgba(4,3,6,0.12)_56%,rgba(3,2,5,0.46)_100%)]',
        factory: createMotorradScene,
    },
    'easter-spring': {
        baseBg: 'bg-[#08060a]',
        image: '/images/campaign-effects/easter-spring-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(6,5,10,0.28)_0%,rgba(4,4,8,0.12)_56%,rgba(3,3,6,0.44)_100%)]',
        factory: createSpringBlossomsScene,
    },
    'summer-sun': {
        baseBg: 'bg-[#0d0804]',
        image: '/images/campaign-effects/summer-sun-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(10,6,3,0.34)_0%,rgba(6,4,2,0.14)_56%,rgba(4,2,2,0.44)_100%)]',
        factory: createSummerSunScene,
    },
    'back-to-school': {
        baseBg: 'bg-[#040914]',
        image: '/images/campaign-effects/back-to-school-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(4,8,18,0.38)_0%,rgba(3,6,14,0.16)_56%,rgba(2,5,12,0.48)_100%)]',
        factory: createBackToSchoolScene,
    },
    'autumn-leaves': {
        baseBg: 'bg-[#0a0503]',
        image: '/images/campaign-effects/autumn-leaves-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(10,5,2,0.36)_0%,rgba(7,4,2,0.14)_56%,rgba(4,2,2,0.48)_100%)]',
        factory: createAutumnLeavesScene,
    },
    'black-friday': {
        baseBg: 'bg-[#050304]',
        image: '/images/campaign-effects/black-friday-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(4,3,4,0.3)_0%,rgba(3,2,3,0.1)_56%,rgba(2,2,3,0.44)_100%)]',
        factory: createBlackFridayScene,
    },
    'eid-crescent': {
        baseBg: 'bg-[#050814]',
        image: '/images/campaign-effects/eid-crescent-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(4,7,16,0.32)_0%,rgba(3,5,12,0.12)_56%,rgba(2,4,10,0.44)_100%)]',
        factory: createEidCrescentScene,
    },
    'gold-gifts': {
        baseBg: 'bg-[#080603]',
        image: '/images/campaign-effects/gold-gifts-bg.webp',
        vignetteClass:
            'bg-[radial-gradient(ellipse_at_center,rgba(6,5,3,0.36)_0%,rgba(4,4,2,0.16)_56%,rgba(3,3,2,0.48)_100%)]',
        factory: createGoldVipScene,
    },
};

export function HybridLuxuryScene({ effectId }: { effectId: HybridEffectId }) {
    const sceneConfig = SCENE_CONFIG[effectId] || SCENE_CONFIG['gold-gifts'];
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backdropLayerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        setImgLoaded(false);
        const frame = requestAnimationFrame(() => {
            if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
                setImgLoaded(true);
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [effectId, sceneConfig.image]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof document === 'undefined') return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let isMobile = width < 768;
        let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

        const setupViewport = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            isMobile = width < 768;
            dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        setupViewport();
        const densityScale = prefersReducedMotion ? 0.35 : isMobile ? 0.55 : 1;
        const scene = sceneConfig.factory(width, height, densityScale);

        const onResize = () => {
            setupViewport();
            scene.resize?.(width, height);
        };
        window.addEventListener('resize', onResize);

        let targetMouseX = 0;
        let targetMouseY = 0;
        let smoothMouseX = 0;
        let smoothMouseY = 0;

        const onPointerMove = (e: PointerEvent) => {
            if (prefersReducedMotion || isMobile) return;
            targetMouseX = (e.clientX / width - 0.5) * -18;
            targetMouseY = (e.clientY / height - 0.5) * -10;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        let rafId = 0;
        let lastTime = performance.now();
        const startTime = lastTime;

        const loop = (now: number) => {
            const rawDt = Math.min((now - lastTime) / 1000, 0.05);
            const dt = prefersReducedMotion ? rawDt * 0.35 : rawDt;
            const elapsed = (now - startTime) / 1000;
            lastTime = now;

            if (backdropLayerRef.current && !prefersReducedMotion) {
                smoothMouseX += (targetMouseX - smoothMouseX) * Math.min(1, rawDt * 4.5);
                smoothMouseY += (targetMouseY - smoothMouseY) * Math.min(1, rawDt * 4.5);
                const breathScale = 1.045 + Math.sin(elapsed * 0.18) * 0.014;
                backdropLayerRef.current.style.transform = `translate3d(${smoothMouseX.toFixed(2)}px, ${smoothMouseY.toFixed(2)}px, 0) scale(${breathScale.toFixed(4)})`;
            }

            ctx.clearRect(0, 0, width, height);
            scene.render(ctx, width, height, dt, elapsed, isMobile);
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, [effectId, sceneConfig]);

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none select-none fixed inset-0 overflow-hidden z-0 ${sceneConfig.baseBg}`}
        >
            {/* Photorealistic 1920x1080 WebP Scene Layer with Smooth Fade-in & GPU Parallax */}
            <div
                ref={backdropLayerRef}
                className="absolute inset-0 will-change-transform transition-opacity duration-500"
                style={{ opacity: imgLoaded ? 1 : 0, transform: 'scale(1.045)' }}
            >
                <img
                    key={effectId}
                    ref={imgRef}
                    src={sceneConfig.image}
                    alt=""
                    decoding="async"
                    fetchPriority="high"
                    onLoad={() => setImgLoaded(true)}
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Center readability vignette keeping flanking artwork luminous */}
            <div className={`absolute inset-0 ${sceneConfig.vignetteClass}`} />

            {/* Live 60fps Atmospheric Physics Overlay */}
            <canvas ref={canvasRef} className="relative z-10 block w-full h-full" />
        </div>
    );
}
