'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Check, X, Clock, BookOpen, Hash, Eye, EyeOff } from 'lucide-react';
import dayjs from '@/lib/dayjs';

interface CourseSchedule {
    id: string;
    date: string;
    time: string;
    abbreviation: string;
    topic: string;
    type: 'INTENSIVE' | 'EVENING';
    isVisible: boolean;
}

export default function AdminKursterminePage() {
    const [mounted, setMounted] = useState(false);
    const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState<{
        date: string;
        time: string;
        abbreviation: string;
        topic: string;
        type: 'INTENSIVE' | 'EVENING' | null;
    }>({
        date: '', // Başlangıçta boş
        time: '17:00', // Default to 17:00
        abbreviation: '',
        topic: '',
        type: null, // Başlangıçta seçili değil
    });

    const [filter, setFilter] = useState<'ALL' | 'INTENSIVE' | 'EVENING'>('ALL');

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/course-schedules');
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.type) {
            alert('Bitte wählen Sie einen Kurstyp (Intensiv oder Abendkurs) aus.');
            return;
        }

        // Set default time if empty (redundant safety check)
        const finalData = {
            ...formData,
            time: formData.time || '17:00'
        };

        try {
            if (editingId) {
                // Update Logic
                const response = await fetch(`/api/admin/course-schedules/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData),
                });
                if (response.ok) {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({
                        date: dayjs().format('YYYY-MM-DD'),
                        time: '17:00',
                        abbreviation: '',
                        topic: '',
                        type: null,
                    });
                    fetchSchedules();
                }
            } else {
                // Create Logic
                const response = await fetch('/api/admin/course-schedules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData),
                });
                if (response.ok) {
                    setIsAdding(false);
                    setFormData({
                        date: dayjs().format('YYYY-MM-DD'),
                        time: '17:00',
                        abbreviation: '',
                        topic: '',
                        type: null,
                    });
                    fetchSchedules();
                }
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    // ... handleDelete ve handleUpdate ...
    const handleDelete = async (id: string) => {
        if (!confirm('Möchten Sie diesen Termin wirklich löschen?')) return;
        try {
            const response = await fetch(`/api/admin/course-schedules/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) fetchSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const handleUpdate = async (id: string, data: Partial<CourseSchedule>) => {
        try {
            const response = await fetch(`/api/admin/course-schedules/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                // setEditingId(null); // Buna gerek yok, sadece visibility toggle için
                fetchSchedules();
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    };

    const handleEditClick = (item: CourseSchedule) => {
        setFormData({
            date: item.date,
            time: item.time,
            abbreviation: item.abbreviation,
            topic: item.topic,
            type: item.type,
        });
        setEditingId(item.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setMounted(true);
        setFormData(prev => ({ ...prev, date: dayjs().format('YYYY-MM-DD') }));
        fetchSchedules();
    }, []);

    if (!mounted) return null;

    const filteredSchedules = schedules.filter(item => {
        if (filter === 'ALL') return true;
        return item.type === filter;
    });

    const sortedSchedules = [...filteredSchedules].sort((a, b) => {
        // Tarihe göre sırala
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        if (!dateA.isSame(dateB)) {
            return dateA.isAfter(dateB) ? 1 : -1;
        }
        // Tarihler aynıysa saate göre sırala
        return a.time.localeCompare(b.time);
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic">Kurstermine Verwalten</h2>
                    <p className="text-muted-foreground font-light text-sm md:text-base">Intensiv- und Abendkurse verwalten.</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(!isAdding);
                        if (isAdding) {
                            setEditingId(null);
                            setFormData({
                                date: dayjs().format('YYYY-MM-DD'),
                                time: '17:00',
                                abbreviation: '',
                                topic: '',
                                type: null,
                            });
                        }
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all w-full sm:w-auto"
                >
                    {isAdding ? <X size={16} /> : <Plus size={16} />}
                    {isAdding ? 'Abbrechen' : 'Neuer Termin'}
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${filter === 'ALL'
                            ? 'bg-white text-black'
                            : 'text-muted-foreground hover:text-white bg-white/5'
                        }`}
                >
                    Alle
                </button>
                <button
                    onClick={() => setFilter('INTENSIVE')}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${filter === 'INTENSIVE'
                            ? 'bg-[#D4AF37] text-black'
                            : 'text-muted-foreground hover:text-[#D4AF37] bg-white/5'
                        }`}
                >
                    Intensivkurs
                </button>
                <button
                    onClick={() => setFilter('EVENING')}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${filter === 'EVENING'
                            ? 'bg-[#9333ea] text-white'
                            : 'text-muted-foreground hover:text-[#9333ea] bg-white/5'
                        }`}
                >
                    Abendkurs
                </button>
            </div>

            {isAdding && (
                <div className="bg-[#0a0a0a] border border-primary/20 p-8 space-y-6">
                    <h3 className="text-xl font-serif text-white italic">
                        {editingId ? 'Termin bearbeiten' : 'Neuen Termin hinzufügen'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* KURSTYP SELECTION (TOP) */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'INTENSIVE' })}
                                className={`
                                    py-3 px-4 border flex items-center justify-center transition-all group
                                    ${formData.type === 'INTENSIVE'
                                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                        : 'bg-white/5 border-white/10 hover:border-[#D4AF37] hover:bg-white/10 text-muted-foreground hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-xs uppercase tracking-[0.2em] font-bold">Intensivkurs</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'EVENING' })}
                                className={`
                                    py-3 px-4 border flex items-center justify-center transition-all group
                                    ${formData.type === 'EVENING'
                                        ? 'bg-[#9333ea] text-white border-[#9333ea]'
                                        : 'bg-white/5 border-white/10 hover:border-[#9333ea] hover:bg-white/10 text-muted-foreground hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-xs uppercase tracking-[0.2em] font-bold">Abendkurs</span>
                            </button>
                        </div>

                        {/* REST OF THE FORM */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Datum</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 px-4 h-12 text-sm focus:border-primary outline-none transition-all"
                                    required
                                    max="9999-12-31"
                                />
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Uhrzeit</label>

                                {/* Scrubbable Time Input Container */}
                                <TimeInput
                                    value={formData.time}
                                    onChange={(val) => setFormData({ ...formData, time: val })}
                                />

                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Abk. (z.B. B1)</label>
                                <input
                                    type="text"
                                    value={formData.abbreviation}
                                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 px-4 h-12 text-sm focus:border-primary outline-none transition-all"
                                    placeholder="B1"
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Themen</label>
                                <input
                                    type="text"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 px-4 h-12 text-sm focus:border-primary outline-none transition-all"
                                    placeholder="Thema 1 & 2"
                                    required
                                />
                            </div>
                            {/* Eski Select Box Kaldırıldı */}
                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all"
                                >
                                    {editingId ? 'Aktualisieren' : 'Speichern'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-20 text-center text-muted-foreground italic">Wird geladen...</div>
                ) : sortedSchedules.length > 0 ? (
                    sortedSchedules.map((item) => {
                        const date = dayjs(item.date);
                        const isToday = date.isSame(dayjs(), 'day');
                        const isPast = date.isBefore(dayjs(), 'day');
                        // isFuture is implicitly logic else

                        let borderColor = 'border-white/5';
                        let statusColor = 'text-muted-foreground';

                        if (isToday) {
                            borderColor = 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]';
                            statusColor = 'text-green-500';
                        } else if (isPast) {
                            borderColor = 'border-red-500/30 bg-red-500/[0.02]';
                            statusColor = 'text-red-500';
                        } else {
                            borderColor = 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
                            statusColor = 'text-blue-500';
                        }

                        return (
                            <div key={item.id} className={`bg-[#0a0a0a] border ${borderColor} p-6 group transition-all flex flex-col md:flex-row items-center gap-6 ${!item.isVisible ? 'opacity-50' : ''}`}>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
                                    <div className="space-y-1">
                                        <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold ${statusColor}`}>
                                            <Calendar size={10} className="currentColor" /> Datum
                                        </div>
                                        <div className={`text-sm ${isToday ? 'font-bold text-white' : ''} ${isPast ? 'text-muted-foreground/50' : ''}`}>
                                            {dayjs(item.date).format('DD.MM.YYYY')}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                            <Clock size={10} className="text-primary" /> Uhrzeit
                                        </div>
                                        <div className="text-sm">{item.time}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                            <Hash size={10} className="text-primary" /> Abk.
                                        </div>
                                        <div className="text-sm font-bold text-primary">{item.abbreviation}</div>
                                    </div>
                                    <div className="space-y-1 lg:col-span-1">
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                            <BookOpen size={10} className="text-primary" /> Typ
                                        </div>
                                        <div className="text-[10px] font-black">{item.type === 'INTENSIVE' ? 'INTENSIV' : 'ABEND'}</div>
                                    </div>
                                    <div className="space-y-1 md:col-span-4 lg:col-span-1">
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                            Themen
                                        </div>
                                        <div className="text-sm font-medium">{item.topic}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleUpdate(item.id, { isVisible: !item.isVisible })}
                                        className={`p-2 transition-colors ${item.isVisible ? 'text-white hover:text-white/80' : 'text-white/30 hover:text-white'}`}
                                        title={item.isVisible ? 'Sichtbar (Verstecken)' : 'Versteckt (Anzeigen)'}
                                    >
                                        {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                                        title="Bearbeiten"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                        title="Löschen"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-20 text-center bg-[#0a0a0a] border border-white/5 text-muted-foreground italic">
                        Keine Termine gefunden. Fügen Sie einen neuen hinzu.
                    </div>
                )}
            </div>
        </div>
    );
}

function TimeInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const showEndTime = value.includes(' - ');
    const parts = value.split(' - ');
    const startTime = parts[0] || '17:00';
    const endTime = parts[1] || '';

    return (
        <div className="relative w-full">
            <div className="w-full bg-white/5 border border-white/10 px-4 h-12 flex items-center gap-2 transition-all hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary relative group">
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                        const newStart = e.target.value;
                        onChange(endTime ? `${newStart} - ${endTime}` : newStart);
                    }}
                    className="bg-transparent text-sm font-bold text-white outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
                />

                {showEndTime && (
                    <>
                        <span className="text-muted-foreground">-</span>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => {
                                const newEnd = e.target.value;
                                onChange(`${startTime} - ${newEnd}`);
                            }}
                            className="bg-transparent text-sm font-bold text-white outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </>
                )}

                <button
                    type="button"
                    onClick={() => {
                        if (showEndTime) {
                            onChange(startTime);
                        } else {
                            onChange(`${startTime} - 19:00`);
                        }
                    }}
                    className={`ml-auto transition-colors flex items-center justify-center w-8 h-8 -mr-2 ${showEndTime ? 'text-muted-foreground hover:text-red-500' : 'text-muted-foreground hover:text-white'}`}
                    title={showEndTime ? "Endzeit entfernen" : "Endzeit hinzufügen"}
                >
                    {showEndTime ? <X size={16} /> : <Plus size={16} />}
                </button>
            </div>
        </div>
    );
}