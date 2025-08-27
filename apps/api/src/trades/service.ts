import { sql } from "kysely";
import { db } from "../db/index.js";
import { getNumberOfSharesToBuy } from "../lmsr/index.js";
import { InsufficientFundsError, InvalidShareAmountError } from "./errors.js";

export const buyOutcome = async (
  marketId: number,
  outcomeId: string,
  dollars: number,
  userId: string
) => {
  // Convert dollars to cents
  const cents = Math.round(dollars * 100);

  // Create trade in database
  return await db.transaction().execute(async (trx) => {
    console.log("Got to wallet lock");
    const wallet = await trx
      .selectFrom("wallets")
      .select(["balance", "locked_balance"])
      .where("user_id", "=", userId)
      .forUpdate()
      .executeTakeFirstOrThrow();

    const availableBalance =
      Number(wallet.balance) - Number(wallet.locked_balance);

    if (availableBalance < cents) {
      throw new InsufficientFundsError(
        "Insufficient funds to complete the purchase"
      );
    }

    console.log("Got to outcome lock");

    const outcome = await trx
      .selectFrom("outcomes")
      .select(["id", "outcome", "shares"])
      .where("id", "=", outcomeId)
      .forUpdate()
      .executeTakeFirstOrThrow();

    // First, calculate the number of shares to buy based on the current price
    const amountOfShares = await getNumberOfSharesToBuy(
      outcome.outcome,
      marketId,
      cents,
      trx
    );

    if (!amountOfShares || amountOfShares <= 0) {
      throw new InvalidShareAmountError("Calculated share amount is invalid");
    }
    // Then, insert the trade into the trades table
    console.log("Got to trade");
    const newTrade = await trx
      .insertInto("trades")
      .values({
        user_id: userId,
        outcome_id: outcomeId,
        shares: amountOfShares,
        price_per_share: Math.round(cents / amountOfShares),
        trade_type: "BUY",
        cost: cents,
      })
      .returningAll()
      .executeTakeFirst();
    // Afterwards, update the shares in the outcomes table
    console.log("Got to outcome");
    await trx
      .updateTable("outcomes")
      .set({
        shares: sql`shares + ${amountOfShares}::NUMERIC`,
      })
      .where("id", "=", outcomeId)
      .execute();

    // Then, upsert user's position
    console.log("Got to position");
    await trx
      .insertInto("positions")
      .values({
        user_id: userId,
        outcome_id: outcomeId,
        shares: amountOfShares,
        average_price_per_share: Math.floor(cents / amountOfShares),
      })
      .onConflict((oc) =>
        oc.columns(["user_id", "outcome_id"]).doUpdateSet((eb) => ({
          shares: sql`"positions"."shares" + ${amountOfShares}`,
          average_price_per_share: sql`
          FLOOR(
            ("positions"."shares" * "positions"."average_price_per_share"
              + ${amountOfShares}::NUMERIC * ${Math.floor(cents / amountOfShares)}::NUMERIC)
            / ("positions"."shares" + ${amountOfShares}::NUMERIC)
          )
        `,
        }))
      )
      .returning(["user_id", "outcome_id", "shares", "average_price_per_share"])
      .execute();

    // Then create new transaction record
    console.log("Got to transaction");

    await trx
      .insertInto("transactions")
      .values({
        user_id: userId,
        amount: -cents,
        transaction_type: "BUY",
      })
      .execute();

    // Finally update user wallet's locked balance
    await trx
      .updateTable("wallets")
      .set({
        locked_balance: sql`locked_balance + ${cents}`,
      })
      .where("user_id", "=", userId)
      .execute();

    // Return the trade details
    return newTrade;
  });
};
