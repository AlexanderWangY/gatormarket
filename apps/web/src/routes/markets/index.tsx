import { fetchActiveMarkets } from '@/api/markets'
import MarketCard from '@/components/MarketCard'
import { getSession } from '@/lib/auth-client'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/markets/')({
  component: RouteComponent,
  beforeLoad: async () => {
    // Fetch auth status
    const session = await getSession()

    return { session }
  },
})

function RouteComponent() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['active-markets', page],
    queryFn: () => fetchActiveMarkets(page, 20),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (isLoading) {
    return (
      <div className="flex flex-col max-w-5xl mx-auto pt-12 gap-12 lg:px-0 px-4">
        <div>
          <h1 className="text-2xl">Active Markets</h1>
        </div>

        <p>Loading...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col max-w-5xl mx-auto pt-12 gap-12 lg:px-0 px-4">
        <div>
          <h1 className="text-2xl">Active Markets</h1>
        </div>

        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto pt-12 gap-12 lg:px-0 px-4">
      <div>
        <h1 className="text-2xl">Active Markets</h1>
      </div>

      <div className="w-full flex flex-row flex-wrap gap-4">
        {data.items.map((item) => (
          <MarketCard
            key={item.id}
            id={item.id}
            question={item.question}
            liquidity={item.liquidity}
            closes_at={item.closes_at}
            yes_shares={item.yes_shares}
            no_shares={item.no_shares}
            course_code={item.course_code}
          />
        ))}
      </div>
    </div>
  )
}
