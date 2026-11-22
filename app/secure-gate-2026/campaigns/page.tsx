'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Megaphone, Plus, Edit2, Trash2, CheckCircle2, XCircle,
    Eye, Upload, Sparkles, X, AlertCircle, Calendar, ChevronDown
} from 'lucide-react';
import { CampaignModal } from '@/components/campaign/CampaignModal';
import {
    CAMPAIGN_EFFECTS,
    getCampaignEffectMeta,
    resolveCampaignEffect,
    type CampaignEffectId,
} from '@/lib/campaign-effects';

interface Campaign {
    id: string;
    title: string;
    subtitle: string | null;
    badge: string | null;
    description: string;
    imageUrl: string | null;
    buttonText: string | null;
    buttonLink: string | null;
    isActive: boolean;
    showEffects: boolean;
    effectType?: string | null;
    translations?: string | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
}

function toInputDate(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatCampaignDateRange(startDate?: string | null, endDate?: string | null): string {
    const start = formatDisplayDate(startDate);
    const end = formatDisplayDate(endDate);
    if (start && end) return `Zeitraum: ${start} – ${end}`;
    if (start) return `Gültig ab ${start}`;
    if (end) return `Gültig bis ${end}`;
    return 'Zeitraum: Unbegrenzt gültig';
}

const MAX_OPTIMIZED_IMAGE_BYTES = 3.5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), type, quality);
    });
}

async function decodeImageSource(
    file: File
): Promise<{ width: number; height: number; draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; cleanup: () => void }> {
    if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(file);
        return {
            width: bitmap.width,
            height: bitmap.height,
            draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
            cleanup: () => bitmap.close(),
        };
    }

    const objectUrl = URL.createObjectURL(file);
    try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = () => reject(new Error('Image decode failed'));
            el.src = objectUrl;
        });
        return {
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
            cleanup: () => URL.revokeObjectURL(objectUrl),
        };
    } catch (err) {
        URL.revokeObjectURL(objectUrl);
        throw err;
    }
}

