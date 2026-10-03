/**
 * System Health Context — Degradation Mode
 *
 * Monitors global health signals (failed requests, error counts) and
 * automatically switches the UI into a lightweight "Degraded Mode" when
 * the system is struggling.
 *
 * In Degraded Mode:
 *  - Heavy features are hidden (analytics widgets, recommendation carousels)
 *  - Non-essential API calls are suppressed
 *  - Core browsing/viewing stays fully functional
 *  - A subtle status banner is shown if degradation is severe
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type HealthStatus = 'healthy' | 'degraded' | 'critical';

interface HealthContextValue {
  status: HealthStatus;
  errorCount: number;
  reportError: () => void;
  reportSuccess: () => void;
  isFeatureEnabled: (feature: DegradableFeature) => boolean;
}

// Features that get DISABLED first when system is under stress
export type DegradableFeature =
  | 'analytics'        // Admin analytics charts (heavy DB queries)
  | 'recommendations' // "You may also like" section (heavy join query)
  | 'media'           // Video/audio media section
  | 'blog'            // Blog feeds
  | 'author-ratings'; // Author rating calculations

const FEATURE_THRESHOLDS: Record<DegradableFeature, HealthStatus[]> = {
  'analytics':      ['degraded', 'critical'],
  'recommendations': ['degraded', 'critical'],
  'media':          ['critical'],
  'blog':           ['critical'],
  'author-ratings': ['degraded', 'critical'],
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [errorCount, setErrorCount] = useState(0);

  const status: HealthStatus =
    errorCount >= 10 ? 'critical' :
    errorCount >= 4  ? 'degraded' :
    'healthy';

  const reportError = useCallback(() => {
    setErrorCount((c) => Math.min(c + 1, 20)); // Cap at 20 to prevent overflow
  }, []);

  const reportSuccess = useCallback(() => {
    // Errors decay on success — 1 success removes 1 error count
    setErrorCount((c) => Math.max(c - 1, 0));
  }, []);

  const isFeatureEnabled = useCallback((feature: DegradableFeature): boolean => {
    const disabledAt = FEATURE_THRESHOLDS[feature];
    return !disabledAt.includes(status);
  }, [status]);

  return (
    <HealthContext.Provider value={{ status, errorCount, reportError, reportSuccess, isFeatureEnabled }}>
      {/* Degradation Banner — subtle, non-intrusive */}
      {status !== 'healthy' && (
        <div
          className={`fixed top-0 left-0 right-0 z-[9999] text-center text-xs py-1.5 font-bold tracking-wider ${
            status === 'critical'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-400 text-yellow-900'
          }`}
        >
          {status === 'critical'
            ? '⚠️ Some services are temporarily unavailable. Core features remain active.'
            : '⚡ System is under high load. Some features may be slower than usual.'}
        </div>
      )}
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error('useHealth must be used inside HealthProvider');
  return ctx;
}
