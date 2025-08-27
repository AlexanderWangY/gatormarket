import z from "zod";

const MakeBuyTradeBodySchema = z.object({
  type: z.literal("BUY"),
  outcome: z.enum(["YES", "NO"]),
  marketId: z.number(),
  amount_cents: z.number().min(1),
});

const MakeSellTradeBodySchema = z.object({
  type: z.literal("SELL"),
  outcome: z.enum(["YES", "NO"]),
  marketId: z.number(),
  shares: z.number().min(0.0001),
});

export type MakeBuyTradeBody = z.infer<typeof MakeBuyTradeBodySchema>;
export type MakeSellTradeBody = z.infer<typeof MakeSellTradeBodySchema>;

export const MakeTradeBodySchema = z.discriminatedUnion("type", [
  MakeBuyTradeBodySchema,
  MakeSellTradeBodySchema,
]);
