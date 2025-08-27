import type { SelectQueryBuilder } from "kysely";
import type { DB } from "../db/db.js";
import type { MarketStatus } from "./schema.js";

export function resolveMarketStatusQueryBuilder(
  status: MarketStatus,
  query: SelectQueryBuilder<DB, "markets", any>
) {
  const now = new Date();

  switch (status) {
    case "open":
      return query.where("closes_at", ">", now).where("resolved", "=", false);
    case "closed":
      return query.where("closes_at", "<=", now).where("resolved", "=", false);
    case "resolved":
      return query.where("resolved", "=", true);
    default:
      return query;
  }
}
