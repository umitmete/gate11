import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Tüm eğitmenleri getir
export async function GET() {
    try {
        const instructors = await prisma.instructor.findMany({
            orderBy: { order: 'asc' }
        });

        // Frontend'in beklediği formata (kısmen) çeviriyoruz
        const formatted = instructors.map(inst => ({
            id: inst.id,
            name: inst.name,
            image: inst.imageUrl, // Schema: imageUrl
            roleDe: inst.role,    // Schema: role (Tek dil)
            bioDe: inst.bio,      // Schema: bio (Tek dil)
            license: inst.licenseTypes || '', // Schema: licenseTypes (Garanti boş string)
            isVisible: inst.isVisible,
            order: inst.order,
            // Diğer diller boş kalacak
            roleEn: '', roleTr: '', roleAr: '', roleFa: '',
            bioEn: '', bioTr: '', bioAr: '', bioFa: ''
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Instructors API GET Error:', error);
        return NextResponse.json([], { status: 200 });
    }
}

// POST: Yeni eğitmen ekle
export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newInstructor = await prisma.instructor.create({
            data: {
                name: data.name,
                imageUrl: data.image, // Frontend: image, Backend: imageUrl
                role: data.roleDe || data.role, // Frontend: roleDe
                bio: data.bioDe || data.bio,   // Frontend: bioDe
                licenseTypes: data.license,    // Frontend: license
                isVisible: true,
                order: data.order || 0
            }
        });

        return NextResponse.json({ success: true, id: newInstructor.id });
    } catch (error: any) {
        console.error('Instructors API POST Error:', error);
        return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
    }
}
