'use client'

import { AudioRecorder } from '@/components/AudioRecorder'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Conversation,
  ConversationResponse,
  IntentResponse,
  Message,
  MessageResponse,
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
  if (response.ok) {
    throw new Error('Failed to fetch conversation')
  }
  return response.json()
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
  if (response.ok) {
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
}): Promise<MessageResponse | IntentResponse> => {
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
  if (response.ok) {
    throw new Error('Failed to create message')
  }
  return response.json()
}

const createTTSMessage = async ({ text }: { text: string }): Promise<Blob> => {
  const response = await fetch(`/api/tts`, {
    method: 'post',
    body: JSON.stringify({ text }),
  })
  if (response.ok) {
    throw new Error('Failed to create tts message')
  }
  return response.blob()
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
  if (response.ok) {
    throw new Error('Failed to end conversation')
  }
  return response.json()
}

export const ConversationDetail = () => {
  const { conversationId } = useParams<{ conversationId?: string }>()
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

  return (
    <>
      <audio ref={audioRef} className="hidden"></audio>
      {data?.conversationStatus === 'open' && (
        <EndConversationButton
          loading={isEndingConversation}
          onClick={async () => await endConversationMutation()}
        />
      )}
      <AudioRecorder
        onSpeechEnd={async (audio) => {
          if (conversationId) {
            const response = await createMessageMutation.mutateAsync(audio)

            if ('intent' in response) {
              if (response.intent === 'bargeIn') {
                audioRef.current?.pause()
              } else if (response.intent === 'repeatThat') {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0
                  audioRef.current.play()
                }
              }
            } else {
              await refetch() // TODO: replace with cache change
              const audio = await ttsMutation.mutateAsync(
                response.message.translatedText,
              )
              const audioUrl = URL.createObjectURL(audio)

              if (audioRef.current) {
                audioRef.current.src = audioUrl
                audioRef.current.play()
              }
            }
          } else {
            const response = await createConversationMutation.mutateAsync(audio)
            router.replace(`/c/${response.conversation.id}`)
          }
        }}
      />
      {data?.conversationStatus}
      {data?.summary && <MarkdownRenderer content={data.summary} />}
      {!conversationId && (
        <LanguageSelector
          doctorLanguage={doctorLanguage}
          onDoctorLanguageChange={(v) => setDoctorLanguage(v)}
          patientLanguage={patientLanguage}
          onPatientLanguageChange={(v) => setPatientLanguage(v)}
        />
      )}
      {data && <ConversationMesages conversation={data} />}
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
    <div className="flex gap-2">
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
}: {
  conversation: Conversation
}) => {
  return (
    <div className="flex flex-col gap-2">
      {conversation.messages.map((message: Message, i) => (
        <ConversationMessage key={i} message={message} />
      ))}
    </div>
  )
}

const ConversationMessage = ({ message }: { message: Message }) => {
  return (
    <div
      className={`
        p-2 rounded
        ${message.speaker === 'doctor' ? 'bg-green-600' : 'bg-blue-600'}`}
    >
      <div>{message.translatedText}</div>
      {message.intent && <div>{message.intent.text}</div>}
    </div>
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
