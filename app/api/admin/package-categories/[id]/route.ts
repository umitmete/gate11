import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const body = await request.json();
        const { name, order } = body;

        const category = await prisma.packageCategory.update({
            where: { id: params.id },
            data: {
                name,
                order
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("PUT Category Error:", error);
        return NextResponse.json({ error: "Kategori güncellenemedi" }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        await prisma.packageCategory.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Category Error:", error);
        return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 });
    }
}
