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
  summary: z.string().optional(),
  messages: z.array(MessageSchema),
  createdAt: z.date(),
})

export type Conversation = z.infer<typeof ConversationSchema>

export type IntentResponse = {
  intent: string
}

export type MessageResponse = {
  message: Message
}

export type ConversationResponse = {
  conversation: Conversation
}
