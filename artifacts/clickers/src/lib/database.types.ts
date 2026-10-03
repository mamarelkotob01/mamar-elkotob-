// ============================================================
// Supabase Database Type Definitions
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          bio_ar: string | null
          bio_en: string | null
          created_at: string
          id: string
          instagram: string | null
          name_ar: string
          name_en: string
          nationality: string | null
          photo_url: string | null
          twitter: string | null
          website: string | null
        }
        Insert: {
          bio_ar?: string | null
          bio_en?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          name_ar: string
          name_en: string
          nationality?: string | null
          photo_url?: string | null
          twitter?: string | null
          website?: string | null
        }
        Update: {
          bio_ar?: string | null
          bio_en?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          name_ar?: string
          name_en?: string
          nationality?: string | null
          photo_url?: string | null
          twitter?: string | null
          website?: string | null
        }
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content_ar: string | null
          content_en: string | null
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          id: string
          image_url: string | null
          published_at: string | null
          read_time: string
          status: string
          title_ar: string
          title_en: string
        }
        Insert: {
          author_id?: string | null
          category: string
          content_ar?: string | null
          content_en?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          read_time: string
          status?: string
          title_ar: string
          title_en: string
        }
        Update: {
          author_id?: string | null
          category?: string
          content_ar?: string | null
          content_en?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          read_time?: string
          status?: string
          title_ar?: string
          title_en?: string
        }
      }
      books: {
        Row: {
          author_id: string
          cover_url: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          format: string
          genre: string
          genre_ar: string
          id: string
          is_featured: boolean
          is_new: boolean
          language: string
          pages: number
          price: number
          original_price: number | null
          published_date: string
          rating: number
          reading_order_in_world: number | null
          review_count: number
          status: string
          tags: string[] | null
          title_ar: string
          title_en: string
          trailer_url: string | null
          world_id: string | null
        }
        Insert: {
          author_id: string
          cover_url?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          format?: string
          genre: string
          genre_ar: string
          id?: string
          is_featured?: boolean
          is_new?: boolean
          language?: string
          pages?: number
          price: number
          original_price?: number | null
          published_date?: string
          rating?: number
          reading_order_in_world?: number | null
          review_count?: number
          status?: string
          tags?: string[] | null
          title_ar: string
          title_en: string
          trailer_url?: string | null
          world_id?: string | null
        }
        Update: {
          author_id?: string
          cover_url?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          format?: string
          genre?: string
          genre_ar?: string
          id?: string
          is_featured?: boolean
          is_new?: boolean
          language?: string
          pages?: number
          price?: number
          original_price?: number | null
          published_date?: string
          rating?: number
          reading_order_in_world?: number | null
          review_count?: number
          status?: string
          tags?: string[] | null
          title_ar?: string
          title_en?: string
          trailer_url?: string | null
          world_id?: string | null
        }
      }
      order_items: {
        Row: {
          book_id: string
          id: string
          order_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          book_id: string
          id?: string
          order_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          book_id?: string
          id?: string
          order_id?: string
          quantity?: number
          unit_price?: number
        }
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          payment_method: string | null
          shipping_address: string | null
          status: string
          total_amount: number
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          shipping_address?: string | null
          status?: string
          total_amount: number
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          shipping_address?: string | null
          status?: string
          total_amount?: number
          transaction_id?: string | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
        }
      }
      reviews: {
        Row: {
          book_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          book_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          book_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
      }
      user_library: {
        Row: {
          acquired_at: string
          book_id: string
          id: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          book_id: string
          id?: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          book_id?: string
          id?: string
          user_id?: string
        }
      }
      worlds: {
        Row: {
          banner_url: string | null
          color_primary: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          is_featured: boolean
          name_ar: string
          name_en: string
        }
        Insert: {
          banner_url?: string | null
          color_primary?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_featured?: boolean
          name_ar: string
          name_en: string
        }
        Update: {
          banner_url?: string | null
          color_primary?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_featured?: boolean
          name_ar?: string
          name_en?: string
        }
      }
      media: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          duration: string | null
          id: string
          title_ar: string
          title_en: string
          type: 'video' | 'music' | 'trailer'
          url: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          duration?: string | null
          id?: string
          title_ar: string
          title_en: string
          type?: 'video' | 'music' | 'trailer'
          url: string
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          duration?: string | null
          id?: string
          title_ar?: string
          title_en?: string
          type?: 'video' | 'music' | 'trailer'
          url?: string
        }
      }
    }
    Views: {
      sales_analytics: {
        Row: {
          order_count: number | null
          revenue: number | null
          sale_date: string | null
          unique_customers: number | null
        }
      }
      top_selling_books: {
        Row: {
          cover_url: string | null
          id: string | null
          price: number | null
          title_ar: string | null
          title_en: string | null
          total_revenue: number | null
          total_sold: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      media_type: "video" | "music" | "trailer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
