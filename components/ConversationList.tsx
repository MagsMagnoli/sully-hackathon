'use client'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Conversation } from '@/lib/models'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export const ConversationList = () => {
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations')
      return response.json()
    },
  })

  if (query.isLoading) {
    return <ConversationsLoadingSkeleton />
  }

  return (
    <SidebarMenu>
      {query.data?.map((conversation: Conversation) => (
        <SidebarMenuItem key={conversation.id}>
          <SidebarMenuButton asChild>
            <Link href={`/c/${conversation.id}`}>{conversation.name}</Link>
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
