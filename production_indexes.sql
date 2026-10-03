-- Production Hardening: Database Indexes for Scalability
-- These indexes prevent slow sequential scans on large datasets

-- Orders Performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Order Items Performance (Joins)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_book_id ON public.order_items(book_id);

-- Content Performance
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON public.books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC) WHERE status = 'published';

-- Social/Interaction Performance (Future Growth)
CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON public.reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_library_user_id ON public.user_library(user_id);

-- Add GIN index for search optimization (PostgreSQL full-text search lite)
CREATE INDEX IF NOT EXISTS idx_books_titles_search ON public.books USING GIN (to_tsvector('arabic', title_ar || ' ' || title_en));
