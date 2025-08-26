import { db } from "../db/index.js";

export const getProbabilityOfOutcome = async (
  outcome: "YES" | "NO",
  marketId: string
): Promise<number> => {
  const outcomes = await db
    .selectFrom("outcomes")
    .innerJoin("markets", "markets.id", "outcomes.market_id")
    .select(["markets.liquidity", "shares", "id", "outcome"])
    .where("market_id", "=", Number(marketId))
    .execute();

  const yesOutcome = outcomes.find((o) => o.outcome === "YES");
  const noOutcome = outcomes.find((o) => o.outcome === "NO");

  if (!yesOutcome || !noOutcome) {
    throw new Error("Market does not have both YES and NO outcomes");
  }

  const b = yesOutcome.liquidity;

  // LMSR price formula
  const expYes = Math.exp(Number(yesOutcome.shares) / b);
  const expNo = Math.exp(Number(noOutcome.shares) / b);

  const yesPrice = expYes / (expYes + expNo);
  const noPrice = expNo / (expYes + expNo);

  return outcome === "YES" ? yesPrice : noPrice;
};

export const getMarketPrices = async (marketId: string) => {
  const outcomes = await db
    .selectFrom("outcomes")
    .innerJoin("markets", "markets.id", "outcomes.market_id")
    .select(["id", "shares", "outcome", "markets.liquidity"])
    .where("market_id", "=", Number(marketId))
    .execute();

  const yesOutcome = outcomes.find((o) => o.outcome === "YES");
  const noOutcome = outcomes.find((o) => o.outcome === "NO");

  if (!yesOutcome || !noOutcome) {
    throw new Error("Market does not have both YES and NO outcomes");
  }

  const b = yesOutcome.liquidity;

  // LMSR price formula
  const expYes = Math.exp(Number(yesOutcome.shares) / b);
  const expNo = Math.exp(Number(noOutcome.shares) / b);

  const yesPrice = expYes / (expYes + expNo);
  const noPrice = expNo / (expYes + expNo);

  return { yesPrice, noPrice };
};
