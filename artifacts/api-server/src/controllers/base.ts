import type { Response } from "express";
import { logger } from "../lib/logger";

/**
 * BaseController
 * Provides standard response methods for consistency and logging
 */
export abstract class BaseController {
  
  protected ok(res: Response, data: any, message: string = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  protected created(res: Response, data: any, message: string = "Resource created") {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  protected error(res: Response, error: any, code: number = 500) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    logger.error({ error, code }, "API Error");
    
    return res.status(code).json({
      success: false,
      error: message,
    });
  }

  protected notFound(res: Response, message: string = "Resource not found") {
    return res.status(404).json({
      success: false,
      error: message,
    });
  }

  protected badRequest(res: Response, message: string = "Invalid request") {
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
}
