import { getConversations } from '@/lib/conversations/getConversations'

export async function GET() {
  const conversations = await getConversations()

  return Response.json({ conversations })
}
