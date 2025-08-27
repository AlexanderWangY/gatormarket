import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/leaderboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <h1>Leaderboard</h1>
    </div>
  )
}
