import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs/promises';

/**
 * GATE11 Email Servisi
 * Kayıt bildirimlerini PDF ekleriyle gönderir.
 */

interface SendRegistrationEmailParams {
    to: string;
    studentName: string;
    pdfPath: string;
    pdfName: string;
}

export async function sendRegistrationEmail({ to, studentName, pdfPath, pdfName }: SendRegistrationEmailParams) {
    // Bunlar .env dosyasında ayarlanmalı
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn('Email servisi yapılandırılmamış. Email gönderimi atlanıyor.');
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        // Read the PDF file to attach it
        const pdfContent = await fs.readFile(pdfPath);

        const mailOptions = {
            from: `"GATE11 Fahrschule" <${fromEmail}>`,
            to: to, // Usually "drive@fahrschulegate11.at"
            subject: `Neue Voranmeldung: ${studentName}`,
            text: `Hallo,\n\neine neue Voranmeldung von ${studentName} ist eingegangen. Die Zusammenfassung finden Sie im Anhang.\n\nDies ist eine automatische Benachrichtigung vom GATE11 Portal.`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #D4AF37;">Neue Voranmeldung erhalten</h2>
                    <p>Es gibt eine neue Online-Voranmeldung auf der Webseite:</p>
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37;">
                        <strong>Schüler:</strong> ${studentName}<br>
                        <strong>Datum:</strong> ${new Date().toLocaleString('de-AT')}
                    </div>
                    <p>Die vollständige PDF-Zusammenfassung wurde dieser E-Mail beigefügt.</p>
                    <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                        GATE11 Fahrschule System-Benachrichtigung
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: pdfName,
                    content: pdfContent,
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Failed to send registration email:', error);
        return false;
    }
}
