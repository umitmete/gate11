'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react';

type Category = {
    id: string;
    name: string;
    order: number;
};

export default function PackageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/package-categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        try {
            const res = await fetch('/api/admin/package-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.toUpperCase(), order: categories.length }),
            });
            if (res.ok) {
                const newCat = await res.json();
                setCategories([...categories, newCat]);
                setNewName('');
                setIsAdding(false);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        try {
            const res = await fetch(`/api/admin/package-categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, order: categories.find(c => c.id === id)?.order }),
            });
            if (res.ok) {
                const updatedCat = await res.json();
                setCategories(categories.map(c => (c.id === id ? updatedCat : c)));
                setEditingId(null);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Diese Kategorie löschen?')) return;
        try {
            const res = await fetch(`/api/admin/package-categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    if (loading) {
        return <div className="h-10 flex items-center text-xs text-gray-500">Kategorien werden geladen...</div>;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 py-3 border-b border-white/10">
            {/* Static "ALLE" pill */}
            <div className="flex items-center gap-1 px-4 py-1.5 border border-[#D4AF37]/40 bg-[#D4AF37]/5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Alle Pakete
            </div>

            {/* Dynamic categories */}
            {categories.map(cat => (
                <div
                    key={cat.id}
                    className="group flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-gray-300 hover:border-white/30 transition-all"
                >
                    {editingId === cat.id ? (
                        <>
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                                className="bg-transparent outline-none text-white w-24 text-xs font-bold uppercase"
                                autoFocus
                            />
                            <button
                                onClick={() => handleUpdate(cat.id)}
                                className="text-green-400 hover:text-green-300 ml-1"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setEditingId(null)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <span>{cat.name}</span>
                            <button
                                onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-all ml-1"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500/70 hover:text-red-400 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </>
                    )}
                </div>
            ))}

            {/* Inline add */}
            {isAdding ? (
                <div className="flex items-center gap-1 px-3 py-1.5 border border-[#D4AF37]/50 rounded-full bg-[#D4AF37]/5">
                    <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setIsAdding(false); setNewName(''); } }}
                        placeholder="B-PAKETE"
                        className="bg-transparent outline-none text-white text-xs font-bold uppercase w-24 placeholder:text-gray-600"
                        autoFocus
                    />
                    <button onClick={handleAdd} className="text-green-400 hover:text-green-300">
                        <Check size={14} />
                    </button>
                    <button onClick={() => { setIsAdding(false); setNewName(''); }} className="text-red-400 hover:text-red-300">
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center justify-center w-7 h-7 border border-dashed border-white/20 rounded-full text-gray-500 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    title="Neue Kategorie hinzufügen"
                >
                    <Plus size={14} />
                </button>
            )}
        </div>
    );
}
