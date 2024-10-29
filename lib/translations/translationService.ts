export type Translation = {
  text: string
  language: string
}

export interface TranslateService {
  detectLanguage: (text: string) => Promise<string>
  translateText: ({
    text,
    targetLanguage,
  }: {
    text: string
    targetLanguage: string
  }) => Promise<Translation>
}

export async function translateText({
  text,
  languages,
  translateService,
}: {
  text: string
  languages: string[]
  translateService: TranslateService
}): Promise<Translation[]> {
  const detectedLanguage = await translateService.detectLanguage(text)

  const translations = []

  for (const language of languages) {
    if (detectedLanguage !== language) {
      const translation = await translateService.translateText({
        text,
        targetLanguage: language,
      })
      translations.push(translation)
    }
  }

  return translations
}
