import { fetchMyPortfolioSummary } from '@/api/portfolio'
import { formatDollarsWithNoSign } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/account/')({
  component: RouteComponent,
  loader: async () => {
    const result = await fetchMyPortfolioSummary()

    return { portfolioSummary: result }
  },
})

function RouteComponent() {
  const { portfolioSummary } = Route.useLoaderData()
  const { session } = Route.useRouteContext()

  const today = new Date()

  return (
    <div className="flex flex-col max-w-6xl mx-auto pt-12 gap-12 lg:px-0 px-4">
      <div>
        <h1 className="text-2xl">Welcome, {session.user.name}</h1>
        <p className="text-neutral-500 text-lg">
          {today.toLocaleDateString('en-US')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Balance:</h2>
        <div className="flex flex-col gap-2">
          <p className="text-6xl font-semibold">
            <span className="font-normal text-4xl mr-1">$</span>
            {formatDollarsWithNoSign(portfolioSummary.totalPortfolioValueCents / 100)}
          </p>
        </div>
      </div>
    </div>
  )
}
