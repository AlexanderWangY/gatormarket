import { Router } from "express";
import { TradesController } from "./controller.js";
import { requireAuth } from "../auth/middleware.js";

const router = Router();

router.get("/", requireAuth, () => {})
router.post("/", requireAuth, TradesController.createTrade);
router.get("/:id", TradesController.getTradeById);

export default router;
