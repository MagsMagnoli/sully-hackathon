import { TextToSpeechService } from '@/lib/textToSpeech/textToSpeechService'
import OpenAI from 'openai'

export class OpenAITextToSpeechService implements TextToSpeechService {
  async generateAudio(text: string): Promise<Blob> {
    const openai = new OpenAI()
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    })

    return mp3.blob()
  }
}
