// Translation Utility Functions
// Google Translate API and DeepL API integration

export async function translateText(
  text: string,
  targetLang: 'en' | 'zh' | 'ja',
  sourceLang: string = 'ko'
): Promise<string> {
  try {
    // Using MyMemory Translation API (Free, no API key required)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    }
    
    // Fallback: return original text if translation fails
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function translateProductTexts(
  nameKo: string,
  descriptionKo: string
): Promise<{
  name_en: string;
  name_zh: string;
  name_ja: string;
  description_en: string;
  description_zh: string;
  description_ja: string;
}> {
  const [name_en, name_zh, name_ja, description_en, description_zh, description_ja] = await Promise.all([
    translateText(nameKo, 'en'),
    translateText(nameKo, 'zh'),
    translateText(nameKo, 'ja'),
    translateText(descriptionKo, 'en'),
    translateText(descriptionKo, 'zh'),
    translateText(descriptionKo, 'ja')
  ]);

  return {
    name_en,
    name_zh,
    name_ja,
    description_en,
    description_zh,
    description_ja
  };
}
