import { db } from "../db/index.js";
import { LSMR } from "../lmsr/index.js";

export class PortfolioService {
  static async getPortfolioSummary(userId: string) {
    const user = await db
      .selectFrom("user")
      .select(["user.balance_cents"])
      .where("user.id", "=", userId)
      .executeTakeFirstOrThrow();

    const positions = await this.getOpenPositions(userId);

    let unrealizedPnlCents = 0;

    for (const position of positions) {
      const { liquidity, yes_shares, no_shares, shares } = position;

      const qYes = Number(yes_shares);
      const qNo = Number(no_shares);
      const b = Number(liquidity);
      const sharesToSell = Number(shares);

      const positionValueCents = LSMR.sellSharesValue(
        qYes,
        qNo,
        b,
        sharesToSell,
        position.outcome
      );

      unrealizedPnlCents += positionValueCents;
    }

    // Round to nearest cent
    unrealizedPnlCents = Math.round(unrealizedPnlCents);

    return {
      balanceCents: Number(user.balance_cents),
      unrealizedPnlCents,
      totalPortfolioValueCents: Number(user.balance_cents) + unrealizedPnlCents,
    };
  }

  static async getOpenPositions(userId: string) {
    const positions = await db
      .selectFrom("positions")
      .innerJoin("markets", "positions.market_id", "markets.id")
      .select([
        "positions.id",
        "positions.outcome",
        "positions.shares",
        "markets.liquidity",
        "markets.yes_shares",
        "markets.no_shares",
        "positions.market_id",
      ])
      .where("positions.user_id", "=", userId)
      .execute();

    return positions;
  }
}
