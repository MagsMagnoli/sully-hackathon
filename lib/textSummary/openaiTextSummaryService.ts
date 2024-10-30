import { TextSummaryService } from '@/lib/textSummary/textSummaryService'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

const createPrompt = (conversation: string) => `
    Summarize the following conversation between a doctor and a patient in English.
    Write the summarization using markdown syntax.
    Be sure to make note of any actions that were taken.

    <conversation>
    ${conversation}
    </conversation>
`

export class OpenAITextSummaryService implements TextSummaryService {
  async generateSummary(text: string): Promise<string> {
    const response = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: createPrompt(text),
    })

    return response.text
  }
}
