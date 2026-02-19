'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TogglePlanVisibilityProps {
    planId: string;
    isActive: boolean;
}

export default function TogglePlanVisibility({ planId, isActive }: TogglePlanVisibilityProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/plans/${planId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Status konnte nicht geändert werden.');
            }
        } catch (error) {
            console.error(error);
            alert('Ein Fehler ist aufgetreten.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-2 rounded border transition-all ${
                isActive 
                ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/20' 
                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white'
            }`}
            title={isActive ? 'Verstecken' : 'Anzeigen'}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isActive ? (
                <Eye className="w-5 h-5" />
            ) : (
                <EyeOff className="w-5 h-5" />
            )}
        </button>
    );
}
