import { PostgresDialect, Kysely } from "kysely";
import { Pool } from "pg";
import type { DB } from "./db.js";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/gatormarket_db",
  }),
});

export const db = new Kysely<DB>({
  dialect,
});