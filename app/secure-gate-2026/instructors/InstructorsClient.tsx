'use client';

import { useState, useRef } from 'react';
import { Trash2, Edit, Plus, Eye, EyeOff, User, Image as ImageIcon, X, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Instructor {
    id: string;
    name: string;
    image?: string;
    roleDe: string;
    bioDe: string;
    license: string;
    isVisible: boolean;
    order: number;
}

export default function InstructorsClient({ initialInstructors }: { initialInstructors: Instructor[] }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<Instructor>>({
        name: '',
        image: '',
        roleDe: '',
        bioDe: '',
        license: '',
        order: 0,
        isVisible: true
    });

    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const max_size = 512;

                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas toBlob failed'));
                    }, 'image/jpeg', 0.8);
                };
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // İsteğe bağlı olarak yeniden boyutlandır
            const resizedBlob = await resizeImage(file);
            const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' });

            const uploadData = new FormData();
            uploadData.append('file', resizedFile);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert('Upload fehlgeschlagen');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Upload hatası oluştu');
        } finally {
            setIsUploading(false);
        }
    };

    const handleOpenModal = (instructor?: Instructor) => {
        if (instructor) {
            setEditingInstructor(instructor);
            setFormData(instructor);
        } else {
            setEditingInstructor(null);
            setFormData({
                name: '',
                image: '',
                roleDe: '',
                bioDe: '',
                license: '',
                order: initialInstructors.length,
                isVisible: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingInstructor
                ? `/api/admin/instructors/${editingInstructor.id}`
                : '/api/admin/instructors';

            const method = editingInstructor ? 'PATCH' : 'POST';

            // autoTranslate her zaman true olarak gönderiliyor
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, autoTranslate: true }),
            });

            if (res.ok) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                const errData = await res.json();
                alert(`Fehler: ${errData.error || 'Speichern fehlgeschlagen'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Ein Fehler ist aufgetreten.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`${name} gerçekten silinsin mi?`)) return;
        try {
            const res = await fetch(`/api/admin/instructors/${id}`, { method: 'DELETE' });
            if (res.ok) router.refresh();
        } catch (error) { alert('Hata!'); }
    };

    const toggleVisibility = async (instructor: Instructor) => {
        try {
            const res = await fetch(`/api/admin/instructors/${instructor.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...instructor, isVisible: !instructor.isVisible }),
            });
            if (res.ok) router.refresh();
        } catch (error) { alert('Hata!'); }
    };

    const handleUpdate = async (instructor: Instructor, updates: Partial<Instructor>) => {
        try {
            const res = await fetch(`/api/admin/instructors/${instructor.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...instructor, ...updates }),
            });
            if (res.ok) router.refresh();
        } catch (error) { alert('Hata!'); }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic">Teamverwaltung</h2>
                    <div className="h-1 w-20 bg-[#D4AF37] mt-2 mx-auto sm:mx-0"></div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" /> Neues Mitglied
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialInstructors.map((inst) => (
                    <div key={inst.id} className="bg-[#0a0a0a] border border-white/5 p-6 relative group hover:border-[#D4AF37]/30 transition-all flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                {inst.image ? (
                                    <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-serif font-bold text-[#D4AF37] italic">
                                        {inst.name.trim().charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toggleVisibility(inst)} className={`p-2 rounded border transition-all ${inst.isVisible ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-muted-foreground'}`}>
                                    {inst.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <button onClick={() => handleOpenModal(inst)} className="p-2 bg-white/5 border border-white/10 text-white hover:border-[#D4AF37] transition-all rounded">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(inst.id, inst.name)} className="p-2 bg-white/5 border border-white/10 text-white hover:border-red-500/50 hover:text-red-500 transition-all rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white mb-1">{inst.name}</h3>
                        <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{inst.roleDe}</p>
                        <p className="text-muted-foreground text-sm font-light line-clamp-3 mb-6 flex-1 italic">"{inst.bioDe}"</p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between">
                            <div className="flex flex-wrap gap-2">
                                {/* License Güvenli Gösterim */}
                                {inst.license && inst.license.split(',').map((l, i) => (
                                    <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 px-2 py-1 bg-white/5 border border-white/5">{l.trim()}</span>
                                ))}
                            </div>

                            <div className="w-24 shrink-0 ml-4">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                                    Sortierung
                                </label>
                                <select
                                    value={inst.order}
                                    onChange={(e) => handleUpdate(inst, { order: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-[#D4AF37]"
                                >
                                    {Array.from({ length: initialInstructors.length }, (_, i) => i).map((orderNum) => (
                                        <option key={orderNum} value={orderNum} className="bg-[#0a0a0a] text-white">
                                            Position {orderNum + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl shadow-2xl overflow-hidden rounded-xl">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                            <h3 className="text-xl font-serif text-white italic">Mitglied Details</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Name (Vollständig)</label>
                                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Foto</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all" placeholder="URL oder Upload &rarr;" />
                                            <ImageIcon className="absolute left-3 top-3.5 text-muted-foreground w-4 h-4" />
                                        </div>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="px-4 py-3 bg-white/5 border border-white/10 text-white hover:border-[#D4AF37] transition-all"
                                            title="Lokal hochladen"
                                        >
                                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> : <Upload className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Rolle / Beruf (Deutsch)</label>
                                <input required value={formData.roleDe} onChange={(e) => setFormData({ ...formData, roleDe: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all" placeholder="z.B. Fahrlehrer" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Biografie (Deutsch)</label>
                                <textarea required rows={4} value={formData.bioDe} onChange={(e) => setFormData({ ...formData, bioDe: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all resize-none" placeholder="Beschreiben Sie die Erfahrung..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Lizenzen</label>
                                <input required value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#D4AF37] placeholder:opacity-30" placeholder="A, B, BE..." />
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-all">Abbrechen</button>
                                <button type="submit" disabled={isLoading || isUploading} className="px-10 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50">
                                    {isLoading ? 'Verarbeitung...' : 'Speichern'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
