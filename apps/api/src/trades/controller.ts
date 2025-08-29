import type { Request, Response } from "express";
import { MakeTradeBodySchema } from "./schema.js";
import { NoResultError } from "kysely";
import { TradesService } from "./service.js";

export class TradesController {
  static async createTrade(req: Request, res: Response) {
    // Get user ID from context
    const userId = req.auth?.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Parse body
    const { data, success, error } = MakeTradeBodySchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: error.message });
    }

    try {
      if (data.type === "BUY") {
        const trade = await TradesService.executeBuyTrade(data, userId);
        return res.status(201).json(trade);
      } else if (data.type === "SELL") {
        const trade = await TradesService.executeSellTrade(data, userId);
        return res.status(201).json(trade);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof NoResultError) {
        return res.status(404).json({ error: "Market not found" });
      }

      if (e instanceof Error) {
        return res.status(500).json({ error: e.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getTradeById(req: Request, res: Response) {
    const tradeId = req.params.id;

    if (!tradeId) {
      return res.status(400).json({ error: "Trade ID is required" });
    }

    try {
      const trade = await TradesService.fetchTradeById(tradeId);
      return res.json(trade);
    } catch (e) {
      if (e instanceof NoResultError) {
        return res.status(404).json({ error: "Trade not found" });
      }
      if (e instanceof Error) {
        return res.status(500).json({ error: e.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
