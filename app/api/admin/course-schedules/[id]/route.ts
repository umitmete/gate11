import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.courseSchedule.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { date, time, abbreviation, topic, type, isVisible } = body;

    const schedule = await prisma.courseSchedule.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        time,
        abbreviation,
        topic,
        type,
        isVisible,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error updating course schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
