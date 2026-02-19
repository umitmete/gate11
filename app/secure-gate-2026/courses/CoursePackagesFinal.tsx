'use client';

import { useState } from 'react';
import { Trash2, Edit, Plus, Eye, EyeOff, Calendar, CalendarOff, Euro, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CoursePackage {
    id: string;
    title: string;
    tag: string;
    price: string;
    courseType: string;
    features: string;
    isVisible: boolean;
    showDate: boolean;
    showPrice: boolean;
    order: number;
}

export default function CoursePackagesFinal({ packages }: { packages: CoursePackage[] }) {
    const router = useRouter();

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Möchten Sie das Paket "${title}" wirklich löschen?`)) return;

        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, { method: 'DELETE' });
            if (res.ok) router.refresh();
            else alert('Löschen fehlgeschlagen!');
        } catch (error) {
            console.error(error);
            alert('Ein Fehler ist aufgetreten!');
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const result = await res.json();



                router.refresh();
            } else {
                const err = await res.text();
                alert(`HATA: Güncelleme başarısız.\nSunucu Yanıtı: ${err}`);
            }
        } catch (error) {
            console.error(error);
            alert('HATA: Bağlantı sorunu veya sunucu hatası.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic">Fahrakademie</h2>
                    <p className="text-muted-foreground font-light text-sm md:text-base mt-2">Verwalten Sie die Kurspakete der Fahrakademie</p>
                </div>
                <Link
                    href="/secure-gate-2026/courses/new"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" /> Neues Paket
                </Link>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                    // Güvenli özellik ayrıştırma
                    let features = [];
                    try {
                        features = pkg.features ? JSON.parse(pkg.features) : [];
                    } catch (e) { features = []; }

                    // Değerleri güvenli hale getirme
                    const isVisible = pkg.isVisible === true || pkg.isVisible === 1 as any;
                    const showDate = pkg.showDate === true || pkg.showDate === 1 as any;
                    const showPrice = pkg.showPrice === true || pkg.showPrice === 1 as any;

                    return (
                        <div
                            key={pkg.id}
                            className={`bg-[#0a0a0a] border p-6 transition-all ${isVisible
                                ? 'border-white/10 hover:border-[#D4AF37]/30'
                                : 'border-red-500/20 opacity-50'
                                }`}
                        >
                            {/* Title & Price */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-serif text-white">{pkg.title}</h3>
                                    <p className="text-xs text-[#D4AF37] uppercase tracking-widest mt-1">{pkg.tag}</p>
                                </div>
                                <div className="text-2xl font-serif text-[#D4AF37]">{pkg.price}</div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-2 mb-4">
                                {features.slice(0, 3).map((feature: string, idx: number) => (
                                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span className="text-[#D4AF37]">✓</span> {feature}
                                    </div>
                                ))}
                                {features.length > 3 && (
                                    <div className="text-xs text-muted-foreground/50 italic">
                                        +{features.length - 3} weitere...
                                    </div>
                                )}
                            </div>

                            {/* Controls: Sortierung & Icons */}
                            <div className="flex items-end gap-3 mb-4">
                                {/* Sortierung Dropdown */}
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                                        Sortierung
                                    </label>
                                    <select
                                        value={pkg.order}
                                        onChange={(e) => handleUpdate(pkg.id, { order: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 p-2 text-white text-sm focus:border-[#D4AF37] outline-none h-[38px]"
                                    >
                                        {Array.from({ length: packages.length }, (_, i) => i).map((orderNum) => (
                                            <option key={orderNum} value={orderNum} className="bg-[#0a0a0a] text-white">
                                                Position {orderNum + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tarih Butonu (TEK ADET) */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 opacity-0">
                                        Date
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdate(pkg.id, { showDate: !showDate })}
                                        className={`flex items-center justify-center border transition-all h-[38px] w-[38px] ${showDate
                                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-white hover:border-white'
                                            : 'bg-transparent text-muted-foreground border-white/10 hover:text-white hover:border-white'
                                            }`}
                                        title={showDate ? 'Termine ausblenden' : 'Termine einblenden'}
                                    >
                                        {showDate ? <Calendar className="w-4 h-4" /> : <CalendarOff className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Fiyat Butonu (TEK ADET) */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 opacity-0">
                                        Price
                                    </label>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdate(pkg.id, { showPrice: !showPrice });
                                        }}
                                        className={`relative z-10 flex items-center justify-center border transition-all h-[38px] w-[38px] ${showPrice
                                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-white hover:border-white'
                                            : 'bg-transparent text-muted-foreground border-white/10 hover:text-white hover:border-white'
                                            }`}
                                        title={showPrice ? 'Preis ausblenden' : 'Preis einblenden'}
                                    >
                                        <Euro className={`w-4 h-4 ${showPrice ? '' : 'opacity-30'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleUpdate(pkg.id, { isVisible: !isVisible })}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <Link
                                    href={`/secure-gate-2026/courses/${pkg.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    <Edit className="w-4 h-4" /> Bearbeiten
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(pkg.id, pkg.title)}
                                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {packages.length === 0 && (
                <div className="p-20 text-center bg-[#0a0a0a] text-muted-foreground">
                    Keine Pakete gefunden.
                </div>
            )}
        </div>
    );
}
