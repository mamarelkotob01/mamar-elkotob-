-- ============================================================
-- Dar Zahmet Kotab — Supabase SQL Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ================================================================
-- PROFILES (extends Supabase auth.users)
-- ================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================================
-- AUTHORS
-- ================================================================
create table if not exists public.authors (
  id uuid primary key default uuid_generate_v4(),
  name_ar text not null,
  name_en text not null,
  bio_ar text,
  bio_en text,
  photo_url text,
  nationality text,
  instagram text,
  twitter text,
  website text,
  created_at timestamptz not null default now()
);

-- ================================================================
-- WORLDS (thematic narrative universes / series)
-- ================================================================
create table if not exists public.worlds (
  id uuid primary key default uuid_generate_v4(),
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  banner_url text,
  color_primary text default '#8B1D3D',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ================================================================
-- BOOKS
-- ================================================================
create table if not exists public.books (
  id uuid primary key default uuid_generate_v4(),
  title_ar text not null,
  title_en text not null,
  author_id uuid references public.authors(id) on delete set null,
  world_id uuid references public.worlds(id) on delete set null,
  cover_url text,
  description_ar text,
  description_en text,
  price numeric(10, 2) not null default 0,
  original_price numeric(10, 2),
  rating numeric(3, 2) not null default 0,
  review_count integer not null default 0,
  genre text not null default 'General',
  genre_ar text not null default 'عام',
  format text not null default 'both' check (format in ('digital', 'physical', 'both')),
  language text not null default 'ar' check (language in ('ar', 'en', 'both')),
  pages integer not null default 0,
  published_date date,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  reading_order_in_world integer,
  tags text[] default '{}',
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- ================================================================
-- BLOG POSTS
-- ================================================================
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title_ar text not null,
  title_en text not null,
  excerpt_ar text,
  excerpt_en text,
  content_ar text,
  content_en text,
  author_id uuid references public.authors(id) on delete set null,
  image_url text,
  category text not null default 'General',
  read_time text not null default '5 min',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ================================================================
-- ORDERS
-- ================================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'delivered')),
  total_amount numeric(10, 2) not null default 0,
  payment_method text,
  shipping_address text,
  notes text,
  created_at timestamptz not null default now()
);

-- ================================================================
-- ORDER ITEMS
-- ================================================================
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete restrict not null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null
);

-- ================================================================
-- REVIEWS
-- ================================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  book_id uuid references public.books(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(book_id, user_id)
);

-- ================================================================
-- USER LIBRARY (books they own after purchase)
-- ================================================================
create table if not exists public.user_library (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  acquired_at timestamptz not null default now(),
  unique(user_id, book_id)
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

-- Profiles: users can read all profiles, update only their own
alter table public.profiles enable row level security;
create policy "Public profiles readable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Books: everyone can read published books; only admins can insert/update/delete
alter table public.books enable row level security;
create policy "Published books readable" 
on public.books 
for select 
using (
  status = 'published' 
  OR 
  exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
);
create policy "Admins manage books" on public.books for all using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Authors: publicly readable, admin writable
alter table public.authors enable row level security;
create policy "Authors readable" on public.authors for select using (true);
create policy "Admins manage authors" on public.authors for all using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Worlds: publicly readable, admin writable
alter table public.worlds enable row level security;
create policy "Worlds readable" on public.worlds for select using (true);
create policy "Admins manage worlds" on public.worlds for all using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Blog Posts: published readable, admin full control
alter table public.blog_posts enable row level security;
create policy "Published posts readable" on public.blog_posts for select using (status = 'published' or (select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admins manage blog" on public.blog_posts for all using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Orders: users see their own, admins see all
alter table public.orders enable row level security;
create policy "Users see own orders" on public.orders for select using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Users create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins manage orders" on public.orders for update using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Order Items
alter table public.order_items enable row level security;
create policy "Order items via order" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and (user_id = auth.uid() or (select role from public.profiles where id = auth.uid()) = 'admin'))
);
create policy "Users insert order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);

-- Reviews
alter table public.reviews enable row level security;
create policy "Reviews readable" on public.reviews for select using (true);
create policy "Users manage own reviews" on public.reviews for all using (auth.uid() = user_id);

-- User Library
alter table public.user_library enable row level security;
create policy "Users see own library" on public.user_library for select using (auth.uid() = user_id);
create policy "System inserts library" on public.user_library for insert with check (auth.uid() = user_id);

-- ================================================================
-- ANALYTICS VIEW (for admin dashboard — efficient aggregation)
-- ================================================================
create or replace view public.sales_analytics as
select
  date_trunc('day', o.created_at) as sale_date,
  count(distinct o.id) as order_count,
  sum(o.total_amount) as revenue,
  count(distinct o.user_id) as unique_customers
from public.orders o
where o.status in ('paid', 'delivered')
group by date_trunc('day', o.created_at)
order by sale_date desc;

-- Top selling books view
create or replace view public.top_selling_books as
select
  b.id,
  b.title_ar,
  b.title_en,
  b.cover_url,
  b.price,
  coalesce(sum(oi.quantity), 0) as total_sold,
  coalesce(sum(oi.quantity * oi.unit_price), 0) as total_revenue
from public.books b
left join public.order_items oi on b.id = oi.book_id
left join public.orders o on oi.order_id = o.id and o.status in ('paid', 'delivered')
group by b.id, b.title_ar, b.title_en, b.cover_url, b.price
order by total_sold desc;

-- ================================================================
-- INDEXES for performance
-- ================================================================
create index if not exists books_author_idx on public.books(author_id);
create index if not exists books_world_idx on public.books(world_id);
create index if not exists books_featured_idx on public.books(is_featured) where is_featured = true;
create index if not exists books_status_idx on public.books(status);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists blog_status_idx on public.blog_posts(status);
