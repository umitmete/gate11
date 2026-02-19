import { NextResponse } from 'next/server';
import { getActiveYearlyPlans, createYearlyPlan } from '@/lib/services/plans';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // URL'den courseType parametresini al
        const { searchParams } = new URL(request.url);
        const courseType = searchParams.get('type') as 'DAY' | 'NIGHT' | null;

        const plans = await getActiveYearlyPlans(courseType || undefined);
        return NextResponse.json(plans, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Failed to fetch plans:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, startDate, endDate, courseType } = body;

        if (!title || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const plan = await createYearlyPlan({
            title,
            description: description || '',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            courseType: courseType || 'DAY', // Varsayılan olarak DAY
        });

        return NextResponse.json(plan, { status: 201 });
    } catch (error) {
        console.error('Failed to create plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
