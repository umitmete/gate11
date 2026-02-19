'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, X, Calendar, Loader2, Trash2 } from 'lucide-react';
import dayjs from '@/lib/dayjs';

interface EditPlanFormProps {
    plan: {
        id: string;
        title: string;
        description: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    };
}

export default function EditPlanForm({ plan }: EditPlanFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: plan.title,
        description: plan.description || '',
        startDate: dayjs(plan.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(plan.endDate).format('YYYY-MM-DD'),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Kurs tipini başlıktan otomatik algıla
            const courseType = formData.title.includes('(Abend)') ? 'NIGHT' : 'DAY';

            const res = await fetch(`/api/plans/${plan.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    courseType, // courseType'ı ekle
                }),
            });

            if (res.ok) {
                setIsOpen(false);
                router.refresh();
            } else {
                alert('Plan konnte nicht aktualisiert werden.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Möchten Sie diesen Plan wirklich löschen?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/plans/${plan.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setIsOpen(false);
                router.refresh();
            } else {
                alert('Plan konnte nicht gelöscht werden.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37]/20 pb-1 cursor-pointer hover:text-white hover:border-white transition-all"
            >
                Bearbeiten
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isLoading && setIsOpen(false)} />

                    <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading || isDeleting}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="flex items-center gap-4 mb-6 md:mb-8 pr-8">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                                <Edit className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-xl md:text-3xl font-serif text-white italic">Plan Bearbeiten</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Titel / Kurs Typ</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-sm md:text-base text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Startdatum</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-sm md:text-base text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Enddatum</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-sm md:text-base text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Notizen (Optional)</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-sm md:text-base text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    disabled={isLoading || isDeleting}
                                    type="submit"
                                    className="flex-1 py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.3em] text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Verarbeitung...
                                        </>
                                    ) : 'Änderungen Speichern'}
                                </button>

                                <button
                                    type="button"
                                    disabled={isLoading || isDeleting}
                                    onClick={handleDelete}
                                    className="w-full md:w-auto px-6 py-4 md:py-5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-[0.3em] text-xs hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span className="md:hidden">Löschen</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
