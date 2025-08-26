import z from "zod";

export const GetMyWalletQuerySchema = z.object({
  includeDailyPL: z.stringbool().default(false),
  includeWeeklyPL: z.stringbool().default(false),
  includeTotalPL: z.stringbool().default(false), 
});
