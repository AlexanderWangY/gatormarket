import { fetchTradeById } from '@/api/trades'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDollarNumber } from '@/lib/utils'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

type Search = {
  tradeId: string
}

export const Route = createFileRoute('/markets/$marketId/trade-success')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => {
    if (typeof search.tradeId !== 'string') {
      throw new Error('tradeId must be a string')
    }

    return { tradeId: search.tradeId }
  },
  beforeLoad: async ({ search }) => {
    const result = await fetchTradeById(search.tradeId)

    return { trade: result }
  },
})

function RouteComponent() {
  const { trade } = Route.useRouteContext()
  const router = useRouter()
  const isBuy = trade.trade_type === 'BUY'
  const amount = Number(trade.amount_cents) / 100

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
        Trade Successful!
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Your {trade.trade_type.toLowerCase()} trade was executed successfully.
      </p>

      {/* Trade Summary Card */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Trade Summary</h2>
          <Badge variant={isBuy ? 'secondary' : 'destructive'}>
            {trade.trade_type}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Market ID:</span>
            <span className="font-semibold">{trade.market_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Shares:</span>
            <span className="font-semibold">{trade.shares}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">
              {isBuy ? 'Spent' : 'Earned'}:
            </span>
            <span className="font-semibold text-green-600">
              ${formatDollarNumber(amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Executed at:</span>
            <span className="text-gray-500">
              {new Date(trade.created_at).toLocaleString()}
            </span>
          </div>

          {!isBuy && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Outcome:</span>
              <span className="text-gray-700 font-semibold">
                {trade.outcome}
              </span>
            </div>
          )}

          <Separator className="my-2" />

          <Button
            className="w-full"
            onClick={() =>
              router.navigate({
                to: '/markets/$marketId',
                params: { marketId: trade.market_id.toString() },
              })
            }
          >
            Back to Market
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
