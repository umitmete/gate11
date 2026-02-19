'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { getMapUrl } from "@/lib/utils/map-helper";

export default function ContactPage() {
    const { t, language } = useLanguage();

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
            <Navbar />

            {/* Giriş Bölümü */}
            <section className="relative pt-24 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{t.footer.contact}</span>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter mb-8 italic">
                            {t.nav.contact}
                        </h1>
                        <p className="text-xl text-muted-foreground font-light max-w-2xl leading-relaxed mx-auto">
                            {t.footer.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* İçerik Bölümü */}
            <section className="relative py-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        {/* İletişim Bilgileri */}
                        <div className="h-[550px] flex flex-col justify-between pl-8 md:pl-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary">
                                    <MapPin className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t.footer.address}</span>
                                </div>
                                <div className="group">
                                    <p className="text-2xl font-serif text-foreground">
                                        {t.footer.addressLine}<br />
                                        {t.footer.cityLine}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary">
                                    <Phone className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t.footer.phone}</span>
                                </div>
                                <p className="text-2xl font-serif text-foreground">+43 1 767 32 87</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary">
                                    <Mail className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t.footer.email}</span>
                                </div>
                                <p className="text-2xl font-serif text-foreground underline decoration-primary/30">drive@fahrschulegate11.at</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary">
                                    <Clock className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t.footer.hours}</span>
                                </div>
                                <div className="space-y-2 text-xl font-serif">
                                    <p className="flex justify-between max-w-xs text-muted-foreground"><span className="text-foreground">{t.footer.schedule.monThu}</span> 09:00 – 18:00</p>
                                    <p className="flex justify-between max-w-xs text-muted-foreground"><span className="text-foreground">{t.footer.schedule.fri}</span> 09:00 – 17:00</p>
                                </div>
                            </div>
                        </div>

                        {/* Harita / Görsel */}
                        <div
                            className="relative h-[550px] rounded-3xl overflow-hidden transition-all duration-700 border border-primary/10 block group shadow-2xl shadow-primary/5"
                        >
                            <iframe
                                src="https://maps.google.at/maps?saddr=Simmeringer+Platz+1,+1110+Wien&daddr=Fahrschule+GATE+11,+Simmeringer+Hauptstra%C3%9Fe+179,+1110+Wien&dirflg=w&hl=de&gl=at&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, marginTop: '-15%' }} // Haritayı yukarı kaydırarak üstteki balonu gizlemeye çalışıyoruz
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="pointer-events-none h-[115%]" // Yüksekliği artırıp margin ile dengeleme
                            />

                            {/* Sol Üst Mesafe Kartı (Orijinal Tasarım) */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="absolute bottom-6 left-6 bg-black/85 backdrop-blur-md border border-primary/40 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-4 border-l-primary min-w-[220px] !opacity-85 group-hover:!opacity-100 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/50 relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                        <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] leading-none mb-1">{t.contact.station}</p>
                                        <p className="text-white text-lg font-serif italic">U3 Simmering</p>
                                    </div>
                                </div>
                                <div className="mt-2 py-1 border-y border-white/5 flex flex-col items-center">
                                    <span className="text-primary text-xl font-black tracking-[0.3em]">{t.contact.distance}</span>
                                </div>
                            </motion.div>

                            {/* Sağ Üst Özel Bilgi Kartı (Optimize Edilmiş) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute top-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 p-5 rounded-xl shadow-2xl w-[260px] z-20 text-white !opacity-90 group-hover:!opacity-100 transition-all duration-500"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-serif font-bold text-lg leading-tight text-white">Fahrschule GATE 11</h3>
                                        <p className="text-white/70 text-[10px] mt-0.5">Simmeringer Hauptstraße 179, Wien</p>
                                    </div>
                                    <div className="bg-white/10 p-1 rounded-md">
                                        <img src="/Gate11_Logo_beyaz.svg" alt="Logo" className="w-6 h-6 object-contain" />
                                    </div>
                                </div>

                                <a
                                    href="https://www.google.com/search?sca_esv=5d794197a6beaa47&rlz=1C1ONGR_trAT1100AT1100&sxsrf=ANbL-n6MlUlnOroqqsNqc86bPIMIb7nsIA:1769649723286&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOff6deklEMkK51e2fYmlBjFyQ4rvn4DNDTz3zm8xqkyxlYkkt5uWbuVhzrew0xG1Tpqp7Vhl1F-8R0zcFxOajPwIX6BP3drtzXpfNNHlyltMV1BEZg%3D%3D&q=Fahrschule+GATE+11+Yorumlar&sa=X&ved=2ahUKEwivooj5yq-SAxUjwAIHHZVTMFgQ0bkNegQIKRAH&biw=1536&bih=738&dpr=1.25&aic=0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/review"
                                >
                                    <span className="font-bold text-sm text-primary">4.9</span>
                                    <div className="flex gap-0.5 text-primary">
                                        {"★★★★★".split("").map((s, i) => <span key={i} className="text-[10px]">{s}</span>)}
                                    </div>
                                    <span className="text-white/50 text-[9px] ml-auto group-hover/review:text-white transition-colors">
                                        (216 Reviews)
                                    </span>
                                </a>
                            </motion.div>

                            <div className="absolute inset-0 pointer-events-none border-[24px] border-background" />
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
