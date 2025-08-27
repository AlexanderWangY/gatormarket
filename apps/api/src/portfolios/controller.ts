import type { Request, Response } from "express";
import { NoResultError } from "kysely";
import { PortfolioService } from "./service.js";

export class PortfolioController {
  static async getSummary(req: Request, res: Response) {
    console.log("Go here")

    const userId = req.auth?.user.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized.",
      });
    }

    try {
      const result = await PortfolioService.getPortfolioSummary(userId);
      return res.status(200).json(result);
    } catch (e) {
      console.error(e);
      if (e instanceof NoResultError) {
        return res.status(404).json({
          error: e.message,
        });
      } else if (e instanceof Error) {
        return res.status(500).json({
          error: e.message,
        });
      }

      return res.status(500).json({
        error: "Internal server error.",
      });
    }
  }
}
