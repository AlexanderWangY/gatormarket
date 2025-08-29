import { sql } from "kysely";
import { db } from "../db/index.js";
import { LSMR } from "../lmsr/index.js";
import { InsufficientFundsError, NoExistingPositionError } from "./errors.js";
import type { MakeBuyTradeBody, MakeSellTradeBody } from "./schema.js";

export class TradesService {
  static async executeBuyTrade(params: MakeBuyTradeBody, userId: string) {
    // First start a database transaction
    return db.transaction().execute(async (trx) => {
      // Lock market row for update
      const market = await trx
        .selectFrom("markets")
        .selectAll()
        .where("id", "=", params.marketId)
        .forUpdate()
        .executeTakeFirstOrThrow();

      // Lock user row for update
      const user = await trx
        .selectFrom("user")
        .selectAll()
        .where("id", "=", userId)
        .forUpdate()
        .executeTakeFirstOrThrow();

      // Check if user has sufficient balance

      if (Number(user.balance_cents) < params.amount_cents) {
        throw new InsufficientFundsError("Insufficient funds for this trade");
      }

      const qYes = Number(market.yes_shares);
      const qNo = Number(market.no_shares);
      const b = Number(market.liquidity);

      // Calculate number of shares to buy
      const sharesDelta = LSMR.sharesToBuy(
        qYes,
        qNo,
        b,
        params.amount_cents,
        params.outcome
      );

      // Update market shares
      const newYesShares = params.outcome === "YES" ? qYes + sharesDelta : qYes;
      const newNoShares = params.outcome === "NO" ? qNo + sharesDelta : qNo;

      const newMarket = await trx
        .updateTable("markets")
        .set({
          yes_shares: newYesShares,
          no_shares: newNoShares,
        })
        .where("id", "=", params.marketId)
        .returning([
          "markets.liquidity",
          "markets.no_shares",
          "markets.yes_shares",
        ])
        .executeTakeFirstOrThrow();

      // Deduct user balance
      const newBalance = Number(user.balance_cents) - params.amount_cents;
      await trx
        .updateTable("user")
        .set({ balance_cents: newBalance })
        .where("id", "=", userId)
        .execute();

      // Record the trade
      const trade = await trx
        .insertInto("trades")
        .values({
          user_id: userId,
          market_id: params.marketId,
          trade_type: "BUY",
          outcome: params.outcome,
          shares: sharesDelta,
          amount_cents: params.amount_cents,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Upsert user market position
      await trx
        .insertInto("positions")
        .values({
          user_id: userId,
          market_id: params.marketId,
          shares: trade.shares,
          outcome: trade.outcome,
        })
        .onConflict((oc) =>
          oc.columns(["market_id", "user_id", "outcome"]).doUpdateSet({
            shares: sql`positions.shares + ${trade.shares}`,
          })
        )
        .execute();

      // Calculate new market prices
      const { priceYes, priceNo } = LSMR.price(
        Number(newMarket.yes_shares),
        Number(newMarket.no_shares),
        Number(newMarket.liquidity)
      );

      // Insert market snapshot
      await trx
        .insertInto("market_snapshots")
        .values({
          market_id: params.marketId,
          yes_price_cents: Math.round(priceYes * 100),
          no_price_cents: Math.round(priceNo * 100),
          yes_shares: Number(newMarket.yes_shares),
          no_shares: Number(newMarket.no_shares),
        })
        .execute();

      return trade;
    });
  }

  static async executeSellTrade(params: MakeSellTradeBody, userId: string) {
    return db.transaction().execute(async (trx) => {
      const market = await trx
        .selectFrom("markets")
        .selectAll()
        .where("id", "=", params.marketId)
        .forUpdate()
        .executeTakeFirstOrThrow();

      const user = await trx
        .selectFrom("user")
        .selectAll()
        .where("id", "=", userId)
        .forUpdate()
        .executeTakeFirstOrThrow();

      const position = await trx
        .selectFrom("positions")
        .selectAll()
        .where("user_id", "=", userId)
        .where("market_id", "=", params.marketId)
        .where("outcome", "=", params.outcome)
        .forUpdate()
        .executeTakeFirst();

      if (!position) {
        throw new NoExistingPositionError("No existing position to sell from");
      }

      if (Number(position.shares) < params.shares) {
        throw new InsufficientFundsError("Insufficient shares to sell");
      }

      // Calculate sale value
      const qYes = Number(market.yes_shares);
      const qNo = Number(market.no_shares);
      const b = Number(market.liquidity);

      const saleValueCents = LSMR.sellSharesValue(
        qYes,
        qNo,
        b,
        params.shares,
        params.outcome
      );

      // Update market shares

      const newYesShares =
        params.outcome === "YES" ? qYes - params.shares : qYes;
      const newNoShares = params.outcome === "NO" ? qNo - params.shares : qNo;

      const newMarket = await trx
        .updateTable("markets")
        .set({
          yes_shares: newYesShares,
          no_shares: newNoShares,
        })
        .where("id", "=", params.marketId)
        .returning([
          "markets.liquidity",
          "markets.no_shares",
          "markets.yes_shares",
        ])
        .executeTakeFirstOrThrow();

      // Update or delete user position
      const remainingShares = Number(position.shares) - params.shares;
      if (remainingShares > 0) {
        await trx
          .updateTable("positions")
          .set({ shares: remainingShares })
          .where("id", "=", position.id)
          .execute();
      } else {
        await trx
          .deleteFrom("positions")
          .where("id", "=", position.id)
          .execute();
      }

      const newUserBalance = Math.round(
        Number(user.balance_cents) + saleValueCents
      );

      await trx
        .updateTable("user")
        .set({ balance_cents: newUserBalance })
        .where("id", "=", userId)
        .execute();

      const trade = await trx
        .insertInto("trades")
        .values({
          user_id: userId,
          market_id: params.marketId,
          trade_type: "SELL",
          outcome: params.outcome,
          shares: params.shares,
          amount_cents: Math.round(saleValueCents),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Calculate new market prices
      const { priceYes, priceNo } = LSMR.price(
        Number(newMarket.yes_shares),
        Number(newMarket.no_shares),
        Number(newMarket.liquidity)
      );

      // Insert market snapshot
      await trx
        .insertInto("market_snapshots")
        .values({
          market_id: params.marketId,
          yes_price_cents: Math.round(priceYes * 100),
          no_price_cents: Math.round(priceNo * 100),
          yes_shares: Number(newMarket.yes_shares),
          no_shares: Number(newMarket.no_shares),
        })
        .execute();

      return trade;
    });
  }

  static async fetchTradeById(tradeId: string) {
    const trade = await db
      .selectFrom("trades")
      .selectAll()
      .where("id", "=", tradeId)
      .executeTakeFirstOrThrow();

    return trade;
  }
}
