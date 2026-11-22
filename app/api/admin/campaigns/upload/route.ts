import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
    uploadCampaignImage,
    deleteCampaignImage,
    isAllowedCampaignImage,
    isManagedCampaignImageUrl,
    MAX_CAMPAIGN_IMAGE_BYTES,
} from '@/lib/services/campaign-storage';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        if (file.size === 0) {
            return NextResponse.json({ error: 'Image file is empty' }, { status: 400 });
        }

        if (file.size > MAX_CAMPAIGN_IMAGE_BYTES) {
            return NextResponse.json({ error: 'Image exceeds maximum size (4 MB)' }, { status: 413 });
        }

        if (!isAllowedCampaignImage(file)) {
            return NextResponse.json(
                { error: 'Only JPG, PNG, WEBP, GIF, and AVIF image files are allowed' },
                { status: 400 }
            );
        }

        const url = await uploadCampaignImage(file);
        return NextResponse.json({ url }, { status: 200 });
    } catch (error) {
        console.error('Campaign image upload error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error && error.message ? error.message : 'Image upload failed',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json().catch(() => null);
        const url = body?.url;

        if (!isManagedCampaignImageUrl(url)) {
            return NextResponse.json({ error: 'Invalid campaign image URL' }, { status: 400 });
        }

        const deleted = await deleteCampaignImage(url);
        return NextResponse.json({ deleted }, { status: deleted ? 200 : 500 });
    } catch (error) {
        console.error('Campaign image delete error:', error);
        return NextResponse.json({ error: 'Image delete failed' }, { status: 500 });
    }
}
