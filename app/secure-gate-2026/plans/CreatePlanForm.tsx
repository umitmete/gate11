'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Calendar, Loader2 } from 'lucide-react';

interface CreatePlanFormProps {
    availableCourses: { title: string, courseType: string }[];
}

export default function CreatePlanForm({ availableCourses }: CreatePlanFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        courseType: 'DAY',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsOpen(false);
                setFormData({ title: '', description: '', startDate: '', endDate: '', courseType: 'DAY' });
                setShowCustomInput(false);
                router.refresh();
            } else {
                alert('Kurs konnte nicht erstellt werden.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-[#D4AF37]/10 w-full sm:w-auto"
            >
                <Plus className="w-4 h-4" /> Neuen Kurs Hinzufügen
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isLoading && setIsOpen(false)} />

                    <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="flex items-center gap-4 mb-6 md:mb-8 pr-8">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                                <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-xl md:text-3xl font-serif text-white italic">Neuen Kurs Hinzufügen</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            {/* Kurs Türü Seçimi (Cascading için ilk adım) */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Kurs Name</label>

                                {!showCustomInput ? (
                                    <div className="space-y-3">
                                        <select
                                            required
                                            className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-sm md:text-base text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        >
                                            <option value="" className="bg-[#0a0a0a]">
                                                Kurs wählen...
                                            </option>
                                            {availableCourses.length > 0 ? (
                                                availableCourses.map((course) => (
                                                    <option key={course.title} value={course.title} className="bg-[#0a0a0a]">
                                                        {course.title}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled className="bg-[#0a0a0a] text-muted-foreground">
                                                    Keine Pakete gefunden
                                                </option>
                                            )}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomInput(true)}
                                            className="text-xs text-[#D4AF37] hover:text-white transition-colors underline"
                                        >
                                            + Eigenen Kursnamen eingeben
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            required
                                            type="text"
                                            placeholder="z.B. Intensivkurs A"
                                            className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-sm md:text-base text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCustomInput(false);
                                                setFormData({ ...formData, title: '' });
                                            }}
                                            className="text-xs text-[#D4AF37] hover:text-white transition-colors underline"
                                        >
                                            ← Zurück zur Auswahl
                                        </button>
                                    </div>
                                )}
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

                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.3em] text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verarbeitung...
                                    </>
                                ) : 'Kurs Veröffentlichen'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
