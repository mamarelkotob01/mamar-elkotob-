/**
 * useAuth hook - kept in a separate file from AuthContext.tsx so that
 * Vite Fast Refresh can handle the AuthProvider component without
 * complaining about mixed component/non-component exports.
 */
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
