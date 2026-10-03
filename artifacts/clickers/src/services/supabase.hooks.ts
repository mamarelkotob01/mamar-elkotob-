// ============================================================
// Supabase service hooks — replace all mock data imports
// These wrap Supabase queries with React Query for caching,
// loading states, and automatic background refetching.
// ============================================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { uploadService, type UploadFolder } from '@/services/upload';
import type { Database } from '@/lib/database.types';

// Types derived from Database for convenience
export type Book = Database['public']['Tables']['books']['Row'] & {
  authors?: Database['public']['Tables']['authors']['Row'] | null;
  worlds?: Database['public']['Tables']['worlds']['Row'] | null;
};
export type Author = Database['public']['Tables']['authors']['Row'];
export type World = Database['public']['Tables']['worlds']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'] & {
  authors?: { name_ar: string; name_en: string; photo_url: string | null } | null;
};
export type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  books?: { title_ar: string; title_en: string; cover_url: string | null } | null;
};
export type Order = Database['public']['Tables']['orders']['Row'] & {
  profiles?: { email: string; full_name: string | null } | null;
  order_items?: OrderItem[];
};
export type LibraryItem = Database['public']['Tables']['user_library']['Row'] & {
  books?: (Book & { authors: Author | null }) | null;
};
export type Media = Database['public']['Tables']['media']['Row'];

// ── BOOKS ─────────────────────────────────────────────────────

