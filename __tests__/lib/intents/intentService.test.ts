import { IntentService, createIntentService } from '@/lib/intents/intentService'
import { OpenAiIntentService } from '@/lib/intents/openAiIntentService'
import { describe, expect, it } from 'vitest'

describe('createIntentService', () => {
  it('should return an instance of OpenAiIntentService for provider "openai"', () => {
    const service: IntentService = createIntentService('openai')

    expect(service).toBeInstanceOf(OpenAiIntentService)
  })

  it('should throw an error for an unsupported provider', () => {
    expect(() => createIntentService('unsupported' as never)).toThrowError(
      'Unsupported provider: unsupported',
    )
  })
})
