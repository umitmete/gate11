import { NextResponse } from 'next/server';
import { uploadCampaignImage } from '@/lib/services/campaign-storage';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        if (!file.type || !file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        const url = await uploadCampaignImage(file);
        return NextResponse.json({ url }, { status: 200 });
    } catch (error) {
        console.error('Campaign image upload error:', error);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
    }
}
