import { db } from "../db/index.js";
import { getMarketPrices } from "../lmsr/index.js";
import { getAllPositionsWorth } from "../positions/service.js";
import { MissingWalletError } from "./errors.js";

interface MarketPnL {
  marketId: string;
  realized: number;
  unrealized: number;
  total: number;
}

export const getAllUnrealizedPL = async (userId: string, since: Date) => {
  const now = new Date();

  if (since > now) {
    throw new Error("Since date cannot be in the future");
  }

  // Get all trades for the wallet since the given date
  // Group by market and outcome
  const trades = await db
    .selectFrom("trades")
    .innerJoin("outcomes", "outcomes.id", "trades.outcome_id")
    .select([
      "cost",
      "trade_type",
      "price_per_share",
      "shares",
      "market_id",
      "outcomes.outcome",
    ])
    .where("user_id", "=", userId)
    .execute();

  const tradesByMarket = trades.reduce<Record<number, (typeof trades)[0][]>>(
    (acc, trade) => {
      if (!acc[trade.market_id]) acc[trade.market_id] = [];
      acc[trade.market_id]?.push(trade);
      return acc;
    },
    {}
  );

  const result: MarketPnL[] = [];

  for (const marketId in tradesByMarket) {
    const marketTrades = tradesByMarket[Number(marketId)];

    const { yesPrice, noPrice } = await getMarketPrices(marketId);

    const positions: Record<
      "YES" | "NO",
      { shares: number; totalCost: number }
    > = {
      YES: { shares: 0, totalCost: 0 },
      NO: { shares: 0, totalCost: 0 },
    };

    let realized = 0;

    if (!marketTrades || marketTrades.length === 0) {
      continue;
    }

    for (const t of marketTrades) {
      const outcome = t.outcome;
      const shares = Number(t.shares);
      const price = Number(t.price_per_share);
      const cost = Number(t.cost);

      const pos = positions[outcome];

      if (t.trade_type === "BUY") {
        pos.shares += shares;
        pos.totalCost += cost;
      } else if (t.trade_type === "SELL") {
        const avgBuyPrice = pos.shares ? pos.totalCost / pos.shares : 0;
        realized += shares * (price - avgBuyPrice);

        pos.shares -= shares;
        pos.totalCost -= avgBuyPrice * shares;
      }
    }

    // Calculate unrealized P&L
    const unrealized =
      positions.YES.shares *
        (yesPrice - positions.YES.totalCost / (positions.YES.shares || 1)) +
      positions.NO.shares *
        (noPrice - positions.NO.totalCost / (positions.NO.shares || 1));

    result.push({
      marketId,
      realized,
      unrealized,
      total: realized + unrealized,
    });
  }

  return result;
};

export const getWalletBalanceWithPNL = async (userId: string) => {
  // Get total_balance = balance - locked_amount

  // Get total positions amount
  const wallet = await db
    .selectFrom("wallets")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!wallet) {
    throw new MissingWalletError("Wallet not found for user");
  }

  const realBalance = Number(wallet.balance) - Number(wallet.locked_balance);

  // Accumulate P&L from all markets
  const positionsWorth = await getAllPositionsWorth(userId);

  return {
    ...wallet,
    totalBalance: (realBalance + positionsWorth) / 100 // Convert to dollars
  }
};
