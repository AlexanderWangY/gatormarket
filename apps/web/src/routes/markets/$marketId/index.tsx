import {
  fetchMarketById,
  fetchMarketPrices,
  fetchMarketSnapshots,
} from '@/api/markets'
import BuyForm from '@/components/BuyForm'
import SnapshotChart from '@/components/SnapshotChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
export const Route = createFileRoute('/markets/$marketId/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const market = await context.queryClient.fetchQuery({
      queryKey: ['market', params.marketId],
      queryFn: () => fetchMarketById(Number(params.marketId)),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return { market }
  },
})

function RouteComponent() {
  const { market } = Route.useLoaderData()
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['market-snapshots', market.id],
    queryFn: () => fetchMarketSnapshots(market.id),
    staleTime: 0, // always fetch fresh data
  })

  const {
    data: marketPriceData,
    isLoading: marketPriceLoading,
    isError: marketPriceError,
  } = useQuery({
    queryKey: ['market-prices', market.id],
    queryFn: () => fetchMarketPrices(market.id),
    staleTime: 0, // always fetch fresh data
  })

  const [option, setOption] = useState<'NO' | 'YES'>('YES')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  return (
    <div className="flex flex-col max-w-6xl mx-auto pt-12 gap-12 px-4 lg:px-0 min-h-screen pb-64">
      <div className="flex flex-col gap-4">
        <Badge className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-500 border-blue-600/60 shadow-none text-md rounded-full mb-2">
          {market.course_code}
        </Badge>
        <h1 className="text-3xl">{market.question}</h1>
        <p className="text-md text-neutral-500 dark:text-neutral-300">
          Closes {new Date(market.closes_at).toLocaleDateString()}{' '}
          {new Date(market.closes_at).toLocaleTimeString()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-8 md:gap-16">
        {/* Chart */}
        <div className="w-full md:flex-3">
          {data && !isLoading && !isError && <SnapshotChart data={data} />}
        </div>

        {/* Trading Card */}
        <div className="w-full md:flex-2">
          {session ? (
            <Card>
              <CardHeader>
                <p className="text-lg text-neutral-500 dark:text-neutral-300">
                  {market.question}
                </p>
                <p
                  className={`text-lg font-medium ${
                    option === 'YES' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {side.charAt(0).toUpperCase() + side.slice(1).toLowerCase()}{' '}
                  {option.charAt(0).toUpperCase() +
                    option.slice(1).toLowerCase()}
                </p>
              </CardHeader>

              {marketPriceData && !marketPriceLoading && !marketPriceError && (
                <CardContent className="flex flex-col gap-4 md:gap-8">
                  <div className="flex flex-col md:flex-row w-full gap-4">
                    <Button
                      size="lg"
                      onClick={() => setOption('YES')}
                      className={`flex-1 py-4 md:py-8 text-2xl cursor-pointer ${
                        option === 'YES'
                          ? 'bg-green-500 text-white hover:bg-green-500'
                          : 'bg-green-500/30 text-green-600 hover:bg-green-500/40'
                      }`}
                    >
                      Yes {Math.round(marketPriceData.priceYes * 100)}¢
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setOption('NO')}
                      className={`flex-1 py-4 md:py-8 text-2xl cursor-pointer ${
                        option === 'NO'
                          ? 'bg-red-500 text-white hover:bg-red-500'
                          : 'bg-red-500/30 text-red-600 hover:bg-red-500/40'
                      }`}
                    >
                      No {Math.round(marketPriceData.priceNo * 100)}¢
                    </Button>
                  </div>

                  <Tabs defaultValue="buy" className="w-full">
                    <TabsList className="flex flex-row justify-between w-full">
                      <TabsTrigger onClick={() => setSide('BUY')} value="buy">
                        Buy
                      </TabsTrigger>
                      <TabsTrigger onClick={() => setSide('SELL')} value="sell">
                        Sell
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="buy">
                      <BuyForm
                        option={option}
                        marketId={market.id}
                        chance={
                          option === 'YES'
                            ? marketPriceData.priceYes
                            : marketPriceData.priceNo
                        }
                      />
                    </TabsContent>
                    <TabsContent value="sell">
                      Change your password here.
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          ) : (
            <Card>

              <CardContent className='space-y-4'>
              <h1 className='text-xl'>You must be logged in to start betting!</h1>
              <Button className='w-full' onClick={() => router.navigate({ to: "/signup"})}>Sign Up</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
