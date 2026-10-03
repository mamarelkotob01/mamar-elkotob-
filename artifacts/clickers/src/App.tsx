import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ProtectedRoute } from "@/lib/security";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HealthProvider } from "@/contexts/HealthContext";

// Lazy Loaded Public Pages
const Homepage = lazy(() => import("@/pages/Homepage").then(m => ({ default: m.Homepage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then(m => ({ default: m.AboutPage })));
const Store = lazy(() => import("@/pages/Store").then(m => ({ default: m.Store })));
const WorldsPage = lazy(() => import("@/pages/WorldsPage").then(m => ({ default: m.WorldsPage })));
const WorldDetail = lazy(() => import("@/pages/WorldDetail").then(m => ({ default: m.WorldDetail })));
const BookDetail = lazy(() => import("@/pages/BookDetail").then(m => ({ default: m.BookDetail })));
const AuthorsPage = lazy(() => import("@/pages/AuthorsPage").then(m => ({ default: m.AuthorsPage })));
const AuthorDetail = lazy(() => import("@/pages/AuthorsPage").then(m => ({ default: m.AuthorDetail })));
const OffersPage = lazy(() => import("@/pages/OffersPage").then(m => ({ default: m.OffersPage })));
const MediaPage = lazy(() => import("@/pages/MediaPage").then(m => ({ default: m.MediaPage })));
const ReaderPage = lazy(() => import("@/pages/ReaderPage").then(m => ({ default: m.ReaderPage })));
const Blog = lazy(() => import("@/pages/Blog")); // Default export
const BlogPostDetail = lazy(() => import("@/pages/BlogPostDetail").then(m => ({ default: m.BlogPostDetail })));
const AuthPage = lazy(() => import("@/pages/AuthPage").then(m => ({ default: m.AuthPage })));
const ResetPassword = lazy(() => import("@/pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const MyOrdersPage = lazy(() => import("@/pages/MyOrdersPage").then(m => ({ default: m.MyOrdersPage })));
const NotFound = lazy(() => import("@/pages/not-found")); // Default export

// Lazy Loaded Admin Pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminBooks = lazy(() => import("@/pages/admin/AdminBooks").then(m => ({ default: m.AdminBooks })));
const AdminAuthors = lazy(() => import("@/pages/admin/AdminAuthors").then(m => ({ default: m.AdminAuthors })));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog").then(m => ({ default: m.AdminBlog })));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders })));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics").then(m => ({ default: m.AdminAnalytics })));
const AdminWorlds = lazy(() => import("@/pages/admin/AdminWorlds").then(m => ({ default: m.AdminWorlds })));
const AdminExports = lazy(() => import("@/pages/admin/AdminExports").then(m => ({ default: m.AdminExports })));
const AdminMedia = lazy(() => import("@/pages/admin/AdminMedia").then(m => ({ default: m.AdminMedia })));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours - Trust the cache for browsing
      gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in storage for 7 days
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false, // Don't hammer DB just because user changed tabs
    },
    mutations: {
      retry: 1,
    },
  },
});

// ── PERSISTENCE: Save cache to localStorage ────────────────────
// This is the "Secret Weapon" for high-traffic browsing.
// Users who return to the site hit THE DISK, not THE DATABASE.
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'CLICKERS_OFFLINE_CACHE',
});

persistQueryClient({
  queryClient: queryClient as any,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
});

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Admin routes rendered without Navbar/Footer
function AdminRoutes() {
  return (
    <ProtectedRoute adminOnly>
      <ErrorBoundary context="Admin Dashboard">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent"><div className="w-8 h-8 rounded-full border-4 border-accent border-r-transparent animate-spin" /></div>}>
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/books" component={AdminBooks} />
            <Route path="/admin/authors" component={AdminAuthors} />
            <Route path="/admin/blog" component={AdminBlog} />
            <Route path="/admin/worlds" component={AdminWorlds} />
            <Route path="/admin/orders" component={AdminOrders} />
            <Route path="/admin/analytics" component={AdminAnalytics} />
            <Route path="/admin/exports" component={AdminExports} />
            <Route path="/admin/media" component={AdminMedia} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}

// Public routes with shared layout
function PublicLayout() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <Navbar />
      <CartDrawer />
      <main>
        <ErrorBoundary context="Page">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent"><div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" /></div>}>
            <Switch>
              <Route path="/" component={Homepage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/store" component={Store} />
              <Route path="/worlds" component={WorldsPage} />
              <Route path="/worlds/:id" component={WorldDetail} />
              <Route path="/book/:id" component={BookDetail} />
              <Route path="/books/:id" component={BookDetail} />
              <Route path="/authors" component={AuthorsPage} />
              <Route path="/authors/:id" component={AuthorDetail} />
              <Route path="/offers" component={OffersPage} />
              <Route path="/media" component={MediaPage} />
              <Route path="/blog/:id" component={BlogPostDetail} />
              <Route path="/blog" component={Blog} />
              <Route path="/reader/:id" component={ReaderPage} />
              <Route path="/auth" component={AuthPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/my-orders" component={MyOrdersPage} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <LanguageProvider>
              <HealthProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <ScrollToTop />
                  <Switch>
                    {/* Admin panel — standalone layout */}
                    <Route path="/admin/:rest*">
                      <AdminRoutes />
                    </Route>
                    <Route path="/admin">
                      <AdminRoutes />
                    </Route>
                    {/* Public site */}
                    <Route component={PublicLayout} />
                  </Switch>
                </WouterRouter>
                <Toaster />
              </HealthProvider>
            </LanguageProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
