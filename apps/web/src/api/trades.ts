import { api } from '@/lib/ky'
import z from 'zod'

export const tradeSchema = z.object({
  outcome: z.enum(['YES', 'NO']),
  amount_cents: z.string(),
  shares: z.string(),
  created_at: z.date(),
  id: z.string(),
  market_id: z.number(),
  trade_type: z.enum(["BUY", "SELL"]), // replace with enum if desired
  user_id: z.string(),
})

export type Trade = z.infer<typeof tradeSchema>

const MakeBuyTradeBodySchema = z.object({
  type: z.literal('BUY'),
  outcome: z.enum(['YES', 'NO']),
  marketId: z.number(),
  amount_cents: z.number().min(1),
})

const MakeSellTradeBodySchema = z.object({
  type: z.literal('SELL'),
  outcome: z.enum(['YES', 'NO']),
  marketId: z.number(),
  shares: z.number().min(0.0001),
})

export type MakeBuyTradeBody = z.infer<typeof MakeBuyTradeBodySchema>
export type MakeSellTradeBody = z.infer<typeof MakeSellTradeBodySchema>

export const MakeTradeBodySchema = z.discriminatedUnion('type', [
  MakeBuyTradeBodySchema,
  MakeSellTradeBodySchema,
])

export type MakeTradeBody = z.infer<typeof MakeTradeBodySchema>

export const makeTrade = async (
  side: 'YES' | 'NO',
  option: 'BUY' | 'SELL',
  marketId: number,
  amount?: number,
  shares?: number,
) => {
  if (!amount && !shares) {
    throw new Error('Either amount or shares must be provided')
  }

  if (amount && option === 'SELL') {
    throw new Error('Amount cannot be provided when selling shares')
  }

  if (shares && option === 'BUY') {
    throw new Error('Shares cannot be provided when buying shares')
  }

  const body: Partial<MakeTradeBody> = {
    type: option,
    outcome: side,
    marketId,
  }

  if (amount && body.type === 'BUY') {
    body.amount_cents = amount * 100
  } else if (shares && body.type === 'SELL') {
    body.shares = shares
  }

  const result = await api.post<Trade>('trades', { json: body }).json()

  return result
}

export const fetchTradeById = async (tradeId: string) => {
    return api.get<Trade>(`trades/${tradeId}`).json()
}
