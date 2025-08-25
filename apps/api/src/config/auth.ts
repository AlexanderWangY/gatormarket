import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: process.env.NODE_ENV === "production",
  },
  database: new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/gatormarket_db",
  }),
  advanced: {
    cookiePrefix: "gatormarket",
  },
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [process.env.CLIENT_URL as string]
      : ["http://localhost:3000"],
});
