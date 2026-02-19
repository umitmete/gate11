import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        await prisma.studentRegistration.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete registration:', error);
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

        await prisma.studentRegistration.update({
            where: { id: params.id },
            data: { ...body },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update registration:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
