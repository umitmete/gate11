import { prisma } from "@/lib/db";
import dayjs from "@/lib/dayjs";

/**
 * Sadece gelecekteki (mavi) Kurs Planlarını getirir.
 * isActive = true VE startDate > ŞİMDİ (UTC) parametrelerine göre filtreler.
 * 
 * Admin Paneli Renk Sistemi:
 * 🔴 Kırmızı (Geçmiş): endDate < bugün - Sitede gösterilmez
 * 🟢 Yeşil (Devam Eden): startDate <= bugün <= endDate - Sitede gösterilmez  
 * 🔵 Mavi (Gelecek): startDate > bugün - Sitede gösterilir
 * 
 * @param courseType - 'DAY' veya 'NIGHT' - Opsiyonel, belirtilirse sadece o tip kursları getirir
 */
export async function getActiveYearlyPlans(courseType?: 'DAY' | 'NIGHT') {
    // Katı sunucu tarafı karşılaştırması için UTC zamanını kullan
    const now = dayjs().utc().toDate();

    const whereClause: any = {
        isActive: true,
        startDate: {
            gt: now, // Sadece gelecekteki (mavi) kursları göster
        },
    };

    // Eğer courseType belirtilmişse, filtreye ekle
    if (courseType) {
        whereClause.courseType = courseType;
    }

    const plans = await prisma.yearlyPlan.findMany({
        where: whereClause,
        orderBy: {
            startDate: 'asc',
        },
    });

    return plans;
}

/**
 * Yeni bir Yıllık Plan oluşturur.
 */
export async function createYearlyPlan(data: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    courseType?: string;
}) {
    return await prisma.yearlyPlan.create({
        data: {
            ...data,
            courseType: data.courseType || 'DAY',
            isActive: true,
        },
    });
}

/**
 * Bir planı pasif hale getirir (isActive değerini false yapar).
 */
export async function deactivatePlan(id: string) {
    return await prisma.yearlyPlan.update({
        where: { id },
        data: { isActive: false },
    });
}
