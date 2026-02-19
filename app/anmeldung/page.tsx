'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LuxuryCard } from '@/components/ui/card/LuxuryCard';
import { Check, Upload, ChevronRight, ChevronLeft, Loader2, FileText, Camera, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { CameraModal } from '@/components/ui/CameraModal';

interface FormData {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    birthPlace: string;
    nationality: string;
    street: string;
    zipCode: string;
    city: string;
    courseType: string;
    licenseClass: string;
    documentUrls: {
        idCard?: string;
        idCardBack?: string;
        passport?: string;
        firstAid?: string;
        residence?: string;
        residenceBack?: string;
    };
    bringLater: {
        idCard: boolean;
        passport: boolean;
        residence: boolean;
    }
}

export default function PreRegistrationPage() {
    const { t, language } = useLanguage();
    const tp = t.preRegistration; // Shortcut for pre-registration translations
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<FormData>({
        salutation: 'Herr',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        birthPlace: '',
        nationality: '',
        street: '',
        zipCode: '',
        city: '',
        courseType: 'B-PAKET',
        licenseClass: 'B',
        documentUrls: {},
        bringLater: {
            idCard: false,
            passport: false,
            residence: false,
        }
    });

    // Auto-scroll to top when step or submitted changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, submitted]);

    const [dayPackages, setDayPackages] = useState<any[]>([]);
    const [nightPackages, setNightPackages] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch Day Courses
                const dayRes = await fetch(`/api/course-packages?type=DAY&lang=${language}`);
                if (dayRes.ok) {
                    const data = await dayRes.json();
                    setDayPackages(data.length > 0 ? data : t.courses.packages);
                } else {
                    setDayPackages(t.courses.packages);
                }

                // Fetch Night Courses
                const nightRes = await fetch(`/api/course-packages?type=NIGHT&lang=${language}`);
                if (nightRes.ok) {
                    const data = await nightRes.json();
                    setNightPackages(data.length > 0 ? data : (t as any).nightCourses?.packages || []);
                } else {
                    setNightPackages((t as any).nightCourses?.packages || []);
                }
            } catch (err) {
                console.error("Kurslar alınamadı", err);
                setDayPackages(t.courses.packages);
                setNightPackages((t as any).nightCourses?.packages || []);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, [language, t.courses.packages, (t as any).nightCourses?.packages]);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraTarget, setCameraTarget] = useState<keyof FormData['documentUrls'] | null>(null);

    const STEPS = [
        { id: 1, title: tp.steps.personal, icon: '👤' },
        { id: 2, title: tp.steps.address, icon: '📍' },
        { id: 3, title: tp.steps.course, icon: '🚗' },
        { id: 4, title: tp.steps.documents, icon: '📄' },
    ];

    const updateField = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleBringLater = (doc: keyof FormData['bringLater']) => {
        setFormData(prev => ({
            ...prev,
            bringLater: { ...prev.bringLater, [doc]: !prev.bringLater[doc] },
            documentUrls: { ...prev.documentUrls, [doc]: !prev.bringLater[doc] ? undefined : prev.documentUrls[doc as keyof FormData['documentUrls']] }
        }));
    };

    const handleFileUpload = async (file: File | Blob, type: keyof FormData['documentUrls']) => {
        if (!file) return;

        setLoading(true);
        try {
            // Dinamik import ile yükleme (Client-side optimization)
            const { upload } = await import('@vercel/blob/client');

            // Benzersiz dosya adı oluştur (RandomUUID benzeri)
            const safeName = (file as File).name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}_${safeName}`;

            const newBlob = await upload(uniqueName, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            if (newBlob.url) {
                setFormData(prev => ({
                    ...prev,
                    documentUrls: { ...prev.documentUrls, [type]: newBlob.url }
                }));
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert(language === 'tr' ? 'Dosya yüklenemedi. Lütfen tekrar deneyin.' : 'Upload fehlgeschlagen. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    const openCamera = (type: keyof FormData['documentUrls']) => {
        setCameraTarget(type);
        setIsCameraOpen(true);
    };

    const handleCameraCapture = (blob: Blob) => {
        if (!cameraTarget) return;
        const file = new File([blob], `${cameraTarget}.jpg`, { type: 'image/jpeg' });
        handleFileUpload(file, cameraTarget);
    };

    const isStepValid = () => {
        if (step === 1) {
            return formData.salutation && formData.firstName && formData.lastName && formData.email && formData.phone && formData.birthDate && formData.birthPlace && formData.nationality;
        }
        if (step === 2) {
            return formData.street && formData.zipCode && formData.city;
        }
        if (step === 3) {
            return formData.courseType && formData.licenseClass;
        }
        if (step === 4) {
            const idCardReady = (formData.documentUrls.idCard && formData.documentUrls.idCardBack) || formData.bringLater.idCard;
            const passportReady = formData.documentUrls.passport || formData.bringLater.passport;
            const residenceReady = formData.documentUrls.residence || formData.bringLater.residence;
            return idCardReady && passportReady && residenceReady;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!isStepValid()) return;
        setLoading(true);
        const allPackages = [...dayPackages, ...nightPackages];
        const selectedPkg = allPackages.find(p => p.title === formData.courseType || (p.title + ' (Abend)') === formData.courseType);
        const price = selectedPkg?.price || '';

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    packagePrice: price
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                const errorMsg = errorData?.details || errorData?.error || `Server error: ${res.status}`;
                console.error('Registration API error:', errorMsg);
                alert(language === 'tr'
                    ? `Kayıt gönderilemedi: ${errorMsg}`
                    : `Anmeldung fehlgeschlagen: ${errorMsg}`);
                return;
            }

            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
                setPdfUrl(data.pdfUrl);
            } else {
                console.error('Registration failed:', data);
                alert(language === 'tr'
                    ? 'Kayıt gönderilemedi. Lütfen tekrar deneyin.'
                    : 'Anmeldung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.');
            }
        } catch (error) {
            console.error('Registration failed', error);
            alert(language === 'tr'
                ? 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
                : 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        const { email, phone, birthDate } = formData;

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = language === 'tr' ? 'Geçersiz e-posta adresi' : 'Ungültige E-Mail-Adresse';
        }

        // Phone Validation (Only numbers and +, min 6 chars)
        const phoneRegex = /^\+?[0-9\s]+$/;
        if (!phoneRegex.test(phone) || phone.replace(/[^0-9]/g, '').length < 6) {
            newErrors.phone = language === 'tr' ? 'Geçersiz telefon (Sadece rakam)' : 'Ungültige Telefonnummer (Nur Ziffern)';
        }

        // Age Validation (Min 15.5)
        if (birthDate) {
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }

            // 15.5 control
            const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
            const isAtLeast15AndHalf = months >= (15 * 12 + 6);

            if (!isAtLeast15AndHalf) {
                newErrors.birthDate = language === 'tr' ? 'Yaşınız 15.5\'ten küçük olamaz' : 'Sie müssen mindestens 15,5 Jahre alt sein';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!isStepValid()) return;

        if (step === 1) {
            if (!validateStep1()) return;
        }

        setStep(s => Math.min(s + 1, 4));
    };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300">
            <Navbar />

            <section className="pt-36 pb-24 container mx-auto px-6 max-w-4xl">
                <div className="mb-16 text-center space-y-4">
                    <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] font-serif">{tp.portal}</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
                        {t.nav.register} <span className="text-primary italic">{tp.subtitle}</span>
                    </h1>
                </div>

                {/* Stepper */}
                <div className="flex justify-center items-start mb-12 md:mb-20 max-w-2xl mx-auto px-4">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-start">
                            <div
                                className={`flex flex-col items-center gap-1.5 group cursor-pointer transition-all ${step >= s.id ? 'opacity-100' : 'opacity-30'}`}
                                onClick={() => i < step && setStep(s.id)}
                            >
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border flex items-center justify-center text-sm md:text-xl transition-all duration-500 ${step === s.id ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : step > s.id ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/20'}`}>
                                    {step > s.id ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : s.icon}
                                </div>
                                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-foreground/60 text-center max-w-[60px] md:max-w-none px-1">
                                    {s.title}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`w-4 sm:w-8 md:w-16 h-[2px] mt-5 md:mt-7 transition-colors duration-500 ${step > s.id ? 'bg-primary' : 'bg-primary/10'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <LuxuryCard hoverEffect={false} className="p-10 md:p-14 border-primary/10 bg-card/50 backdrop-blur-2xl relative shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40" />

                                    {/* Step 1: Personal */}
                                    {step === 1 && (
                                        <div className="space-y-8">
                                            {/* Anrede */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Anrede</label>
                                                <div className="flex gap-4">
                                                    {['Herr', 'Frau'].map((option) => (
                                                        <div
                                                            key={option}
                                                            onClick={() => updateField('salutation', option)}
                                                            className={`flex-1 p-4 border cursor-pointer text-center transition-all ${formData.salutation === option
                                                                ? 'border-primary bg-primary text-primary-foreground font-bold'
                                                                : 'border-primary/10 hover:border-primary/30 text-foreground/60'
                                                                }`}
                                                        >
                                                            {option}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.firstName}</label>
                                                    <input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} type="text" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="Max" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.lastName}</label>
                                                    <input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} type="text" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="Mustermann" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.birthDate}</label>
                                                    <input
                                                        value={formData.birthDate}
                                                        onChange={(e) => {
                                                            updateField('birthDate', e.target.value);
                                                            if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
                                                        }}
                                                        max={new Date().toISOString().split("T")[0]}
                                                        type="date"
                                                        className={`w-full bg-primary/[0.03] border p-4 text-foreground focus:border-primary outline-none transition-all rounded-none dark:[color-scheme:dark] ${errors.birthDate ? 'border-red-500' : 'border-primary/10'}`}
                                                    />
                                                    {errors.birthDate && <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">{errors.birthDate}</span>}
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Geburtsort</label>
                                                    <input value={formData.birthPlace} onChange={(e) => updateField('birthPlace', e.target.value)} type="text" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="Wien" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Staatsbürgerschaft</label>
                                                <input value={formData.nationality} onChange={(e) => updateField('nationality', e.target.value)} type="text" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="Österreich" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.email}</label>
                                                    <input
                                                        value={formData.email}
                                                        onChange={(e) => {
                                                            updateField('email', e.target.value);
                                                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                                        }}
                                                        type="email"
                                                        className={`w-full bg-primary/[0.03] border p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30 ${errors.email ? 'border-red-500' : 'border-primary/10'}`}
                                                        placeholder="max@example.at"
                                                    />
                                                    {errors.email && <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">{errors.email}</span>}
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.phone}</label>
                                                    <input
                                                        value={formData.phone}
                                                        onChange={(e) => {
                                                            updateField('phone', e.target.value);
                                                            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                                                        }}
                                                        type="tel"
                                                        className={`w-full bg-primary/[0.03] border p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30 ${errors.phone ? 'border-red-500' : 'border-primary/10'}`}
                                                        placeholder="+43 664..."
                                                    />
                                                    {errors.phone && <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">{errors.phone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Address */}
                                    {step === 2 && (
                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.street}</label>
                                                <input value={formData.street} onChange={(e) => updateField('street', e.target.value)} type="text" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="Beispielstraße 12/3" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.zipCode}</label>
                                                    <input value={formData.zipCode} onChange={(e) => updateField('zipCode', e.target.value.replace(/\D/g, '').slice(0, 4))} type="text" inputMode="numeric" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="1110" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{tp.fields.city}</label>
                                                    <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} type="text" className="w-full bg-primary/[0.03] border border-primary/10 p-4 text-foreground focus:border-primary outline-none transition-all rounded-none placeholder:text-muted-foreground/30" placeholder="Wien" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Course */}
                                    {step === 3 && (
                                        <div className="space-y-8">
                                            {/* License Class */}
                                            <div className="space-y-3 pb-8 border-b border-primary/10">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Führerscheinklasse</label>
                                                <div className="flex gap-4 flex-wrap">
                                                    {['B', 'A', 'L17', 'B+A', 'Moped'].map((cls) => (
                                                        <div
                                                            key={cls}
                                                            onClick={() => updateField('licenseClass', cls)}
                                                            className={`px-6 py-3 border cursor-pointer text-center transition-all min-w-[30px] ${formData.licenseClass === cls
                                                                ? 'border-primary bg-primary text-primary-foreground font-bold'
                                                                : 'border-primary/10 hover:border-primary/30 text-foreground/60'
                                                                }`}
                                                        >
                                                            {cls}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {loadingCourses ? (
                                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.courses.loading || "Kurslar yükleniyor..."}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Day Courses */}
                                                    <div className="space-y-4">
                                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 pl-1">{t.nav.courses_day}</h3>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {dayPackages.map((pkg: any) => (
                                                                <div
                                                                    key={`day-${pkg.title}`}
                                                                    onClick={() => updateField('courseType', pkg.title)}
                                                                    className={`p-6 border cursor-pointer transition-all flex justify-between items-center group ${formData.courseType === pkg.title ? 'border-primary bg-primary/[0.08]' : 'border-primary/10 hover:border-primary/30 bg-primary/[0.01]'}`}
                                                                >
                                                                    <div>
                                                                        <div className={`font-serif text-lg transition-colors ${formData.courseType === pkg.title ? 'text-foreground font-bold' : 'text-foreground/60'}`}>{pkg.title}</div>
                                                                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">{pkg.tag} {pkg.showPrice !== false && `— ${pkg.price}`}</div>
                                                                    </div>
                                                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${formData.courseType === pkg.title ? 'border-primary bg-primary' : 'border-primary/20'}`}>
                                                                        {formData.courseType === pkg.title && <Check className="w-4 h-4 text-primary-foreground" />}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Night Courses */}
                                                    {nightPackages.length > 0 && (
                                                        <div className="space-y-4 pt-4 border-t border-primary/10">
                                                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 pl-1">{t.nav.courses_night}</h3>
                                                            <div className="grid grid-cols-1 gap-4">
                                                                {nightPackages.map((pkg: any) => {
                                                                    // If the title doesn't contain (Abend) already, add it for clarity in select
                                                                    const nightTitle = pkg.title.toLowerCase().includes('abend') ? pkg.title : `${pkg.title} (Abend)`;
                                                                    return (
                                                                        <div
                                                                            key={`night-${pkg.title}`}
                                                                            onClick={() => updateField('courseType', nightTitle)}
                                                                            className={`p-6 border cursor-pointer transition-all flex justify-between items-center group ${formData.courseType === nightTitle ? 'border-primary bg-primary/[0.08]' : 'border-primary/10 hover:border-primary/30 bg-primary/[0.01]'}`}
                                                                        >
                                                                            <div>
                                                                                <div className={`font-serif text-lg transition-colors ${formData.courseType === nightTitle ? 'text-foreground font-bold' : 'text-foreground/60'}`}>{pkg.title} <span className="text-sm opacity-50 not-italic font-sans ml-1">(Abend)</span></div>
                                                                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">{pkg.tag} {pkg.showPrice !== false && `— ${pkg.price}`}</div>
                                                                            </div>
                                                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${formData.courseType === nightTitle ? 'border-primary bg-primary' : 'border-primary/20'}`}>
                                                                                {formData.courseType === nightTitle && <Check className="w-4 h-4 text-primary-foreground" />}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Step 4: Documents */}
                                    {step === 4 && (
                                        <div className="space-y-8">
                                            <div className="p-6 bg-primary/[0.03] border border-primary/20 flex gap-4 items-center">
                                                <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                                                <p className="text-[10px] text-primary leading-relaxed uppercase tracking-[0.2em] font-bold">
                                                    {tp.docs.info}
                                                </p>
                                            </div>

                                            <div className="space-y-10">
                                                {/* ID CARD */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary shrink-0">{tp.docs.idCard}</label>
                                                        <div className="flex items-center justify-end gap-3 cursor-pointer group text-right" onClick={() => toggleBringLater('idCard')}>
                                                            <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors max-w-[140px] sm:max-w-none leading-tight">{tp.docs.bringLater}</span>
                                                            <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all ${formData.bringLater.idCard ? 'border-primary bg-primary' : 'border-primary/20 bg-primary/[0.02]'}`}>
                                                                {formData.bringLater.idCard && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {['idCard', 'idCardBack'].map((key) => (
                                                            <div key={key} className="space-y-2">
                                                                <span className="text-[9px] uppercase tracking-widest font-bold text-primary/40 px-1">{key === 'idCard' ? tp.docs.front : tp.docs.back}</span>
                                                                <div className={`border-2 border-dashed transition-all relative overflow-hidden ${formData.bringLater.idCard ? 'border-primary/5 bg-primary/[0.01] opacity-40' : formData.documentUrls[key as keyof FormData['documentUrls']] ? 'border-primary bg-primary/[0.05]' : 'border-primary/10 hover:border-primary/40 bg-primary/[0.01]'}`}>
                                                                    {formData.documentUrls[key as keyof FormData['documentUrls']] ? (
                                                                        <div className="py-8 flex flex-col items-center justify-center">
                                                                            <Check className="text-primary w-6 h-6" />
                                                                            <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40">{tp.docs.uploaded}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex divide-x divide-primary/10">
                                                                            <label className="flex-1 flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-primary/[0.03] transition-colors group/upload">
                                                                                <Upload className="text-primary/40 group-hover/upload:text-primary transition-colors w-6 h-6" />
                                                                                <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/upload:text-foreground transition-colors">{tp.docs.select}</span>
                                                                                {!formData.bringLater.idCard && <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], key as any)} />}
                                                                            </label>
                                                                            <button
                                                                                onClick={() => openCamera(key as any)}
                                                                                disabled={formData.bringLater.idCard}
                                                                                className="flex-1 flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-primary/[0.03] transition-colors group/camera"
                                                                            >
                                                                                <Camera className="text-primary/40 group-hover/camera:text-primary transition-colors w-6 h-6" />
                                                                                <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/camera:text-foreground transition-colors">{tp.docs.takePhoto}</span>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-10">
                                                    {/* PASSPORT */}
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary shrink-0">{tp.docs.passport}</label>
                                                            <div className="flex items-center justify-end gap-3 cursor-pointer group text-right" onClick={() => toggleBringLater('passport')}>
                                                                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors max-w-[140px] sm:max-w-none leading-tight">{tp.docs.bringLater}</span>
                                                                <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all ${formData.bringLater.passport ? 'border-primary bg-primary' : 'border-primary/20 bg-primary/[0.02]'}`}>
                                                                    {formData.bringLater.passport && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`border-2 border-dashed transition-all relative overflow-hidden ${formData.bringLater.passport ? 'border-primary/5 bg-primary/[0.01] opacity-40' : formData.documentUrls.passport ? 'border-primary bg-primary/[0.05]' : 'border-primary/10 hover:border-primary/40 bg-primary/[0.01]'}`}>
                                                            {formData.documentUrls.passport ? (
                                                                <div className="h-40 flex flex-col items-center justify-center">
                                                                    <Check className="text-primary w-6 h-6" />
                                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40">{tp.docs.uploaded}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex h-40 divide-x divide-primary/10">
                                                                    <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/[0.03] transition-colors group/upload">
                                                                        <FileText className="text-primary/40 group-hover/upload:text-primary transition-colors w-6 h-6" />
                                                                        <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/upload:text-foreground transition-colors">{tp.docs.select}</span>
                                                                        {!formData.bringLater.passport && <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'passport')} />}
                                                                    </label>
                                                                    <button
                                                                        onClick={() => openCamera('passport')}
                                                                        disabled={formData.bringLater.passport}
                                                                        className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/[0.03] transition-colors group/camera"
                                                                    >
                                                                        <Camera className="text-primary/40 group-hover/camera:text-primary transition-colors w-6 h-6" />
                                                                        <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/camera:text-foreground transition-colors">{tp.docs.takePhoto}</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* RESIDENCE */}
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary shrink-0">{tp.docs.residence}</label>
                                                            <div className="flex items-center justify-end gap-3 cursor-pointer group text-right" onClick={() => toggleBringLater('residence')}>
                                                                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors max-w-[140px] sm:max-w-none leading-tight">{tp.docs.bringLater}</span>
                                                                <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all ${formData.bringLater.residence ? 'border-primary bg-primary' : 'border-primary/20 bg-primary/[0.02]'}`}>
                                                                    {formData.bringLater.residence && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {['residence', 'residenceBack'].map((key) => (
                                                                <div key={key} className="space-y-2">
                                                                    <span className="text-[9px] uppercase tracking-widest font-bold text-primary/40 px-1 flex items-center gap-2">
                                                                        {key === 'residence' ? tp.docs.front : tp.docs.back}
                                                                        {key === 'residenceBack' && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] tracking-widest rounded-full">{tp.docs.optional}</span>}
                                                                    </span>
                                                                    <div className={`border-2 border-dashed transition-all relative overflow-hidden ${formData.bringLater.residence ? 'border-primary/5 bg-primary/[0.01] opacity-40' : formData.documentUrls[key as keyof FormData['documentUrls']] ? 'border-primary bg-primary/[0.05]' : 'border-primary/10 hover:border-primary/40 bg-primary/[0.01]'}`}>
                                                                        {formData.documentUrls[key as keyof FormData['documentUrls']] ? (
                                                                            <div className="py-12 flex flex-col items-center justify-center">
                                                                                <Check className="text-primary w-6 h-6" />
                                                                                <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40">{tp.docs.uploaded}</span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-32 md:h-40 divide-x divide-primary/10">
                                                                                <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/[0.03] transition-colors group/upload">
                                                                                    <FileText className="text-primary/40 group-hover/upload:text-primary transition-colors w-6 h-6" />
                                                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/upload:text-foreground transition-colors">{tp.docs.select}</span>
                                                                                    {!formData.bringLater.residence && <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], key as any)} />}
                                                                                </label>
                                                                                <button
                                                                                    onClick={() => openCamera(key as any)}
                                                                                    disabled={formData.bringLater.residence}
                                                                                    className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/[0.03] transition-colors group/camera"
                                                                                >
                                                                                    <Camera className="text-primary/40 group-hover/camera:text-primary transition-colors w-6 h-6" />
                                                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/camera:text-foreground transition-colors">{tp.docs.takePhoto}</span>
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* FIRST AID (OPTIONAL) */}
                                                <div className="space-y-4">
                                                    <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary flex items-center gap-2">
                                                        {tp.docs.firstAid}
                                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] tracking-widest rounded-full">{tp.docs.optional}</span>
                                                    </label>
                                                    <div className={`border-2 border-dashed transition-all relative overflow-hidden ${formData.documentUrls.firstAid ? 'border-primary bg-primary/[0.05]' : 'border-primary/10 hover:border-primary/40 bg-primary/[0.01]'}`}>
                                                        {formData.documentUrls.firstAid ? (
                                                            <div className="p-8 flex flex-col items-center justify-center">
                                                                <Check className="text-primary w-6 h-6" />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40">{tp.docs.uploaded}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex divide-x divide-primary/10">
                                                                <label className="flex-1 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-primary/[0.03] transition-colors group/upload">
                                                                    <ShieldCheck className="text-primary/40 group-hover/upload:text-primary transition-colors w-6 h-6" />
                                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/upload:text-foreground transition-colors">{tp.docs.select}</span>
                                                                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'firstAid')} />
                                                                </label>
                                                                <button
                                                                    onClick={() => openCamera('firstAid')}
                                                                    className="flex-1 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-primary/[0.03] transition-colors group/camera"
                                                                >
                                                                    <Camera className="text-primary/40 group-hover/camera:text-primary transition-colors w-6 h-6" />
                                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-3 text-foreground/40 group-hover/camera:text-foreground transition-colors">{tp.docs.takePhoto}</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="mt-16 pt-10 border-t border-primary/10 flex flex-row items-stretch gap-3 sm:gap-0 sm:justify-between sm:items-center">
                                        <button
                                            onClick={prevStep}
                                            disabled={step === 1 || loading}
                                            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 py-5 border border-primary/10 sm:border-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-primary ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                        >
                                            <ChevronLeft className="w-4 h-4" /> {tp.nav.back}
                                        </button>

                                        {step < 4 ? (
                                            <button
                                                onClick={nextStep}
                                                disabled={!isStepValid()}
                                                className={`flex-[2] sm:flex-none px-8 sm:px-12 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-3 shadow-xl ${!isStepValid() ? 'opacity-30 cursor-not-allowed filter grayscale' : 'shadow-primary/20'}`}
                                            >
                                                {tp.nav.next} <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading || !isStepValid()}
                                                className={`flex-[2] sm:flex-none px-8 sm:px-12 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 ${loading || !isStepValid() ? 'opacity-30 cursor-not-allowed filter grayscale' : ''}`}
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : tp.nav.submit}
                                            </button>
                                        )}
                                    </div>
                                </LuxuryCard>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <LuxuryCard className="p-16 border-primary/30 bg-primary/[0.02] shadow-2xl">
                                    <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                                        <Check className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-5xl font-serif font-bold text-foreground mb-4 italic">
                                        {tp.success.title}
                                    </h2>
                                    <p className="text-muted-foreground text-lg mb-4 max-w-sm mx-auto font-light">
                                        {tp.success.desc.replace('{name}', formData.firstName)}
                                    </p>
                                    <p className="text-primary text-sm mb-12 max-w-sm mx-auto font-bold uppercase tracking-wider">
                                        {tp.success.deadline}
                                    </p>

                                    <div className="flex flex-col gap-5">
                                        {pdfUrl && (
                                            <a
                                                href={pdfUrl}
                                                target="_blank"
                                                className="w-full py-5 bg-foreground text-background font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-3 shadow-lg"
                                            >
                                                <FileText className="w-6 h-6" /> {tp.success.download}
                                            </a>
                                        )}
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="w-full py-5 border border-primary/20 text-foreground font-bold uppercase tracking-[0.2em] hover:bg-primary/5 transition-all"
                                        >
                                            {tp.success.home}
                                        </button>
                                    </div>
                                </LuxuryCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <Footer />

            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
                title={cameraTarget ? (tp.docs[cameraTarget as keyof typeof tp.docs] as string) : ''}
                documentType={cameraTarget as any}
            />
        </main>
    );
}
