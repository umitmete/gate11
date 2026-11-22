import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { translateCampaignFields } from '@/lib/translation-service';
import { resolveCampaignEffect } from '@/lib/campaign-effects';
import {
    deactivateExpiredCampaigns,
    deleteCampaignImage,
    isManagedCampaignImageUrl,
    parseStartDate,
    parseEndDate,
} from '@/lib/services/campaign-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await deactivateExpiredCampaigns(prisma);
        const campaigns = await prisma.campaign.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    let uploadedImageUrl: string | null = null;
    try {
        const body = await request.json();
        const {
            title,
            subtitle,
            badge,
            description,
            imageUrl,
            buttonText,
            buttonLink,
            isActive,
            showEffects,
            effectType,
            startDate,
            endDate,
        } = body;

        if (isManagedCampaignImageUrl(imageUrl)) {
            uploadedImageUrl = imageUrl;
        }

        if (!title || !description) {
            if (uploadedImageUrl) {
                await deleteCampaignImage(uploadedImageUrl);
            }
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const resolvedEffect = resolveCampaignEffect(effectType, showEffects);

        const translations = await translateCampaignFields({
            title,
            subtitle,
            badge,
            description,
        });

        const campaign = await prisma.campaign.create({
            data: {
                title,
                subtitle: subtitle || null,
                badge: badge || null,
                description,
                imageUrl: imageUrl || null,
                buttonText: buttonText || 'Zu den Paketen',
                buttonLink: buttonLink || '/Fahrakademie',
                isActive: Boolean(isActive),
                showEffects: resolvedEffect !== 'none',
                effectType: resolvedEffect,
                translations,
                startDate: parseStartDate(startDate),
                endDate: parseEndDate(endDate),
            },
        });

        revalidatePath('/');
        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        if (uploadedImageUrl) {
            await deleteCampaignImage(uploadedImageUrl);
        }
        console.error('Failed to create campaign:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
