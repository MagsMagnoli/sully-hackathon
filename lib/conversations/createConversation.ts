import { db } from '@/db/drizzle'
import { conversations, language } from '@/db/schema'
import { z } from 'zod'

export const createConversationInputSchema = z.object({
  doctorLanguage: z.enum(language.enumValues),
  patientLanguage: z.enum(language.enumValues),
})

export type CreateConversationInput = z.infer<
  typeof createConversationInputSchema
>

export async function createConversation({
  doctorLanguage,
  patientLanguage,
}: CreateConversationInput) {
  return db
    .insert(conversations)
    .values({
      doctorLanguage,
      patientLanguage,
    })
    .returning()
}
