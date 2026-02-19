import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import dayjs from '@/lib/dayjs';

interface RegistrationData {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courseType: string;
    packagePrice?: string;
    licenseClass: string;
    birthDate: Date;
    birthPlace: string;
    nationality: string;
    address: {
        street: string;
        zipCode: string;
        city: string;
    };
    documentStatus?: {
        idCard: 'UPLOADED' | 'BRING_LATER';
        passport: 'UPLOADED' | 'BRING_LATER';
        residence: 'UPLOADED' | 'BRING_LATER';
        firstAid?: 'UPLOADED' | 'NOT_PROVIDED';
    };
    documentUrls?: {
        idCard?: string;
        idCardBack?: string;
        passport?: string;
        residence?: string;
        residenceBack?: string;
        firstAid?: string;
    };
}

export async function generateRegistrationPDF(data: RegistrationData): Promise<Uint8Array> {
    try {
        // 1. AcroForm PDF'i yükle
        const templatePath = path.join(process.cwd(), 'data', 'Ausbildungsauftrag_acroform.pdf');

        try {
            await fs.access(templatePath);
        } catch (error) {
            console.error('Şablon dosyası bulunamadı:', templatePath);
            throw new Error('PDF şablonu bulunamadı (Ausbildungsauftrag_acroform.pdf)');
        }

        const templateBytes = await fs.readFile(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();

        // Font ve Renkler
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const redColor = rgb(0.898, 0.016, 0.071);
        const grayColor = rgb(0.4, 0.4, 0.4);

        // --- FORM ALANLARINI DOLDUR ---
        try {
            const setField = (name: string, value: string) => {
                try {
                    const field = form.getTextField(name);
                    if (field) field.setText(value);
                } catch (e) {
                    // Alan bulunamazsa sessizce devam et
                }
            };

            setField('Klassen', data.licenseClass || 'B');

            try {
                const anredeField = form.getTextField('Andere') || form.getTextField('Anrede');
                if (anredeField) anredeField.setText(data.salutation);
            } catch { }

            setField('Familienname', data.lastName);
            setField('Vorname', data.firstName);
            setField('Geb. am', dayjs(data.birthDate).format('DD.MM.YYYY'));
            setField('Geburtsort', data.birthPlace || '');
            setField('Staatsb', data.nationality || '');
            setField('Adresse', data.address.street);
            setField('PLZ/Ort', `${data.address.zipCode} ${data.address.city}`);
            setField('Telefonnummer', data.phone);

            const packageFull = data.packagePrice
                ? `${data.courseType} - ${data.packagePrice}`
                : data.courseType;
            setField('Aktuelles Paket laut Preisliste', packageFull);

            const dateField = form.getTextField('Datum');
            if (dateField) dateField.setText(`Wien, am ${dayjs().format('DD.MM.YYYY')}`);

            form.flatten();
        } catch (err) {
            console.error('Form doldurma hatası:', err);
        }

        // 2. Eklenen Belgeleri PDF'e Ekle
        if (data.documentUrls) {
            const urls = [
                { label: 'Personalausweis (Vorderseite)', url: data.documentUrls.idCard },
                { label: 'Personalausweis (Rückseite)', url: data.documentUrls.idCardBack },
                { label: 'Reisepass', url: data.documentUrls.passport },
                { label: 'Meldezettel (Vorderseite)', url: data.documentUrls.residence },
                { label: 'Meldezettel (Rückseite)', url: data.documentUrls.residenceBack },
                { label: 'Erste-Hilfe-Zertifikat', url: data.documentUrls.firstAid },
            ].filter(item => item.url && item.url.trim() !== '');

            for (const item of urls) {
                const docPage = pdfDoc.addPage([595.28, 841.89]); // A4
                const { width: pWidth, height: pHeight } = docPage.getSize();

                // Sayfa Başlığı
                docPage.drawText(item.label.toUpperCase(), {
                    x: 40,
                    y: pHeight - 50,
                    size: 14,
                    font: boldFont,
                    color: redColor
                });

                try {
                    // URL veya yerel dosya yolundan resmi oku
                    let imageBytes: Buffer;
                    let ext: string;

                    const url = item.url!;

                    if (url.startsWith('http://') || url.startsWith('https://')) {
                        // Web URL (Vercel Blob vb.) -> fetch ile indir
                        console.log(`Resim indiriliyor (URL): ${url}`);
                        const response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(`Resim indirilemedi: ${response.status} ${response.statusText}`);
                        }
                        const arrayBuffer = await response.arrayBuffer();
                        imageBytes = Buffer.from(arrayBuffer);

                        // URL'den uzantıyı belirle
                        const contentType = response.headers.get('content-type') || '';
                        if (contentType.includes('png')) {
                            ext = '.png';
                        } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
                            ext = '.jpg';
                        } else {
                            // URL'den uzantı al
                            const urlPath = new URL(url).pathname;
                            ext = path.extname(urlPath).toLowerCase() || '.jpg';
                        }
                    } else {
                        // Yerel dosya yolu
                        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
                        let imagePath;

                        if (cleanUrl.startsWith('uploads/') || cleanUrl.startsWith('uploads\\')) {
                            imagePath = path.join(process.cwd(), cleanUrl);
                        } else {
                            imagePath = path.join(process.cwd(), 'public', cleanUrl);
                        }

                        console.log(`Resim okunuyor (dosya): ${imagePath}`);
                        await fs.access(imagePath);
                        imageBytes = await fs.readFile(imagePath);
                        ext = path.extname(imagePath).toLowerCase();
                    }

                    let image;
                    if (ext === '.png') {
                        image = await pdfDoc.embedPng(imageBytes);
                    } else if (['.jpg', '.jpeg'].includes(ext)) {
                        image = await pdfDoc.embedJpg(imageBytes);
                    } else {
                        throw new Error(`Desteklenmeyen format: ${ext}`);
                    }

                    // Boyutlandırma (FIT TO PAGE)
                    const margin = 40;
                    const maxImgWidth = pWidth - (margin * 2);
                    const maxImgHeight = pHeight - 150;

                    const scale = Math.min(maxImgWidth / image.width, maxImgHeight / image.height);

                    const drawWidth = image.width * scale;
                    const drawHeight = image.height * scale;

                    docPage.drawImage(image, {
                        x: (pWidth - drawWidth) / 2,
                        y: pHeight - 100 - drawHeight,
                        width: drawWidth,
                        height: drawHeight,
                    });

                } catch (err: any) {
                    console.error(`Resim eklenemedi (${item.url}):`, err);

                    docPage.drawText(`HATA: Belge yüklenemedi.`, {
                        x: 40,
                        y: pHeight / 2,
                        size: 12,
                        font: boldFont,
                        color: redColor
                    });
                    docPage.drawText(`Dosya: ${item.url}`, {
                        x: 40,
                        y: (pHeight / 2) - 20,
                        size: 10,
                        font: font,
                        color: grayColor
                    });
                    docPage.drawText(`Hata Detayı: ${err.message}`, {
                        x: 40,
                        y: (pHeight / 2) - 40,
                        size: 8,
                        font: font,
                        color: grayColor
                    });
                }

                // Alt Bilgi
                docPage.drawText(`Gate11 - Digitale Dokumentenkopie: ${data.lastName}`, {
                    x: 40,
                    y: 30,
                    size: 8,
                    font: font,
                    color: grayColor
                });
            }
        }

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;

    } catch (error) {
        console.error('generateRegistrationPDF Kritik Hata:', error);
        throw error;
    }
}
