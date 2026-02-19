'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface DeletePlanButtonProps {
    planId: string;
    planTitle: string;
}

export default function DeletePlanButton({ planId, planTitle }: DeletePlanButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Möchten Sie "${planTitle}" wirklich löschen?`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/plans/${planId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Kurs konnte nicht gelöscht werden.');
            }
        } catch (err) {
            console.error(err);
            alert('Fehler beim Löschen.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 rounded"
            title="Löschen"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
