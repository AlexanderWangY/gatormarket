import z from "zod";

export const MakeTradeBodySchema = z.union([
  z.object({
    outcomeId: z.string().uuid(),
    type: z.literal("BUY"),
    dollars: z.number().positive(),
  }),
  z.object({
    outcomeId: z.string().uuid(),
    type: z.literal("SELL"),
    shares: z.number().positive(),
  }),
]);
