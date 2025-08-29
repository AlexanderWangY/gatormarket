import { Separator } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import TablerArrowRight from '~icons/tabler/arrow-right'
import { fetchMarketPrices, type Market } from '@/api/markets'
import { Badge } from './ui/badge'
import { useQuery } from '@tanstack/react-query'
import { formatDollarNumber, lmsrMarketMoney } from '@/lib/utils'
import { useRouter } from '@tanstack/react-router'

type Props = Pick<
  Market,
  | 'id'
  | 'question'
  | 'liquidity'
  | 'no_shares'
  | 'yes_shares'
  | 'closes_at'
  | 'course_code'
>

function MarketCard({
  id,
  question,
  liquidity,
  closes_at,
  yes_shares,
  no_shares,
  course_code,
}: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['market-prices', id],
    queryFn: () => fetchMarketPrices(id),
    staleTime: 0, // always fetch fresh data
  })
  const router = useRouter()

  return (
    <Card className="flex flex-col justify-between rounded-2xl w-full sm:max-w-84 shadow-md hover:shadow-lg transition">
      <CardHeader>
        <Badge className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-500 border-blue-600/60 shadow-none rounded-full mb-2">
          {course_code}
        </Badge>
        <CardTitle className="text-lg font-medium leading-snug">
          {question}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Closes {new Date(closes_at).toLocaleDateString()}{' '}
          {new Date(closes_at).toLocaleTimeString()}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isError ? (
          <p className="text-red-500">
            Something went wrong fetching prices. Please refresh.
          </p>
        ) : isLoading || !data ? (
          <div className="flex flex-row justify-between gap-2">
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-1">Yes</p>
              <p className="text-lg font-medium">...</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-1">No</p>
              <p className="text-lg font-medium">...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-row justify-between gap-6">
            <div className="flex-1 flex flex-col items-center justify-center bg-green-500/20 dark:bg-red-green/25 py-2 rounded-md">
              <p className="text-md dark:text-green-400 mb-1 text-green-600">
                Yes
              </p>
              <p className="text-xl font-bold dark:text-green-400 text-green-600">
                {Math.round(data.priceYes * 100)}%
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-red-500/20 dark:bg-red-500/25 py-2 rounded-md">
              <p className="text-md mb-1 text-red-600">No</p>
              <p className="text-xl font-bold text-red-600">
                {Math.round(data.priceNo * 100)}%
              </p>
            </div>
          </div>
        )}

        <Separator />

        <Button
          onClick={() =>
            router.navigate({
              to: `/markets/${id}`,
            })
          }
          variant="outline"
          className="cursor-pointer"
        >
          Trade <TablerArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-neutral-400 text-xs">
          $
          {formatDollarNumber(
            lmsrMarketMoney(
              Number(yes_shares),
              Number(no_shares),
              Number(liquidity),
            ) / 100,
          )}{' '}
          volume traded
        </p>
      </CardFooter>
    </Card>
  )
}

export default MarketCard
