import { OpenAISpeechToTextService } from '@/lib/speechToText/openaiSpeechToTextService'
import { z } from 'zod'

export interface SpeechToTextService {
  generateText(filePath: string): Promise<string>
}

export const speechToTextProviders = z.enum(['openai'])
export type SpeechToTextProvider = z.infer<typeof speechToTextProviders>

export function createSpeechToTextService(
  provider: SpeechToTextProvider,
): SpeechToTextService {
  switch (provider) {
    case 'openai':
      return new OpenAISpeechToTextService()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
