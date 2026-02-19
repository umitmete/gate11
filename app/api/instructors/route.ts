import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { translateText } from '@/lib/translation-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = (searchParams.get('lang') || 'de') as any;

        // Ham SQL sorgusu ile eğitmenleri al
        const instructors = await prisma.$queryRaw`
            SELECT * FROM "Instructor" 
            WHERE isVisible = 1
            ORDER BY "order" ASC
        ` as any[];

        // Eğer dil Almanca değilse çeviri yap
        if (lang !== 'de' && instructors.length > 0) {
            const translatedInstructors = await Promise.all(
                instructors.map(async (inst) => {
                    try {
                        const [translatedRole, translatedBio] = await Promise.all([
                            translateText(inst.role, lang),
                            inst.bio ? translateText(inst.bio, lang) : Promise.resolve(null)
                        ]);
                        return {
                            id: inst.id,
                            name: inst.name,
                            image: inst.imageUrl,
                            role: translatedRole,
                            bio: translatedBio,
                            license: inst.licenseTypes
                        };
                    } catch (err) {
                        console.error(`Translation failed for instructor ${inst.name}: `, err);
                        return {
                            id: inst.id,
                            name: inst.name,
                            image: inst.imageUrl,
                            role: inst.role,
                            bio: inst.bio,
                            license: inst.licenseTypes
                        };
                    }
                })
            );
            return NextResponse.json(translatedInstructors);
        }

        // Almanca veya çeviri başarısız/gerekli olmayan durumlar
        const formatted = instructors.map(inst => ({
            id: inst.id,
            name: inst.name,
            image: inst.imageUrl,
            role: inst.role,
            bio: inst.bio,
            license: inst.licenseTypes
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Public Team API Error:', error);
        return NextResponse.json([], { status: 200 });
    }
}
