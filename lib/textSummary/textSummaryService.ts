import { OpenAITextSummaryService } from '@/lib/textSummary/openaiTextSummaryService'
import { z } from 'zod'

export interface TextSummaryService {
  generateSummary(text: string): Promise<string>
}

export const textSummaryProviders = z.enum(['openai'])
export type TextSummaryProvider = z.infer<typeof textSummaryProviders>

export function createTextSummaryService(
  provider: TextSummaryProvider,
): TextSummaryService {
  switch (provider) {
    case 'openai':
      return new OpenAITextSummaryService()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
