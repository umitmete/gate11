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
    titleDe?: string;
    titleEn?: string;
    titleTr?: string;
    tagDe?: string;
    tagEn?: string;
    tagTr?: string;
    featuresDe?: string;
    featuresEn?: string;
    featuresTr?: string;
    isVisible: boolean;
    showDate: boolean;
    showPrice: boolean;
    order: number;
}

export default function CoursePackagesClient({ packages }: { packages: CoursePackage[] }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async (id: string, title: string) => {
        console.log('Silme işlemi başlatıldı:', id, title);
        if (!window.confirm(`Möchten Sie das Paket "${title}" wirklich löschen?`)) return;

        try {
            console.log('API çağrısı yapılıyor...');
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'DELETE',
            });
            console.log('API yanıtı:', res.status);

            if (res.ok) {
                console.log('Silme başarılı, sayfa yenileniyor...');
                router.refresh();
            } else {
                console.error('Silme başarısız:', await res.text());
                alert('Löschen fehlgeschlagen!');
            }
        } catch (error) {
            console.error('Silme hatası:', error);
            alert('Ein Fehler ist aufgetreten!');
        }
    };

    const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisible: !currentVisibility }),
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            alert('Sichtbarkeit konnte nicht geändert werden!');
        }
    };

    const handleOrderChange = async (id: string, newOrder: number) => {
        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder }),
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Order change error:', error);
        }
    };

    const handleToggleShowDate = async (id: string, currentShowDate: boolean) => {
        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ showDate: !currentShowDate }),
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            alert('Datum-Status konnte nicht geändert werden!');
        }
    };

    const handleToggleShowPrice = async (id: string, currentShowPrice: boolean) => {
        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ showPrice: !currentShowPrice }),
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            alert('Preis-Status konnte nicht geändert werden!');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-serif text-white italic">Fahrakademie</h2>
                    <p className="text-muted-foreground font-light mt-2">Verwalten Sie die Kurspakete der Fahrakademie</p>
                </div>
                <div className="flex items-center gap-4">

                    <Link
                        href="/admin/Fahrakademie/new"
                        className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all"
                    >
                        <Plus className="w-5 h-5" /> Neues Paket
                    </Link>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                    const features = JSON.parse(pkg.features || '[]');

                    return (
                        <div
                            key={pkg.id}
                            className={`bg-[#0a0a0a] border p-6 transition-all ${pkg.isVisible
                                ? 'border-white/10 hover:border-[#D4AF37]/30'
                                : 'border-red-500/20 opacity-50'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-serif text-white">{pkg.title}</h3>
                                    <p className="text-xs text-[#D4AF37] uppercase tracking-widest mt-1">{pkg.tag}</p>
                                </div>
                                <div className="text-2xl font-serif text-[#D4AF37]">{pkg.price}</div>
                            </div>

                            {/* Features */}
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

                            {/* Order and Show Date Selection */}
                            <div className="flex items-end gap-3 mb-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                                        Sortierung
                                    </label>
                                    <select
                                        value={pkg.order}
                                        onChange={(e) => handleOrderChange(pkg.id, parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 p-2 text-white text-sm focus:border-[#D4AF37] outline-none h-[38px]"
                                    >
                                        {Array.from({ length: packages.length }, (_, i) => i).map((orderNum) => (
                                            <option key={orderNum} value={orderNum} className="bg-[#0a0a0a] text-white">
                                                Position {orderNum + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 opacity-0">
                                        Date
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleShowDate(pkg.id, pkg.showDate)}
                                        className={`flex items-center justify-center border transition-all h-[38px] w-[38px] ${pkg.showDate
                                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-white hover:border-white'
                                            : 'bg-transparent text-muted-foreground border-white/10 hover:text-white hover:border-white'
                                            }`}
                                        title={pkg.showDate ? 'Termine ausblenden' : 'Termine einblenden'}
                                    >
                                        {pkg.showDate ? <Calendar className="w-4 h-4" /> : <CalendarOff className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* DUBLİKE OLAN "Date" BÖLÜMÜ KALDIRILDI */}

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 opacity-0">
                                        Price
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleShowPrice(pkg.id, pkg.showPrice)}
                                        className={`flex items-center justify-center border transition-all h-[38px] w-[38px] ${pkg.showPrice
                                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-white hover:border-white'
                                            : 'bg-transparent text-muted-foreground border-white/10 hover:text-white hover:border-white'
                                            }`}
                                        title={pkg.showPrice ? 'Preis ausblenden' : 'Preis einblenden'}
                                    >
                                        {pkg.showPrice ? <Euro className="w-4 h-4" /> : <DollarSign className="w-4 h-4 opacity-30" />}
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleToggleVisibility(pkg.id, pkg.isVisible)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all"
                                    title={pkg.isVisible ? 'Verbergen' : 'Anzeigen'}
                                >
                                    {pkg.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <Link
                                    href={`/admin/Fahrakademie/${pkg.id}`}
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
                <div className="p-20 text-center bg-[#0a0a0a] border border-white/5">
                    <p className="text-muted-foreground font-serif italic text-xl">
                        Noch keine Kurspakete hinzugefügt.
                    </p>
                </div>
            )}
        </div>
    );
}
