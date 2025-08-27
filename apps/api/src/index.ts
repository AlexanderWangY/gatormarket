import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";
import cors from "cors";
import { logger } from "./config/logger.js";
import marketRouter from "./markets/router.js";
import type { Session, User } from "better-auth";
import tradesRouter from "./trades/router.js";
import portfoliosRouter from "./portfolios/router.js";

declare global {
  namespace Express {
    interface Request {
      auth?: { user: User, session: Session }
    }
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.json());
app.use("/markets", marketRouter);
app.use("/trades", tradesRouter)
app.use("/portfolios", portfoliosRouter)

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
