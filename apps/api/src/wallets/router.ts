import { Router } from "express";
import { getMyWallet } from "./controller.js";

const router = Router()

/**
 * Route starts with /v1/wallets
 */

router.get('/me', getMyWallet)

export default router;