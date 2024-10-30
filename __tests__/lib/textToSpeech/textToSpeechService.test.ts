import {
  TextToSpeechService,
  createAudioFromText,
} from '@/lib/textToSpeech/textToSpeechService'
import { describe, expect, it, vi } from 'vitest'

const mockBlob = new Blob(['audio data'], { type: 'audio/mpeg' })

describe('createAudioFromText', () => {
  it('should call generateAudio with the correct text and return the Blob', async () => {
    const mockText = 'Hello, world!'

    const mockTextToSpeechService: TextToSpeechService = {
      generateAudio: vi.fn().mockResolvedValue(mockBlob),
    }

    const result = await createAudioFromText({
      text: mockText,
      textToSpeechService: mockTextToSpeechService,
    })

    expect(mockTextToSpeechService.generateAudio).toHaveBeenCalledOnce()
    expect(mockTextToSpeechService.generateAudio).toHaveBeenCalledWith(mockText)

    expect(result).toBe(mockBlob)
  })
})
