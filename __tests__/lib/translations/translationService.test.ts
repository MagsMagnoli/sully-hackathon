import { GoogleTranslationService } from '@/lib/translations/googleTranslationService'
import {
  TranslationService,
  createTranslationService,
} from '@/lib/translations/translationService'
import { describe, expect, it } from 'vitest'

describe('createTranslationService', () => {
  it('should return an instance of GoogleTranslationService for provider "google"', () => {
    const service: TranslationService = createTranslationService('google')

    expect(service).toBeInstanceOf(GoogleTranslationService)
  })

  it('should throw an error for an unsupported provider', () => {
    expect(() => createTranslationService('unsupported' as never)).toThrowError(
      'Unsupported provider: unsupported',
    )
  })
})
