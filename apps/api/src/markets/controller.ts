import type { Request, Response } from "express";
import {
  GetMarketSnapshotsBodySchema,
  GetMarketsQuerySchema,
} from "./schema.js";
import { db } from "../db/index.js";
import { resolveMarketStatusQueryBuilder } from "./utils.js";
import { MarketService } from "./service.js";
import { NoResultError } from "kysely";

export class MarketController {
  static async getMarkets(req: Request, res: Response) {
    // Parse query params
    const { data, success, error } = GetMarketsQuerySchema.safeParse(req.query);
    if (!success) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const { items, total } = await MarketService.fetchMarkets(data);

      return res.json({
        items,
        total: total,
        page: data.page,
        limit: data.limit,
      });
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        return res.status(500).json({ error: e.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMarketById(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json({ error: "Market ID is required" });
    }

    const marketId = Number(req.params.id);

    try {
      const market = await MarketService.fetchMarketById(marketId);
      return res.json(market);
    } catch (e) {
      if (e instanceof NoResultError) {
        return res.status(404).json({ error: "Market not found" });
      }
      if (e instanceof Error) {
        return res.status(500).json({ error: e.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMarketPrices(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json({ error: "Market ID is required" });
    }

    const marketId = Number(req.params.id);

    try {
      const prices = await MarketService.fetchMarketPricesById(marketId);
      return res.json(prices);
    } catch (e) {
      if (e instanceof Error) {
        return res.status(500).json({ error: e.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMarketSnapshots(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json({ error: "Market ID is required" });
    }

    const marketId = Number(req.params.id);

    // Parse body
    const { data, success, error } = GetMarketSnapshotsBodySchema.safeParse(
      req.body
    );
    if (!success) {
      return res.status(400).json({ error: error.message });
    }

    let from: Date | undefined;
    if (data && data.fromTime) {
      from = new Date(data.fromTime);
      if (isNaN(from.getTime())) {
        return res.status(400).json({ error: "Invalid fromTime" });
      }
    }

    let to: Date | undefined;
    if (data && data.toTime) {
      to = new Date(data.toTime);
      if (isNaN(to.getTime())) {
        return res.status(400).json({ error: "Invalid toTime" });
      }
    }

    try {
      const snapshots = await MarketService.fetchMarketSnapshotsByTimeframe(
        marketId,
        from,
        to
      );

      return res.json(snapshots);
    } catch (e) {
      if (e instanceof NoResultError) {
        return res.status(404).json({ error: "Market not found" });
      } else if (e instanceof Error) {
        return res.status(500).json({ error: e.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
