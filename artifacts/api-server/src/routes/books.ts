import { Router } from "express";
import { bookController } from "../controllers/book.controller";
import { standardLimiter } from "../middleware/rateLimiter";

const router = Router();

/**
 * Public routes for books
 * Applied standard rate limiting to prevent scrapers
 */
router.get("/", standardLimiter, (req, res) => bookController.list(req, res));
router.get("/:id", standardLimiter, (req, res) => bookController.detail(req, res));

export default router;
