import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRegistrationPDF } from '@/lib/pdf-generator';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch student registration data
        const student = await prisma.studentRegistration.findUnique({
            where: { id },
        });

        if (!student) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        // Prepare data for PDF generator
        const pdfData = {
            salutation: student.salutation || '',
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phone: student.phone,
            courseType: student.courseType,
            licenseClass: student.licenseClass || '',
            birthDate: new Date(student.birthDate),
            birthPlace: student.birthPlace || '',
            nationality: student.nationality || '',
            address: {
                street: student.street,
                zipCode: student.zipCode,
                city: student.city,
            },
            documentStatus: {
                idCard: student.bringIdLater ? 'BRING_LATER' : (student.idCardUrl ? 'UPLOADED' : 'BRING_LATER') as any,
                passport: student.bringPassportLater ? 'BRING_LATER' : (student.passportUrl ? 'UPLOADED' : 'BRING_LATER') as any,
                residence: student.bringResidenceLater ? 'BRING_LATER' : (student.residenceUrl ? 'UPLOADED' : 'BRING_LATER') as any,
                firstAid: student.firstAidUrl ? 'UPLOADED' : 'NOT_PROVIDED' as any,
            },
            documentUrls: {
                idCard: student.idCardUrl || undefined,
                passport: student.passportUrl || undefined,
                residence: student.residenceUrl || undefined,
                firstAid: student.firstAidUrl || undefined,
            }
        };

        const pdfBytes = await generateRegistrationPDF(pdfData);

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Anmeldung_${student.lastName}_${student.firstName}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error('Failed to generate dynamic PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
