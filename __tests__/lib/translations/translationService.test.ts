import {
  TranslateService,
  translateText,
  Translation,
} from '@/lib/translations/translationService'
import { describe, expect, it, vi } from 'vitest'

describe('translateText', () => {
  it('translates text to specified languages, excluding the detected language', async () => {
    const mockTranslateService: TranslateService = {
      detectLanguage: vi.fn().mockResolvedValue('en'),
      translateText: vi.fn(({ text, targetLanguage }) =>
        Promise.resolve({
          text: `${text} in ${targetLanguage}`,
          language: targetLanguage,
        }),
      ),
    }

    const text = 'Hello'
    const languages = ['es', 'fr']

    const translations: Translation[] = await translateText({
      text,
      languages,
      translateService: mockTranslateService,
    })

    expect(translations).toEqual([
      { text: 'Hello in es', language: 'es' },
      { text: 'Hello in fr', language: 'fr' },
    ])

    expect(mockTranslateService.detectLanguage).toHaveBeenCalledWith(text)
    expect(mockTranslateService.translateText).toHaveBeenCalledWith({
      text,
      targetLanguage: 'es',
    })
    expect(mockTranslateService.translateText).toHaveBeenCalledWith({
      text,
      targetLanguage: 'fr',
    })
  })

  it('skips translation for the detected language', async () => {
    const mockTranslateService: TranslateService = {
      detectLanguage: vi.fn().mockResolvedValue('es'),
      translateText: vi.fn(({ text, targetLanguage }) =>
        Promise.resolve({
          text: `${text} in ${targetLanguage}`,
          language: targetLanguage,
        }),
      ),
    }

    const text = 'Hola'
    const languages = ['es', 'fr']

    const translations: Translation[] = await translateText({
      text,
      languages,
      translateService: mockTranslateService,
    })

    expect(translations).toEqual([{ text: 'Hola in fr', language: 'fr' }])
    expect(mockTranslateService.detectLanguage).toHaveBeenCalledWith(text)
    expect(mockTranslateService.translateText).toHaveBeenCalledWith({
      text,
      targetLanguage: 'fr',
    })
    expect(mockTranslateService.translateText).not.toHaveBeenCalledWith({
      text,
      targetLanguage: 'es',
    })
  })

  it('returns an empty array if all target languages match detected language', async () => {
    const mockTranslateService: TranslateService = {
      detectLanguage: vi.fn().mockResolvedValue('fr'),
      translateText: vi.fn(),
    }

    const text = 'Bonjour'
    const languages = ['fr']

    const translations: Translation[] = await translateText({
      text,
      languages,
      translateService: mockTranslateService,
    })

    expect(translations).toEqual([])
    expect(mockTranslateService.detectLanguage).toHaveBeenCalledWith(text)
    expect(mockTranslateService.translateText).not.toHaveBeenCalled()
  })
})
