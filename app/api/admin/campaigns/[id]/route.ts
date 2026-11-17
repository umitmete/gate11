import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
    deleteCampaignImage,
    parseStartDate,
    parseEndDate,
} from '@/lib/services/campaign-storage';
import { translateCampaignFields } from '@/lib/translation-service';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
            startDate,
            endDate,
        } = body;

        const hasTextUpdate =
            title !== undefined ||
            subtitle !== undefined ||
            badge !== undefined ||
            description !== undefined;

        const existing = (imageUrl !== undefined || hasTextUpdate)
            ? await prisma.campaign.findUnique({
                where: { id },
                select: {
                    imageUrl: true,
                    title: true,
                    subtitle: true,
                    badge: true,
                    description: true,
                },
            })
            : null;

        // Eğer görsel güncelleniyor veya kaldırılıyorsa eski görseli depodan sil
        if (imageUrl !== undefined && existing?.imageUrl && existing.imageUrl !== imageUrl) {
            await deleteCampaignImage(existing.imageUrl);
        }

        // Eğer metin alanlarından biri güncellendiyse diğer dillere otomatik çevir
        let translations: string | undefined;
        if (hasTextUpdate && existing) {
            translations = await translateCampaignFields({
                title: title !== undefined ? title : existing.title,
                subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
                badge: badge !== undefined ? badge : existing.badge,
                description: description !== undefined ? description : existing.description,
            });
        }

        const updatedCampaign = await prisma.campaign.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(subtitle !== undefined && { subtitle: subtitle || null }),
                ...(badge !== undefined && { badge: badge || null }),
                ...(description !== undefined && { description }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
                ...(buttonText !== undefined && { buttonText }),
                ...(buttonLink !== undefined && { buttonLink }),
                ...(isActive !== undefined && { isActive }),
                ...(showEffects !== undefined && { showEffects: Boolean(showEffects) }),
                ...(translations !== undefined && { translations }),
                ...(startDate !== undefined && { startDate: parseStartDate(startDate) }),
                ...(endDate !== undefined && { endDate: parseEndDate(endDate) }),
            },
        });

        return NextResponse.json(updatedCampaign);
    } catch (error) {
        console.error('Failed to update campaign:', error);
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existing = await prisma.campaign.findUnique({
            where: { id },
            select: { imageUrl: true },
        });

        if (existing?.imageUrl) {
            await deleteCampaignImage(existing.imageUrl);
        }

        await prisma.campaign.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete campaign:', error);
        return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
    }
}
