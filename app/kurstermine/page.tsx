'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/tr';
import 'dayjs/locale/ar';
import 'dayjs/locale/fa';

interface CourseSchedule {
    id: string;
    date: string;
    time: string;
    abbreviation: string;
    topic: string;
    type: 'INTENSIVE' | 'EVENING';
}

export default function KursterminePage() {
    const { t, language } = useLanguage();
    const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'INTENSIVE' | 'EVENING'>('INTENSIVE');

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await fetch(`/api/course-schedules?lang=${language}`);
                const data = await response.json();
                setSchedules(data);
            } catch (error) {
                console.error('Failed to fetch schedules:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [language]);

    const intensiveCourses = schedules.filter(s => s.type === 'INTENSIVE');
    const eveningCourses = schedules.filter(s => s.type === 'EVENING');

    const renderTable = (title: string, data: CourseSchedule[]) => (
        <div className="flex flex-col w-full animate-fade-in">
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">{t.kurstermine.columns.date}</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">{t.kurstermine.columns.time}</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">{t.kurstermine.columns.abk}</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{t.kurstermine.columns.topics}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, idx) => {
                                const isToday = dayjs(item.date).isSame(dayjs(), 'day');
                                return (
                                    <tr key={item.id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                        <td className="px-6 py-5 text-base font-medium whitespace-nowrap">
                                            {dayjs(item.date).locale(language).format('DD.MM.YYYY')}
                                        </td>
                                        <td className={`px-6 py-5 text-base font-medium whitespace-nowrap ${isToday ? 'text-green-500 font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'text-primary'}`}>
                                            {item.time}
                                        </td>
                                        <td className="px-6 py-5 text-base font-bold opacity-70 whitespace-nowrap">
                                            {item.abbreviation}
                                        </td>
                                        <td className="px-6 py-5 text-base font-medium">
                                            {item.topic}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-base text-muted-foreground italic">
                                    {loading ? t.kurstermine.loading : t.kurstermine.noData}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            
            <div className="min-h-screen pt-24 pb-20 overflow-hidden relative">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-7xl font-serif font-bold italic tracking-tighter uppercase leading-tight">
                                {t.kurstermine.title}<span className="text-primary text-outline ml-3">{t.kurstermine.titleOutline}</span>
                            </h1>
                            <p className="text-base md:text-xl text-muted-foreground leading-relaxed font-light whitespace-nowrap translate-y-2">
                                {t.kurstermine.subtitle}
                            </p>
                        </motion.div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                        <button
                            onClick={() => setActiveTab('INTENSIVE')}
                            className={`
                                relative px-8 py-4 w-full md:w-auto min-w-[200px] text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 border
                                ${activeTab === 'INTENSIVE' 
                                    ? 'bg-primary text-black border-primary shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                                    : 'bg-transparent text-muted-foreground border-white/10 hover:border-primary/50 hover:text-white'
                                }
                            `}
                        >
                            {t.kurstermine.intensive}
                            {activeTab === 'INTENSIVE' && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('EVENING')}
                            className={`
                                relative px-8 py-4 w-full md:w-auto min-w-[200px] text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 border
                                ${activeTab === 'EVENING' 
                                    ? 'bg-[#9333ea] text-white border-[#9333ea] shadow-[0_0_30px_rgba(147,51,234,0.3)]' 
                                    : 'bg-transparent text-muted-foreground border-white/10 hover:border-[#9333ea]/50 hover:text-white'
                                }
                            `}
                        >
                            {t.kurstermine.evening}
                            {activeTab === 'EVENING' && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#9333ea] rotate-45" />
                            )}
                        </button>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeTab === 'INTENSIVE' 
                                ? renderTable(t.kurstermine.intensive, intensiveCourses)
                                : renderTable(t.kurstermine.evening, eveningCourses)
                            }
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
