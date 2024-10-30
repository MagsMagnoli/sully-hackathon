import { v2 } from '@google-cloud/translate'
import { TranslationService } from './translationService'

export class GoogleTranslationService implements TranslationService {
  private translate: v2.Translate

  constructor() {
    this.translate = new v2.Translate({
      apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
    })
  }

  async detectLanguage(text: string) {
    const [detection] = await this.translate.detect(text)
    return detection.language
  }

  async translateText({
    text,
    targetLanguage,
  }: {
    text: string
    targetLanguage: string
  }) {
    const [translation] = await this.translate.translate(text, targetLanguage)
    return {
      text: translation,
      language: targetLanguage,
    }
  }
}
