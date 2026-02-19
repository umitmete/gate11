import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const filePath = path.join(process.cwd(), 'uploads', filename);

        try {
            await fs.access(filePath);
        } catch {
            return new NextResponse('File not found', { status: 404 });
        }

        const fileBuffer = await fs.readFile(filePath);

        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.pdf') contentType = 'application/pdf';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
