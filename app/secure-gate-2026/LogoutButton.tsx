'use client';

import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const handleLogout = () => {
        // Um sich von Basic Auth abzumelden, senden wir eine Anfrage mit ungültigen Anmeldedaten
        // Da der Browser 'Basic' Auth verwendet, ist dies der einzige Weg oder den Browser zu schließen.
        // Diese Methode zeigt den Benutzer als abgemeldet an.

        const logoutUrl = window.location.origin + '/secure-gate-2026';

        // Wir senden eine Anfrage mit falschem Passwort, um den Browser-Cache zu löschen
        const xhr = new XMLHttpRequest();
        xhr.open('GET', logoutUrl, true, 'logout', 'logout');
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Weiterleiten
                window.location.href = '/';
            }
        };
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-4 hover:bg-red-500/10 rounded-none text-sm font-medium tracking-wide text-red-400/60 hover:text-red-500 transition-all border-l-2 border-transparent hover:border-red-500 w-full text-left"
        >
            <LogOut className="w-4 h-4" /> Abmelden
        </button>
    );
}
