import { NewConversationButton } from '@/components/NewConversationButton'
import { AppSidebar } from '@/components/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex gap-1 items-center px-1">
          <SidebarTrigger />
          <NewConversationButton />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