export function useBooks(opts?: {
  genre?: string;
  worldId?: string;
  authorId?: string;
  featured?: boolean;
  isNew?: boolean;
  search?: string;
  status?: 'draft' | 'published';
}) {
  return useQuery<Book[]>({
    queryKey: ['books', opts],
    queryFn: async () => {
      let q = supabase
        .from('books')
        .select('*, authors(name_ar, name_en, photo_url), worlds(name_ar, name_en)')
        .order('created_at', { ascending: false });

      if (opts?.status) q = q.eq('status', opts.status);
      else q = q.eq('status', 'published');

      if (opts?.genre) q = q.eq('genre', opts.genre);
      if (opts?.worldId) q = q.eq('world_id', opts.worldId);
      if (opts?.authorId) q = q.eq('author_id', opts.authorId);
      if (opts?.featured) q = q.eq('is_featured', true);
      if (opts?.isNew) q = q.eq('is_new', true);
      if (opts?.search) {
        q = q.or(`title_ar.ilike.%${opts.search}%,title_en.ilike.%${opts.search}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as Book[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
  });
}

export function useBook(id: string | undefined) {
  return useQuery<Book>({
    queryKey: ['book', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*, authors(*), worlds(*)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as unknown as Book;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// ── AUTHORS ────────────────────────────────────────────────────

export function useAuthors() {
  return useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name_ar');
      if (error) throw error;
      return data as Author[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAuthor(id: string | undefined) {
  return useQuery<Author>({
    queryKey: ['author', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Author;
    },
  });
}

// ── WORLDS ─────────────────────────────────────────────────────

export function useWorlds() {
  return useQuery<World[]>({
    queryKey: ['worlds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .order('name_ar');
      if (error) throw error;
      return data as World[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useWorld(id: string | undefined) {
  return useQuery<World>({
    queryKey: ['world', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as World;
    },
  });
}

// ── BLOG POSTS ─────────────────────────────────────────────────

export function useBlogPosts(opts?: { status?: 'draft' | 'published' }) {
  return useQuery<BlogPost[]>({
    queryKey: ['blog', opts],
    queryFn: async () => {
      let q = supabase
        .from('blog_posts')
        .select('*, authors(name_ar, name_en, photo_url)')
        .order('published_at', { ascending: false });

      if (opts?.status) q = q.eq('status', opts.status);
      else q = q.eq('status', 'published');

      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as BlogPost[];
    },
  });
}

export function useBlogPost(id: string | undefined) {
  return useQuery<BlogPost>({
    queryKey: ['blog-post', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, authors(name_ar, name_en, photo_url)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as unknown as BlogPost;
    },
  });
}


// ── ORDERS ─────────────────────────────────────────────────────

export function useMyOrders(userId: string | undefined) {
  return useQuery<Order[]>({
    queryKey: ['orders', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, books(title_ar, title_en, cover_url))')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Order[];
    },
  });
}

export function useAllOrders() {
  return useQuery<Order[]>({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(email, full_name, phone), order_items(*, books(title_ar, title_en, cover_url))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Order[];
    },
    staleTime: 0,                  // always consider data stale
    refetchInterval: 30 * 1000,    // poll every 30 seconds as fallback
    refetchOnWindowFocus: true,    // refetch instantly when tab is focused
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      items: { bookId: string; quantity: number }[];
      paymentMethod: string;
      shippingAddress: string;
      transactionId?: string;
      notes?: string;
    }) => {
      // SECURITY: Fetch current official prices from the database to prevent tampering
      const bookIds = payload.items.map(i => i.bookId);
      const { data: currentBooks, error: fetchErr } = await supabase
        .from('books')
        .select('id, price')
        .in('id', bookIds);
      
      if (fetchErr || !currentBooks) throw new Error('Security: Failed to verify item pricing');

      // SECURITY: Calculate true total based on database prices, not frontend input
      let validatedTotal = 0;
      const validatedItems = payload.items.map(item => {
        const book = (currentBooks as any[]).find(b => b.id === item.bookId);
        if (!book) throw new Error('Security: Invalid book data in transaction');
        validatedTotal += book.price * item.quantity;
        return {
          book_id: item.bookId,
          quantity: item.quantity,
          unit_price: book.price
        };
      });

      // Insert Order with validated data
      const { data: order, error: orderErr } = await (supabase.from('orders') as any)
        .insert({
          user_id: payload.userId,
          total_amount: validatedTotal,
          payment_method: payload.paymentMethod,
          shipping_address: payload.shippingAddress,
          transaction_id: payload.transactionId,
          notes: payload.notes,
          status: 'pending',
        })
        .select()
        .single();
      
      if (orderErr) throw orderErr;

      // Insert Order Items with validated pricing
      const orderItems = validatedItems.map(i => ({
        ...i,
        order_id: (order as any).id
      }));
      
      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems as any);
      if (itemsErr) throw itemsErr;

      return order;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['orders', vars.userId] });
    },
  });
}

// ── USER LIBRARY ───────────────────────────────────────────────

export function useMyLibrary(userId: string | undefined) {
  return useQuery<LibraryItem[]>({
    queryKey: ['library', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_library')
        .select('*, books(*, authors(name_ar, name_en))')
        .eq('user_id', userId!);
      if (error) throw error;
      return data as unknown as LibraryItem[];
    },
  });
}

// ── ADMIN ANALYTICS ────────────────────────────────────────────

export interface AnalyticsData {
  salesByDay: Database['public']['Views']['sales_analytics']['Row'][];
  topBooks: Database['public']['Views']['top_selling_books']['Row'][];
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      // Run all queries in parallel; views may not exist in fresh Supabase projects,
      // so we catch their errors independently instead of letting them crash everything.
      const [salesRes, topBooksRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('sales_analytics').select('*').limit(30).then(r => r),
        supabase.from('top_selling_books').select('*').limit(10).then(r => r),
        supabase.from('orders').select('id, status, total_amount, created_at'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      const orders = ordersRes.data || [];

      const totalRevenue = orders
        .filter((o: any) => ['paid', 'delivered', 'shipped'].includes(o.status))
        .reduce((sum: number, o: any) => sum + Number(o.total_amount ?? 0), 0);

      const totalOrders   = orders.length;
      // Count ALL registered profiles (admin + user) so no account is hidden
      const totalUsers    = usersRes.count ?? 0;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

      // Views may not exist; silently fall back to empty array
      const salesByDay = (!salesRes.error && salesRes.data) ? salesRes.data : [];
      const topBooks   = (!topBooksRes.error && topBooksRes.data) ? topBooksRes.data : [];

      return {
        salesByDay: salesByDay as Database['public']['Views']['sales_analytics']['Row'][],
        topBooks:   topBooks   as Database['public']['Views']['top_selling_books']['Row'][],
        totalRevenue,
        totalOrders,
        totalUsers,
        pendingOrders,
      };
    },
    staleTime: 0,            // Always refetch on mount — live admin data
    gcTime: 0,               // Never persist to localStorage offline cache
    refetchOnMount: true,
  });
}


// ── ADMIN CRUD ─────────────────────────────────────────────────

export function useUpsertBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (book: any) => {
      const cleanBook = { ...book };
      delete cleanBook.authors;
      delete cleanBook.worlds;
      delete cleanBook.author_name_input;
      delete cleanBook.image_public_id;
      delete cleanBook.image_storage_type;
      delete cleanBook.trailer_url; // Not in PostgreSQL table schema

      if (!cleanBook.author_id) delete cleanBook.author_id;
      if (!cleanBook.world_id) delete cleanBook.world_id;
      if (!cleanBook.cover_url) delete cleanBook.cover_url;

      const { data, error } = await supabase
        .from('books')
        .upsert(cleanBook as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useAssignBooksToWorld() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ worldId, bookIds }: { worldId: string, bookIds: string[] }) => {
      // 1. Remove this world_id from all books that currently have it
      await (supabase.from('books') as any).update({ world_id: null }).eq('world_id', worldId);
      
      // 2. Assign this world_id to the selected books
      if (bookIds.length > 0) {
        const { error } = await (supabase.from('books') as any)
          .update({ world_id: worldId })
          .in('id', bookIds);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useAssignBooksToAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ authorId, bookIds }: { authorId: string, bookIds: string[] }) => {
      // 1. Remove this author_id from all books that currently have it (dangerous, usually we just set the new ones)
      // Actually, since a book HAS to have an author, we usually just update the selected ones.
      // But to "unbind", we'd need a multi-author system. For now, we'll just assign.
      const { error } = await (supabase.from('books') as any)
        .update({ author_id: authorId })
        .in('id', bookIds);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useUpsertAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (author: any) => {
      const { data, error } = await supabase
        .from('authors')
        .upsert(author as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['authors'] }),
  });
}

export function useUpsertWorld() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (world: any) => {
      const { data, error } = await supabase
        .from('worlds')
        .upsert(world as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['worlds'] }),
  });
}

export function useDeleteWorld() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('worlds').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['worlds'] }),
  });
}

export function useUpsertBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(post as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // 1. Update the order status
      const { error: updateErr } = await (supabase.from('orders') as any).update({ status }).eq('id', id);
      if (updateErr) throw updateErr;

      // 2. SECURITY: If status is 'paid', unlock the content for the user
      if (status === 'paid') {
        // Fetch order owner and items
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .select('user_id, order_items(book_id)')
          .eq('id', id)
          .single();
        
        if (orderErr || !order) throw new Error('Security: Failed to fetch order items for fulfillment');

        const items = (order as any).order_items || [];
        if (items.length > 0) {
          const libraryGrants = items.map((item: any) => ({
            user_id: (order as any).user_id,
            book_id: item.book_id
          }));

          // Atomic Grant to User Library
          const { error: grantErr } = await supabase.from('user_library').upsert(libraryGrants as any, { onConflict: 'user_id,book_id' });
          if (grantErr) throw grantErr;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      qc.invalidateQueries({ queryKey: ['library'] });
    },
  });
}

// ── STORAGE ────────────────────────────────────────────────────

export function useUploadFile() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File, bucket: string = 'assets'): Promise<string> => {
    setIsUploading(true);
    try {
      // 1. Primary: Try Cloudinary upload via express api-server
      try {
        const folder: UploadFolder = bucket === 'covers' || bucket === 'blog' ? 'posts' : 'stories';
        const res = await uploadService.uploadImage(file, folder);
        if (res?.imageUrl) return res.imageUrl;
      } catch (cloudErr) {
        console.warn('Cloudinary upload via api-server failed, falling back to Supabase storage...', cloudErr);
      }

      // 2. Secondary: Try Supabase storage bucket
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (supaErr) {
        console.warn('Supabase storage upload failed, using DataURL fallback...', supaErr);
      }

      // 3. Tertiary Fail-safe: Data URL conversion so upload NEVER blocks the user
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}

export function useBookRating(bookId?: string) {
  return useQuery({
    queryKey: ['book-rating', bookId],
    queryFn: async () => {
      const empty = { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
      if (!bookId) return empty;
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('book_id', bookId);
      if (error || !data || data.length === 0) return empty;

      const dist: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const sum = data.reduce((acc: number, curr: any) => {
        dist[curr.rating] = (dist[curr.rating] || 0) + 1;
        return acc + curr.rating;
      }, 0);
      return { average: sum / data.length, count: data.length, distribution: dist };
    },
    enabled: !!bookId,
  });
}

export function useRateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookId, rating, userId, comment }: { bookId: string; rating: number; userId: string; comment?: string }) => {
      const payload: any = { book_id: bookId, user_id: userId, rating };
      if (comment !== undefined) payload.comment = comment;

      const { error } = await (supabase.from('reviews') as any)
        .upsert(
          payload,
          { onConflict: 'book_id,user_id' }
        );
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['book-rating', variables.bookId] });
      qc.invalidateQueries({ queryKey: ['book-reviews', variables.bookId] });
    },
  });
}

export function useBookReviews(bookId?: string) {
  return useQuery({
    queryKey: ['book-reviews', bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });
}

export function useAuthorRating(authorId?: string) {
  return useQuery({
    queryKey: ['author-rating', authorId],
    queryFn: async () => {
      if (!authorId) return { average: 0, count: 0 };
      const { data, error } = await supabase
        .from('author_ratings' as any)
        .select('rating');
      if (error) return { average: 0, count: 0 };
      
      if (!data || data.length === 0) return { average: 0, count: 0 };
      const sum = data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      return {
        average: sum / data.length,
        count: data.length
      };
    },
    enabled: !!authorId,
  });
}

export function useRateAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ authorId, rating, userId }: { authorId: string, rating: number, userId: string }) => {
      const { error } = await supabase
        .from('author_ratings' as any)
        .upsert({ author_id: authorId, user_id: userId, rating } as any);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['author-rating', variables.authorId] });
    },
  });
}

export function useMedia(type?: Database['public']['Enums']['media_type'] | 'all') {
  return useQuery<Media[]>({
    queryKey: ['media', type],
    queryFn: async () => {
      let query = supabase.from('media').select('*');
      if (type && type !== 'all') {
        query = query.eq('type', type);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Media[];
    },
  });
}
