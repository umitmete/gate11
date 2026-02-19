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
