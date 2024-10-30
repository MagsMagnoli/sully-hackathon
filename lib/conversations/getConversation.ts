import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'
import { conversations } from '../../db/schema'

export async function getConversation(slug: string) {
  return db.query.conversations.findFirst({
    where: eq(conversations.id, slug),
  })
}
