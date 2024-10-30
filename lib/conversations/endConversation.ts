import { db } from '@/db/drizzle'
import { conversations } from '@/db/schema'
import {
  createFeatureFlagService,
  featureFlagProviders,
} from '@/lib/featureFlags/featureFlagService'
import { MessagesSchema } from '@/lib/models'
import { createTextSummaryService } from '@/lib/textSummary/textSummaryService'
import { eq } from 'drizzle-orm'

export const endAndSummarizeConversation = async (slug: string) => {
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, slug),
    with: {
      messages: true,
    },
  })

  if (!conversation) {
    return new Response('Conversation not found', { status: 404 })
  }

  const featureFlagProvider = featureFlagProviders.parse(
    process.env.FEATURE_FLAG_PROVIDER,
  )

  const featureFlagService = createFeatureFlagService(featureFlagProvider)
  const textSummarService = createTextSummaryService(
    featureFlagService.textSummaryProvider(),
  )
  const parsedMessages = MessagesSchema.parse(conversation.messages)
  const summary = await textSummarService.generateSummary(
    parsedMessages
      .map((m) => {
        return `
            Speaker: ${m.speaker}
            Text: ${m.text}
            ${m.intent ? `Action taken: ${m.intent.text}` : ''}
          `
      })
      .join('\n'),
  )

  await db
    .update(conversations)
    .set({
      conversationStatus: 'closed',
      summary,
    })
    .where(eq(conversations.id, slug))

  return summary
}
