/**
 * Frontend Circuit Breaker
 *
 * Prevents a failing service (Supabase, API) from being hammered
 * with requests when it is clearly down.
 *
 * States:
 *  CLOSED   → Normal operation. All requests pass through.
 *  OPEN     → Service is failing. Requests are blocked instantly.
 *             Returns cached fallback data instead.
 *  HALF_OPEN → After a cool-down period, one request is allowed
 *             through as a "health probe". If it succeeds, the
 *             circuit closes again. If it fails, it re-opens.
 */

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number; // How many failures before opening
  successThreshold: number; // How many successes in HALF_OPEN to close
  cooldownMs: number;       // How long to wait before probing again
}

interface CircuitStats {
  state: CircuitState;
  failures: number;
  lastFailureTime: number | null;
  successes: number;
}

const circuits = new Map<string, CircuitStats>();

function getCircuit(name: string): CircuitStats {
  if (!circuits.has(name)) {
    circuits.set(name, {
      state: 'CLOSED',
      failures: 0,
      lastFailureTime: null,
      successes: 0,
    });
  }
  return circuits.get(name)!;
}

export function getCircuitState(name: string): CircuitState {
  return getCircuit(name).state;
}

/**
 * Execute a function through a circuit breaker.
 * If the circuit is OPEN, throws immediately without calling fn().
 * Call this inside your queryFn for critical data sources.
 */
export async function withCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
  config: Partial<CircuitBreakerConfig> = {}
): Promise<T> {
  const cfg: CircuitBreakerConfig = {
    name,
    failureThreshold: config.failureThreshold ?? 5,
    successThreshold: config.successThreshold ?? 2,
    cooldownMs: config.cooldownMs ?? 30_000, // 30 seconds
  };

  const circuit = getCircuit(name);
  const now = Date.now();

  // OPEN → check if cooldown has passed
  if (circuit.state === 'OPEN') {
    if (circuit.lastFailureTime && now - circuit.lastFailureTime > cfg.cooldownMs) {
      circuit.state = 'HALF_OPEN';
      circuit.successes = 0;
      console.warn(`[CircuitBreaker:${name}] → HALF_OPEN (probing)`);
    } else {
      throw new Error(`[CircuitBreaker:${name}] Circuit is OPEN. Using fallback.`);
    }
  }

  try {
    const result = await fn();

    // Success
    if (circuit.state === 'HALF_OPEN') {
      circuit.successes++;
      if (circuit.successes >= cfg.successThreshold) {
        circuit.state = 'CLOSED';
        circuit.failures = 0;
        console.info(`[CircuitBreaker:${name}] → CLOSED (recovered)`);
      }
    } else {
      circuit.failures = 0; // Reset failure count on success
    }

    return result;
  } catch (err) {
    // Failure
    circuit.failures++;
    circuit.lastFailureTime = now;

    if (circuit.state === 'HALF_OPEN' || circuit.failures >= cfg.failureThreshold) {
      circuit.state = 'OPEN';
      console.error(`[CircuitBreaker:${name}] → OPEN after ${circuit.failures} failures. Cooling down ${cfg.cooldownMs / 1000}s`);
    }

    throw err;
  }
}
