import type { Request, Response } from "express";
import { MakeTradeBodySchema } from "./schema.js";
import { buyOutcome } from "./service.js";
import { InsufficientFundsError, InvalidShareAmountError } from "./errors.js";

export const makeTrade = async (req: Request, res: Response) => {
  // Get market ID from URL parameters
  const marketId = Number(req.params.id);
  const userId = req.auth?.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (isNaN(marketId)) {
    return res.status(400).json({ error: "Invalid market ID" });
  }

  // Validate request body
  const { success, data, error } = MakeTradeBodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: error.message });
  }

  try {
    if (data.type === "BUY") {
      const newTrade = await buyOutcome(
        marketId,
        data.outcomeId,
        data.dollars,
        userId
      );

      return res.status(200).json({
        message: "Trade succeeded",
        marketId,
        tradeDetails: newTrade,
      });
    }

    return res.status(200).json({
      message: "Got here!",
    });
  } catch (err) {
    if (err instanceof InvalidShareAmountError) {
      return res.status(400).json({ error: err.message });
    } else if (err instanceof InsufficientFundsError) {
      return res.status(400).json({ error: err.message });
    } else if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
