import { prisma } from "@/lib/db";
import { generateRegistrationPDF } from "@/lib/pdf-generator";
import { sendRegistrationEmail } from "./email";
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

interface SubmitRegistrationParams {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: Date;
    birthPlace: string;
    nationality: string;
    street: string;
    zipCode: string;
    city: string;
    courseType: string;
    packagePrice?: string;
    licenseClass: string;
    documentUrls?: {
        idCard?: string;
        idCardBack?: string;
        passport?: string;
        firstAid?: string;
        residence?: string;
        residenceBack?: string;
    };
    bringLater: {
        idCard: boolean;
        passport: boolean;
        residence: boolean;
    }
}

export async function submitRegistration(data: SubmitRegistrationParams) {
    // 1. PDF Oluştur
    const pdfBytes = await generateRegistrationPDF({
        salutation: data.salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        courseType: data.courseType,
        packagePrice: data.packagePrice,
        licenseClass: data.licenseClass,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        nationality: data.nationality,
        address: {
            street: data.street,
            zipCode: data.zipCode,
            city: data.city,
        },
        documentStatus: {
            idCard: data.bringLater.idCard ? 'BRING_LATER' : 'UPLOADED',
            passport: data.bringLater.passport ? 'BRING_LATER' : 'UPLOADED',
            residence: data.bringLater.residence ? 'BRING_LATER' : 'UPLOADED',
            firstAid: data.documentUrls?.firstAid ? 'UPLOADED' : 'NOT_PROVIDED',
        },
        documentUrls: data.documentUrls
    });

    // 2. PDF'i Vercel Blob'a Kaydet
    const fileId = crypto.randomUUID();
    const fileName = `registration_${fileId}.pdf`;

    // Server-side upload (Generated PDF is small, so this is fine)
    const { put } = await import('@vercel/blob');
    const blob = await put(`registrations/${fileName}`, Buffer.from(pdfBytes), {
        access: 'public',
        addRandomSuffix: false // We already added UUID
    });

    const publicUrl = blob.url;

    // 3. Veritabanına Kaydet (Raw SQL kullanarak)
    const id = crypto.randomUUID();
    const now = new Date();

    await prisma.$executeRaw`
        INSERT INTO StudentRegistration (
            id, salutation, firstName, lastName, email, phone, birthDate, birthPlace, nationality,
            street, zipCode, city, courseType, licenseClass, registrationPdfUrl, 
            idCardUrl, passportUrl, firstAidUrl, residenceUrl, 
            bringIdLater, bringPassportLater, bringResidenceLater, 
            status, submittedAt, updatedAt
        ) VALUES (
            ${id}, ${data.salutation}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${data.birthDate.toISOString()}, ${data.birthPlace}, ${data.nationality},
            ${data.street}, ${data.zipCode}, ${data.city}, ${data.courseType}, ${data.licenseClass}, ${publicUrl},
            ${data.documentUrls?.idCard || null}, ${data.documentUrls?.passport || null}, 
            ${data.documentUrls?.firstAid || null}, ${data.documentUrls?.residence || null},
            ${data.bringLater.idCard ? 1 : 0}, ${data.bringLater.passport ? 1 : 0}, ${data.bringLater.residence ? 1 : 0},
            'PENDING', ${now.toISOString()}, ${now.toISOString()}
        )
    `;

    // 4. Email Bildirimi Gönder (Asenkron / Arka Planda)
    // Email başarısız olursa kullanıcıyı bloklamak istemiyoruz
    sendRegistrationEmail({
        to: 'drive@fahrschulegate11.at',
        studentName: `${data.firstName} ${data.lastName}`,
        pdfPath: publicUrl, // Blob URL'sini gönderiyoruz (Email servisi bunu attachment olarak indirecek şekilde güncellenmeli veya link verilmeli)
        pdfName: `Voranmeldung_${data.lastName}.pdf`
    }).catch(err => console.error('Background email failed:', err));

    return { id, registrationPdfUrl: publicUrl };
}

// Kaydı sil
export async function deleteRegistration(id: string) {
    // 1. Önce kayıt bilgilerini al (Dosya URL'lerine erişmek için)
    // Raw SQL ile
    const registrations = await prisma.$queryRaw<any[]>`SELECT * FROM StudentRegistration WHERE id = ${id}`;
    const registration = registrations[0];

    if (registration) {
        // 2. Vercel Blob'dan dosyaları temizle
        const urlsToDelete = [
            registration.idCardUrl,
            registration.passportUrl,
            registration.firstAidUrl,
            registration.residenceUrl,
            registration.registrationPdfUrl
        ].filter(url => url && typeof url === 'string' && url.includes('public.blob.vercel-storage.com')) as string[];

        if (urlsToDelete.length > 0) {
            try {
                // Dinamik import ile del fonksiyonunu al
                const { del } = await import('@vercel/blob');
                // Hepsini paralel sil
                await Promise.all(urlsToDelete.map(url => del(url)));
                console.log(`Deleted ${urlsToDelete.length} blobs for registration ${id}`);
            } catch (error) {
                console.error('Error deleting blobs:', error);
                // Dosya silinemese bile veritabanından kaydı silmeye devam et
            }
        }
    }

    // 3. Veritabanından kaydı sil
    return await prisma.$executeRaw`DELETE FROM StudentRegistration WHERE id = ${id}`;
}
