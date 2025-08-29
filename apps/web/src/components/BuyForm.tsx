import { fetchMyPortfolioSummary } from '@/api/portfolio'
import { useQuery } from '@tanstack/react-query'
import { cn, formatDollarsWithNoSign } from '@/lib/utils'
import { Button } from './ui/button'
import MoneyInput from './MoneyInput'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useState } from 'react'
import { makeTrade } from '@/api/trades'
import { useRouter } from '@tanstack/react-router'

type FormValues = {
  amount: number | null
}

interface Props {
  marketId: number
  option: "YES" | "NO"
  chance: number
}

function BuyForm({ marketId, chance, option }: Props) {
  const router = useRouter()
  const [tradeCreationLoading, setTradeCreationLoading] = useState(false)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['portfolio-summary'],
    queryFn: fetchMyPortfolioSummary,
  })
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      amount: null,
    },
  })

  const amount = watch('amount')
  const multiplier = 1 / chance

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    if (!value.amount) {
      toast.warning('Please enter a valid amount to buy')
      return
    }

    if (value.amount * 100 > ( data?.balanceCents ?? 0)) {
      toast.error('Insufficient buying power')
      return
    }

    setTradeCreationLoading(true)

    try {
      const trade = await makeTrade(option, "BUY", marketId, value.amount)
      toast.success(`Successfully bought $${formatDollarsWithNoSign(value.amount)} of ${option} shares`)
      router.navigate({ to: '/markets/$marketId/trade-success', params: { marketId: marketId.toString() }, search: { tradeId: trade.id } })
    } catch (e) {
      console.error(e)
      toast.error('Error creating trade. Please try again.')
    } finally {
      setTradeCreationLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data) {
    return <div>Error loading portfolio summary</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full py-2 space-y-4">
        <div className="relative flex items-center">
          <MoneyInput control={control} name="amount" className="w-full" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-end">
            {' '}
            <h2 className="text-lg font-medium">Odds</h2>
            <h2 className="text-xl font-medium">
              {Math.round(chance * 100)}% chance
            </h2>
          </div>
          <div className="flex flex-row justify-between items-end">
            {' '}
            <h2 className="text-xl font-medium">Potential Payout</h2>
            <h2 className="text-4xl font-bold text-green-400">
              ${formatDollarsWithNoSign(Number(amount) * multiplier)}
            </h2>
          </div>
        </div>

        <p>
          Buying Power (BP): ${formatDollarsWithNoSign(data.balanceCents / 100)}
        </p>
        <Button
          size="lg"
          type="submit"
          disabled={tradeCreationLoading}
          className="w-full bg-green-500 text-white hover:bg-green-400 cursor-pointer text-lg py-6"
        >
          {tradeCreationLoading
            ? 'Processing...'
            : `Buy`}
        </Button>
      </div>
    </form>
  )
}

export default BuyForm
