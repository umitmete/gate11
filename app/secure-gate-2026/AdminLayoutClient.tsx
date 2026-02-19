'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, FileText, GraduationCap, Calendar, Users, LogOut } from 'lucide-react';
import LogoutButton from './LogoutButton';
import HealthIndicator from '@/components/admin/HealthIndicator';
import { usePathname } from 'next/navigation';

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/secure-gate-2026', label: 'Übersicht', icon: Home },
        { href: '/secure-gate-2026/Voranmeldungen', label: 'Voranmeldungen', icon: FileText },
        { href: '/secure-gate-2026/Schuelerlisten', label: 'Schülerlisten', icon: Users },
        { href: '/secure-gate-2026/courses', label: 'Fahrakademie', icon: GraduationCap },
        { href: '/secure-gate-2026/kurse', label: 'Kurse', icon: Calendar },
        { href: '/secure-gate-2026/Jahresplan', label: 'Jahresplan', icon: Calendar },
        { href: '/secure-gate-2026/Team', label: 'Team', icon: Users },
    ];

    return (
        <div className="flex min-h-screen bg-[#050505] text-[#ededed]">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-3">
                    <img src="/Gate11_Logo_beyaz.svg" alt="GATE 11" className="h-6 w-auto" />
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-white hover:text-[#D4AF37] transition-colors"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Backdrop (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9990] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 right-0 w-72 bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl z-[9999] transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                lg:relative lg:inset-y-auto lg:left-0 lg:right-auto lg:translate-x-0 lg:border-r lg:border-l-0 lg:block lg:z-0
            `}>
                <div className="p-8 pb-4 hidden lg:block">
                    <div className="group cursor-default">
                        <img src="/Gate11_Logo_beyaz.svg" alt="GATE 11 Logo" className="h-10 w-auto object-contain mb-2" />
                        <span className="text-[10px] font-sans text-muted-foreground block uppercase tracking-[0.3em] group-hover:text-primary transition-colors">Admin Konsole</span>
                    </div>
                </div>

                {/* Mobile Logo in Sidebar Header */}
                <div className="p-6 flex items-center justify-between lg:hidden border-b border-white/5">
                    <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-[0.3em]">Navigation</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 -mr-2 text-white hover:text-red-500 transition-colors"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-1 flex-1 px-4 py-6 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all
                                ${isActive(item.href)
                                    ? 'bg-white/10 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-[#D4AF37]'
                                }
                            `}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <LogoutButton />
                    </div>

                    <div className="pt-4 mt-2">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-white transition-colors">
                            <span className="text-xs">&larr;</span> Zur Website
                        </Link>
                    </div>
                </nav>

                <div className="p-6 text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest border-t border-white/5 bg-[#0a0a0a]">
                    Sicherheit: Aktiv <br />
                    v1.0.0 • GATE11
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pt-16 lg:pt-0">
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 lg:px-10 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-30 hidden lg:flex">
                    <h1 className="font-serif text-xl italic tracking-tight text-white">Systemverwaltung</h1>
                    <HealthIndicator />
                </header>

                {/* Mobile Health Indicator Bar */}
                <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-6 py-2 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Status</span>
                    <HealthIndicator />
                </div>

                <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.02),transparent)] p-4 md:p-10">
                    <div className="max-w-7xl mx-auto pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
