import { Router } from "express";
import { MarketController } from "./controller.js";

const router = Router();

/**
 * Route starts with /v1/markets
 */

router.get("/", MarketController.getMarkets);
router.get("/:id", MarketController.getMarketById);
router.get("/:id/prices", MarketController.getMarketPrices);
router.get("/:id/snapshots", MarketController.getMarketSnapshots);

export default router;
