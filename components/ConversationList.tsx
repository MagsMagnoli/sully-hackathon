'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Conversation } from '@/lib/models'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await fetch('/api/conversations')
  if (response.ok) {
    throw new Error('Failed to fetch conversations')
  }
  return response.json()
}

export const ConversationList = () => {
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  })

  if (query.isLoading) {
    return <ConversationsLoadingSkeleton />
  }

  if (query.isError) {
    return <ConversationsLoadingFailedAlert />
  }

  return (
    <SidebarMenu data-testid="conversation-list">
      {query.data?.map((conversation: Conversation) => (
        <SidebarMenuItem key={conversation.id}>
          <SidebarMenuButton asChild>
            <Link href={`/c/${conversation.id}`}>
              {conversation.createdAt.toISOString()}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

const ConversationsLoadingSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="flex flex-col space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

const ConversationsLoadingFailedAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Conversations failed to load</AlertDescription>
    </Alert>
  )
}
