import { NextResponse } from 'next/server';
import { submitRegistration } from '@/lib/services/registration';
import { z } from 'zod'; // Zod kullanımı varsayımı, veya manuel kontrol. Ekstra yükleme gerektirmemek için manuel basit kontrol kullanıyorum.

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Temel Doğrulama
        if (!body.firstName || !body.lastName || !body.email || !body.courseType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const birthDate = new Date(body.birthDate);
        if (isNaN(birthDate.getTime())) {
            return NextResponse.json({ error: 'Invalid birth date' }, { status: 400 });
        }

        const result = await submitRegistration({
            salutation: body.salutation,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            birthDate: birthDate,
            birthPlace: body.birthPlace,
            nationality: body.nationality,
            courseType: body.courseType,
            licenseClass: body.licenseClass,
            street: body.street,
            zipCode: body.zipCode,
            city: body.city,
            documentUrls: body.documentUrls,
            bringLater: body.bringLater,
            packagePrice: body.packagePrice
        });

        return NextResponse.json({ success: true, id: result.id, pdfUrl: result.registrationPdfUrl });
    } catch (error) {
        console.error('Registration failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
