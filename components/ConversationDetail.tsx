'use client'

import { AudioRecorder } from '@/components/AudioRecorder'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Conversation,
  ConversationResponse,
  CreateMessageResponse,
  Message,
} from '@/lib/models'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

const fetchConversation = async (
  conversationId?: string,
): Promise<Conversation> => {
  if (!conversationId) {
    throw new Error('Missing conversationId')
  }

  const response = await fetch(`/api/conversations/${conversationId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch conversation')
  }
  const json = await response.json()

  return json.conversation
}

const createConversation = async ({
  doctorLanguage,
  patientLanguage,
  audio,
}: {
  doctorLanguage: string
  patientLanguage: string
  audio: string
}): Promise<ConversationResponse> => {
  const response = await fetch(`/api/conversations`, {
    method: 'post',
    body: JSON.stringify({ doctorLanguage, patientLanguage, audio }),
  })
  if (!response.ok) {
    throw new Error('Failed to fetch conversation')
  }
  return response.json()
}

const createMessage = async ({
  conversationId,
  audio,
}: {
  conversationId?: string
  audio: string
}): Promise<CreateMessageResponse> => {
  if (!conversationId) {
    throw new Error('Missing conversationId')
  }

  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      method: 'post',
      body: JSON.stringify({ audio }),
    },
  )
  if (!response.ok) {
    throw new Error('Failed to create message')
  }
  return response.json()
}

const createTTSMessage = async ({
  text,
}: {
  text: string
}): Promise<ArrayBuffer> => {
  const response = await fetch(`/api/tts`, {
    headers: {
      Accept: '*/*',
    },
    method: 'post',
    body: JSON.stringify({ text }),
  })
  if (!response.ok) {
    throw new Error('Failed to create tts message')
  }
  return response.arrayBuffer()
}

const endConversation = async ({
  conversationId,
}: {
  conversationId?: string
}): Promise<{ summary: string }> => {
  if (!conversationId) {
    throw new Error('Missing conversationId')
  }

  const response = await fetch(`/api/conversations/${conversationId}/end`, {
    method: 'post',
    body: JSON.stringify({}),
  })
  if (!response.ok) {
    throw new Error('Failed to end conversation')
  }
  return response.json()
}

export const ConversationDetail = () => {
  const { conversationId: conversationIdParam } = useParams<{
    conversationId?: string
  }>()
  const [conversationId, setConversationId] = useState(conversationIdParam)
  const [doctorLanguage, setDoctorLanguage] = useState('en')
  const [patientLanguage, setPatientLanguage] = useState('es')
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  const { data, refetch } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => fetchConversation(conversationId),
    enabled: !!conversationId,
  })

  const createConversationMutation = useMutation({
    mutationKey: ['conversations', 'create'],
    mutationFn: (audio: string) =>
      createConversation({
        doctorLanguage,
        patientLanguage,
        audio,
      }),
  })

  const createMessageMutation = useMutation({
    mutationKey: ['conversations', conversationId, 'messages', 'create'],
    mutationFn: (audio: string) =>
      createMessage({
        conversationId,
        audio,
      }),
  })

  const ttsMutation = useMutation({
    mutationKey: ['conversations', conversationId, 'messages', 'tts'],
    mutationFn: (text: string) =>
      createTTSMessage({
        text,
      }),
  })

  const {
    mutateAsync: endConversationMutation,
    isPending: isEndingConversation,
  } = useMutation({
    mutationKey: ['conversations', conversationId],
    mutationFn: async () => {
      await endConversation({
        conversationId,
      }),
        await refetch()
    },
  })

  const playAudio = async (message: Message, onEnded?: () => void) => {
    await refetch() // TODO: replace with cache change
    const audio = await ttsMutation.mutateAsync(message.translatedText)
    const audioUrl = URL.createObjectURL(new Blob([audio]))

    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      audioRef.current.onended = () => {
        onEnded?.()
      }
    }
  }

  const disableAudio =
    createConversationMutation.isPending ||
    createMessageMutation.isPending ||
    isEndingConversation

  return (
    <>
      <audio ref={audioRef} className="hidden"></audio>
      {data?.conversationStatus === 'open' && (
        <div className="flex w-full justify-center">
          <EndConversationButton
            loading={isEndingConversation}
            onClick={async () => await endConversationMutation()}
          />
        </div>
      )}
      {(!conversationId || data?.conversationStatus === 'open') && (
        <>
          <AudioRecorder
            disabled={disableAudio}
            onSpeechEnd={async (audio) => {
              if (conversationId) {
                const response = await createMessageMutation.mutateAsync(audio)

                console.log('RESPONSE', JSON.stringify(response))

                if (response.type === 'intent') {
                  if (response.data === 'bargeIn') {
                    audioRef.current?.pause()
                  } else if (response.data === 'repeatThat') {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0
                      audioRef.current.play()
                    }
                  }
                } else {
                  await playAudio(response.data)
                }
              } else {
                const response = await createConversationMutation.mutateAsync(
                  audio,
                )
                const { conversation } = response

                setConversationId(conversation.id)

                if (conversation.messages?.length) {
                  await playAudio(conversation.messages?.[0], () => {
                    router.replace(`/c/${conversation.id}`)
                  })
                }
              }
            }}
          />
          {!disableAudio && !conversationId && (
            <div className="flex w-full justify-center">
              Speak to get started
            </div>
          )}
          <div className="flex w-full justify-center">
            {disableAudio && <Spinner />}
          </div>
        </>
      )}
      {data?.summary && (
        <div className="rounded border-black border p-4 w-full">
          <MarkdownRenderer content={data.summary} />
        </div>
      )}
      {!conversationId && (
        <LanguageSelector
          doctorLanguage={doctorLanguage}
          onDoctorLanguageChange={(v) => setDoctorLanguage(v)}
          patientLanguage={patientLanguage}
          onPatientLanguageChange={(v) => setPatientLanguage(v)}
        />
      )}
      {data && (
        <ConversationMesages
          conversation={data}
          loadingAudio={ttsMutation.isPending}
        />
      )}
    </>
  )
}

const LanguageSelector = ({
  doctorLanguage,
  patientLanguage,
  onDoctorLanguageChange,
  onPatientLanguageChange,
}: {
  doctorLanguage: string
  patientLanguage: string
  onDoctorLanguageChange: (language: string) => void
  onPatientLanguageChange: (language: string) => void
}) => {
  return (
    <div className="flex justify-center w-full gap-2">
      <div>
        <div className="text-xs">Doctor Language</div>
        <Select value={doctorLanguage} onValueChange={onDoctorLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Doctor Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="text-xs">Patient Language</div>
        <Select value={patientLanguage} onValueChange={onPatientLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Patient Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const ConversationMesages = ({
  conversation,
  loadingAudio,
}: {
  conversation: Conversation
  loadingAudio: boolean
}) => {
  const messages = conversation.messages || []

  return (
    <div className="flex flex-col gap-2 w-full">
      {conversation.messages?.map((message: Message, i) => (
        <ConversationMessage
          key={i}
          message={message}
          loading={loadingAudio && i === messages.length - 1}
        />
      ))}
    </div>
  )
}

const ConversationMessage = ({
  message,
  loading,
}: {
  message: Message
  loading: boolean
}) => {
  return (
    <>
      <div
        className={`
        p-2 rounded w-1/2
        ${
          message.speaker === 'doctor'
            ? 'bg-green-600 self-start'
            : 'bg-blue-600 self-end'
        }`}
      >
        <div className="flex items-center relative">
          {message.translatedText}
          {loading && <Spinner className="absolute right-2" size="small" />}
        </div>
      </div>
      {message.intent && (
        <div className="mt-1 bg-neutral-200 rounded w-full p-2">
          <div className="font-bold text-sm">Action Taken</div>
          <div className="text-xs">{message.intent.text}</div>
        </div>
      )}
    </>
  )
}

const EndConversationButton = ({
  loading,
  onClick,
}: {
  loading: boolean
  onClick: () => void
}) => {
  return (
    <Button disabled={loading} onClick={onClick}>
      End Conversation
    </Button>
  )
}
