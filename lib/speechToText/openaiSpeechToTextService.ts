import { SpeechToTextService } from '@/lib/speechToText/speechToTextService'
import fs from 'fs'
import OpenAI from 'openai'

export class OpenAISpeechToTextService implements SpeechToTextService {
  async generateText(filePath: string): Promise<string> {
    const openai = new OpenAI()
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: fs.createReadStream(filePath),
    })

    return transcription.text
  }
}
