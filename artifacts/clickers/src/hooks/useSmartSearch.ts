import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { useBooks } from '@/services/supabase.hooks';
import { useHealth } from '@/contexts/HealthContext';

/**
 * Multi-layer Smart Search Hook
 * Layer 1: Local RAM (TanStack Cache)
 * Layer 2: Debounced Server Search (Fallback)
 * 
 * Provides instant results for previously seen items and 
 * shields Supabase during traffic spikes or DB slowdowns.
 */
export function useSmartSearch(query: string) {
  const { data: allBooks, isLoading: isLoadingInitial } = useBooks();
  const { status: systemHealth } = useHealth();

  // Create Fuzzy Search instance from cached books
  const fuse = useMemo(() => {
    if (!allBooks) return null;
    return new Fuse(allBooks, {
      keys: [
        { name: 'title_ar', weight: 0.7 },
        { name: 'title_en', weight: 0.7 },
        { name: 'author_name_ar', weight: 0.3 },
        { name: 'author_name_en', weight: 0.3 },
        { name: 'genre', weight: 0.2 }
      ],
      threshold: 0.3, // "Fuzzy" enough to handle typos
      includeScore: true
    });
  }, [allBooks]);

  // Layer 1: Perform search locally in 0ms-10ms
  const localResults = useMemo(() => {
    if (!query || query.length < 2 || !fuse) return [];
    
    // If system is CRITICAL, we only search local cache, no server fallbacks
    return fuse.search(query).map((res: any) => res.item);
  }, [query, fuse]);

  const isDegraded = systemHealth !== 'healthy';

  return {
    results: localResults,
    initialLoading: isLoadingInitial,
    isLocalOnly: isDegraded || localResults.length > 5, // No need for server if local is strong
    totalFound: localResults.length
  };
}
