import { OpenAITextToSpeechService } from '@/lib/textToSpeech/openaiTextToSpeechService'
import {
  TextToSpeechService,
  createTextToSpeechService,
} from '@/lib/textToSpeech/textToSpeechService'
import { describe, expect, it } from 'vitest'

describe('createTextToSpeechService', () => {
  it('should return an instance of OpenAITextToSpeechService for provider "openai"', () => {
    const service: TextToSpeechService = createTextToSpeechService('openai')

    expect(service).toBeInstanceOf(OpenAITextToSpeechService)
  })

  it('should throw an error for unsupported provider', () => {
    expect(() =>
      createTextToSpeechService('unsupported' as never),
    ).toThrowError('Unsupported provider: unsupported')
  })
})
