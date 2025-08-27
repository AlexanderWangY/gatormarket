import { db } from "../db/index.js";
import { LSMR } from "../lmsr/index.js";
import type { GetMarketsQuery } from "./schema.js";
import { resolveMarketStatusQueryBuilder } from "./utils.js";

export class MarketService {
  static async fetchMarkets(params: GetMarketsQuery) {
    let query = db.selectFrom("markets");

    if (params.status) {
      query = resolveMarketStatusQueryBuilder(params.status, query);
    }

    if (params.search) {
      query = query.where("question", "ilike", `%${params.search}%`);
    }

    const totalQuery = query.select(db.fn.countAll().as("count"));

    // Apply sorting
    query = query.orderBy(
      "created_at",
      params.sortOrder === "desc" ? "desc" : "asc"
    );

    // Pagination
    query = query.limit(params.limit).offset((params.page - 1) * params.limit);

    // Execute in parallel
    const [items, totalResult] = await Promise.all([
      query.selectAll().execute(),
      totalQuery.executeTakeFirstOrThrow(),
    ]);

    return {
      items,
      total: Number(totalResult.count),
    };
  }

  static async fetchMarketById(marketId: number) {
    const market = await db
      .selectFrom("markets")
      .selectAll()
      .where("id", "=", marketId)
      .executeTakeFirstOrThrow();

    return market;
  }

  /**
   * Fetches the current yes and no prices for a market using the LMSR formula.
   * @param marketId - ID of the market
   * @returns - Object containing yesPrice and noPrice
   */
  static async fetchMarketPricesById(marketId: number) {
    const market = await db
      .selectFrom("markets")
      .select(["liquidity", "yes_shares", "no_shares"])
      .where("id", "=", marketId)
      .executeTakeFirstOrThrow();

    const qYes = Number(market.yes_shares);
    const qNo = Number(market.no_shares);
    const liquidity = Number(market.liquidity);

    return LSMR.price(qYes, qNo, liquidity);
  }
}
