'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Eye, EyeOff, Calendar, CalendarOff, Euro } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PackageCategories from './PackageCategories';

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
    categoryId: string | null;
}

interface Category {
    id: string;
    name: string;
    order: number;
}

export default function CoursePackagesFinal({ packages: initialPackages }: { packages: CoursePackage[] }) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [packages, setPackages] = useState<CoursePackage[]>(initialPackages);

    useEffect(() => {
        fetch('/api/admin/package-categories')
            .then(r => r.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Möchten Sie das Paket "${title}" wirklich löschen?`)) return;
        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPackages(prev => prev.filter(p => p.id !== id));
                router.refresh();
            }
            else alert('Löschen fehlgeschlagen!');
        } catch (error) {
            console.error(error);
            alert('Ein Fehler ist aufgetreten!');
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        // Optimistic UI update
        setPackages(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, ...data }
                    : p
            )
        );

        try {
            const res = await fetch(`/api/admin/course-packages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                router.refresh();
            } else {
                const err = await res.text();
                alert(`HATA: Güncelleme başarısız.\nSunucu Yanıtı: ${err}`);
                setPackages(initialPackages);
            }
        } catch (error) {
            console.error(error);
            alert('HATA: Bağlantı sorunu veya sunucu hatası.');
            setPackages(initialPackages);
        }
    };

    const handleToggleCategory = async (packageId: string, currentIds: string[], targetId: string) => {
        let newIds: string[];
        if (currentIds.includes(targetId)) {
            newIds = currentIds.filter(id => id !== targetId);
        } else {
            newIds = [...currentIds, targetId];
        }

        // Optimistic UI update for instant feedback
        setPackages(prev =>
            prev.map(p =>
                p.id === packageId
                    ? { ...p, categoryIds: JSON.stringify(newIds) } as any
                    : p
            )
        );

        try {
            await fetch(`/api/admin/course-packages/${packageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryIds: JSON.stringify(newIds) }),
            });
        } catch (error) {
            console.error('Error updating categories:', error);
            setPackages(initialPackages);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white italic">Fahrakademie</h2>
                    <p className="text-muted-foreground font-light text-sm md:text-base mt-2">Verwalten Sie die Kurspakete der Fahrakademie</p>
                </div>
            </div>

            {/* Package Categories / Tabs Management */}
            <PackageCategories />

            {/* Neues Paket Button – right aligned, below categories */}
            <div className="flex justify-end">
                <Link
                    href="/secure-gate-2026/courses/new"
                    className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all text-sm"
                >
                    <Plus className="w-4 h-4" /> Neues Paket
                </Link>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                    let features = [];
                    try {
                        features = pkg.features ? JSON.parse(pkg.features) : [];
                    } catch (e) { features = []; }

                    const isVisible = pkg.isVisible === true || pkg.isVisible === 1 as any;
                    const showDate = pkg.showDate === true || pkg.showDate === 1 as any;
                    const showPrice = pkg.showPrice === true || pkg.showPrice === 1 as any;

                    let selectedCategoryIds: string[] = [];
                    try {
                        selectedCategoryIds = (pkg as any).categoryIds ? JSON.parse((pkg as any).categoryIds) : [];
                    } catch (e) {
                        if (pkg.categoryId) {
                            selectedCategoryIds = [pkg.categoryId];
                        }
                    }

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

                            {/* Controls Row 1: Sortierung + icon buttons */}
                            <div className="flex items-end gap-3 mb-3">
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

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 opacity-0">Date</label>
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

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 opacity-0">Price</label>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdate(pkg.id, { showPrice: !showPrice })}
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

                             {/* Controls Row 2: Kategori */}
                             <div className="mb-4">
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                                     Kategorien / Filter-Tabs
                                 </label>
                                 <div className="flex flex-wrap gap-1.5 p-2 bg-white/5 border border-white/10 rounded min-h-[38px]">
                                     {categories.length === 0 ? (
                                         <span className="text-xs text-gray-500 italic">Keine Kategorien vorhanden.</span>
                                     ) : (
                                         categories.map((cat) => {
                                             const isSelected = selectedCategoryIds.includes(cat.id);
                                             return (
                                                 <button
                                                     key={cat.id}
                                                     type="button"
                                                     onClick={() => handleToggleCategory(pkg.id, selectedCategoryIds, cat.id)}
                                                     className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                                         isSelected
                                                             ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50'
                                                             : 'bg-transparent text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/15'
                                                     }`}
                                                 >
                                                     {cat.name}
                                                 </button>
                                             );
                                         })
                                     )}
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
