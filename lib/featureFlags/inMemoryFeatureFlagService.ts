import { FeatureFlagService } from '@/lib/featureFlags/featureFlagService'
import { IntentProvider, intentProviders } from '@/lib/intents/intentService'
import { TextSummaryProvider } from '@/lib/textSummary/textSummaryService'
import {
  TextToSpeechProvider,
  textToSpeechProviders,
} from '@/lib/textToSpeech/textToSpeechService'
import {
  TranslationProvider,
  translationProviders,
} from '@/lib/translations/translationService'
import {
  SpeechToTextProvider,
  speechToTextProviders,
} from '../speechToText/speechToTextService'
import { textSummaryProviders } from '../textSummary/textSummaryService'

export class InMemoryFeatureFlagService implements FeatureFlagService {
  textToSpeechProvider(): TextToSpeechProvider {
    return textToSpeechProviders.Enum.openai
  }

  speechToTextProvider(): SpeechToTextProvider {
    return speechToTextProviders.Enum.openai
  }

  intentProvider(): IntentProvider {
    return intentProviders.Enum.openai
  }

  translationProvider(): TranslationProvider {
    return translationProviders.Enum.google
  }

  textSummaryProvider(): TextSummaryProvider {
    return textSummaryProviders.Enum.openai
  }
}
