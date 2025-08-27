import { Router } from "express";
import { makeTrade } from "./controller.js";
import { requireAuth } from "../auth/middleware.js";

const router = Router();

// Middleware for user auth
router.use(requireAuth);

router.post("/markets/:id/trades", makeTrade);

export default router;
