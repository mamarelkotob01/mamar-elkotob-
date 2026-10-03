-- ============================================================
-- Performance Index Migration
-- Dar Zahmet Kotab / Clickers Marketplace
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to run multiple times (uses CREATE INDEX IF NOT EXISTS)
-- ============================================================


-- ================================================================
-- BOOKS TABLE INDEXES
-- ================================================================

-- 1. Status filter (most queries filter published books first)
--    Used by: useBooks() → .eq('status', 'published')
CREATE INDEX IF NOT EXISTS idx_books_status
  ON public.books (status);

-- 2. Featured books lookup (Homepage hero section)
--    Used by: useBooks({ featured: true })
CREATE INDEX IF NOT EXISTS idx_books_is_featured
  ON public.books (is_featured)
  WHERE is_featured = true; -- Partial index: only indexes TRUE rows (tiny, ultra-fast)

-- 3. New arrivals lookup
--    Used by: useBooks({ isNew: true })
CREATE INDEX IF NOT EXISTS idx_books_is_new
  ON public.books (is_new)
  WHERE is_new = true; -- Partial index

-- 4. Genre filtering (Store page filter sidebar)
--    Used by: useBooks({ genre: '...' })
CREATE INDEX IF NOT EXISTS idx_books_genre
  ON public.books (genre);

-- 5. World (series) lookup — book detail + world page
--    Used by: useBooks({ worldId: '...' })
CREATE INDEX IF NOT EXISTS idx_books_world_id
  ON public.books (world_id);

-- 6. Author lookup — author detail page
--    Used by: useBooks({ authorId: '...' })
CREATE INDEX IF NOT EXISTS idx_books_author_id
  ON public.books (author_id);

-- 7. Full-text search on Arabic + English titles
--    Used by: Store search bar → .ilike('%query%')
--    tsvector approach: massively faster than ILIKE on 10k+ books
CREATE INDEX IF NOT EXISTS idx_books_search_ar
  ON public.books USING gin(to_tsvector('arabic', coalesce(title_ar, '')));

CREATE INDEX IF NOT EXISTS idx_books_search_en
  ON public.books USING gin(to_tsvector('english', coalesce(title_en, '')));

-- 8. Composite: status + created_at (default sort for published books)
--    Used by: homepage and store default sort
CREATE INDEX IF NOT EXISTS idx_books_status_created
  ON public.books (status, created_at DESC);


-- ================================================================
-- ORDERS TABLE INDEXES
-- ================================================================

-- 9. User's orders (My Orders page — most common user query)
--    Used by: useMyOrders(userId)
CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON public.orders (user_id);

-- 10. Order status filter (Admin orders page)
--     Used by: AdminOrders → filter by 'pending', 'paid', etc.
CREATE INDEX IF NOT EXISTS idx_orders_status
  ON public.orders (status);

-- 11. Composite: user + created_at (user order history, newest first)
--     Used by: useMyOrders → .order('created_at', { ascending: false })
CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON public.orders (user_id, created_at DESC);

-- 12. Composite: status + created_at (admin dashboard pending orders)
--     Used by: AdminOrders + analytics
CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON public.orders (status, created_at DESC);


-- ================================================================
-- REVIEWS TABLE INDEXES
-- ================================================================

-- 13. Book reviews lookup (Book detail page review section)
--     Used by: useBookReviews(bookId)
CREATE INDEX IF NOT EXISTS idx_reviews_book_id
  ON public.reviews (book_id);

-- 14. User's own review on a book (RLS check + upsert lookup)
--     Used by: useRateBook → upsert { onConflict: 'book_id,user_id' }
--     NOTE: This mirrors the UNIQUE constraint but explicit index speeds joins
CREATE INDEX IF NOT EXISTS idx_reviews_book_user
  ON public.reviews (book_id, user_id);

-- 15. Book reviews sorted newest first
--     Used by: useBookReviews → .order('created_at', { ascending: false })
CREATE INDEX IF NOT EXISTS idx_reviews_book_created
  ON public.reviews (book_id, created_at DESC);


-- ================================================================
-- ORDER ITEMS TABLE INDEXES
-- ================================================================

-- 16. Order items by order (checkout fulfillment + admin view)
--     Used by: order detail joins
CREATE INDEX IF NOT EXISTS idx_order_items_order_id
  ON public.order_items (order_id);

-- 17. Book sales tracking (top_selling_books analytics view)
--     Used by: AdminAnalytics → GROUP BY book_id
CREATE INDEX IF NOT EXISTS idx_order_items_book_id
  ON public.order_items (book_id);


-- ================================================================
-- USER LIBRARY INDEXES
-- ================================================================

-- 18. User library lookup (Reader page + My Library)
--     Used by: useMyLibrary(userId)
CREATE INDEX IF NOT EXISTS idx_user_library_user_id
  ON public.user_library (user_id);


-- ================================================================
-- BLOG POSTS INDEXES
-- ================================================================

-- 19. Published posts only (Blog page default view)
--     Used by: useBlogPosts({ status: 'published' })
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published
  ON public.blog_posts (status, published_at DESC)
  WHERE status = 'published';


-- ================================================================
-- PROFILES INDEXES
-- ================================================================

-- 20. Role-based lookup (Admin check + user count analytics)
--     Used by: AuthContext isAdmin check + useAnalytics user count
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles (role);

-- ============================================================
-- VERIFICATION: Check index sizes after creation
-- Run this query to confirm all indexes were created:
-- SELECT indexname, tablename, indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;
-- ============================================================
