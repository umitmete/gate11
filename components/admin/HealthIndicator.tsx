'use client';

import { useEffect, useState } from 'react';

export default function HealthIndicator() {
    const [status, setStatus] = useState<'online' | 'offline' | 'loading'>('loading');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Timestamp hinzufügen, um Cache zu verhindern
                const res = await fetch(`/api/admin/health?t=${Date.now()}`);
                if (res.ok) {
                    setStatus('online');
                } else {
                    setStatus('offline');
                }
            } catch (err) {
                setStatus('offline');
            }
        };

        checkHealth();
        // Alle 30 Sekunden prüfen
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4 transition-all duration-500">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                status === 'offline' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-bounce' :
                    'bg-gray-500 opacity-50'
                }`} title={status === 'online' ? 'System Aktiv' : status === 'offline' ? 'Verbindungsproblem!' : 'Wird überprüft...'} />

            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${status === 'online' ? 'text-muted-foreground' :
                status === 'offline' ? 'text-red-500' :
                    'text-muted-foreground/30'
                }`}>
                {status === 'online' ? 'Server Live' :
                    status === 'offline' ? 'Server Offline' :
                        'Checking...'}
            </span>
        </div>
    );
}
