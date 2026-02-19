'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from 'lucide-react';

interface CourseFormProps {
    initialData?: any;
    isEdit?: boolean;
    totalPackages?: number;
}

export default function CoursePackageForm({ initialData, isEdit = false, totalPackages = 1 }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state - Admin-Panel ist jetzt nur auf Deutsch
    const [formData, setFormData] = useState({
        titleDe: initialData?.titleDe || initialData?.title || '',
        tagDe: initialData?.tagDe || initialData?.tag || '',
        price: initialData?.price || '€ ',
        courseType: initialData?.courseType || 'DAY',
        isVisible: initialData?.isVisible ?? true,
        order: initialData?.order ?? totalPackages, // Yeni paket için en son pozisyon
        autoTranslate: true // Varsayılan olarak otomatik çeviri açık
    });

    const [featuresDe, setFeaturesDe] = useState<string[]>(
        initialData?.featuresDe ? JSON.parse(initialData.featuresDe) :
            (initialData?.features ? JSON.parse(initialData.features) : [''])
    );

    const addFeature = () => setFeaturesDe([...featuresDe, '']);
    const removeFeature = (index: number) => setFeaturesDe(featuresDe.filter((_, i) => i !== index));
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...featuresDe];
        newFeatures[index] = value;
        setFeaturesDe(newFeatures);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Wir senden nur deutsche Daten, das Backend übernimmt die Übersetzung, wenn autoTranslate aktiviert ist
            const payload = {
                ...formData,
                title: formData.titleDe, // Legacy-Kompatibilität
                tag: formData.tagDe,     // Legacy-Kompatibilität
                features: JSON.stringify(featuresDe.filter(f => f.trim())),
                featuresDe: JSON.stringify(featuresDe.filter(f => f.trim())),
            };

            const url = isEdit
                ? `/api/admin/course-packages/${initialData.id}`
                : '/api/admin/course-packages';

            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/secure-gate-2026/courses');
                router.refresh();
            } else {
                alert('Speichern fehlgeschlagen!');
            }
        } catch (error) {
            alert('Ein Fehler ist aufgetreten!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <a
                        href="/secure-gate-2026/courses"
                        className="p-2 hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                    </a>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-serif text-white italic">
                            {isEdit ? 'Paket bearbeiten' : 'Neues Paket hinzufügen'}
                        </h2>
                        <p className="text-sm text-muted-foreground font-light mt-1 md:mt-2">
                            Kursdetails auf Deutsch eingeben
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 w-full md:w-auto text-xs md:text-sm"
                >
                    {loading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Save className="w-4 h-4 md:w-5 md:h-5" />}
                    {loading ? 'Speichern...' : 'Speichern'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Linke Spalte */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Kursdetails */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-4 md:p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Titel</label>
                                <input
                                    type="text"
                                    value={formData.titleDe}
                                    onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#D4AF37] outline-none text-sm"
                                    placeholder="B-PAKET"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Tag/Slogan</label>
                                <input
                                    type="text"
                                    value={formData.tagDe}
                                    onChange={(e) => setFormData({ ...formData, tagDe: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#D4AF37] outline-none text-sm"
                                    placeholder="Klassik"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Leistungen / Features</label>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="text-xs text-[#D4AF37] hover:text-white flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Hinzufügen
                                </button>
                            </div>
                            <div className="space-y-3">
                                {featuresDe.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(idx, e.target.value)}
                                            className="flex-1 bg-white/5 border border-white/10 p-2 md:p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                                            placeholder="z.B. 18 Fahrstunden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rechte Spalte */}
                <div className="space-y-6">
                    {/* Preis */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-4 md:p-6">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-3">Preis</label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#D4AF37] outline-none text-sm"
                            placeholder="Leer lassen für 'Preis auf Anfrage'"
                        />
                    </div>

                    {/* Sortierung */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-4 md:p-6">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-3">Sortierung</label>
                        <select
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-[#D4AF37] outline-none"
                        >
                            {Array.from({ length: totalPackages + 1 }, (_, i) => i).map((orderNum) => (
                                <option key={orderNum} value={orderNum} className="bg-[#0a0a0a] text-white">
                                    Position {orderNum + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sichtbarkeit */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-4 md:p-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.isVisible}
                                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                className="w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-[#D4AF37]"
                            />
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Öffentlich sichtbar</div>
                                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Auf Website anzeigen</div>
                            </div>
                        </label>
                    </div>

                    {/* Otomatik Çeviri */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-4 md:p-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.autoTranslate}
                                onChange={(e) => setFormData({ ...formData, autoTranslate: e.target.checked })}
                                className="w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-[#D4AF37]"
                            />
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Automatische Übersetzung</div>
                                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">In andere Sprachen übersetzen</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}
