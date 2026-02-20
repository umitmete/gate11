import { prisma } from "@/lib/db";
import { generateRegistrationPDF } from "@/lib/pdf-generator";
import { sendRegistrationEmail } from "./email";
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
    const id = crypto.randomUUID();
    const now = new Date();
    let publicUrl: string | null = null;

    // 1. PDF Oluştur ve Vercel Blob'a Kaydet (Hata olursa kayıt yine devam eder)
    try {
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

        // PDF'i Vercel Blob'a Kaydet
        const fileId = crypto.randomUUID();
        const fileName = `registration_${fileId}.pdf`;

        const { put } = await import('@vercel/blob');
        const blob = await put(`registrations/${fileName}`, Buffer.from(pdfBytes), {
            access: 'public',
            addRandomSuffix: false
        });

        publicUrl = blob.url;
        console.log('PDF created and uploaded:', publicUrl);
    } catch (pdfError: any) {
        // PDF oluşturulamazsa bile kayıt devam etsin
        console.error('PDF generation/upload failed (continuing with registration):', pdfError?.message || pdfError);
    }

    // 2. Veritabanına Kaydet (Bu kısım ZORUNLU)
    try {
        await prisma.$executeRaw`
            INSERT INTO "StudentRegistration" (
                "id", "salutation", "firstName", "lastName", "email", "phone", "birthDate", "birthPlace", "nationality",
                "street", "zipCode", "city", "courseType", "packagePrice", "licenseClass", "registrationPdfUrl", 
                "idCardUrl", "passportUrl", "firstAidUrl", "residenceUrl", 
                "bringIdLater", "bringPassportLater", "bringResidenceLater", 
                "status", "submittedAt", "updatedAt"
            ) VALUES (
                ${id}, ${data.salutation}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${data.birthDate}::timestamp, ${data.birthPlace}, ${data.nationality},
                ${data.street}, ${data.zipCode}, ${data.city}, ${data.courseType}, ${data.packagePrice || null}, ${data.licenseClass}, ${publicUrl},
                ${data.documentUrls?.idCard || null}, ${data.documentUrls?.passport || null}, 
                ${data.documentUrls?.firstAid || null}, ${data.documentUrls?.residence || null},
                ${data.bringLater.idCard}, ${data.bringLater.passport}, ${data.bringLater.residence},
                'PENDING', ${now}::timestamp, ${now}::timestamp
            )
        `;
    } catch (dbError: any) {
        console.error('Database insert failed:', dbError?.message || dbError);
        throw new Error(`Veritabanı hatası: ${dbError?.message || 'Bilinmeyen hata'}`);
    }

    // 3. Email Bildirimi Gönder (Arka Planda - başarısız olursa kayıt etkilenmez)
    if (publicUrl) {
        sendRegistrationEmail({
            to: 'drive@fahrschulegate11.at',
            studentName: `${data.firstName} ${data.lastName}`,
            pdfPath: publicUrl,
            pdfName: `Voranmeldung_${data.lastName}.pdf`
        }).catch(err => console.error('Background email failed:', err));
    }

    return { id, registrationPdfUrl: publicUrl };
}

// Kaydı sil
export async function deleteRegistration(id: string) {
    // 1. Önce kayıt bilgilerini al (Dosya URL'lerine erişmek için)
    const registrations = await prisma.$queryRaw<any[]>`SELECT * FROM "StudentRegistration" WHERE id = ${id}`;
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
                const { del } = await import('@vercel/blob');
                await Promise.all(urlsToDelete.map(url => del(url)));
                console.log(`Deleted ${urlsToDelete.length} blobs for registration ${id}`);
            } catch (error) {
                console.error('Error deleting blobs:', error);
            }
        }
    }

    // 3. Veritabanından kaydı sil
    return await prisma.$executeRaw`DELETE FROM "StudentRegistration" WHERE id = ${id}`;
}
