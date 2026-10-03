import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/contexts/useAuth';



/**
 * ProtectedRoute: Physically blocks unauthorized access to Admin pages.
 * Redirects non-admins to the login page or homepage cleanly using Redirect component.
 */
export function ProtectedRoute({ children, adminOnly = true }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Redirect to="/" replace />;
  }

  return <>{children}</>;
}

