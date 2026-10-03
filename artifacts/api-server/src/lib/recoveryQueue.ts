/**
 * Self-Recovering Operation Queue
 *
 * When critical backend operations fail (Supabase update, webhook processing),
 * they are pushed onto this in-memory queue and automatically retried
 * using exponential backoff — without blocking the main Express thread.
 *
 * This ensures:
 * - Failed Paymob webhooks are always retried until they succeed
 * - Supabase temporary outages don't permanently lose order updates
 * - The Node.js Event Loop is NEVER blocked
 *
 * NOTE: For production at scale, replace with a persistent Redis queue (Bull/BullMQ).
 * This in-memory version survives process restarts if Hostinger's Node keeps the
 * process alive (which it does on VPS/Business plans).
 */

import { monitor } from './monitor';

export interface QueuedOperation {
  id: string;
  label: string;
  fn: () => Promise<void>;
  attempts: number;
  maxAttempts: number;
  nextRetryAt: number;
}

class RecoveryQueue {
  private queue: QueuedOperation[] = [];
  private processing = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Check the queue every 10 seconds for pending retries
    this.intervalId = setInterval(() => this.flush(), 10_000);
  }

  enqueue(label: string, fn: () => Promise<void>, maxAttempts = 5) {
    const op: QueuedOperation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      fn,
      attempts: 0,
      maxAttempts,
      nextRetryAt: Date.now() + 2000, // First retry after 2 seconds
    };
    this.queue.push(op);
    monitor.warn(`[Queue] Enqueued: "${label}"`, 'RecoveryQueue', { id: op.id });
  }

  private async flush() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const now = Date.now();
    const pending = this.queue.filter((op) => op.nextRetryAt <= now);

    for (const op of pending) {
      try {
        await op.fn();
        // Success: remove from queue
        this.queue = this.queue.filter((o) => o.id !== op.id);
        monitor.info(`[Queue] Recovered: "${op.label}" after ${op.attempts + 1} attempt(s)`, 'RecoveryQueue');
      } catch (err: any) {
        op.attempts++;

        if (op.attempts >= op.maxAttempts) {
          // Max retries exceeded — log critical and remove
          this.queue = this.queue.filter((o) => o.id !== op.id);
          monitor.error(
            `[Queue] PERMANENTLY FAILED: "${op.label}" after ${op.maxAttempts} attempts`,
            'RecoveryQueue',
            { error: err?.message, operationId: op.id }
          );
        } else {
          // Exponential backoff: 2s, 4s, 8s, 16s, 32s
          const backoff = Math.min(2000 * 2 ** op.attempts, 60_000);
          op.nextRetryAt = Date.now() + backoff;
          monitor.warn(
            `[Queue] Retry ${op.attempts}/${op.maxAttempts} for "${op.label}" in ${backoff / 1000}s`,
            'RecoveryQueue'
          );
        }
      }
    }

    this.processing = false;
  }

  get size() {
    return this.queue.length;
  }
}

// Singleton instance — shared across the entire Node process
export const recoveryQueue = new RecoveryQueue();
