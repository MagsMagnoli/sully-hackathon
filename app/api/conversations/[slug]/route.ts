import { getConversation } from '@/lib/conversations/getConversation'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const conversation = await getConversation(slug)

  return Response.json({ conversation })
}
