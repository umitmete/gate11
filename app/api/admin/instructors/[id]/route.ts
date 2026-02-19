import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        const data = await request.json();

        // Veriyi Prisma Schema formatına dönüştür
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.image) updateData.imageUrl = data.image; // Frontend: image -> Backend: imageUrl
        if (data.roleDe) updateData.role = data.roleDe;   // Frontend: roleDe -> Backend: role
        if (data.bioDe) updateData.bio = data.bioDe;     // Frontend: bioDe -> Backend: bio
        if (data.license) updateData.licenseTypes = data.license; // Frontend: license -> Backend: licenseTypes
        if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;

        // Sıralama (Order) Değişikliği ve Swap Mantığı
        if (data.order !== undefined) {
            const currentInstructor = await prisma.instructor.findUnique({
                where: { id },
                select: { order: true }
            });

            if (currentInstructor && currentInstructor.order !== data.order) {
                // Hedef sırada başka biri var mı kontrol et
                const collision = await prisma.instructor.findFirst({
                    where: {
                        order: data.order,
                        id: { not: id }
                    }
                });

                if (collision) {
                    // Swap: Çakışan kişiyi, mevcut kişinin eski sırasına ata
                    await prisma.instructor.update({
                        where: { id: collision.id },
                        data: { order: currentInstructor.order }
                    });
                }
            }
            updateData.order = data.order;
        }

        await prisma.instructor.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Instructor API PATCH Error:', error);
        return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;

        // Önce resim URL'sini alalım (silmek için)
        // Prisma ile kaydı çek
        const instructor = await prisma.instructor.findUnique({
            where: { id },
            select: { imageUrl: true }
        });

        if (instructor?.imageUrl && instructor.imageUrl.startsWith('/uploads/')) {
            try {
                const { unlink } = await import('fs/promises');
                const path = await import('path');
                const absolutePath = path.join(process.cwd(), 'public', instructor.imageUrl);
                await unlink(absolutePath);
            } catch (err) {
                console.error('File delete error:', err);
            }
        }

        // Kaydı sil
        await prisma.instructor.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Instructor API DELETE Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
