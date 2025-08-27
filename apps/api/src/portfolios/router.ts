import { Router } from "express";
import { PortfolioController } from "./controller.js";
import { requireAuth } from "../auth/middleware.js";

const router = Router()

router.get("/", () => {})
router.get("/summary", requireAuth, PortfolioController.getSummary)
router.get("/:marketId", () => {});

export default router
