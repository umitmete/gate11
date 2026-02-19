'use client';

import { useState } from 'react';
import { FileText, X, Eye } from 'lucide-react';

interface RegistrationDocumentsProps {
    registration: any;
}

export default function RegistrationDocuments({ registration }: RegistrationDocumentsProps) {
    const [viewingUrl, setViewingUrl] = useState<string | null>(null);

    const documents = [
        {
            key: 'idCardUrl',
            label: 'Personalausweis',
            url: registration.idCardUrl,
            status: registration.idCardUrl ? 'available' : registration.bringIdLater ? 'bringLater' : 'missing',
            statusText: registration.idCardUrl ? '✅' : registration.bringIdLater ? '⏳ BÜRO' : '❌ FEHLT'
        },
        {
            key: 'passportUrl',
            label: 'Reisepass',
            url: registration.passportUrl,
            status: registration.passportUrl ? 'available' : registration.bringPassportLater ? 'bringLater' : 'missing',
            statusText: registration.passportUrl ? '✅' : registration.bringPassportLater ? '⏳ BÜRO' : '❌ FEHLT'
        },
        {
            key: 'residenceUrl',
            label: 'Meldezettel',
            url: registration.residenceUrl,
            status: registration.residenceUrl ? 'available' : registration.bringResidenceLater ? 'bringLater' : 'missing',
            statusText: registration.residenceUrl ? '✅' : registration.bringResidenceLater ? '⏳ BÜRO' : '❌ FEHLT'
        },
        {
            key: 'firstAidUrl',
            label: 'Erste Hilfe',
            url: registration.firstAidUrl,
            status: registration.firstAidUrl ? 'available' : 'missing', // First aid optional, no "bring later" specific logic usually?
            statusText: registration.firstAidUrl ? '✅' : '-'
        }
    ];

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 cursor-pointer';
            case 'bringLater': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
            case 'missing': 
            default: return 'bg-red-500/10 border-red-500/30 text-red-500';
        }
    };

    // Helper to check if file is image based on extension
    const isImage = (url: string) => {
        if (!url) return false;
        return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                {documents.map((doc) => (
                    <div
                        key={doc.key}
                        onClick={() => doc.status === 'available' && doc.url && setViewingUrl(doc.url)}
                        className={`px-3 py-2 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-between transition-all ${getStatusClasses(doc.status)} ${doc.status === 'missing' && doc.key === 'firstAidUrl' ? 'bg-white/5 border-white/10 text-muted-foreground' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            {doc.status === 'available' ? <Eye className="w-3 h-3" /> : <FileText className="w-3 h-3" />} 
                            {doc.label}
                        </div>
                        <span>{doc.statusText}</span>
                    </div>
                ))}
            </div>

            {/* Document Viewer Modal */}
            {viewingUrl && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-10">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setViewingUrl(null)} />
                    
                    <div className="relative z-10 w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center">
                        <button
                            onClick={() => setViewingUrl(null)}
                            className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                        >
                            Schließen <X className="w-6 h-6" />
                        </button>
                        
                        <div className="bg-[#0a0a0a] border border-white/10 p-2 shadow-2xl w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                            {isImage(viewingUrl) ? (
                                <img 
                                    src={viewingUrl} 
                                    alt="Dokument Vorschau" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <iframe 
                                    src={viewingUrl} 
                                    className="w-full h-full border-none"
                                    title="Dokument Vorschau"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
