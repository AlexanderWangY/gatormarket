import type { Request, Response } from "express";
import { GetMarketsQuerySchema } from "./schema.js";
import { db } from "../db/index.js"; // Node automatically resolves index.js
import { getMarketPrices, getProbabilityOfOutcome } from "../lmsr/index.js";

export const getMarkets = async (req: Request, res: Response) => {
  // Parse query parameters
  const params = req.query;

  const { data, success, error } = GetMarketsQuerySchema.safeParse(params);
  if (!success) {
    return res.status(400).json({ error: error.message });
  }

  try {
    let query = db.selectFrom("markets").selectAll();

    if (data.search) {
      query = query.where((eb) =>
        eb.or([
          eb("title", "like", `%${data.search}%`),
          eb("course_code", "like", `%${data.search}%`),
          eb("exam_name", "like", `%${data.search}%`),
        ])
      );
    }

    if (data.status) {
      query = query.where("status", "=", data.status);
    }

    if (data.sortOrder) {
      query = query.orderBy("created_at", data.sortOrder);
    }

    const markets = await query
      .limit(data.limit)
      .offset((data.page - 1) * data.limit)
      .execute();

    // Return the markets in the response
    return res.status(200).json({
      items: markets, // Replace with actual markets
      page: data.page,
      limit: data.limit,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMarketOutcomes = async (req: Request, res: Response) => {
  const marketId = Number(req.params.id);
  if (isNaN(marketId)) {
    return res.status(400).json({ error: "Invalid market ID" });
  }

  try {
    const outcomes = await db
      .selectFrom("outcomes")
      .selectAll()
      .where("market_id", "=", marketId)
      .execute();

    const { yesPrice, noPrice } =  await getMarketPrices(marketId)

    const outcomesWithProbability = outcomes.map((outcome) => {
      console.log("Calculating probability for outcome:", outcome.outcome);
      let probability = 0;
      if (outcome.outcome === "YES") {
        probability = yesPrice;
      } else if (outcome.outcome === "NO") {
        probability = noPrice;
      }
      return { ...outcome, probability };
    });

    console.log("HERE")

    return res.status(200).json({ items: outcomesWithProbability });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: "Internal server error" });
  }
};
