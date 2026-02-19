import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Dosya adı oluştur (timestamp ile benzersiz yap)
        const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const relativePath = `/uploads/instructors/${filename}`;
        const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'instructors', filename);

        await writeFile(absolutePath, buffer);

        return NextResponse.json({ url: relativePath });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
