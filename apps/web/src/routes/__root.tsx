import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import type { createAuthClient } from 'better-auth/react'
import Navbar from '@/components/Navbar'
import { ModeToggle } from '@/components/mode-toggle'

type AuthClient = ReturnType<typeof createAuthClient>
type SessionData = ReturnType<AuthClient['useSession']>['data']

interface MyRouterContext {
  queryClient: QueryClient
  auth?: SessionData
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && (
        <>
          <div className="fixed w-screen h-screen pointer-events-none flex flex-row">
            <TanstackDevtools
              config={{
                position: 'bottom-left',
                openHotkey: [],
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </div>

          <div className="fixed right-4 bottom-4">
            <ModeToggle />
          </div>
        </>
      )}
    </>
  ),
})
