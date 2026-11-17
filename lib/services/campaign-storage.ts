import crypto from 'crypto';
import path from 'path';
import { mkdir, writeFile, unlink } from 'fs/promises';

function getSafeExtension(file: File): string {
    const extFromName = path.extname(file.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (extFromName && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(extFromName)) {
        return extFromName;
    }
    const mimeMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/avif': 'avif',
    };
    return mimeMap[file.type] || 'jpg';
}

export async function uploadCampaignImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = getSafeExtension(file);
    const filename = `campaign_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;

    // Try Vercel Blob first (for both production and configured local environments)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
            const { put } = await import('@vercel/blob');
            const blob = await put(`campaigns/${filename}`, buffer, {
                access: 'public',
                addRandomSuffix: false,
                contentType: file.type || 'image/jpeg',
            });
            return blob.url;
        } catch (blobError) {
            console.error('Vercel Blob upload failed, falling back to local storage:', blobError);
        }
    }

    // Fallback to local public/uploads/campaigns
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'campaigns');
    await mkdir(uploadDir, { recursive: true });
    const absolutePath = path.join(uploadDir, filename);
    await writeFile(absolutePath, buffer);

    return `/uploads/campaigns/${filename}`;
}

export async function deleteCampaignImage(imageUrl: string | null | undefined): Promise<void> {
    if (!imageUrl || typeof imageUrl !== 'string') return;

    if (imageUrl.includes('public.blob.vercel-storage.com')) {
        try {
            const { del } = await import('@vercel/blob');
            await del(imageUrl);
        } catch (blobErr) {
            console.error('Vercel Blob delete error:', blobErr);
        }
        return;
    }

    if (imageUrl.startsWith('/uploads/campaigns/')) {
        try {
            const relativeFile = imageUrl.replace(/^\/+/, '');
            const absolutePath = path.join(process.cwd(), 'public', relativeFile);
            await unlink(absolutePath);
        } catch (fsErr: any) {
            if (fsErr?.code !== 'ENOENT') {
                console.error('Local campaign image delete error:', fsErr);
            }
        }
    }
}

export function parseStartDate(dateStr?: string | null): Date | null {
    if (!dateStr || typeof dateStr !== 'string' || !dateStr.trim()) return null;
    const trimmed = dateStr.trim();
    const d = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
        ? new Date(`${trimmed}T00:00:00.000`)
        : new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
}

export function parseEndDate(dateStr?: string | null): Date | null {
    if (!dateStr || typeof dateStr !== 'string' || !dateStr.trim()) return null;
    const trimmed = dateStr.trim();
    const d = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
        ? new Date(`${trimmed}T23:59:59.999`)
        : new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
}

export async function deactivateExpiredCampaigns(prisma: any): Promise<void> {
    await prisma.campaign.updateMany({
        where: {
            isActive: true,
            endDate: { lt: new Date() },
        },
        data: {
            isActive: false,
        },
    });
}

export async function getCurrentlyLiveCampaigns(prisma: any) {
    await deactivateExpiredCampaigns(prisma);
    const now = new Date();
    return prisma.campaign.findMany({
        where: {
            isActive: true,
            AND: [
                { OR: [{ startDate: null }, { startDate: { lte: now } }] },
                { OR: [{ endDate: null }, { endDate: { gte: now } }] },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function getCurrentlyLiveCampaign(prisma: any) {
    const list = await getCurrentlyLiveCampaigns(prisma);
    return list[0] || null;
}
