'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Megaphone, Plus, Edit2, Trash2, CheckCircle2, XCircle,
    Eye, Upload, Sparkles, X, AlertCircle, Calendar
} from 'lucide-react';
import { CampaignModal } from '@/components/campaign/CampaignModal';

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

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [previewCampaigns, setPreviewCampaigns] = useState<Campaign[]>([]);

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
        showEffects: true,
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
        setFormData({
            badge: 'SONDERANGEBOT',
            title: '',
            subtitle: '',
            description: '',
            imageUrl: '',
            startDate: '',
            endDate: '',
            isActive: true,
            showEffects: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (campaign: Campaign) => {
        resetFileSelection();
        setErrorMessage(null);
        setEditingCampaign(campaign);
        setFormData({
            badge: campaign.badge || '',
            title: campaign.title,
            subtitle: campaign.subtitle || '',
            description: campaign.description,
            imageUrl: campaign.imageUrl || '',
            startDate: toInputDate(campaign.startDate),
            endDate: toInputDate(campaign.endDate),
            isActive: campaign.isActive,
            showEffects: campaign.showEffects ?? true,
        });
        setIsModalOpen(true);
    };

    const handleCloseFormModal = () => {
        resetFileSelection();
        setErrorMessage(null);
        setIsModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
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

        try {
            let finalImageUrl = formData.imageUrl;

            // Upload newly selected file only on save
            if (selectedFile) {
                const uploadBody = new FormData();
                uploadBody.append('file', selectedFile);

                const uploadRes = await fetch('/api/admin/campaigns/upload', {
                    method: 'POST',
                    body: uploadBody,
                });

                if (!uploadRes.ok) {
                    const errData = await uploadRes.json().catch(() => ({}));
                    throw new Error(errData.error || 'Bild konnte nicht hochgeladen werden.');
                }

                const uploadData = await uploadRes.json();
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
                    showEffects: formData.showEffects,
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
            console.error('Save error:', error);
            setErrorMessage(error?.message || 'Ein Fehler ist aufgetreten.');
        } finally {
            setSaving(false);
        }
    };

    const activePreviewImage = localPreviewUrl || formData.imageUrl || null;

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
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide ${
                                            camp.showEffects !== false
                                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                                                : 'bg-white/5 text-neutral-400 border border-white/10'
                                        }`}>
                                            {camp.showEffects !== false ? '✨ Mit Geschenk-Effekten' : 'Schlichte Ansicht'}
                                        </span>
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
                    <div className="relative w-full max-w-2xl bg-[#0f0f0f] border border-primary/30 rounded-2xl shadow-2xl overflow-hidden my-8">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
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

                        <form onSubmit={handleSave} className="p-6 space-y-4">
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

                            {/* 6. Hintergrund-Geschenke & Glitzereffekte */}
                            <div className="pt-2 flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                                <div>
                                    <p className="text-sm font-semibold text-white">Hintergrund-Geschenke & Glitzereffekte anzeigen</p>
                                    <p className="text-xs text-neutral-400">Wenn aktiviert, erscheinen animierte Geschenksymbole und goldene Funken rund um das Fenster.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.showEffects}
                                    onChange={(e) => setFormData({ ...formData, showEffects: e.target.checked })}
                                    className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
                                />
                            </div>

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
