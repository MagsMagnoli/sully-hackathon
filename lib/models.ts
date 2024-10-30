import { z } from 'zod'

export type Conversation = {
  id: string
  name: string
}

export const MessageSchema = z.object({
  speaker: z.string(),
  text: z.string(),
  intent: z
    .object({
      text: z.string(),
    })
    .nullable()
    .optional(),
})

export const MessagesSchema = z.array(MessageSchema)
