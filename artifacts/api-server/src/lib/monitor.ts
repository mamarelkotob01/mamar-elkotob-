/**
 * Production Observability Module
 *
 * Provides structured logging and error tracking for the Clickers API server.
 * In production, replace the `reportToService` function body with a real
 * Sentry/Datadog SDK call. The interface is intentionally kept identical
 * so the swap requires zero changes elsewhere in the codebase.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogPayload {
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  userId?: string;
  durationMs?: number;
  timestamp?: string;
}

// ── Internal helpers ────────────────────────────────────────────
function timestamp(): string {
  return new Date().toISOString();
}

function formatLog(payload: LogPayload): string {
  return JSON.stringify({ ...payload, timestamp: timestamp() });
}

// ── External error reporting (plug in Sentry/Datadog here) ──────
function reportToService(payload: LogPayload) {
  // TODO: Replace with real SDK in production:
  // Sentry.captureException(payload.data?.error, { extra: payload });
  if (payload.level === 'error') {
    console.error('[MONITOR]', formatLog(payload));
  }
}

// ── Public API ──────────────────────────────────────────────────
export const monitor = {
  info(message: string, context?: string, data?: Record<string, unknown>) {
    console.log(formatLog({ level: 'info', message, context, data }));
  },

  warn(message: string, context?: string, data?: Record<string, unknown>) {
    console.warn(formatLog({ level: 'warn', message, context, data }));
    reportToService({ level: 'warn', message, context, data });
  },

  error(message: string, context?: string, data?: Record<string, unknown>) {
    reportToService({ level: 'error', message, context, data });
  },

  // Track slow operations (DB queries, API calls)
  slow(message: string, durationMs: number, context?: string) {
    if (durationMs > 2000) {
      console.warn(formatLog({ level: 'warn', message, context, durationMs, data: { alert: 'SLOW_OPERATION' } }));
      reportToService({ level: 'warn', message, context, durationMs });
    }
  },

  // Measure async operation duration
  async measure<T>(label: string, fn: () => Promise<T>, context?: string): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const durationMs = Date.now() - start;
      monitor.slow(label, durationMs, context);
      return result;
    } catch (err: any) {
      monitor.error(label, context, { error: err?.message, stack: err?.stack });
      throw err;
    }
  },
};
