-- Migration: Add Cloudinary Support to Image Fields
-- This adds public_id and storage_type to track external image storage

-- Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image_public_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image_storage_type TEXT DEFAULT 'local';

-- Authors
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS image_public_id TEXT;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS image_storage_type TEXT DEFAULT 'local';

-- Books
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS image_public_id TEXT;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS image_storage_type TEXT DEFAULT 'local';

-- Blog Posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_public_id TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_storage_type TEXT DEFAULT 'local';

-- Worlds
ALTER TABLE public.worlds ADD COLUMN IF NOT EXISTS image_public_id TEXT;
ALTER TABLE public.worlds ADD COLUMN IF NOT EXISTS image_storage_type TEXT DEFAULT 'local';

-- Comment: 'local' storage_type means the URL is a direct link or legacy storage.
-- 'cloudinary' means it's managed via the Cloudinary provider.
