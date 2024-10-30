import { OpenAITextToSpeechService } from '@/lib/textToSpeech/openaiTextToSpeechService'
import { z } from 'zod'

export interface TextToSpeechService {
  generateAudio(text: string): Promise<Blob>
}

export const textToSpeechProviders = z.enum(['openai'])
export type TextToSpeechProvider = z.infer<typeof textToSpeechProviders>

export function createTextToSpeechService(
  provider: TextToSpeechProvider,
): TextToSpeechService {
  switch (provider) {
    case 'openai':
      return new OpenAITextToSpeechService()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
