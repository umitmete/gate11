// app/api/cron/keep-alive/route.ts
// Vercel Cron Job ile otomatik ping

import { NextResponse } from 'next/server';

export async function GET() {
    // Basit health check
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({ 
        status: 'alive',
        timestamp,
        message: 'Site aktif ve çalışıyor'
    });
}

// Bu endpoint'i Vercel Cron ile her 5 dakikada bir çağırabilirsiniz
// Ama Vercel'de gerek YOK! Sadece ekstra güvence için.
