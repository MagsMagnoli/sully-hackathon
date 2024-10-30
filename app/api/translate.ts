import { TranslationService } from '@/lib/translations/translationService'
import { Translation } from 'openai/resources/audio/translations.mjs'

export async function translateText({
  text,
  languages,
  translateService,
}: {
  text: string
  languages: string[]
  translateService: TranslationService
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
