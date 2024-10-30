import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export const NewConversationButton = () => {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/">
        <EditIcon />
        <span className="sr-only">New Conversation</span>
      </Link>
    </Button>
  )
}
