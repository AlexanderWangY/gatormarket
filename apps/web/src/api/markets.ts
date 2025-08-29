import { api } from '@/lib/ky'
import z from 'zod'

export const OutcomeResultType = z.enum(['YES', 'NO'])

export const MarketSchema = z.object({
  id: z.number().int(),
  question: z.string(),
  semester: z.string(),
  closes_at: z.iso.datetime(), // TIMESTAMPTZ serialized as ISO string
  liquidity: z.number().int(), // BIGINT → JS number (safe up to 2^53-1)
  resolved: z.boolean(),
  outcome: OutcomeResultType.nullable(), // outcome_result_type can be null
  yes_shares: z.string(), // NUMERIC → string (to preserve precision)
  no_shares: z.string(), // same here
  course_code: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
})

export const GetMarketsResponseSchema = z.object({
  items: z.array(MarketSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
})

export const GetMarketPricesResponseSchema = z.object({
  priceYes: z.number(),
  priceNo: z.number(),
})

export const MarketSnapshot = z.object({
  id: z.uuid(),
  market_id: z.number().int(),
  yes_shares: z.coerce.number(),
  no_shares: z.coerce.number(),
  yes_price_cents: z.coerce.number(),
  no_price_cents: z.coerce.number(),
  created_at: z.coerce.date(),
})

export type Market = z.infer<typeof MarketSchema>
export type MarketSnapshot = z.infer<typeof MarketSnapshot>
export type GetMarketsResponse = z.infer<typeof GetMarketsResponseSchema>
export type GetMarketPricesResponse = z.infer<
  typeof GetMarketPricesResponseSchema
>

export const fetchActiveMarkets = async (
  page: number = 1,
  limit: number = 20,
) => {
  return api
    .get<GetMarketsResponse>(`markets?page=${page}&limit=${limit}`)
    .json()
}

export const fetchMarketPrices = async (marketId: number) => {
  return api.get<GetMarketPricesResponse>(`markets/${marketId}/prices`).json()
}

export const fetchMarketById = async (marketId: number) => {
  return api.get<Market>(`markets/${marketId}`).json()
}

export const fetchMarketSnapshots = async (marketId: number) => {
  const result = await api.get(`markets/${marketId}/snapshots`).json()

  return MarketSnapshot.array().parseAsync(result)
}
