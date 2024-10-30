import { conversationStatus, language } from '@/db/schema'
import { z } from 'zod'

export const MessageSchema = z.object({
  speaker: z.string(),
  text: z.string(),
  translatedText: z.string(),
  intent: z
    .object({
      text: z.string(),
    })
    .nullable()
    .optional(),
})

export const MessagesSchema = z.array(MessageSchema)
export type Message = z.infer<typeof MessageSchema>

const ConversationSchema = z.object({
  id: z.string(),
  conversationStatus: z.enum(conversationStatus.enumValues),
  doctorLanguage: z.enum(language.enumValues),
  patientLanguage: z.enum(language.enumValues),
  summary: z.string().nullable().optional(),
  messages: z.array(MessageSchema).optional(),
  createdAt: z.string(),
})

export type Conversation = z.infer<typeof ConversationSchema>

export type ConversationResponse = {
  conversation: Conversation
}

export type CreateMessageResponse =
  | {
      type: 'intent'
      data: string
    }
  | {
      type: 'message'
      data: Message
    }
