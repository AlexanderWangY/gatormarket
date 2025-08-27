import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'

interface Props {
  imageUrl?: string | null
  name: string
}

function AvatarProfile({ imageUrl, name }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const logout = async () => {
    await authClient.signOut(
      {},
      {
        onError: (err) => {
          toast.error(`${err.error.message}`)
        },
        onSuccess: () => {
          toast('See you later, alligator!', { closeButton: true })
          router.navigate({
            to: '/',
            replace: true,
          })
        },
      },
    )
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      modal={false}
    >
      <DropdownMenuTrigger onMouseEnter={() => setIsOpen(true)}>
        <Avatar className="h-10 w-10 aspect-square">
          <AvatarImage src={imageUrl ?? undefined} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseLeave={() => setIsOpen(false)}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
        className="min-w-48"
        align="end"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Portfolio</DropdownMenuItem>
        <DropdownMenuItem>Trades</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarProfile
