import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { translateText, translateArray } from '@/lib/translation-service';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const pkg = await prisma.coursePackage.findUnique({
            where: { id: params.id }
        });
        if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(pkg);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const data = await request.json();
        const updated = await prisma.coursePackage.update({
            where: { id: params.id },
            data: {
                title: data.title,
                tag: data.tag,
                price: data.price,
                isVisible: data.isVisible,
                order: data.order
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const data = await request.json();

        // SWAP MANTIĞI: Eğer sıra değişiyorsa ve hedef sıra doluysa, yer değiştir.
        if (data.order !== undefined) {
            const targetOrder = Number(data.order);
            const currentPkg = await prisma.coursePackage.findUnique({
                where: { id: params.id },
                select: { order: true }
            });

            if (currentPkg && currentPkg.order !== targetOrder) {
                // Hedef sırada birisi var mı?
                const collision = await prisma.coursePackage.findFirst({
                    where: {
                        order: targetOrder,
                        id: { not: params.id }
                    }
                });

                if (collision) {
                    // Varsa, onun sırasını bizim eski sıramıza al (Swap)
                    await prisma.coursePackage.update({
                        where: { id: collision.id },
                        data: { order: currentPkg.order }
                    });
                }
            }
        }

        let updateQuery = 'UPDATE "CoursePackage" SET ';
        const fields = [];
        if (data.showDate !== undefined) fields.push(`"showDate" = ${data.showDate ? 'true' : 'false'}`);
        if (data.showPrice !== undefined) fields.push(`"showPrice" = ${data.showPrice ? 'true' : 'false'}`);
        if (data.isVisible !== undefined) fields.push(`"isVisible" = ${data.isVisible ? 'true' : 'false'}`);
        if (data.order !== undefined) fields.push(`"order" = ${Number(data.order)}`);

        if (fields.length > 0) {
            updateQuery += fields.join(', ') + ` WHERE "id" = '${params.id}'`;
            await prisma.$executeRawUnsafe(updateQuery);
        }

        const pkg = await prisma.coursePackage.findUnique({ where: { id: params.id } });
        return NextResponse.json(pkg || { success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        await prisma.coursePackage.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
