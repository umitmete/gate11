'use client';

import { useEffect, useRef, useState } from 'react';

interface Point2D {
    x: number;
    y: number;
}

type FireworkTier = 'small' | 'medium' | 'grand';

interface SnowFlake {
    x: number;
    y: number;
    radius: number;
    layer: 0 | 1 | 2;
    vy: number;
    swayAmp: number;
    swayFreq: number;
    phase: number;
    alpha: number;
    warmHint: boolean;
}

interface MistWisp {
    x: number;
    yRatio: number;
    rx: number;
    ry: number;
    vx: number;
    alpha: number;
}

interface Rocket {
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetY: number;
    rgb: string;
    isWillow: boolean;
    tier: FireworkTier;
    trail: Point2D[];
}

interface Spark {
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
}

interface SkyFlash {
    x: number;
    y: number;
    radius: number;
    rgb: string;
    life: number;
    maxLife: number;
}

interface ShimmerNode {
    xRatio: number;
    yRatio: number;
    size: number;
    speed: number;
    phase: number;
    rgb: string;
}

function createPrng(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (1664525 * s + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
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
        const len = radius * 1.25;
        const beam = ctx.createLinearGradient(-len, 0, len, 0);
        beam.addColorStop(0, `rgba(${rgb}, 0)`);
        beam.addColorStop(0.5, `rgba(255, 250, 228, ${(alpha * 0.72).toFixed(4)})`);
        beam.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = beam;
        ctx.fillRect(-len, -0.6, len * 2, 1.2);
        ctx.restore();
    }

    ctx.restore();
}

