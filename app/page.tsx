'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LuxuryCard, CardTitle, CardDescription } from '@/components/ui/card/LuxuryCard';
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoProgress = useMotionValue(0);
  const smoothProgress = useSpring(videoProgress, { damping: 50, stiffness: 200, mass: 0.8 });

  const textOpacity = useTransform(smoothProgress, [0.5, 0.85], [0, 1]);
  const textY = useTransform(smoothProgress, [0.5, 0.85], [60, 0]);
  const textScale = useTransform(smoothProgress, [0.5, 0.85], [0.97, 1]);
  const overlayOpacity = useTransform(smoothProgress, [0.7, 0.95], [0, 1]);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const logoSrc = mounted && currentTheme === 'light'
    ? "/Gate11_Logo_siyah.svg"
    : "/Gate11_Logo_beyaz.svg";

  useEffect(() => {
    let animationFrameId: number;
    const video = videoRef.current;
    let currentRate = 1.0;

    const animate = () => {
      if (video) {
        const { currentTime, duration } = video;

        if (duration > 0) {
          const progress = currentTime / duration;
          videoProgress.set(progress);

          let targetRate = 1.0;
          if (progress > 0.75) {
            const slowdownStart = 0.75;
            const slowdownEnd = 0.98;

            if (progress < slowdownEnd) {
              const factor = (progress - slowdownStart) / (slowdownEnd - slowdownStart);
              targetRate = 1.0 - (factor * 0.9);
            } else {
              targetRate = 0.1;
            }
          }

          // Smooth rate transition to prevent jitter
          currentRate += (targetRate - currentRate) * 0.1;
          video.playbackRate = Math.max(0.1, currentRate);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [videoProgress]);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* Giriş Bölümü (Hero) */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-background mt-20">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="/images/hero/BMW_M2_CS_2025.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          // No loop, stops at end for "soft cut" feel with slowdown
          />
          {/* Metin okunabilirliği için koyu katman */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          {/* Side vignetting/darkening that appears at the end */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90"
          />
        </div>

        {/* Arka Plan Desenleri */}
        <div className="absolute inset-0 z-1 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-10" />

        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            willChange: 'transform, opacity'
          }}
          className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center space-y-8 md:space-y-12"
        >
          <div className="inline-block border border-primary/40 px-6 py-2 rounded-full bg-black/20 backdrop-blur-sm mb-2 shadow-xl">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-primary uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t.hero.establishment}
            </span>
          </div>

          <div className="flex justify-center items-center py-2 md:py-4">
            <img
              src={logoSrc}
              alt="GATE 11 Logo"
              className={`h-24 md:h-40 w-auto object-contain transition-all duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]`}
            />
          </div>

          <div className="space-y-6">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight max-w-6xl mx-auto leading-tight italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {t.hero.subtitle}
            </p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-lg" />
            <p className="text-sm sm:text-sm md:text-xl font-light text-white/90 tracking-widest md:tracking-[0.2em] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {t.hero.description}
            </p>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* İstatistik Bölümü */}
      <section className="py-16 md:py-24 border-y border-primary/10 bg-primary/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-32 text-center max-w-6xl mx-auto">
            {[
              { label: t.stats.students, value: "2000+" },
              { label: t.stats.vehicles, value: "10+" },
              { label: t.stats.instructors, value: "7+" },
            ].map((stat: any, i: number) => (
              <div key={i} className="group">
                <p className="text-4xl md:text-6xl font-serif text-foreground mb-4 transition-all duration-500 group-hover:scale-110">{stat.value}</p>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary font-bold transition-all duration-300 group-hover:tracking-[0.4em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-20 md:py-32 bg-background relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 md:mb-24 gap-8 text-center lg:text-left">
            <div className="max-w-xl space-y-4">
              <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-serif">{t.features.badge}</span>
              <h2 className="text-3xl md:text-6xl font-serif text-foreground leading-[1.2] flex flex-wrap justify-center lg:justify-start items-center gap-x-3 md:gap-x-4">
                {t.features.title.split('GATE11')[0]}
                <img src={logoSrc} alt="GATE 11" className="h-8 md:h-16 w-auto object-contain inline-block" />
                {t.features.title.split('GATE11')[1]}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg font-light tracking-wide">{t.features.subtitle}</p>
            </div>
            <Link href="/ueber-uns" className="text-primary hover:text-foreground transition-colors border-b border-primary/30 pb-2 text-[10px] md:text-xs font-bold tracking-widest uppercase">
              {t.features.philosophy} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <LuxuryCard className="group p-8 md:p-10 h-full">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6 md:mb-8 border border-primary/20 group-hover:bg-primary transition-colors duration-500">
                <span className="text-primary text-xl md:text-2xl group-hover:text-primary-foreground transition-colors">✦</span>
              </div>
              <CardTitle className="text-xl md:text-2xl mb-3 md:mb-4 font-serif">{t.features.fleet_title}</CardTitle>
              <CardDescription className="text-sm md:text-base font-light leading-relaxed">
                {t.features.fleet_desc}
              </CardDescription>
            </LuxuryCard>

            <LuxuryCard className="group p-8 md:p-10 h-full border-primary/20 bg-primary/[0.03]">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6 md:mb-8 border border-primary/20 group-hover:bg-primary transition-colors duration-500">
                <span className="text-primary text-xl md:text-2xl group-hover:text-primary-foreground transition-colors">⚡</span>
              </div>
              <CardTitle className="text-xl md:text-2xl mb-3 md:mb-4 font-serif">{t.features.digital_title}</CardTitle>
              <CardDescription className="text-sm md:text-base font-light leading-relaxed">
                {t.features.digital_desc}
              </CardDescription>
            </LuxuryCard>

            <LuxuryCard className="group p-8 md:p-10 h-full">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6 md:mb-8 border border-primary/20 group-hover:bg-primary transition-colors duration-500">
                <span className="text-primary text-xl md:text-2xl group-hover:text-primary-foreground transition-colors">♛</span>
              </div>
              <CardTitle className="text-xl md:text-2xl mb-3 md:mb-4 font-serif">{t.features.mentorship_title}</CardTitle>
              <CardDescription className="text-sm md:text-base font-light leading-relaxed">
                {t.features.mentorship_desc}
              </CardDescription>
            </LuxuryCard>
          </div>
        </div>
      </section>

      {/* CTA (Eylem Çağrısı) Bölümü */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
            alt="Driving"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-8 md:space-y-12">
          <h2 className="text-3xl md:text-7xl font-serif text-white tracking-tight leading-tight">{t.cta.title}</h2>
          <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            {t.cta.description}
          </p>
          <div className="pt-4 md:pt-8">
            <Link
              href="/anmeldung"
              className="inline-block w-full sm:w-auto px-12 py-5 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(229,4,18,0.3)] text-center"
            >
              {t.cta.button}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main >
  );
}
