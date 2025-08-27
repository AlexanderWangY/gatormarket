import { db } from "../db/index.js";
import { getMarketPrices } from "../lmsr/index.js";

export const getAllPositionsWorth = async (userId: string) => {
  const positions = await db
    .selectFrom("positions as p")
    .innerJoin("outcomes as o", "o.id", "p.outcome_id")
    .innerJoin("markets as m", "m.id", "o.market_id")
    .select(["p.id", "o.market_id", "o.outcome", "p.shares"])
    .where("p.user_id", "=", userId)
    .execute();

    const marketPriceCache: Record<string, { yesPriceCents: number, noPriceCents: number}> = {};
    let totalWorthCents = 0;
    for (const position of positions) {
        let pricePerShareCents = 0;
        const cachedPrices = marketPriceCache[position.market_id];

        if (cachedPrices) {
            pricePerShareCents = position.outcome === "YES" ? cachedPrices.yesPriceCents : cachedPrices.noPriceCents;
        } else {
            const { yesPrice, noPrice } = await getMarketPrices(position.market_id.toString())
            const yesPriceCents = Math.round(yesPrice * 100);
            const noPriceCents = Math.round(noPrice * 100);

            marketPriceCache[position.market_id] = { yesPriceCents, noPriceCents };

            pricePerShareCents = position.outcome === "YES" ? yesPriceCents : noPriceCents;
        }

        totalWorthCents += Number(position.shares) * pricePerShareCents;
    }

    return Math.round(totalWorthCents);
};
