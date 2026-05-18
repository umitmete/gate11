import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const categories = await prisma.packageCategory.findMany({
            orderBy: {
                order: "asc"
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET Categories Error:", error);
        return NextResponse.json({ error: "Kategoriler getirilemedi" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, order } = body;

        const category = await prisma.packageCategory.create({
            data: {
                name,
                order: order || 0
            }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("POST Category Error:", error);
        return NextResponse.json({ error: "Kategori oluşturulamadı" }, { status: 500 });
    }
}
