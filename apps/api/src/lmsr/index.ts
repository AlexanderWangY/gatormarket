import type { Transaction } from "kysely";
import { db } from "../db/index.js";
import type { DB } from "../db/db.js";

export const getProbabilityOfOutcome = async (
  outcome: "YES" | "NO",
  marketId: string
): Promise<number> => {
  console.log("Got here");

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

export const getMarketPrices = async (marketId: number) => {
  // const outcomes = await db
  //   .selectFrom("outcomes")
  //   .innerJoin("markets", "markets.id", "outcomes.market_id")
  //   .select(["id", "shares", "outcome", "markets.liquidity"])
  //   .where("market_id", "=", Number(marketId))
  //   .execute();

  const outcomes = await db
    .selectFrom("outcomes")
    .innerJoin("markets", "markets.id", "outcomes.market_id")
    .select(["outcomes.id", "shares", "outcome", "markets.liquidity"])
    .where("market_id", "=", marketId)
    .execute();

  console.log("Outcomes:", outcomes);
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

export const getNumberOfSharesToBuy = async (
  outcome: "YES" | "NO",
  marketId: number,
  cents: number,
  trx?: Transaction<DB>
) => {
  const dbClient = trx ?? db;

  const outcomes = await dbClient
    .selectFrom("outcomes")
    .innerJoin("markets", "markets.id", "outcomes.market_id")
    .select(["outcomes.id", "shares", "outcome", "markets.liquidity"])
    .where("market_id", "=", marketId)
    .execute();

  const yesOutcome = outcomes.find((o) => o.outcome === "YES");
  const noOutcome = outcomes.find((o) => o.outcome === "NO");

  if (!yesOutcome || !noOutcome) {
    throw new Error("Market does not have both YES and NO outcomes");
  }

  const b = yesOutcome.liquidity;

  // Current prices
  const expYes = Math.exp(Number(yesOutcome.shares) / b);
  const expNo = Math.exp(Number(noOutcome.shares) / b);
  const expCents = Math.exp(cents / b);

  if (outcome === "YES") {
    return b * Math.log((expCents * (expYes + expNo) - expNo) / expYes);
  } else if (outcome === "NO") {
    return b * Math.log((expCents * (expYes + expNo) - expYes) / expNo);
  }
};
