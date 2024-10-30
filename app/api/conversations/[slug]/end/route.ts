import { endAndSummarizeConversation } from '@/lib/conversations/endConversation'

export const POST = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const slug = (await params).slug
  const summary = await endAndSummarizeConversation(slug)

  return Response.json({ summary })
}