async function encodeScaledCanvas(
    source: { width: number; height: number; draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void },
    maxDim: number,
    webpQuality: number,
    jpegQuality: number
): Promise<Blob | null> {
    const scale = Math.min(1, maxDim / Math.max(source.width, source.height));
    const targetW = Math.max(1, Math.round(source.width * scale));
    const targetH = Math.max(1, Math.round(source.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    source.draw(ctx, targetW, targetH);

    let blob = await canvasToBlob(canvas, 'image/webp', webpQuality);
    if (!blob || blob.type !== 'image/webp') {
        blob = await canvasToBlob(canvas, 'image/jpeg', jpegQuality);
    }
    return blob;
}

async function optimizeCampaignImage(file: File): Promise<File> {
    if (file.type === 'image/gif' && file.size <= MAX_OPTIMIZED_IMAGE_BYTES) {
        return file;
    }

    try {
        const source = await decodeImageSource(file);
        try {
            let blob = await encodeScaledCanvas(source, MAX_IMAGE_DIMENSION, 0.84, 0.85);
            if (blob && blob.size > MAX_OPTIMIZED_IMAGE_BYTES) {
                blob = await encodeScaledCanvas(source, 1280, 0.72, 0.72);
            }

            if (!blob || blob.size > MAX_OPTIMIZED_IMAGE_BYTES) {
                throw new Error('Das Bild ist zu groß (max. 4 MB) oder das Format wird nicht unterstützt.');
            }

            const baseName = (file.name || 'campaign').replace(/\.[^/.]+$/, '') || 'campaign';
            const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
            return new File([blob], `${baseName}.${ext}`, { type: blob.type });
        } finally {
            source.cleanup();
        }
    } catch (err) {
        if (file.size <= MAX_OPTIMIZED_IMAGE_BYTES) {
            return file;
        }
        throw err instanceof Error
            ? err
            : new Error('Das Bild ist zu groß (max. 4 MB) oder das Format wird nicht unterstützt.');
    }
}

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [previewCampaigns, setPreviewCampaigns] = useState<Campaign[]>([]);
    const [isEffectPickerOpen, setIsEffectPickerOpen] = useState(false);

    // Form State (German master inputs)
    const [formData, setFormData] = useState({
        badge: '',
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
        isActive: false,
        showEffects: false,
        effectType: 'none' as CampaignEffectId,
    });

    // Local image file selection (uploaded only on save)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/admin/campaigns');
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Failed to load campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        return () => {
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        };
    }, [localPreviewUrl]);

    const activeCampaigns = campaigns.filter(c => c.isActive);
    const liveCampaigns = campaigns.filter(c => {
        if (!c.isActive) return false;
        const now = new Date();
        if (c.startDate && new Date(c.startDate) > now) return false;
        if (c.endDate && new Date(c.endDate) < now) return false;
        return true;
    });

    const resetFileSelection = () => {
        if (localPreviewUrl) {
            URL.revokeObjectURL(localPreviewUrl);
        }
        setSelectedFile(null);
        setLocalPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOpenCreate = () => {
        resetFileSelection();
        setErrorMessage(null);
        setEditingCampaign(null);
        setIsEffectPickerOpen(false);
        setFormData({
            badge: 'SONDERANGEBOT',
            title: '',
            subtitle: '',
            description: '',
            imageUrl: '',
            startDate: '',
            endDate: '',
            isActive: true,
            showEffects: false,
            effectType: 'none',
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (campaign: Campaign) => {
        resetFileSelection();
        setErrorMessage(null);
        setEditingCampaign(campaign);
        setIsEffectPickerOpen(false);
        const resolvedEffect = resolveCampaignEffect(campaign.effectType, campaign.showEffects);
        setFormData({
            badge: campaign.badge || '',
            title: campaign.title,
            subtitle: campaign.subtitle || '',
            description: campaign.description,
            imageUrl: campaign.imageUrl || '',
            startDate: toInputDate(campaign.startDate),
            endDate: toInputDate(campaign.endDate),
            isActive: campaign.isActive,
            showEffects: resolvedEffect !== 'none',
            effectType: resolvedEffect,
        });
        setIsModalOpen(true);
    };

    const handleCloseFormModal = () => {
        resetFileSelection();
        setErrorMessage(null);
        setIsEffectPickerOpen(false);
        setIsModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isSvg = file.type.toLowerCase().includes('svg') || /\.svg$/i.test(file.name);
        const isSupportedImage =
            !isSvg &&
            (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name));

        if (!isSupportedImage) {
            setErrorMessage('Bitte wählen Sie eine gültige Bilddatei aus (JPG, PNG, WEBP).');
            return;
        }

        setErrorMessage(null);
        if (localPreviewUrl) {
            URL.revokeObjectURL(localPreviewUrl);
        }
        setSelectedFile(file);
        setLocalPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        resetFileSelection();
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleToggleActive = async (campaign: Campaign) => {
        const nextState = !campaign.isActive;
        try {
            const res = await fetch(`/api/admin/campaigns/${campaign.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: nextState }),
            });
            if (res.ok) {
                setStatusMessage(nextState ? `"${campaign.title}" wurde aktiviert!` : 'Kampagne wurde deaktiviert.');
                setTimeout(() => setStatusMessage(null), 3000);
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Toggle error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Möchten Sie diese Kampagne und das zugehörige Bild wirklich dauerhaft löschen?')) return;
        try {
            const res = await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setStatusMessage('Kampagne und zugehöriges Bild wurden gelöscht.');
                setTimeout(() => setStatusMessage(null), 3000);
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMessage(null);

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            setErrorMessage('Das Enddatum darf nicht vor dem Startdatum liegen.');
            setSaving(false);
            return;
        }

        let newlyUploadedImageUrl: string | null = null;
        try {
            let finalImageUrl = formData.imageUrl;

            // Upload newly selected file only on save (client-side optimized to stay well below 4.5 MB limit)
            if (selectedFile) {
                const fileToUpload = await optimizeCampaignImage(selectedFile);
                const uploadBody = new FormData();
                uploadBody.append('file', fileToUpload);

                const uploadRes = await fetch('/api/admin/campaigns/upload', {
                    method: 'POST',
                    body: uploadBody,
                });

                if (!uploadRes.ok) {
                    if (uploadRes.status === 413) {
                        throw new Error('Das Bild ist zu groß für den Upload. Bitte wählen Sie ein kleineres Bild.');
                    }
                    const errData = await uploadRes.json().catch(() => ({}));
                    throw new Error(errData.error || 'Bild konnte nicht hochgeladen werden.');
                }

                const uploadData = await uploadRes.json();
                newlyUploadedImageUrl = uploadData.url;
                finalImageUrl = uploadData.url;
            }

            const url = editingCampaign ? `/api/admin/campaigns/${editingCampaign.id}` : '/api/admin/campaigns';
            const method = editingCampaign ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    badge: formData.badge,
                    title: formData.title,
                    subtitle: formData.subtitle,
                    description: formData.description,
                    imageUrl: finalImageUrl,
                    buttonText: 'Zu den Paketen',
                    buttonLink: '/Fahrakademie',
                    startDate: formData.startDate || null,
                    endDate: formData.endDate || null,
                    isActive: formData.isActive,
                    showEffects: formData.effectType !== 'none',
                    effectType: formData.effectType,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Kampagne konnte nicht gespeichert werden.');
            }

            resetFileSelection();
            setIsModalOpen(false);
            setStatusMessage(
                editingCampaign
                    ? 'Kampagne wurde aktualisiert und automatisch übersetzt!'
                    : 'Neue Kampagne wurde erstellt und automatisch übersetzt!'
            );
            setTimeout(() => setStatusMessage(null), 3500);
            fetchCampaigns();
        } catch (error: any) {
            if (newlyUploadedImageUrl) {
                fetch('/api/admin/campaigns/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: newlyUploadedImageUrl }),
                }).catch(() => {});
            }
            console.error('Save error:', error);
            setErrorMessage(error?.message || 'Ein Fehler ist aufgetreten.');
        } finally {
            setSaving(false);
        }
    };

    const activePreviewImage = localPreviewUrl || formData.imageUrl || null;

    const handlePreviewSelectedEffect = () => {
        const draft: Campaign = {
            id: editingCampaign?.id || 'draft-effect-preview',
            badge: formData.badge || 'ANGEBOT DES MONATS',
            title: formData.title || 'Effekt-Vorschau: GATE 11 Aktion',
            subtitle: formData.subtitle || 'Dein Führerschein. Dein Vorteil.',
            description:
                formData.description ||
                'So erscheint Ihre Kampagne mit dem ausgewählten Hintergrund-Effekt auf der Webseite.',
            imageUrl: activePreviewImage,
            buttonText: 'Zu den Paketen',
            buttonLink: '/Fahrakademie',
            isActive: true,
            showEffects: formData.effectType !== 'none',
            effectType: formData.effectType,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setPreviewCampaigns([draft]);
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                            <Megaphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                                Kampagnen & Pop-up Ankündigungen
                            </h1>
                            <p className="text-sm text-neutral-400 mt-0.5">
                                Verwalten Sie Ankündigungen und Aktionen, die beim ersten Öffnen der Webseite angezeigt werden.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-[#c49f27] transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Neue Kampagne erstellen
                </button>
            </div>

            {/* Status Alert Bar */}
            {statusMessage && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{statusMessage}</span>
                </div>
            )}

            <div className={`p-5 rounded-2xl border transition-all ${
                liveCampaigns.length > 0
                    ? 'bg-primary/5 border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.08)]'
                    : 'bg-white/[0.02] border-white/10'
            }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                            liveCampaigns.length > 0
                                ? 'bg-green-500 animate-pulse'
                                : activeCampaigns.length > 0
                                ? 'bg-blue-400'
                                : 'bg-neutral-600'
                        }`} />
                        <div>
                            <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Live-Status:</span>
                            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                                {liveCampaigns.length === 1 ? (
                                    <>Aktuell aktiv auf der Webseite: <span className="text-primary">{liveCampaigns[0].title}</span></>
                                ) : liveCampaigns.length > 1 ? (
                                    <>
                                        Aktuell aktiv auf der Webseite ({liveCampaigns.length} Kampagnen im Slider):{' '}
                                        <span className="text-primary">{liveCampaigns.map(c => c.title).join(' • ')}</span>
                                    </>
                                ) : activeCampaigns.length > 0 ? (
                                    <span className="text-blue-300 font-normal">
                                        Geplante Kampagnen ({activeCampaigns.length}): Werden zum Startdatum automatisch angezeigt
                                    </span>
                                ) : (
                                    <span className="text-neutral-400 font-normal">Derzeit keine aktive Kampagne (Webseite öffnet direkt)</span>
                                )}
                            </h3>
                        </div>
                    </div>

                    {liveCampaigns.length > 0 && (
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setPreviewCampaigns(liveCampaigns)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                {liveCampaigns.length > 1 ? 'Slider Live-Vorschau' : 'Live-Vorschau'}
                            </button>
                            {liveCampaigns.length === 1 && (
                                <button
                                    onClick={() => handleToggleActive(liveCampaigns[0])}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                                >
                                    Deaktivieren
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign Cards Grid */}
            {loading ? (
                <div className="text-center py-20 text-neutral-500">Kampagnen werden geladen...</div>
            ) : campaigns.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] p-8">
                    <Sparkles className="w-12 h-12 text-primary/40 mx-auto mb-3" />
                    <h3 className="text-lg font-serif text-white">Noch keine Kampagnen vorhanden</h3>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 mb-6">
                        Erstellen Sie Ihre erste Kampagne für Rabatte, neue Kurstermine oder besondere Aktionen auf Ihrer Webseite.
                    </p>
                    <button
                        onClick={handleOpenCreate}
                        className="px-6 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        Erste Kampagne erstellen
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {campaigns.map((camp) => {
                        const dateRangeText = formatCampaignDateRange(camp.startDate, camp.endDate);
                        const now = new Date();
                        const isExpired = Boolean(camp.endDate && new Date(camp.endDate) < now);
                        const isScheduled = Boolean(camp.isActive && camp.startDate && new Date(camp.startDate) > now);

                        return (
                        <div
                            key={camp.id}
                            className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                                camp.isActive
                                    ? 'bg-gradient-to-br from-[#121008] to-[#0a0a0a] border-primary/40 shadow-[0_0_25px_rgba(212,175,55,0.12)]'
                                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div>
                                {/* Card Header with Badge & Status Toggle */}
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {camp.badge && (
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30">
                                                {camp.badge}
                                            </span>
                                        )}
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                                            camp.isActive
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                                : 'bg-neutral-800 text-neutral-400'
                                        }`}>
                                            {camp.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {camp.isActive ? 'AKTIV' : 'INAKTIV'}
                                        </span>
                                        {isExpired && (
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                                                ABGELAUFEN
                                            </span>
                                        )}
                                        {isScheduled && (
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                                GEPLANT
                                            </span>
                                        )}
                                        {(() => {
                                            const effId = resolveCampaignEffect(camp.effectType, camp.showEffects);
                                            const effMeta = getCampaignEffectMeta(effId);
                                            return (
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide ${
                                                    effId !== 'none'
                                                        ? `bg-amber-500/10 text-amber-200 border ${effMeta.accentBorder}`
                                                        : 'bg-white/5 text-neutral-400 border border-white/10'
                                                }`}>
                                                    {effMeta.shortLabel}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Quick Active Toggle Button */}
                                    <button
                                        onClick={() => handleToggleActive(camp)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            camp.isActive
                                                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                                : 'bg-primary text-black font-bold hover:bg-[#c49f27]'
                                        }`}
                                    >
                                        {camp.isActive ? 'Deaktivieren' : 'Aktivieren'}
                                    </button>
                                </div>

                                {/* Title & Subtitle */}
                                <h3 className="text-xl font-serif font-bold text-white mb-1">
                                    {camp.title}
                                </h3>
                                {camp.subtitle && (
                                    <p className="text-xs text-primary/80 font-medium mb-3">
                                        {camp.subtitle}
                                    </p>
                                )}

                                {/* Image preview if any */}
                                {camp.imageUrl && (
                                    <div className="w-full h-36 rounded-xl overflow-hidden border border-white/10 mb-3 bg-neutral-900">
                                        <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                                    {camp.description}
                                </p>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-neutral-300 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>{dateRangeText}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => setPreviewCampaigns([camp])}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                        title="Vorschau"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEdit(camp)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                        title="Bearbeiten"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(camp.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                                        title="Löschen"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}

            {/* CREATE / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0f0f0f] border border-primary/30 rounded-2xl shadow-2xl overflow-hidden my-4">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
                            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-primary" />
                                {editingCampaign ? 'Kampagne bearbeiten' : 'Neue Kampagne erstellen'}
                            </h2>
                            <button
                                onClick={handleCloseFormModal}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
                            {errorMessage && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* 1. Badge / Etikett */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                                    Badge / Etikett (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.badge}
                                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                    placeholder="z. B. SONDERANGEBOT, -20% RABATT"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* 2. Kampagnentitel */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                                    Kampagnentitel *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="z. B. Frühlingsaktion: Sonderpreis für Klasse B!"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* 3. Untertitel */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                                    Untertitel (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="z. B. Nur für kurze Zeit gültig"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* 4. Kampagnenbeschreibung */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                                    Kampagnenbeschreibung *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Details zur Aktion für Ihre Besucher..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors resize-none"
                                />
                            </div>

                            {/* 5. Kampagnenbild */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                                    Kampagnenbild (Optional)
                                </label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {activePreviewImage ? (
                                    <div className="relative rounded-xl overflow-hidden border border-primary/30 bg-black/40">
                                        <img
                                            src={activePreviewImage}
                                            alt="Kampagnenbild Vorschau"
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-3 bg-[#141414] border-t border-white/10 flex items-center justify-between gap-2">
                                            <span className="text-xs text-neutral-400 truncate">
                                                {selectedFile ? selectedFile.name : 'Hochgeladenes Kampagnenbild'}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                                                >
                                                    Ändern
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-colors cursor-pointer"
                                                >
                                                    Bild entfernen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-8 px-4 rounded-xl border-2 border-dashed border-white/15 hover:border-primary/50 bg-white/[0.02] hover:bg-primary/[0.04] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                                    >
                                        <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            Bild auswählen
                                        </span>
                                        <span className="text-[11px] text-neutral-500">
                                            PNG, JPG, WEBP werden unterstützt • Beim Löschen der Kampagne wird das Bild automatisch entfernt
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* 5b. Zeitliche Steuerung (Startdatum & Ablaufdatum) */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                                            Startdatum (Optional — Gültig ab)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                                            Ablaufdatum / Enddatum (Optional — Automatische Deaktivierung)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            min={formData.startDate || undefined}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-neutral-400">
                                    Nach Ablauf des Enddatums wird die Kampagne automatisch deaktiviert und nicht mehr auf der Webseite angezeigt.
                                </p>
                            </div>

                            {/* 6. Hintergrund-Effekt & Saisonales Thema (Aufklappbar) */}
                            {(() => {
                                const selectedEffectMeta = getCampaignEffectMeta(formData.effectType);
                                return (
                                    <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
                                        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsEffectPickerOpen((prev) => !prev)}
                                                className="flex-1 flex items-center justify-between gap-3 text-left cursor-pointer group"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                                            Hintergrund-Effekt & Saisonales Thema
                                                        </p>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                                            formData.effectType !== 'none'
                                                                ? `bg-amber-500/10 text-amber-200 ${selectedEffectMeta.accentBorder}`
                                                                : 'bg-white/5 text-neutral-400 border-white/15'
                                                        }`}>
                                                            <span>{selectedEffectMeta.emoji}</span>
                                                            <span>{selectedEffectMeta.label}</span>
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-400 mt-0.5">
                                                        Klicken Sie hier, um einen passenden Hintergrund-Effekt auszuwählen.
                                                    </p>
                                                </div>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-neutral-400 group-hover:text-white shrink-0 transition-transform duration-200 ${
                                                        isEffectPickerOpen ? 'rotate-180 text-primary' : ''
                                                    }`}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handlePreviewSelectedEffect}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-primary/15 hover:bg-primary/25 text-primary border border-primary/40 transition-colors shrink-0 cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Effekt live testen
                                            </button>
                                        </div>

                                        {isEffectPickerOpen && (
                                            <div className="p-4 pt-3 border-t border-white/10 bg-black/25">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                    {CAMPAIGN_EFFECTS.map((effect) => {
                                                        const isSelected = formData.effectType === effect.id;
                                                        return (
                                                            <button
                                                                key={effect.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        effectType: effect.id,
                                                                        showEffects: effect.id !== 'none',
                                                                    })
                                                                }
                                                                className={`text-left rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                                                                    isSelected
                                                                        ? 'border-primary bg-primary/10 ring-1 ring-primary/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                                                        : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-white/[0.04]'
                                                                }`}
                                                            >
                                                                {/* Miniature WebP Preview Strip */}
                                                                <div className={`relative h-16 w-full overflow-hidden bg-gradient-to-br ${effect.previewBg}`}>
                                                                    {effect.backdropImage ? (
                                                                        <>
                                                                            <img
                                                                                src={effect.backdropImage}
                                                                                alt=""
                                                                                loading="lazy"
                                                                                decoding="async"
                                                                                className="w-full h-full object-cover object-center opacity-85"
                                                                            />
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
                                                                        </>
                                                                    ) : effect.id === 'none' ? (
                                                                        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]">
                                                                            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                                                                                Ohne Effekt
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_30%,rgba(229,4,18,0.34),transparent_52%),radial-gradient(circle_at_82%_28%,rgba(212,175,55,0.34),transparent_52%)] backdrop-blur-sm">
                                                                            <span className="text-[10px] uppercase tracking-widest text-amber-200/90 font-bold drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                                                                                Transparent • Blur
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    <div className="absolute inset-x-2.5 bottom-1.5 flex items-center justify-between gap-1.5">
                                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/75 border border-white/15 text-[11px] font-bold text-white backdrop-blur-sm truncate">
                                                                            <span>{effect.emoji}</span>
                                                                            <span className="truncate">{effect.label}</span>
                                                                        </span>
                                                                        {isSelected && (
                                                                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]" />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Short Description */}
                                                                <div className="p-2.5">
                                                                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                                                                        {effect.description}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* 7. Kampagne sofort aktivieren */}
                            <div className="pt-2 flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                                <div>
                                    <p className="text-sm font-semibold text-white">Kampagne sofort aktivieren</p>
                                    <p className="text-xs text-neutral-400">Wenn aktiviert, wird diese Kampagne beim Öffnen der Webseite angezeigt. Bei mehreren aktiven Kampagnen werden alle automatisch als Slider nacheinander eingeblendet.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseFormModal}
                                    className="px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-[#c49f27] transition-all cursor-pointer shadow-lg disabled:opacity-50"
                                >
                                    {saving ? 'Wird gespeichert & übersetzt...' : editingCampaign ? 'Aktualisieren' : 'Erstellen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* LIVE PREVIEW POPUP MODAL */}
            <CampaignModal
                campaigns={previewCampaigns}
                isOpen={previewCampaigns.length > 0}
                onClose={() => setPreviewCampaigns([])}
            />
        </div>
    );
}
