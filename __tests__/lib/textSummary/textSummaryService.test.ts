import { OpenAITextSummaryService } from '@/lib/textSummary/openaiTextSummaryService'
import {
  createTextSummaryService,
  TextSummaryService,
} from '@/lib/textSummary/textSummaryService'
import { describe, expect, it } from 'vitest'

describe('createTextSummaryService', () => {
  it('should return an instance of OpenAITextSummaryService for provider "openai"', () => {
    const service: TextSummaryService = createTextSummaryService('openai')

    expect(service).toBeInstanceOf(OpenAITextSummaryService)
  })

  it('should throw an error for unsupported provider', () => {
    expect(() => createTextSummaryService('unsupported' as never)).toThrowError(
      'Unsupported provider: unsupported',
    )
  })
})
