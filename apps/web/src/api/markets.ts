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
  yes_shares: z.number(), // NUMERIC → string (to preserve precision)
  no_shares: z.number(), // same here
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
})

export const GetMarketsResponseSchema = z.object({
  items: z.array(MarketSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
})

export type Market = z.infer<typeof MarketSchema>
export type GetMarketsResponse = z.infer<typeof GetMarketsResponseSchema>

export const fetchActiveMarkets = async (
  page: number = 1,
  limit: number = 20,
) => {
  return api
    .get<GetMarketsResponse>(`markets?page=${page}&limit=${limit}`)
    .json()
}
