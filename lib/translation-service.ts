/**
 * Otomatik Çeviri Servisi
 * Kurs içeriklerinin otomatik çevirisini yapar.
 */

export async function translateText(text: string, targetLang: 'en' | 'tr' | 'ar' | 'fa'): Promise<string> {
    if (!text || text.trim() === '') return text;

    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);

        if (!res.ok) {
            console.error(`Translation API error for ${targetLang}:`, res.statusText);
            throw new Error('Translation failed');
        }

        const data = await res.json();

        // Google Translate yapısı karmaşık olabilir, tüm parçaları dikkatlice birleştirmeliyiz
        if (data && data[0]) {
            const translatedText = data[0].map((item: any) => item[0]).join('');
            console.log(`Translated: "${text.substring(0, 20)}..." -> "${translatedText.substring(0, 20)}..." (${targetLang})`);
            return translatedText;
        }

        return text;
    } catch (error) {
        console.error(`Translation error details (${targetLang}):`, error);
        return text; // Hata durumunda orijinal metni döndür
    }
}

export async function translateArray(items: string[], targetLang: 'en' | 'tr' | 'ar' | 'fa'): Promise<string[]> {
    if (!items || items.length === 0) return [];

    console.log(`Translating array of ${items.length} items to ${targetLang}...`);
    return Promise.all(items.map(item => translateText(item, targetLang)));
}

export interface CampaignLocalizedFields {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
}

export async function translateCampaignFields(fields: {
    title: string;
    subtitle?: string | null;
    badge?: string | null;
    description: string;
}): Promise<string> {
    const targetLangs: Array<'en' | 'tr' | 'ar' | 'fa'> = ['en', 'tr', 'ar', 'fa'];
    const result: Record<string, CampaignLocalizedFields> = {};

    await Promise.all(
        targetLangs.map(async (lang) => {
            const [title, subtitle, badge, description] = await Promise.all([
                translateText(fields.title || '', lang),
                fields.subtitle ? translateText(fields.subtitle, lang) : Promise.resolve(''),
                fields.badge ? translateText(fields.badge, lang) : Promise.resolve(''),
                translateText(fields.description || '', lang),
            ]);
            result[lang] = { title, subtitle, badge, description };
        })
    );

    return JSON.stringify(result);
}
