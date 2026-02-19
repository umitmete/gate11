'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { encrypt, verifyPassword } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function authenticate(_currentState: unknown, formData: FormData) {
    try {
        const result = loginSchema.safeParse(Object.fromEntries(formData));

        if (!result.success) {
            return { error: 'Geçersiz giriş formatı.' };
        }

        const { email, password } = result.data;

        // Admin kullanıcısını bul
        const user = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (!user) {
            // Güvenlik: Kullanıcı bulunamadı dememek için genel hata veriyoruz
            // Ama burada audit log tutulabilir
            return { error: 'Giriş bilgileri hatalı.' };
        }

        // Şifre kontrolü
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return { error: 'Giriş bilgileri hatalı.' };
        }

        // Oturum oluştur
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat
        const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role }, expires });

        // Cookie ayarla
        const cookieStore = await cookies();
        cookieStore.set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Bir hata oluştu.' };
    }

    // Redirect try-catch bloğunun dışında olmalı
    redirect('/secure-gate-2026');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}
