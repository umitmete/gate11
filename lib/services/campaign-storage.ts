import crypto from 'crypto';
import path from 'path';
import { mkdir, writeFile, unlink } from 'fs/promises';

export const MAX_CAMPAIGN_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel 4.5 MB limitinin altında)

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'] as const;
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
];

const MIME_BY_EXT: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    avif: 'image/avif',
};

export function isAllowedCampaignImage(file: File): boolean {
    const mime = (file.type || '').toLowerCase().split(';')[0].trim();
    const ext = path.extname(file.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    if (mime.includes('svg') || ext === 'svg') {
        return false;
    }

    if (mime && mime !== 'application/octet-stream') {
        return ALLOWED_MIME_TYPES.includes(mime);
    }

    return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

export function isManagedCampaignImageUrl(imageUrl: string | null | undefined): boolean {
    if (!imageUrl || typeof imageUrl !== 'string') return false;
    return imageUrl.includes('.blob.vercel-storage.com') || imageUrl.startsWith('/uploads/campaigns/');
}

function getSafeExtension(file: File): string {
    const extFromName = path.extname(file.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (extFromName && (ALLOWED_EXTENSIONS as readonly string[]).includes(extFromName)) {
        return extFromName;
    }
    const mimeMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/avif': 'avif',
    };
    const normalizedMime = (file.type || '').toLowerCase().split(';')[0].trim();
    return mimeMap[normalizedMime] || 'jpg';
}

export async function uploadCampaignImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = getSafeExtension(file);
    const filename = `campaign_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const contentType = MIME_BY_EXT[ext] || 'image/jpeg';

    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    const isVercel = Boolean(process.env.VERCEL);

    if (token) {
        try {
            const { put } = await import('@vercel/blob');
            const blob = await put(`campaigns/${filename}`, buffer, {
                access: 'public',
                addRandomSuffix: false,
                contentType,
                token,
            });
            return blob.url;
        } catch (blobError) {
            console.error('Vercel Blob upload failed:', blobError);
            if (isVercel) {
                throw new Error(
                    `Vercel Blob upload failed: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`
                );
            }
        }
    } else if (isVercel) {
        throw new Error('BLOB_READ_WRITE_TOKEN is not configured in Vercel environment variables.');
    }

    // Local development fallback (public/uploads/campaigns)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'campaigns');
    await mkdir(uploadDir, { recursive: true });
    const absolutePath = path.join(uploadDir, filename);
    await writeFile(absolutePath, buffer);

    return `/uploads/campaigns/${filename}`;
}

export async function deleteCampaignImage(imageUrl: string | null | undefined): Promise<boolean> {
    if (!imageUrl || typeof imageUrl !== 'string') return true;

    if (imageUrl.includes('.blob.vercel-storage.com')) {
        const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
        const delOptions = token ? { token } : undefined;

        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const { del } = await import('@vercel/blob');
                await del(imageUrl, delOptions);
                return true;
            } catch (blobErr) {
                if (attempt === 0) {
                    await new Promise((resolve) => setTimeout(resolve, 300));
                    continue;
                }
                console.error('Vercel Blob delete error:', blobErr);
                return false;
            }
        }
        return false;
    }

    if (imageUrl.startsWith('/uploads/campaigns/')) {
        const filename = path.basename(imageUrl);
        if (!filename || imageUrl !== `/uploads/campaigns/${filename}`) {
            return false;
        }
        try {
            const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'campaigns', filename);
            await unlink(absolutePath);
            return true;
        } catch (fsErr: any) {
            if (fsErr?.code === 'ENOENT') {
                return true;
            }
            console.error('Local campaign image delete error:', fsErr);
            return false;
        }
    }

    return true;
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