export function ChristmasLuxuryScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backdropLayerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
            setImgLoaded(true);
        }
    }, []);

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
        window.addEventListener('resize', setupViewport);

        // Damped mouse parallax for cinema depth
        let targetMouseX = 0;
        let targetMouseY = 0;
        let smoothMouseX = 0;
        let smoothMouseY = 0;

        const onPointerMove = (e: PointerEvent) => {
            if (prefersReducedMotion || width < 768) return;
            targetMouseX = (e.clientX / width - 0.5) * -20;
            targetMouseY = (e.clientY / height - 0.5) * -12;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        const rand = createPrng(24122026);

        // 3-layer realistic depth-of-field snow (210 desktop, 115 mobile)
        const flakeTotal = isMobile ? 115 : 210;
        const snowflakes: SnowFlake[] = Array.from({ length: flakeTotal }, (_, i) => {
            const ratio = i / flakeTotal;
            const layer: 0 | 1 | 2 = ratio < 0.34 ? 0 : ratio < 0.86 ? 1 : 2;
            const radius =
                layer === 0 ? 1.0 + rand() * 1.1 : layer === 1 ? 2.1 + rand() * 2.1 : 6.0 + rand() * 8.5;
            return {
                x: rand() * width,
                y: rand() * height,
                radius,
                layer,
                vy: layer === 0 ? 22 + rand() * 16 : layer === 1 ? 48 + rand() * 32 : 92 + rand() * 52,
                swayAmp: layer === 0 ? 8 + rand() * 8 : layer === 1 ? 16 + rand() * 18 : 28 + rand() * 24,
                swayFreq: 0.5 + rand() * 0.85,
                phase: rand() * Math.PI * 2,
                alpha: layer === 0 ? 0.28 + rand() * 0.22 : layer === 1 ? 0.58 + rand() * 0.3 : 0.18 + rand() * 0.16,
                warmHint: rand() > 0.78,
            };
        });

        // Low winter courtyard snow mist
        const mistWisps: MistWisp[] = Array.from({ length: 6 }, (_, i) => ({
            x: (i / 5) * width,
            yRatio: 0.84 + (i % 3) * 0.04,
            rx: 240 + rand() * 200,
            ry: 26 + rand() * 18,
            vx: 9 + rand() * 14,
            alpha: 0.035 + rand() * 0.035,
        }));

        // Subtle tree fairy-light & right-tree sparkle anchors aligned to image flanks
        const shimmers: ShimmerNode[] = [
            // Left Christmas tree lights & star
            { xRatio: 0.195, yRatio: 0.04, size: 16, speed: 1.8, phase: 0.1, rgb: '252, 226, 152' },
            { xRatio: 0.17, yRatio: 0.25, size: 8, speed: 2.3, phase: 0.7, rgb: '255, 244, 210' },
            { xRatio: 0.21, yRatio: 0.34, size: 7, speed: 2.9, phase: 1.4, rgb: '242, 198, 86' },
            { xRatio: 0.15, yRatio: 0.44, size: 8, speed: 2.1, phase: 2.2, rgb: '255, 240, 198' },
            { xRatio: 0.23, yRatio: 0.52, size: 9, speed: 2.6, phase: 0.4, rgb: '248, 216, 128' },
            { xRatio: 0.18, yRatio: 0.58, size: 7, speed: 3.1, phase: 1.8, rgb: '255, 244, 210' },
            // Right companion spruce & brass lantern bounce
            { xRatio: 0.94, yRatio: 0.42, size: 8, speed: 2.2, phase: 0.9, rgb: '252, 224, 148' },
            { xRatio: 0.91, yRatio: 0.56, size: 7, speed: 2.8, phase: 1.7, rgb: '255, 242, 200' },
        ];

        // Multi-scale ballistic fireworks illuminating the alpine night sky
        const rockets: Rocket[] = [];
        const sparks: Spark[] = [];
        const flashes: SkyFlash[] = [];
        const fireworkColors = ['212, 175, 55', '252, 226, 152', '229, 4, 18', '241, 245, 249'];
        let fwTimer = 0.25;

        const spawnRocket = (immediate = false, forcedTier?: FireworkTier) => {
            const tierRoll = rand();
            const tier: FireworkTier =
                forcedTier || (tierRoll < 0.28 ? 'small' : tierRoll < 0.7 ? 'medium' : 'grand');

            // Distribute explosions over dark upper sky (left mountains, right mountains, upper center)
            const zoneRoll = rand();
            const rx =
                zoneRoll < 0.4
                    ? (0.12 + rand() * 0.2) * width
                    : zoneRoll < 0.8
                    ? (0.68 + rand() * 0.2) * width
                    : (0.38 + rand() * 0.24) * width;
            const ry = height * 0.56;
            const ty =
                tier === 'grand'
                    ? (0.09 + rand() * 0.16) * height
                    : tier === 'medium'
                    ? (0.11 + rand() * 0.21) * height
                    : (immediate ? 0.14 : 0.15) * height + rand() * 0.18 * height;
            const t = tier === 'grand' ? 0.72 + rand() * 0.22 : tier === 'medium' ? 0.58 + rand() * 0.22 : 0.45 + rand() * 0.2;
            const g = 240;
            const vy = -(ry - ty) / t - 0.5 * g * t;

            rockets.push({
                x: rx,
                y: ry,
                vx: (rand() - 0.5) * 60,
                vy,
                targetY: ty,
                rgb: fireworkColors[Math.floor(rand() * fireworkColors.length)],
                isWillow: tier === 'grand' || rand() > 0.38,
                tier,
                trail: [],
            });
        };

        const detonateRocket = (r: Rocket) => {
            const flashRadius = r.tier === 'grand' ? 350 : r.tier === 'medium' ? 235 : 135;
            flashes.push({
                x: r.x,
                y: r.y,
                radius: flashRadius,
                rgb: r.rgb,
                life: 0,
                maxLife: r.tier === 'grand' ? 0.62 : 0.45,
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
                for (let i = 0; i < count; i++) {
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
                        maxLife: maxLifeBase + rand() * 0.7,
                        rgb: i % 4 === 0 ? altRgb : ringRgb,
                        size: sizeBase + rand() * 1.15,
                        drag: dragVal,
                        gravity: gravityVal,
                        glitter: r.isWillow || rand() > 0.58,
                    });
                }
            };

            const secondary = rand() > 0.5 ? '255, 248, 224' : '212, 175, 55';
            if (r.tier === 'grand') {
                addRing(98, 295, r.rgb, secondary, 1.5, 1.7, 0.958, 122);
                const coreRgb = r.rgb === '229, 4, 18' ? '252, 226, 152' : '229, 4, 18';
                addRing(52, 138, coreRgb, '255, 250, 235', 1.12, 1.45, 0.962, 138);
            } else if (r.tier === 'medium') {
                addRing(88, 218, r.rgb, secondary, 1.22, 1.42, 0.963, 142);
            } else {
                addRing(48, 128, r.rgb, secondary, 0.82, 1.12, 0.968, 162);
            }
        };

        spawnRocket(true, 'grand');
        spawnRocket(true, 'medium');
        spawnRocket(true, 'small');

        let rafId = 0;
        let lastTime = performance.now();
        const startTime = lastTime;

        const frame = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            const elapsed = (now - startTime) / 1000;
            lastTime = now;

            // Smooth GPU-only parallax & subtle breathing zoom on the studio photograph
            if (backdropLayerRef.current && !prefersReducedMotion) {
                smoothMouseX += (targetMouseX - smoothMouseX) * Math.min(1, dt * 4.5);
                smoothMouseY += (targetMouseY - smoothMouseY) * Math.min(1, dt * 4.5);
                const breathScale = 1.045 + Math.sin(elapsed * 0.18) * 0.014;
                backdropLayerRef.current.style.transform = `translate3d(${smoothMouseX.toFixed(2)}px, ${smoothMouseY.toFixed(2)}px, 0) scale(${breathScale.toFixed(4)})`;
            }

            ctx.clearRect(0, 0, width, height);

            // 1. Live warm flickering candle pulse on right lantern + delicate tree sparkles
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            const lanternX = width * 0.74;
            const lanternY = height * 0.78;
            const flicker = 0.86 + 0.14 * Math.sin(elapsed * 7.2) * Math.cos(elapsed * 4.1);
            const lanternGlow = ctx.createRadialGradient(lanternX, lanternY, 2, lanternX, lanternY, 96 * flicker);
            lanternGlow.addColorStop(0, `rgba(255, 240, 192, ${(0.34 * flicker).toFixed(4)})`);
            lanternGlow.addColorStop(0.35, `rgba(255, 184, 72, ${(0.18 * flicker).toFixed(4)})`);
            lanternGlow.addColorStop(1, 'rgba(255, 184, 72, 0)');
            ctx.fillStyle = lanternGlow;
            ctx.beginPath();
            ctx.arc(lanternX, lanternY, 96 * flicker, 0, Math.PI * 2);
            ctx.fill();

            for (const sh of shimmers) {
                const wave = Math.max(0, Math.sin(elapsed * sh.speed + sh.phase));
                const a = Math.pow(wave, 2.2) * 0.72;
                drawOpticalGlint(ctx, sh.xRatio * width, sh.yRatio * height, sh.size, a, sh.rgb);
            }

            // 2. Ballistic fireworks illuminating the starry night sky
            const maxRockets = isMobile ? 3 : 5;
            fwTimer -= dt;
            if (fwTimer <= 0 && rockets.length < maxRockets) {
                spawnRocket(false);
                if (!isMobile && rand() < 0.34) {
                    spawnRocket(false, 'small');
                }
                fwTimer = 0.72 + rand() * 0.85;
            }

            for (let i = flashes.length - 1; i >= 0; i--) {
                const fl = flashes[i];
                fl.life += dt;
                if (fl.life >= fl.maxLife) {
                    flashes.splice(i, 1);
                    continue;
                }
                const alpha = (1 - fl.life / fl.maxLife) * 0.25;
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
                    detonateRocket(r);
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
                if (sp.history.length > 7) sp.history.shift();

                const dragF = Math.pow(sp.drag, dt * 60);
                sp.vx *= dragF;
                sp.vy = sp.vy * dragF + sp.gravity * dt;
                sp.x += sp.vx * dt;
                sp.y += sp.vy * dt;

                const t = sp.life / sp.maxLife;
                let a = t < 0.15 ? 1 : Math.pow(1 - (t - 0.15) / 0.85, 1.5);
                if (sp.glitter && t > 0.54) {
                    a *= 0.3 + 0.7 * Math.abs(Math.sin(elapsed * 26 + i * 2.9));
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

                const tailStart = sp.history[sp.history.length - 1] || { x: sp.x, y: sp.y };
                ctx.strokeStyle = `rgba(${rgb}, ${clamp(a, 0, 1).toFixed(4)})`;
                ctx.lineWidth = Math.max(0.6, sp.size * (1 - t * 0.35));
                ctx.beginPath();
                ctx.moveTo(tailStart.x, tailStart.y);
                ctx.lineTo(sp.x, sp.y);
                ctx.stroke();

                if (t < 0.45) {
                    ctx.fillStyle = `rgba(255, 252, 240, ${clamp(a * 0.85, 0, 1).toFixed(4)})`;
                    ctx.beginPath();
                    ctx.arc(sp.x, sp.y, sp.size * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();

            // 3. Slow courtyard ground mist
            const globalWind = Math.sin(elapsed * 0.24) * 20 + Math.sin(elapsed * 0.58) * 9;
            for (const m of mistWisps) {
                m.x += (m.vx + globalWind * 0.38) * dt;
                if (m.x > width + m.rx) m.x = -m.rx;
                if (m.x < -m.rx) m.x = width + m.rx;
                const my = m.yRatio * height;
                const mg = ctx.createRadialGradient(m.x, my, 0, m.x, my, m.rx);
                mg.addColorStop(0, `rgba(220, 236, 252, ${m.alpha.toFixed(4)})`);
                mg.addColorStop(1, 'rgba(220, 236, 252, 0)');
                ctx.save();
                ctx.translate(m.x, my);
                ctx.scale(1, m.ry / m.rx);
                ctx.fillStyle = mg;
                ctx.beginPath();
                ctx.arc(0, 0, m.rx, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // 4. 3-Layer realistic depth-of-field snowfall
            for (const f of snowflakes) {
                const sway = Math.sin(elapsed * f.swayFreq + f.phase) * f.swayAmp;
                f.y += f.vy * dt;
                f.x += (globalWind * (0.38 + f.layer * 0.36) + sway) * dt;

                if (f.y > height + f.radius * 3) {
                    f.y = -f.radius * 3;
                    f.x = rand() * width;
                }
                if (f.x > width + f.radius * 3) f.x = -f.radius * 3;
                if (f.x < -f.radius * 3) f.x = width + f.radius * 3;

                const rgb = f.warmHint ? '255, 245, 222' : '236, 246, 255';
                const rScale = f.layer === 2 ? f.radius : f.radius * 1.45;
                const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rScale);
                grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha.toFixed(4)})`);
                grad.addColorStop(
                    f.layer === 2 ? 0.6 : 0.5,
                    `rgba(${rgb}, ${(f.alpha * (f.layer === 2 ? 0.42 : 0.72)).toFixed(4)})`
                );
                grad.addColorStop(1, `rgba(${rgb}, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(f.x, f.y, rScale, 0, Math.PI * 2);
                ctx.fill();
            }

            rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', setupViewport);
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, []);

    return (
        <div aria-hidden="true" className="pointer-events-none select-none fixed inset-0 overflow-hidden z-0 bg-[#040812]">
            {/* Photorealistic 1920x1080 WebP Scene Layer with Smooth Fade-in & GPU Parallax */}
            <div
                ref={backdropLayerRef}
                className="absolute inset-0 will-change-transform transition-opacity duration-500"
                style={{ opacity: imgLoaded ? 1 : 0, transform: 'scale(1.045)' }}
            >
                <img
                    ref={imgRef}
                    src="/images/campaign-effects/christmas-bg.webp"
                    alt=""
                    decoding="async"
                    fetchPriority="high"
                    onLoad={() => setImgLoaded(true)}
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Subtle atmospheric vignette keeping center readable while preserving bright illuminated flanks */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,7,16,0.34)_0%,rgba(2,5,12,0.14)_54%,rgba(2,4,10,0.44)_100%)]" />

            {/* Live 60fps Fireworks, Multi-Depth Snowfall & Optical Candle/Star Sparkles */}
            <canvas ref={canvasRef} className="relative z-10 block w-full h-full" />
        </div>
    );
}
