import { getSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Link, Outlet } from '@tanstack/react-router'
import { createFileRoute, useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/markets')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    return { session }
  },
})

function RouteComponent() {
  const path = useLocation({
    select: (location) => location.pathname,
  })
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center max-w-5xl mx-auto lg:px-0 px-4 py-8">
        <Link
          to="/dashboard"
          className={cn(
            'text-md',
            path === '/dashboard' ? 'underline underline-offset-8' : '',
          )}
        >
          Wallet
        </Link>
        <Link
          to="/markets"
          className={cn(
            'text-md',
            path.startsWith('/markets') ? 'underline underline-offset-8' : '',
          )}
        >
          Markets
        </Link>
        <Link
          to="/dashboard/account"
          className={cn(
            'text-md',
            path.startsWith('/dashboard/account')
              ? 'underline underline-offset-8'
              : '',
          )}
        >
          Account
        </Link>
      </div>
      <Outlet />
    </div>
  )
}
