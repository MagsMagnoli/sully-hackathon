import { getConversation } from '@/lib/conversations/getConversation'
import { speechToMessage } from '@/lib/messages/speechToMessage'
import { z } from 'zod'

const createMessageInputSchema = z.object({
  audio: z.string(),
})

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const body = await request.json()

  const { audio } = createMessageInputSchema.parse(body)

  const slug = (await params).slug
  const conversation = await getConversation(slug)

  if (!conversation) {
    return new Response('Conversation not found', { status: 404 })
  }

  const data = await speechToMessage({
    conversation,
    base64Audio: audio,
  })

  return Response.json(data)
}
