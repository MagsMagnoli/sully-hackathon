import { Speaker } from '@/db/schema'
import { createConversation } from '@/lib/conversations/createConversation'
import {
  createFeatureFlagService,
  featureFlagProviders,
} from '@/lib/featureFlags/featureFlagService'
import { createIntentService } from '@/lib/intents/intentService'
import { createMessage } from '@/lib/messages/createMessage'
import {
  createSpeechToTextService,
  SpeechToTextService,
} from '@/lib/speechToText/speechToTextService'
import { createTranslationService } from '@/lib/translations/translationService'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export async function speechToMessage({
  conversation,
  base64Audio,
}: {
  conversation: Awaited<ReturnType<typeof createConversation>>[0]
  base64Audio: string
}) {
  const featureFlagProvider = featureFlagProviders.parse(
    process.env.FEATURE_FLAG_PROVIDER,
  )

  const featureFlagService = createFeatureFlagService(featureFlagProvider)
  const speechToTextService = createSpeechToTextService(
    featureFlagService.speechToTextProvider(),
  )

  const text = await fetchTextFromSpeech({
    base64Audio,
    speechToTextService,
  })

  if (!text.length) {
    return
  }

  const intentService = createIntentService(featureFlagService.intentProvider())
  const intent = await intentService.detectIntent(text)

  if (intent?.name === 'bargeIn' || intent?.name === 'repeatThat') {
    return {
      type: 'intent',
      data: intent.name,
    }
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

  const [message] = await createMessage({
    conversationId: conversation.id,
    text,
    language,
    speaker,
    translatedText: translatedText.text,
    translatedLanguage,
    intent,
  })

  return {
    type: 'message',
    data: message,
  }
}

async function fetchTextFromSpeech({
  base64Audio,
  speechToTextService,
}: {
  base64Audio: string
  speechToTextService: SpeechToTextService
}) {
  const dir = path.join(process.cwd(), 'public', 'audio')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const audioBuffer = Buffer.from(base64Audio, 'base64')
  const filePath = path.join(dir, `${crypto.randomUUID()}.mp3`)

  try {
    fs.writeFileSync(filePath, audioBuffer)

    const text = await speechToTextService.generateText(filePath)
    return text
  } finally {
    fs.unlinkSync(filePath)
  }
}
