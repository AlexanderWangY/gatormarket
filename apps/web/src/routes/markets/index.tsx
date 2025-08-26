import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { api } from '@/lib/ky'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/markets/')({
  component: RouteComponent,
})

export const MarketStatusEnum = z.enum([
  'active',
  'inactive',
  'settled',
  'cancelled',
])

// Replace with contracts in future
export const MarketSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  course_code: z.string(),
  exam_name: z.string(),
  exam_start_time: z.string(), // ISO timestamp
  exam_end_time: z.string(), // ISO timestamp
  status: MarketStatusEnum,
  created_at: z.string(),
  updated_at: z.string(),
})

export type Market = z.infer<typeof MarketSchema>

export const GetMarketsResponseSchema = z.object({
  items: z.array(MarketSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type GetMarketsResponse = z.infer<typeof GetMarketsResponseSchema>

const fetchActiveMarkets = async (page: number) => {
  const result = await api
    .get<GetMarketsResponse>(`markets?status=active&page=${page}&limit=100`)
    .json()

  return result.items
}

function RouteComponent() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['active-markets', page],
    queryFn: () => fetchActiveMarkets(page),
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
    <div className="flex flex-col max-w-5xl mx-auto pt-12 gap-12 lg:px-0 px-4">
      <div>
        <h1 className="text-2xl">Active Markets</h1>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((market) => (
            <Card key={market.id}>
              <CardHeader>
                {market.title}{' '}
                <CardDescription>
                  {market.description ?? 'No description.'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-row w-full gap-4">
                  {/* Yes Button */}
                  <div className="flex-1 flex flex-col items-center gap-2 border-2 border-neutral-100 rounded-md p-4">
                    <div>
                      <div className="text-xl font-medium">
                        ¢{(0.62).toFixed(2)} {/* placeholder price */}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        x{(1 / 0.62).toFixed(2)} {/* multiplier */}
                      </div>
                    </div>
                    <Button
                      variant="default"
                      className="w-full bg-green-600 cursor-pointer hover:bg-green-800"
                    >
                      Yes
                    </Button>
                  </div>

                  {/* No Button */}
                  <div className="flex-1 flex flex-col items-center gap-2 border-2 border-neutral-100 rounded-md p-4">
                    <div>
                      <div className="text-xl font-medium">
                        ¢{(0.38).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        x{(1 / 0.38).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full cursor-pointer"
                    >
                      No
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/markets/${market.id}`} className='text-blue-500 underline underline-offset-4'>View more details</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No active markets available at the moment.</p>
      )}
    </div>
  )
}
