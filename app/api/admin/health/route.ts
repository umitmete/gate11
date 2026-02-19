import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Veritabanı bağlantısını test etmek için basit bir sorgu
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'online',
            db: 'connected',
            timestamp: new Date().toISOString()
        }, { status: 200 });
    } catch (error) {
        console.error('Health Check Error:', error);
        return NextResponse.json({
            status: 'error',
            db: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
