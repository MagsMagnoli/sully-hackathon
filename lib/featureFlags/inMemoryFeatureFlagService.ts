import { FeatureFlagService } from '@/lib/featureFlags/featureFlagService'
import { IntentProvider, intentProviders } from '@/lib/intents/intentService'
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
}
