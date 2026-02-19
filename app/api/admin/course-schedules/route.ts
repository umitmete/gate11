import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST: Create a new course schedule
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, abbreviation, topic, type } = body;

    const schedule = await prisma.courseSchedule.create({
      data: {
        date: new Date(date),
        time,
        abbreviation,
        topic,
        type,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error creating course schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Fetch all course schedules (for admin, including past ones)
export async function GET() {
  try {
    const schedules = await prisma.courseSchedule.findMany({
      orderBy: {
        date: 'desc', // Show newest/latest dates first in admin
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching course schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
