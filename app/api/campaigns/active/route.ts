import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentlyLiveCampaigns } from '@/lib/services/campaign-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const activeCampaigns = await getCurrentlyLiveCampaigns(prisma);
        return NextResponse.json(activeCampaigns || [], { status: 200 });
    } catch (error) {
        console.error('Active campaign fetch error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
