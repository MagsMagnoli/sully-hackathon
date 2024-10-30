import { db } from '@/db/drizzle'
import { language, messages, speaker } from '@/db/schema'
import { z } from 'zod'

export const createMessageInputSchema = z.object({
  conversationId: z.string(),
  text: z.string(),
  language: z.enum(language.enumValues),
  speaker: z.enum(speaker.enumValues),
  translatedText: z.string(),
  translatedLanguage: z.enum(language.enumValues),
  intent: z
    .object({
      text: z.string(),
    })
    .nullable()
    .optional(),
})

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>

export async function createMessage({
  conversationId,
  text,
  language,
  speaker,
  translatedText,
  translatedLanguage,
  intent,
}: CreateMessageInput) {
  return db
    .insert(messages)
    .values({
      conversationId,
      text,
      language,
      speaker,
      translatedText,
      translatedLanguage,
      intent,
    })
    .returning()
}
