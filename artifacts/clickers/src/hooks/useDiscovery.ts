import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  RECENT_VIEWS: 'CLICKERS_RECENT_VIEWS',
  RECENT_SEARCHES: 'CLICKERS_RECENT_SEARCHES',
};

const MAX_ITEMS = 10;

/**
 * Smart discovery Hook
 * Operates entirely on the client side to provide instant "Netflix-style"
 * recommendations without eating into Supabase quotas.
 */
export function useDiscovery() {
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedViews = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
    const savedSearches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    
    if (savedViews) setRecentViews(JSON.parse(savedViews));
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  const trackView = useCallback((book: any) => {
    setRecentViews((prev) => {
      const filtered = prev.filter(b => b.id !== book.id);
      const updated = [book, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const trackSearch = useCallback((query: string) => {
    if (!query || query.length < 3) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 5);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    recentViews,
    recentSearches,
    trackView,
    trackSearch
  };
}
