import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import LucideLoaderCircle from '~icons/lucide/loader-circle'

export const Route = createFileRoute('/dashboard/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    await authClient.signOut(
      {},
      {
        onSuccess: () => {
          router.navigate({
            to: '/login',
            replace: true,
          })
        },
        onError: (error) => {
          toast.error(error.error.message || 'Something went wrong logging out')
        },
        onRequest: () => {
          setLoading(true)
        },
      },
    )

    setLoading(false)
  }

  return (
    <div className="flex flex-col max-w-5xl mx-auto pt-12 gap-12 lg:px-0 px-4">
      <div>
        <h1 className="text-2xl">Account Settings</h1>
      </div>

      <div>
        <Button
          onClick={logout}
          variant="destructive"
          className="hover:cursor-pointer"
        >
          {loading ? (
            <>
              <LucideLoaderCircle className="animate-spin" /> Logging out...
            </>
          ) : (
            'Log out'
          )}
        </Button>
      </div>
    </div>
  )
}
