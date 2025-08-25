import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    
  }
})

function RouteComponent() {
  const { session } = Route.useRouteContext()

  return <div>Hello {session.user.name}!</div>
}
