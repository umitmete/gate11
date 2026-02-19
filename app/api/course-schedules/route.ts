import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { translateText } from '@/lib/translation-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'de';

    const now = new Date();
    // Tarih karşılaştırması için saati günün başlangıcına sıfırla
    now.setHours(0, 0, 0, 0);

    const intensiveSchedules = await prisma.courseSchedule.findMany({
      where: {
        isVisible: true,
        type: 'INTENSIVE',
        date: {
          gte: now,
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 20,
    });

    const eveningSchedules = await prisma.courseSchedule.findMany({
      where: {
        isVisible: true,
        type: 'EVENING',
        date: {
          gte: now,
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 20,
    });

    const schedules = [...intensiveSchedules, ...eveningSchedules];

    // Otomatik Çeviri Uygula
    if (lang !== 'de' && schedules.length > 0) {
      const translatedSchedules = await Promise.all(
        schedules.map(async (schedule) => {
          try {
            const translatedTopic = await translateText(schedule.topic, lang as any);
            return {
              ...schedule,
              topic: translatedTopic
            };
          } catch (err) {
            return schedule;
          }
        })
      );
      return NextResponse.json(translatedSchedules);
    }

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching course schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
