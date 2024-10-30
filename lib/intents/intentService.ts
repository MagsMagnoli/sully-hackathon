import { OpenAiIntentService } from '@/lib/intents/openAiIntentService'
import { z } from 'zod'

export type Intent = {
  id: string
  parameters: Record<string, string>
  text: string
}

export interface IntentService {
  detectIntent(text: string): Promise<Intent | null>
}

export const intentProviders = z.enum(['openai'])
export type IntentProvider = z.infer<typeof intentProviders>

export function createIntentService(provider: IntentProvider): IntentService {
  switch (provider) {
    case 'openai':
      return new OpenAiIntentService()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
