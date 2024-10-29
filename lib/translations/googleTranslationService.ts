import { v2 } from '@google-cloud/translate'
import { TranslateService } from './translationService'

export class GoogleTranslateService implements TranslateService {
  private translate: v2.Translate

  constructor() {
    this.translate = new v2.Translate()
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
