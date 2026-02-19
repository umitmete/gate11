'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCw, Check, AlertCircle } from 'lucide-react';

export type DocumentType = 'idCard' | 'idCardBack' | 'passport' | 'residence' | 'residenceBack' | 'firstAid';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (blob: Blob) => void;
    title: string;
    documentType?: DocumentType;
}

// Document template configurations
// idCard/idCardBack: ID-1 standard (credit card size) - 85.6mm × 53.98mm → aspect ratio 1.586:1 (landscape)
// passport: Passport book page - 125mm × 88mm → aspect ratio ~1.42:1 (landscape)
// residence/residenceBack/firstAid: A4 paper - 210mm × 297mm → aspect ratio 1:1.414 (portrait)
function getDocumentConfig(type?: DocumentType) {
    switch (type) {
        case 'passport':
            return {
                aspectRatio: 'aspect-[1.42/1]',    // Passport landscape ratio
                cropRatio: 1.42,                     // Used for canvas crop
                widthPercent: 0.80,                  // Slightly smaller to fit passport shape
                label: 'PASSPORT',
            };
        case 'residence':
        case 'residenceBack':
        case 'firstAid':
            return {
                aspectRatio: 'aspect-[1/1.414]',    // A4 portrait ratio
                cropRatio: 1 / 1.414,                // Portrait: width < height
                widthPercent: 0.60,                  // Narrower since it's portrait
                label: 'A4',
            };
        case 'idCard':
        case 'idCardBack':
        default:
            return {
                aspectRatio: 'aspect-[1.58/1]',     // ID-1 standard landscape ratio
                cropRatio: 1.58,                      // Used for canvas crop
                widthPercent: 0.85,                   // 85% of video width
                label: 'ID',
            };
    }
}

export function CameraModal({ isOpen, onClose, onCapture, title, documentType }: CameraModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const config = getDocumentConfig(documentType);

    useEffect(() => {
        if (isOpen && !preview) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, preview]);

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Kamera erişimi reddedildi veya bulunamadı. / Camera access denied or not found.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsCapturing(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            const cropRatio = config.cropRatio;
            const widthPercent = config.widthPercent;

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            let sourceWidth: number;
            let sourceHeight: number;

            if (cropRatio >= 1) {
                // Landscape document (ID card, passport)
                sourceWidth = videoWidth * widthPercent;
                sourceHeight = sourceWidth / cropRatio;

                // Safety check: ensure height doesn't exceed available space
                if (sourceHeight > videoHeight * 0.85) {
                    sourceHeight = videoHeight * 0.85;
                    sourceWidth = sourceHeight * cropRatio;
                }
            } else {
                // Portrait document (A4 - residence, first aid)
                // For portrait, height is the dominant dimension
                sourceHeight = videoHeight * 0.85;
                sourceWidth = sourceHeight * cropRatio;

                // Safety check: ensure width doesn't exceed available space
                if (sourceWidth > videoWidth * widthPercent) {
                    sourceWidth = videoWidth * widthPercent;
                    sourceHeight = sourceWidth / cropRatio;
                }
            }

            const startX = (videoWidth - sourceWidth) / 2;
            const startY = (videoHeight - sourceHeight) / 2;

            // Set canvas size specifically to the document dimensions for high-res output
            canvas.width = sourceWidth;
            canvas.height = sourceHeight;

            // Perform the crop: Draw only the template area from the video stream
            context.drawImage(
                video,
                startX, startY, sourceWidth, sourceHeight, // Crop source
                0, 0, canvas.width, canvas.height           // Target destination
            );

            // Export with higher quality since it's a document scan
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setPreview(dataUrl);
            stopCamera();
        }
        setIsCapturing(false);
    };

    const handleConfirm = () => {
        if (!preview) return;

        // Convert dataUrl back to blob
        fetch(preview)
            .then(res => res.blob())
            .then(blob => {
                onCapture(blob);
                handleClose();
            });
    };

    const handleRetake = () => {
        setPreview(null);
        startCamera();
    };

    const handleClose = () => {
        setPreview(null);
        setError(null);
        stopCamera();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-4 md:p-8"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                    <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em]">{title}</h3>
                    <button onClick={handleClose} className="p-2 text-white/60 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Viewport Area */}
                <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    {!preview ? (
                        <>
                            {error ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                    <p className="text-white text-sm font-medium">{error}</p>
                                    <button onClick={startCamera} className="mt-4 px-6 py-2 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest">↻</button>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Guidance Template / Overlay - adapts to document type */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className={`${documentType === 'passport'
                                                ? 'w-[80%] aspect-[1.42/1]'
                                                : (documentType === 'residence' || documentType === 'residenceBack' || documentType === 'firstAid')
                                                    ? 'h-[85%] aspect-[1/1.414]'
                                                    : 'w-[85%] aspect-[1.58/1]'
                                            } border-2 border-primary/50 rounded-xl relative shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]`}>
                                            {/* Corners */}
                                            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                                            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                                            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

                                            {/* Document type indicator */}
                                            <div className="absolute top-2 left-3 text-primary/40 text-[8px] font-bold uppercase tracking-widest">
                                                {config.label}
                                            </div>

                                            {/* Flash Effect Placeholder */}
                                            {isCapturing && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white" />}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-0 right-0 flex justify-center px-8 text-center">
                                        <p className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">
                                            {(documentType === 'residence' || documentType === 'residenceBack' || documentType === 'firstAid')
                                                ? '↕ A4'
                                                : '↔'
                                            }
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <img src={preview} className="w-full h-full object-contain bg-black" alt="Capture preview" />
                    )}
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex items-center gap-8">
                    {!preview ? (
                        <button
                            disabled={!!error || !stream}
                            onClick={capturePhoto}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
                        >
                            <div className="w-16 h-16 rounded-full border-4 border-black" />
                        </button>
                    ) : (
                        <div className="flex gap-6">
                            <button
                                onClick={handleRetake}
                                className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <RotateCw className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 transition-all"
                            >
                                <Check className="w-8 h-8" />
                            </button>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </motion.div>
        </AnimatePresence>
    );
}
