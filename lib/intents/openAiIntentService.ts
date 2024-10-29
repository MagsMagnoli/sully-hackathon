import { Intent, IntentService } from '@/lib/intents/intentService'
import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { z } from 'zod'

const tools = {
  scheduleAppointment: tool({
    description: 'Schedule a follow-up appointment',
    parameters: z.object({ date: z.string(), time: z.string() }),
    execute: async ({ date, time }) => ({
      text: `Appointment scheduled on ${date} at ${time}`,
    }),
  }),
  sendLabOrder: tool({
    description: 'Send a lab order',
    parameters: z.object({ labType: z.string(), orderDate: z.string() }),
    execute: async ({ labType, orderDate }) => ({
      text: `Lab order for ${labType} on ${orderDate} sent`,
    }),
  }),
  sendReferral: tool({
    description: 'Send a referral',
    parameters: z.object({ specialistType: z.string(), location: z.string() }),
    execute: async ({ specialistType, location }) => ({
      text: `Referral to ${specialistType} in ${location} sent`,
    }),
  }),
}

export class OpenAiIntentService implements IntentService {
  async detectIntent(text: string): Promise<Intent | null> {
    const { toolResults } = await generateText({
      model: openai('gpt-4-turbo'),
      tools,
      prompt: text,
      toolChoice: 'auto',
    })

    if (toolResults.length === 0) {
      return null
    }

    const toolResult = toolResults[0]

    return {
      id: toolResult.toolCallId,
      parameters: toolResult.args,
      text: toolResult.result.text,
    }
  }
}
