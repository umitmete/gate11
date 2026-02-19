'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LuxuryCard, CardTitle } from '@/components/ui/card/LuxuryCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';

export default function VehiclesPage() {
    const { t, language } = useLanguage();

    const vehicles_data = {
        de: [
            { name: "Golf 8 (2026)", type: "Schaltgetriebe", features: ["150 PS", "IQ.LIGHT", "Travel Assist"], image: "/images/Golf 8 (2026).png" },
            { name: "BMW 116 (2025)", type: "Schalt- & Automatikgetriebe", features: ["M Sport", "Comfort Paket", "Live Cockpit"], image: "/images/BMW 118 (2025) .png" },
            { name: "Kawasaki Z650 (2025)", type: "Motorrad", features: ["ABS", "LED", "Kompakt"], image: "/images/Kawasaki Z650 (2025).png" }
        ],
        en: [
            { name: "Golf 8 (2026)", type: "Manual", features: ["150 HP", "IQ.LIGHT", "Travel Assist"], image: "/images/Golf 8 (2026).png" },
            { name: "BMW 116 (2025)", type: "Manual & Automatic", features: ["M Sport", "Comfort Package", "Live Cockpit"], image: "/images/BMW 118 (2025) .png" },
            { name: "Kawasaki Z650 (2025)", type: "Motorcycle", features: ["ABS", "LED", "Compact"], image: "/images/Kawasaki Z650 (2025).png" }
        ],
        tr: [
            { name: "Golf 8 (2026)", type: "Manuel", features: ["150 HP", "IQ.LIGHT", "Sürüş Asistanı"], image: "/images/Golf 8 (2026).png" },
            { name: "BMW 116 (2025)", type: "Manuel & Otomatik", features: ["M Paket", "Konfor Paketi", "Live Cockpit"], image: "/images/BMW 118 (2025) .png" },
            { name: "Kawasaki Z650 (2025)", type: "Motosiklet", features: ["ABS", "LED Aydınlatma", "Kompakt Tasarım"], image: "/images/Kawasaki Z650 (2025).png" }
        ],
        ar: [
            { name: "Golf 8 (2026)", type: "يدوي", features: ["150 HP", "IQ.LIGHT", "Travel Assist"], image: "/images/Golf 8 (2026).png" },
            { name: "BMW 116 (2025)", type: "يدوي & أوتوماتيك", features: ["M Sport", "باقة الراحة", "Live Cockpit"], image: "/images/BMW 118 (2025) .png" },
            { name: "Kawasaki Z650 (2025)", type: "دراجة نارية", features: ["ABS", "LED", "مدمجة"], image: "/images/Kawasaki Z650 (2025).png" }
        ],
        fa: [
            { name: "Golf 8 (2026)", type: "دستی", features: ["۱۵۰ اسب بخار", "IQ.LIGHT", "کمک راننده"], image: "/images/Golf 8 (2026).png" },
            { name: "BMW 116 (2025)", type: "دستی & اتوماتیک", features: ["M Sport", "پکیج راحتی", "Live Cockpit"], image: "/images/BMW 118 (2025) .png" },
            { name: "Kawasaki Z650 (2025)", type: "موتورسیکلت", features: ["ABS", "LED", "کم جا"], image: "/images/Kawasaki Z650 (2025).png" }
        ]
    };

    const vehicles = vehicles_data[language] || vehicles_data.de;

    return (
        <main className="min-h-screen bg-background text-foreground pt-20 transition-colors duration-300">
            <Navbar />

            {/* Özel Tanıtım Bölümü: BMW M2 CS - Sayfanın En Üstünde */}
            <section className="relative group w-full pt-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-20" />

                <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1, filter: "grayscale(100%)" }}
                        animate={{ scale: 1, filter: "grayscale(0%)" }}
                        transition={{ duration: 1.5 }}
                        className="w-full h-full"
                    >
                        <img
                            src="/images/bmw-hero.jpg"
                            alt="BMW M2 CS 2025"
                            className="w-full h-full object-cover object-center"
                        />
                    </motion.div>
                </div>

                <div className={`absolute top-16 md:top-20 ${language === 'ar' || language === 'fa' ? 'right-6 md:right-24 text-right' : 'left-6 md:left-24 text-left'} z-30 max-w-4xl pr-6`}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="space-y-6 md:space-y-8"
                    >
                        <div className="space-y-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                                className={`flex ${language === 'ar' || language === 'fa' ? 'justify-end' : 'justify-start'} mb-4 md:mb-6`}
                            >
                                <span className="bg-primary text-white text-xs md:text-3xl font-black uppercase tracking-[0.2em] px-4 md:px-8 py-2 md:py-3 shadow-[0_0_50px_rgba(229,4,18,0.7)] border-2 border-white/20 relative overflow-hidden group">
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                    />
                                    {language === 'tr' ? 'AVUSTURYA\'DA İLK VE TEK' :
                                        language === 'en' ? 'AUSTRIA\'S FIRST & ONLY' :
                                            language === 'ar' ? 'الأول والوحيد في النمسا' :
                                                language === 'fa' ? 'اولین و تنها در اتریش' :
                                                    'ÖSTERREICHS ERSTER & EINZIGER'}
                                </span>
                            </motion.div>
                            <p className="text-2xl md:text-6xl font-serif italic text-primary font-bold ml-1 md:ml-2 drop-shadow-[0_0_15px_rgba(229,4,18,0.4)]">
                                {t.vehicles.reveal.model}
                            </p>
                        </div>

                        <p className={`text-sm md:text-xl text-white/70 font-light leading-relaxed max-w-[280px] md:max-w-lg ${language === 'ar' || language === 'fa' ? 'border-r-4 pr-4 md:pr-6 bg-gradient-to-l text-right' : 'border-l-4 pl-4 md:pl-6 bg-gradient-to-r text-left'} border-primary py-2 from-white/5 to-transparent`}>
                            {t.vehicles.reveal.description}
                        </p>

                        <div className={`grid grid-cols-3 gap-2 md:gap-8 pt-4 md:pt-6 border-t border-white/10 w-full max-w-lg md:max-w-xl mx-auto md:mx-0`}>
                            {t.vehicles.reveal.features.map((feat: string, i: number) => {
                                const parts = feat.split(' ');
                                let valPart = parts[0];
                                let labelPart = parts.slice(1).join(' ');

                                // Sayı ve birimi ayır (Örn: "3.8s" -> ["3.8", "s"])
                                // Eğer birim sayıyla bitişikse (3.8sn gibi), birimi etikete taşıyoruz
                                const unitMatch = valPart.match(/^([\d.]+)([a-zA-Z]+)$/);
                                if (unitMatch) {
                                    valPart = unitMatch[1];
                                    labelPart = unitMatch[2] + (labelPart ? ' ' + labelPart : '');
                                }

                                return (
                                    <div key={i} className="flex flex-col items-center justify-start text-center group/feat cursor-default h-full">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover/feat:text-primary transition-all duration-300 font-serif leading-none mb-1">
                                            {valPart}
                                        </div>
                                        <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground group-hover/feat:text-white transition-all duration-300 leading-tight px-1">
                                            {labelPart}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 pb-24 pt-12 md:pt-24">
                <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto space-y-6">
                    <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] font-serif">{t.vehicles.badge}</span>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold text-foreground leading-tight px-4">{t.vehicles.title}</h1>
                    <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed px-4">
                        {t.vehicles.subtitle}
                    </p>
                </header>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {vehicles.map((car: any, idx: number) => (
                        <LuxuryCard key={idx} className="group p-4 md:p-5 bg-primary/[0.01] w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(50%-1.5rem)]">
                            <div className="aspect-video w-full overflow-hidden mb-6 md:mb-8 border border-primary/10 relative">
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                                />
                                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-background/80 backdrop-blur-md px-3 md:px-4 py-1.5 text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-[0.2em] border border-primary/20">
                                    {car.type}
                                </div>
                            </div>

                            <div className="px-2 md:px-4 pb-2 md:pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-serif mb-4 md:mb-6 italic">{car.name}</CardTitle>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {car.features.map((feat: string, i: number) => (
                                        <span key={i} className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 md:px-3 py-1 bg-primary/5 text-primary border border-primary/10">
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>

                <div className="mt-20 md:mt-32 text-center pb-20">
                    <Link
                        href="/anmeldung"
                        className="inline-flex w-full sm:w-auto justify-center px-12 py-5 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-background transition-all shadow-[0_0_40px_rgba(229,4,18,0.2)] text-center"
                    >
                        {t.vehicles.cta}
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
