import { TextToSpeechService } from '@/lib/textToSpeech/textToSpeechService'
import OpenAI from 'openai'

export class OpenAITextToSpeechService implements TextToSpeechService {
  async generateAudio(text: string): Promise<ArrayBuffer> {
    const openai = new OpenAI()
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    })

    return response.arrayBuffer()
  }
}
