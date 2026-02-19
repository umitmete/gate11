'use client';

import { useFormState } from 'react-dom';
import { authenticate } from '@/app/actions/auth';
import { useEffect, useRef } from 'react';

export default function LoginPage() {
    const [state, dispatch] = useFormState(authenticate, undefined);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.7;
        }
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full opacity-40 grayscale"
                >
                    <source src="/images/hero/BMW_M2_CS_2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 w-full max-w-md p-8 mx-4">
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8 space-y-4">
                        <img
                            src="/Gate11_Logo_beyaz.svg"
                            alt="GATE 11"
                            className="h-12 w-auto object-contain"
                        />
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                        <h1 className="text-xl font-serif italic text-white tracking-wide">
                            Admin Konsole
                        </h1>
                    </div>

                    <form action={dispatch} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs uppercase tracking-widest text-[#ededed] font-medium block">
                                E-Mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@fahrschulegate11.at"
                                required
                                className="flex h-9 w-full rounded-md border bg-white/5 border-white/10 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs uppercase tracking-widest text-[#ededed] font-medium block">
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                className="flex h-9 w-full rounded-md border bg-white/5 border-white/10 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50 text-white"
                            />
                        </div>

                        {state?.error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded">
                                {state.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full bg-[#D4AF37] hover:bg-[#B4941F] text-black font-medium tracking-wide transition-all"
                        >
                            Anmelden
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest text-[#ededed]">
                            Geschützter Bereich • Nur für autorisiertes Personal
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
