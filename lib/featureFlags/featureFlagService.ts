import { InMemoryFeatureFlagService } from '@/lib/featureFlags/inMemoryFeatureFlagService'
import { IntentProvider } from '@/lib/intents/intentService'
import { SpeechToTextProvider } from '@/lib/speechToText/speechToTextService'
import { TextSummaryProvider } from '@/lib/textSummary/textSummaryService'
import { TextToSpeechProvider } from '@/lib/textToSpeech/textToSpeechService'
import { TranslationProvider } from '@/lib/translations/translationService'
import { z } from 'zod'

export interface FeatureFlagService {
  textToSpeechProvider(): TextToSpeechProvider
  speechToTextProvider(): SpeechToTextProvider
  intentProvider(): IntentProvider
  translationProvider(): TranslationProvider
  textSummaryProvider(): TextSummaryProvider
}

export const featureFlagProviders = z.enum(['memory'])
export type FeatureFlagProvider = z.infer<typeof featureFlagProviders>

export function createFeatureFlagService(
  provider: FeatureFlagProvider,
): FeatureFlagService {
  switch (provider) {
    case 'memory':
      return new InMemoryFeatureFlagService()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
