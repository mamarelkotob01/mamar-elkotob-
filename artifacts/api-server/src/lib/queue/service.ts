import { logger } from "../logger";

/**
 * QueueService
 * Manages background tasks to keep the API response time low.
 * In production, this should be connected to Redis (BullMQ) or QStash.
 */
class QueueService {
  /**
   * Push a task to the background
   * @param name Task identifier
   * @param task Function to execute
   */
  async push(name: string, task: () => Promise<void>): Promise<void> {
    logger.info({ task: name }, "Task queued in background");
    
    // Simulate async execution without waiting
    setImmediate(async () => {
      try {
        const start = Date.now();
        await task();
        const duration = Date.now() - start;
        logger.info({ task: name, duration: `${duration}ms` }, "Background task completed");
      } catch (error) {
        logger.error({ task: name, error }, "Background task failed");
      }
    });
  }
}

export const queueService = new QueueService();
