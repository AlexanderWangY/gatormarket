import { Separator } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import TablerArrowRight from '~icons/tabler/arrow-right'
import type { Market } from '@/api/markets'

type Props = Pick<
  Market,
  'id' | 'question' | 'liquidity' | 'no_shares' | 'yes_shares' | 'closes_at'
>

function MarketCard({
  id,
  question,
  liquidity,
  closes_at,
  yes_shares,
  no_shares,
}: Props) {
  return (
    <Card className="flex flex-col justify-between rounded-2xl min-w-72 shadow-md hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="text-lg font-medium leading-snug">
          {question}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Closes {new Date(closes_at).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="w-full rounded-xl py-6 flex flex-col items-center"
          >
            <span className="text-sm font-medium">Yes</span>
            <span className="text-lg font-bold">
              {(0.87 * 100).toFixed(1)}¢
            </span>
          </Button>
          <Button
            variant="secondary"
            className="w-full rounded-xl py-6 flex flex-col items-center"
          >
            <span className="text-sm font-medium">No</span>
            <span className="text-lg font-bold">
              {(0.56 * 100).toFixed(1)}¢
            </span>
          </Button>
        </div>

        <Separator />

        <Button
          variant="outline"
          className="w-full rounded-xl flex items-center justify-center gap-2"
        >
          Trade <TablerArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default MarketCard;