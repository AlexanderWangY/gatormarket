import { z } from "zod";

// --------------------
// Trade Type Enum
// --------------------
export const TradeTypeEnum = z.enum(["BUY", "SELL"]);

// --------------------
// Trade Object
// --------------------
export const TradeSchema = z.object({
  id: z.uuid(),
  outcome_id: z.uuid(),
  user_id: z.string(),
  trade_type: TradeTypeEnum,
  shares: z.number().positive(), // NUMERIC(20,10)
  price_per_share: z.number().positive(), // NUMERIC(20,10)
  cost: z.number().nonnegative(), // NUMERIC(20,10), could be 0 if allowed
  created_at: z.string(), // ISO timestamp
});

export type Trade = z.infer<typeof TradeSchema>;

// --------------------
// GET /trades/:user_id or /trades?outcome_id=...
// --------------------
export const GetTradesQuerySchema = z.object({
  user_id: z.string().optional(),
  outcome_id: z.uuid().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const GetTradesResponseSchema = z.object({
  items: z.array(TradeSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type GetTradesQuery = z.infer<typeof GetTradesQuerySchema>;
export type GetTradesResponse = z.infer<typeof GetTradesResponseSchema>;

// --------------------
// POST /trades (create trade)
// --------------------
export const CreateTradeBodySchema = z.object({
  outcome_id: z.uuid(),
  user_id: z.string(),
  trade_type: TradeTypeEnum,
  shares: z.number().positive(),
  price_per_share: z.number().positive(),
  cost: z.number().nonnegative(),
});

export const CreateTradeResponseSchema = TradeSchema;
export type CreateTradeBody = z.infer<typeof CreateTradeBodySchema>;
export type CreateTradeResponse = z.infer<typeof CreateTradeResponseSchema>;
