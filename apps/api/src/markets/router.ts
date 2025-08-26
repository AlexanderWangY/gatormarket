import { Router } from "express";
import { getMarketOutcomes, getMarkets } from "./controller.js";

const router = Router()

/**
 * Route starts with /v1/markets
 */

router.get('/', getMarkets)
router.get('/:id/outcomes', getMarketOutcomes)

export default router;