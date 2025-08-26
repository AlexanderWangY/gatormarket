import type { Request, Response } from "express";
import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db/index.js";
import { getWalletBalance } from "./service.js";

export const getMyWallet = async (req: Request, res: Response) => {
  // Get user ID from request context
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  // Fetch wallet from database

  const wallet = db
    .selectFrom("wallets")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  try {
    const wallet = await getWalletBalance(userId);

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    return res.status(200).json({ wallet });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
