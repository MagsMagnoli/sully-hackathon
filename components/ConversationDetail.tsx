import { AudioRecorder } from '@/components/AudioRecorder'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Conversation, Message } from '@/lib/models'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const fetchConversation = async (
  conversationId?: string,
): Promise<Conversation> => {
  if (!conversationId) {
    throw new Error('Missing conversationId')
  }

  const response = await fetch(`/api/conversation/${conversationId}`)
  if (response.ok) {
    throw new Error('Failed to fetch conversation')
  }
  return response.json()
}

export const ConversationDetail = () => {
  const { conversationId } = useParams<{ conversationId?: string }>()
  const [doctorLanguage, setDoctorLanguage] = useState('en')
  const [patientLanguage, setPatientLanguage] = useState('es')

  const { data } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => fetchConversation(conversationId),
    enabled: !!conversationId,
  })

  return (
    <>
      <AudioRecorder />
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

const ConversationMessage = {
  message,
}
