import { Speaker } from '@/db/schema'
import {
  createFeatureFlagService,
  featureFlagProviders,
} from '@/lib/featureFlags/featureFlagService'
import { createIntentService } from '@/lib/intents/intentService'
import { createMessage } from '@/lib/messages/createMessage'
import { Conversation } from '@/lib/models'
import { createSpeechToTextService } from '@/lib/speechToText/speechToTextService'
import { createTranslationService } from '@/lib/translations/translationService'

export async function speechToMessage({
  conversation,
}: {
  conversation: Conversation
}) {
  const featureFlagProvider = featureFlagProviders.parse(
    process.env.FEATURE_FLAG_PROVIDER,
  )

  const featureFlagService = createFeatureFlagService(featureFlagProvider)
  const speechToTextService = createSpeechToTextService(
    featureFlagService.speechToTextProvider(),
  )
  const text = await speechToTextService.generateText(filePath)
  const intentService = createIntentService(featureFlagService.intentProvider())
  const intent = await intentService.detectIntent(text)

  if (intent?.id === 'bargeIn' || intent?.id === 'repeatThat') {
    return Response.json({ intent: intent.id })
  }

  const translationService = createTranslationService(
    featureFlagService.translationProvider(),
  )
  const textLanguage = await translationService.detectLanguage(text)

  let language
  let translatedLanguage
  let speaker: Speaker

  if (textLanguage === conversation.doctor_language) {
    language = conversation.doctor_language
    translatedLanguage = conversation.patient_language
    speaker = 'doctor'
  } else {
    language = conversation.patient_language
    translatedLanguage = conversation.doctor_language
    speaker = 'patient'
  }

  const translatedText = await translationService.translateText({
    text,
    targetLanguage: translatedLanguage,
  })

  const message = await createMessage({
    conversationId: conversation.id,
    text,
    language,
    speaker,
    translatedText: translatedText.text,
    translatedLanguage,
    intent,
  })

  return message
}
