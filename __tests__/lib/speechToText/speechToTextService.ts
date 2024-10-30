import {
  SpeechToTextService,
  createTextFromAudio,
} from '@/lib/speechToText/speechToTextService'
import { describe, expect, it, vi } from 'vitest'

const mockGeneratedText = 'Transcribed audio text'

describe('createTextFromAudio', () => {
  it('should call generateText with the correct text and return the generated text', async () => {
    const mockText = 'Audio data'

    const mockSpeechToTextService: SpeechToTextService = {
      generateText: vi.fn().mockResolvedValue(mockGeneratedText),
    }

    const result = await createTextFromAudio({
      text: mockText,
      speechToTextService: mockSpeechToTextService,
    })

    expect(mockSpeechToTextService.generateText).toHaveBeenCalledOnce()
    expect(mockSpeechToTextService.generateText).toHaveBeenCalledWith(mockText)

    expect(result).toBe(mockGeneratedText)
  })
})
