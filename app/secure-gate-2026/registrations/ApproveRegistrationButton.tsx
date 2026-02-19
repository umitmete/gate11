'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ApproveRegistrationButtonProps {
    registrationId: string;
    isApproved: boolean;
}

export default function ApproveRegistrationButton({ registrationId, isApproved }: ApproveRegistrationButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        if (isApproved) return;

        if (!confirm('Sind Sie sicher, dass Sie diese Voranmeldung bestätigen und in die Schülerliste aufnehmen möchten?')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/registrations/${registrationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'APPROVED' })
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Bestätigung fehlgeschlagen.');
            }
        } catch (error) {
            console.error('Approval error:', error);
            alert('Ein Fehler ist aufgetreten.');
        } finally {
            setLoading(false);
        }
    };

    if (isApproved) {
        return (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest border border-green-500/30">
                <Check className="w-4 h-4" /> Bestätigt
            </div>
        );
    }

    return (
        <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Bestätigen
        </button>
    );
}
