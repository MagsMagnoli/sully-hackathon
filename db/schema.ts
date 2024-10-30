import { relations } from 'drizzle-orm'
import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const conversationStatus = pgEnum('conversation_status', [
  'open',
  'closed',
])

export const language = pgEnum('language', ['en', 'es', 'fr', 'de'])
const LanguageSchema = z.enum(language.enumValues)
export type Language = z.infer<typeof LanguageSchema>

export const speaker = pgEnum('speakers', ['doctor', 'patient'])
const SpeakerSchema = z.enum(speaker.enumValues)
export type Speaker = z.infer<typeof SpeakerSchema>

export const conversations = pgTable('conversations', {
  id: uuid().primaryKey().defaultRandom(),
  doctor_language: language().notNull(),
  patient_language: language().notNull(),
  conversationStatus: conversationStatus().notNull().default('open'),
  summary: varchar(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}))

export const messages = pgTable('messages', {
  id: uuid().primaryKey().defaultRandom(),
  conversationId: uuid()
    .notNull()
    .references(() => conversations.id),
  text: varchar().notNull(),
  language: language().notNull(),
  translatedText: varchar().notNull(),
  translatedLanguage: language().notNull(),
  intent: jsonb(),
  speaker: speaker().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}))
