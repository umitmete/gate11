import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import dayjs from '@/lib/dayjs';

/**
 * Türkçe karakterleri ASCII karşılıkları ile değiştirir.
 * PDF-lib standart fontları (Helvetica vb.) Türkçe karakterleri doğrudan desteklemez.
 */
function replaceTurkishChars(text: string): string {
    if (!text) return "";
    return text
        // Türkçe
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ı/g, 'i').replace(/İ/g, 'I')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C')
        // Almanca
        // Not: 'ß' karakteri için standart fontlarda güvenli olması için 'ss' kullanıyoruz
        .replace(/ß/g, 'ss')
        .replace(/ä/g, 'ae').replace(/Ä/g, 'Ae')
        // WinAnsi güvenliği için ek temizlik
        .replace(/[^\x00-\x7F]+/g, '');
}

interface Student {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
}

/**
 * Admin paneli için öğrenci listesi PDF'i oluşturur.
 */
export async function generateStudentListPDF(groupName: string, students: Student[]) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([595.28, 841.89]); // A4 Boyutu
    const { width, height } = page.getSize();

    const margin = 50;
    let y = height - margin;

    // Başlık ve Marka Renkleri (#e50412)
    const primaryRGB = rgb(0.898, 0.016, 0.071);

    page.drawText('GATE 11 FAHRSCHULE', {
        x: margin,
        y: y,
        size: 20,
        font: fontBold,
        color: primaryRGB,
    });

    y -= 25;
    page.drawText('SCHÜLERLISTE', {
        x: margin,
        y: y,
        size: 14,
        font: fontBold,
        color: rgb(0, 0, 0),
    });

    y -= 35;

    // Grup Bilgisi Arka Planı
    page.drawRectangle({
        x: margin,
        y: y - 5,
        width: width - (margin * 2),
        height: 25,
        color: rgb(0.95, 0.95, 0.95),
    });

    page.drawText(`${replaceTurkishChars(groupName)}`, {
        x: margin + 10,
        y: y + 2,
        size: 12,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.2),
    });

    y -= 40;

    // Tablo Başlıkları
    const cols = {
        nr: margin,
        name: margin + 30,
        phone: margin + 180,
        email: margin + 310,
        birth: margin + 450
    };

    page.drawText('Nr.', { x: cols.nr, y, size: 10, font: fontBold });
    page.drawText('Name Nachname', { x: cols.name, y, size: 10, font: fontBold });
    page.drawText('Telefon', { x: cols.phone, y, size: 10, font: fontBold });
    page.drawText('E-Mail', { x: cols.email, y, size: 10, font: fontBold });
    page.drawText('Geb. Datum', { x: cols.birth, y, size: 10, font: fontBold });

    y -= 15;
    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });

    y -= 20;

    // Öğrenci Listesi Döngüsü
    students.forEach((student, index) => {
        // Sayfa sonu kontrolü
        if (y < margin + 40) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = height - margin;

            page.drawLine({
                start: { x: margin, y: y + 10 },
                end: { x: width - margin, y: y + 10 },
                thickness: 1,
                color: primaryRGB
            });
        }

        const rowY = y;
        page.drawText(`${index + 1}`, { x: cols.nr, y: rowY, size: 9, font });
        page.drawText(`${replaceTurkishChars(student.firstName)} ${replaceTurkishChars(student.lastName)}`, { x: cols.name, y: rowY, size: 9, font });
        page.drawText(`${replaceTurkishChars(student.phone)}`, { x: cols.phone, y: rowY, size: 9, font });
        page.drawText(`${replaceTurkishChars(student.email)}`, { x: cols.email, y: rowY, size: 9, font });
        page.drawText(`${dayjs(student.birthDate).format('DD.MM.YYYY')}`, { x: cols.birth, y: rowY, size: 9, font });

        y -= 20;

        // Satır Ayırıcı Çizgi
        page.drawLine({
            start: { x: margin, y: y + 5 },
            end: { x: width - margin, y: y + 5 },
            thickness: 0.5,
            color: rgb(0.9, 0.9, 0.9),
        });
    });

    // Sayfa Altı Bilgisi
    // Sayfa Altı Bilgisi
    const footerText = `Erstellt am: ${dayjs().format('DD.MM.YYYY HH:mm')} | gate11.at`;
    page.drawText(footerText, {
        x: margin,
        y: 20,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
    });

    return await pdfDoc.save();
}
