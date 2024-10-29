import {
  Intent,
  IntentService,
  detectIntent,
} from '@/lib/intents/intentService'
import { describe, expect, it, vi } from 'vitest'

describe('detectIntent function', () => {
  const mockIntent: Intent = {
    id: 'test-id',
    parameters: { param1: 'value1', param2: 'value2' },
    text: 'mock response text',
  }

  const mockIntentService: IntentService = {
    detectIntent: vi.fn().mockResolvedValue(mockIntent),
  }

  it('should return the correct Intent from the intentService', async () => {
    const text = 'sample input text'

    const result = await detectIntent({
      text,
      intentService: mockIntentService,
    })

    expect(result).toEqual(mockIntent)
    expect(mockIntentService.detectIntent).toHaveBeenCalledOnce()
    expect(mockIntentService.detectIntent).toHaveBeenCalledWith(text)
  })

  it('should handle rejection in intentService.detectIntent gracefully', async () => {
    const error = new Error('Intent detection failed')
    vi.spyOn(mockIntentService, 'detectIntent').mockRejectedValueOnce(error)

    await expect(
      detectIntent({ text: 'error test', intentService: mockIntentService }),
    ).rejects.toThrow('Intent detection failed')
  })

  it('should call detectIntent with the correct parameters', async () => {
    const text = 'check parameters'

    await detectIntent({ text, intentService: mockIntentService })

    expect(mockIntentService.detectIntent).toHaveBeenCalledWith(text)
  })
})
