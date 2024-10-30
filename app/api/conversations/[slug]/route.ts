import { getConversation } from '@/lib/conversations/getConversation'

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const slug = (await params).slug
  const conversation = await getConversation(slug)

  if (!conversation) {
    return new Response('Conversation not found', { status: 404 })
  }

  return Response.json({ conversation })
}
