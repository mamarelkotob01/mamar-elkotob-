import rateLimit from "express-rate-limit";
import { logger } from "../lib/logger";

/**
 * Standard Rate Limiter
 * Used for general API endpoints to prevent simple spam
 */
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." },
  handler: (req, res, _next, options) => {
    logger.warn({ ip: req.ip, path: req.path }, "Rate limit exceeded");
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict Rate Limiter
 * Used for sensitive endpoints like auth and uploads
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per window
  message: { error: "Security limit reached. Please try again in an hour." },
  handler: (req, res, _next, options) => {
    logger.error({ ip: req.ip, path: req.path }, "Strict rate limit exceeded");
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
