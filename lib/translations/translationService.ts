import { GoogleTranslationService } from '@/lib/translations/googleTranslationService'
import { z } from 'zod'

export type Translation = {
  text: string
  language: string
}

export interface TranslationService {
  detectLanguage: (text: string) => Promise<string>
  translateText: ({
    text,
    targetLanguage,
  }: {
    text: string
    targetLanguage: string
  }) => Promise<Translation>
}

export const translationProviders = z.enum(['google'])
export type TranslationProvider = z.infer<typeof translationProviders>

export function createTranslationService(
  provider: TranslationProvider,
): TranslationService {
  switch (provider) {
    case 'google':
      return new GoogleTranslationService()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
