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
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export async function speechToMessage({
  conversation,
  base64Audio,
}: {
  conversation: Conversation
  base64Audio: string
}) {
  const featureFlagProvider = featureFlagProviders.parse(
    process.env.FEATURE_FLAG_PROVIDER,
  )

  const featureFlagService = createFeatureFlagService(featureFlagProvider)
  const speechToTextService = createSpeechToTextService(
    featureFlagService.speechToTextProvider(),
  )

  const dir = path.join(process.cwd(), 'public', 'audio')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const audioBuffer = Buffer.from(base64Audio, 'base64')

  const filePath = path.join(dir, `${crypto.randomUUID()}.mp3`)

  fs.writeFileSync(filePath, audioBuffer)

  const text = await speechToTextService.generateText(filePath)

  fs.unlinkSync(filePath)

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

  if (textLanguage === conversation.doctorLanguage) {
    language = conversation.doctorLanguage
    translatedLanguage = conversation.patientLanguage
    speaker = 'doctor'
  } else {
    language = conversation.patientLanguage
    translatedLanguage = conversation.doctorLanguage
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
