import { prisma } from "@/lib/db";
import InstructorsClient from './InstructorsClient';

export const dynamic = 'force-dynamic';

async function getInstructors() {
    try {
        const instructors = await prisma.instructor.findMany({
            orderBy: { order: 'asc' }
        });

        // Veriyi Client component'in beklediği formata dönüştür
        return instructors.map(inst => ({
            id: inst.id,
            name: inst.name,
            image: inst.imageUrl, // Schema: imageUrl -> Client: image
            roleDe: inst.role,    // Schema: role -> Client: roleDe
            bioDe: inst.bio,      // Schema: bio -> Client: bioDe
            license: inst.licenseTypes || '', // Schema: licenseTypes -> Client: license (BOŞ OLAMAZ)
            isVisible: inst.isVisible,
            order: inst.order,
            roleEn: '', roleTr: '', bioEn: '', bioTr: '' // Diğer diller boş
        }));
    } catch (error) {
        console.error('Instructors Fetch Error:', error);
        return [];
    }
}

export default async function AdminInstructorsPage() {
    const instructors = await getInstructors();
    return <InstructorsClient initialInstructors={instructors as any} />;
}
