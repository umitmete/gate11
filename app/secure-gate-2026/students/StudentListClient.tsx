'use client';

import { useState } from 'react';
import dayjs from '@/lib/dayjs';
import { X, User, Mail, Phone, Calendar, MapPin, FileText, Download, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Student {
    id: string;
    salutation?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    birthPlace?: string;
    nationality?: string;
    street: string;
    zipCode: string;
    city: string;
    courseType: string;
    licenseClass?: string;
    registrationPdfUrl?: string;
    submittedAt: string;
    idCardUrl?: string;
    idCardBackUrl?: string;
    passportUrl?: string;
    residenceUrl?: string;
    residenceBackUrl?: string;
    firstAidUrl?: string;
}

interface StudentListClientProps {
    groupedStudents: Record<string, Student[]>;
}

export default function StudentListClient({ groupedStudents }: StudentListClientProps) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [downloading, setDownloading] = useState<string | null>(null);
    const router = useRouter();

    const groupKeys = Object.keys(groupedStudents).sort((a, b) => {
        // Nach Datum absteigend sortieren (angenommenes Format: Paket - DD.MM.YYYY)
        const dateA = a.split(' - ')[1];
        const dateB = b.split(' - ')[1];
        return dayjs(dateB, 'DD.MM.YYYY').unix() - dayjs(dateA, 'DD.MM.YYYY').unix();
    });

    const downloadList = async (groupName: string, students: Student[]) => {
        setDownloading(groupName);
        try {
            const res = await fetch('/api/students/download-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupName,
                    studentIds: students.map(s => s.id)
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Serverfehler');
            }

            const blob = await res.blob();
            // Removed strict size check as it might cause false positives while the file is actually valid
            if (blob.size < 100) console.warn('Warnung: Dateigröße scheint sehr klein zu sein:', blob.size);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Gate11_${groupName.replace(/\s+/g, '_')}_Liste.pdf`;

            document.body.appendChild(a);
            a.click();

            // Aufräumen
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 200);

        } catch (error: any) {
            console.error('PDF Download error:', error);
            alert('PDF konnte nicht heruntergeladen werden: ' + error.message);
        } finally {
            setDownloading(null);
        }
    };

    const handleDelete = async (studentId: string, name: string) => {
        if (!confirm(`Sind Sie sicher, dass Sie den Schüler ${name} DAUERHAFT aus der Liste löschen möchten?`)) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(`/api/registrations/${studentId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setSelectedStudent(null);
                router.refresh();
            } else {
                alert('Löschen fehlgeschlagen.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Ein Fehler ist aufgetreten.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-12">
            {groupKeys.map(key => (
                <div key={key} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <h3 className="text-lg md:text-xl font-serif text-primary italic whitespace-nowrap">{key}</h3>
                        <div className="h-[1px] w-full bg-gradient-to-r from-primary/30 to-transparent hidden md:block" />
                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 whitespace-nowrap">
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                {groupedStudents[key].length} Schüler
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('PDF-Download gestartet:', key);
                                    downloadList(key, groupedStudents[key]);
                                }}
                                disabled={downloading === key}
                                className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/20 transition-all text-[9px] font-bold uppercase tracking-widest disabled:opacity-50 pointer-events-auto"
                            >
                                {downloading === key ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Download className="w-3 h-3" />
                                )}
                                Liste PDF
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {groupedStudents[key].map((student) => (
                            <div key={student.id} className="relative group">
                                <button
                                    onClick={() => setSelectedStudent(student)}
                                    className="w-full bg-[#0a0a0a] border border-white/5 p-4 hover:border-primary/50 transition-all duration-300 text-left h-full"
                                >
                                    <div className="text-sm font-serif text-white group-hover:text-primary transition-colors truncate pr-6">
                                        {student.salutation ? `${student.salutation} ` : ''}{student.firstName} {student.lastName}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/40 uppercase tracking-tighter mt-1">
                                        {student.courseType} {student.licenseClass ? `(${student.licenseClass})` : ''}
                                    </div>
                                </button>
                                {student.registrationPdfUrl && (
                                    <a
                                        href={`/api/registrations/${student.id}/pdf`}
                                        target="_blank"
                                        className="absolute top-2 right-2 p-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 ring-1 ring-primary/20"
                                        title="Anmeldeformular PDF"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FileText className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Student Detail Modal */}
            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudent(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0f0f0f] border border-primary/20 rounded-none shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            {/* Document Header Design */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                            <div className="p-6 md:p-12 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="text-primary font-bold text-[10px] uppercase tracking-[0.5em] mb-2">Student Profile</div>
                                        <h2 className="text-2xl md:text-3xl font-serif text-white italic">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                                        <p className="text-muted-foreground text-xs uppercase tracking-widest">{selectedStudent.courseType}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                    {/* Column 1: Personal info */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 border-b border-white/5 pb-2">Persönliche Informationen</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><User className="w-4 h-4" /></div>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Name</div>
                                                    <div className="text-sm text-white font-light truncate">{selectedStudent.salutation} {selectedStudent.firstName} {selectedStudent.lastName}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><Mail className="w-4 h-4" /></div>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">E-Mail</div>
                                                    <div className="text-sm text-white font-light truncate">{selectedStudent.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><Phone className="w-4 h-4" /></div>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Telefon</div>
                                                    <div className="text-sm text-white font-light truncate">{selectedStudent.phone}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><Calendar className="w-4 h-4" /></div>
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Geburtsdatum</div>
                                                    <div className="text-sm text-white font-light">
                                                        {dayjs(selectedStudent.birthDate).format('DD.MM.YYYY')}
                                                        {selectedStudent.birthPlace && <span className="text-muted-foreground"> in {selectedStudent.birthPlace}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            {(selectedStudent.nationality) && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><ShieldCheck className="w-4 h-4" /></div>
                                                    <div>
                                                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Staatsbürgerschaft</div>
                                                        <div className="text-sm text-white font-light">{selectedStudent.nationality}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 2: Address & System info */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 border-b border-white/5 pb-2">Adressinformationen</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><FileText className="w-4 h-4" /></div>
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Kurs / Klasse</div>
                                                    <div className="text-sm text-white font-light">
                                                        {selectedStudent.courseType}
                                                        {selectedStudent.licenseClass && <span className="text-primary font-bold ml-2">[{selectedStudent.licenseClass}]</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><MapPin className="w-4 h-4" /></div>
                                                <div className="min-w-0">
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Adresse</div>
                                                    <div className="text-sm text-white font-light break-words">
                                                        {selectedStudent.street}<br />
                                                        {selectedStudent.zipCode} {selectedStudent.city}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary/60 shrink-0"><ShieldCheck className="w-4 h-4" /></div>
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Registrierungsdatum</div>
                                                    <div className="text-sm text-white font-light">{dayjs(selectedStudent.submittedAt).format('DD.MM.YYYY HH:mm')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                                    {selectedStudent.registrationPdfUrl && (
                                        <a
                                            href={`/api/registrations/${selectedStudent.id}/pdf`}
                                            target="_blank"
                                            className="w-full md:flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all text-center"
                                        >
                                            <Download className="w-4 h-4" /> PDF Anmeldeformular
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(selectedStudent.id, `${selectedStudent.firstName} ${selectedStudent.lastName}`)}
                                        disabled={deleting}
                                        className="w-full md:w-auto px-6 py-4 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        Löschen
                                    </button>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="w-full md:w-auto px-6 py-4 bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 text-center"
                                    >
                                        Schließen
                                    </button>
                                </div>
                            </div>

                            {/* Decorative background logo */}
                            <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none">
                                <img src="/Gate11_Logo_beyaz.svg" alt="" className="w-64 h-64 rotate-12" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
