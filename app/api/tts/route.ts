import {
  createFeatureFlagService,
  featureFlagProviders,
} from '@/lib/featureFlags/featureFlagService'
import { createTextToSpeechService } from '@/lib/textToSpeech/textToSpeechService'
import { z } from 'zod'

const textToSpeechInputSchema = z.object({
  text: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json()

  const { text } = textToSpeechInputSchema.parse(body)

  const featureFlagProvider = featureFlagProviders.parse(
    process.env.FEATURE_FLAG_PROVIDER,
  )

  const featureFlagService = createFeatureFlagService(featureFlagProvider)
  const textToSpeechService = createTextToSpeechService(
    featureFlagService.textToSpeechProvider(),
  )
  const audio = await textToSpeechService.generateAudio(text)

  return new Response(audio, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': audio.byteLength.toString(),
    },
  })
}
