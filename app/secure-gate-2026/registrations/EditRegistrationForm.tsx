'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Loader2, Save } from 'lucide-react';
import dayjs from '@/lib/dayjs';

interface EditRegistrationFormProps {
    registration: any;
}

export default function EditRegistrationForm({ registration }: EditRegistrationFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        salutation: registration.salutation || '',
        firstName: registration.firstName || '',
        lastName: registration.lastName || '',
        email: registration.email || '',
        phone: registration.phone || '',
        birthDate: registration.birthDate ? dayjs(registration.birthDate).format('YYYY-MM-DD') : '',
        street: registration.street || '',
        zipCode: registration.zipCode || '',
        city: registration.city || '',
        courseType: registration.courseType || '',
        licenseClass: registration.licenseClass || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/registrations/${registration.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    birthDate: new Date(formData.birthDate).toISOString(), // Ensure ISO format
                }),
            });

            if (res.ok) {
                setIsOpen(false);
                router.refresh();
            } else {
                alert('Fehler beim Aktualisieren der Daten.');
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
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20"
                title="Bearbeiten"
            >
                <Pencil className="w-3 h-3" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isLoading && setIsOpen(false)} />

                    <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Pencil className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-serif text-white italic">Daten Bearbeiten</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Anrede</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.salutation}
                                        onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                                    >
                                        <option value="Herr" className="bg-[#0a0a0a] text-white">Herr</option>
                                        <option value="Frau" className="bg-[#0a0a0a] text-white">Frau</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Vorname</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nachname</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-Mail</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Telefon</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Straße</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PLZ</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stadt</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Geburtsdatum</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm dark:[color-scheme:dark]"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kurs</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.courseType}
                                        onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Klasse</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        value={formData.licenseClass}
                                        onChange={(e) => setFormData({ ...formData, licenseClass: e.target.value })}
                                    >
                                        {['B', 'A', 'L17', 'B+A'].map((cls) => (
                                            <option key={cls} value={cls} className="bg-[#0a0a0a] text-white">{cls}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full py-4 bg-blue-500 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Speichern...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Änderungen Speichern
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
