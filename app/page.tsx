import { prisma } from '@/lib/db';
import HomePageClient from '@/components/home/HomePageClient';
import type { CampaignData } from '@/components/campaign/CampaignModal';
import { getCurrentlyLiveCampaigns } from '@/lib/services/campaign-storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let activeCampaigns: CampaignData[] = [];
  try {
    const camps = await getCurrentlyLiveCampaigns(prisma);
    activeCampaigns = camps.map((camp: any) => ({
      id: camp.id,
      title: camp.title,
      subtitle: camp.subtitle,
      badge: camp.badge,
      description: camp.description,
      imageUrl: camp.imageUrl,
      buttonText: camp.buttonText,
      buttonLink: camp.buttonLink,
      isActive: camp.isActive,
      showEffects: camp.showEffects,
      effectType: camp.effectType ?? null,
      translations: camp.translations,
      updatedAt: camp.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching active campaigns on home:', error);
  }

  return <HomePageClient initialCampaigns={activeCampaigns} />;
}
