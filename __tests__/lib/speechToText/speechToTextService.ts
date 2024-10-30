import { OpenAISpeechToTextService } from '@/lib/speechToText/openaiSpeechToTextService'
import {
  SpeechToTextService,
  createSpeechToTextService,
} from '@/lib/speechToText/speechToTextService'
import { describe, expect, it } from 'vitest'

describe('createSpeechToTextService', () => {
  it('should return an instance of OpenAISpeechToTextService for provider "openai"', () => {
    const service: SpeechToTextService = createSpeechToTextService('openai')

    // Verify the instance type
    expect(service).toBeInstanceOf(OpenAISpeechToTextService)
  })

  it('should throw an error for unsupported provider', () => {
    expect(() =>
      createSpeechToTextService('unsupported' as never),
    ).toThrowError('Unsupported provider: unsupported')
  })
})
