import type { Request, Response } from "express";
import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db/index.js";
import { getWalletBalanceWithPNL } from "./service.js";
import { MissingWalletError } from "./errors.js";

export const getMyWallet = async (req: Request, res: Response) => {
  // Get user ID from request context
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  try {
    const walletWithTotal = await getWalletBalanceWithPNL(userId);

    return res.status(200).json({
      total_balance: walletWithTotal.totalBalance,
      balance: walletWithTotal.balance,
      locked_balance: walletWithTotal.locked_balance,
    });
  } catch (err) {
    if (err instanceof MissingWalletError) {
      return res.status(404).json({ error: err.message });
    } else if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
