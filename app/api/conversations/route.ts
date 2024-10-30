import { language } from '@/db/schema'
import { createConversation } from '@/lib/conversations/createConversation'
import { getConversations } from '@/lib/conversations/getConversations'
import { speechToMessage } from '@/lib/messages/speechToMessage'
import { z } from 'zod'

export async function GET() {
  const conversations = await getConversations()

  return Response.json({ conversations })
}

const createConversationInputSchema = z.object({
  doctorLanguage: z.enum(language.enumValues),
  patientLanguage: z.enum(language.enumValues),
  audio: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json()

  const { doctorLanguage, patientLanguage, audio } =
    createConversationInputSchema.parse(body)

  const [conversation] = await createConversation({
    doctorLanguage,
    patientLanguage,
  })

  const response = await speechToMessage({
    conversation,
    base64Audio: audio,
  })

  if (response?.type === 'message') {
    return Response.json({
      conversation: {
        ...conversation,
        messages: [response.data],
      },
    })
  }

  return Response.json({ conversation })
}
