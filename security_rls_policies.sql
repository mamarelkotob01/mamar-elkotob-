-- ============================================================
-- 🛡️ SECURITY HARDENING: Row Level Security (RLS) - FIXED
-- This version prevents infinite recursion in PostgreSQL.
-- Run this in Supabase SQL Editor to lock down data.
-- ============================================================

-- 0. Helper Function to check admin status without recursion
-- Using SECURITY DEFINER to bypass RLS check inside the function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS on all critical tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES: Users can only see/edit their own profile
--    Uses is_admin() to avoid infinite loop
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. ORDERS: Users can ONLY see their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin());

-- 4. ORDER ITEMS: Users can see items belonging to their orders
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" 
ON public.order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_admin())
  )
);

-- 5. BOOKS: Keep public for browsing (read-only)
DROP POLICY IF EXISTS "Anyone can view published books" ON public.books;
CREATE POLICY "Anyone can view published books" 
ON public.books FOR SELECT 
USING (status = 'published');

-- Only admins can modify books
DROP POLICY IF EXISTS "Admins can modify books" ON public.books;
CREATE POLICY "Admins can modify books" 
ON public.books FOR ALL 
USING (public.is_admin());
