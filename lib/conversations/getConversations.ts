import { db } from '@/db/drizzle'

export async function getConversations() {
  return db.query.conversations.findMany({
    columns: {
      id: true,
      createdAt: true,
    },
  })
}
