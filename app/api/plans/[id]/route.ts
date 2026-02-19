import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { title, description, startDate, endDate, courseType, isActive } = body;

        if (!title || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const data: any = {
            title,
            description: description || '',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            courseType: courseType || 'DAY',
        };

        if (typeof isActive === 'boolean') {
            data.isActive = isActive;
        }

        const plan = await prisma.yearlyPlan.update({
            where: { id: params.id },
            data,
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Failed to update plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { isActive } = body;

        const plan = await prisma.yearlyPlan.update({
            where: { id: params.id },
            data: { isActive },
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Failed to patch plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        await prisma.yearlyPlan.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
