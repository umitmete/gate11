import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateStudentListPDF } from '@/lib/student-list-pdf';
import dayjs from '@/lib/dayjs';

export async function POST(request: Request) {
    try {
        const { groupName, studentIds } = await request.json();

        if (!studentIds || !Array.isArray(studentIds)) {
            return NextResponse.json({ error: 'Invalid students' }, { status: 400 });
        }

        const studentIdsStr = studentIds.map(id => `'${id}'`).join(',');
        const students = await prisma.$queryRawUnsafe(`
            SELECT * FROM StudentRegistration 
            WHERE id IN (${studentIdsStr})
            ORDER BY lastName ASC
        `) as any[];

        const pdfBytes = await generateStudentListPDF(groupName, students as any);

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Schuelerliste_${dayjs().format('YYYYMMDD')}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error('PDF generation error details:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
