import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Star, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

interface BookCardProps {
  book: Record<string, any>;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export function BookCard({ book, variant = 'default', index = 0 }: BookCardProps) {
  const { t, isRTL, language } = useLanguage();
  const queryClient = useQueryClient();

  // Prefetch book detail on hover — loads data silently before click
  // By the time the user clicks, the detail page renders instantly from cache
  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['book', book.id],
      queryFn: async () => {
        const { data } = await supabase
          .from('books')
          .select('*, authors(*), worlds(*)')
          .eq('id', book.id)
          .single();
        return data;
      },
      staleTime: 5 * 60 * 1000, // Don't re-prefetch within 5 minutes
    });
  };

  const title = language === 'ar' ? (book.title_ar || book.titleAr) : (book.title_en || book.titleEn);
  
  // Handle nested author or flat author name depending on the join
  const authorData = Array.isArray(book.authors) ? book.authors[0] : book.authors;
  let authorName = authorData ? (language === 'ar' ? authorData.name_ar : authorData.name_en) : null;
  if (!authorName) {
    authorName = language === 'ar' ? book.authorNameAr : book.authorNameEn;
  }
  
  const discount = (book.original_price || book.originalPrice)
    ? Math.round((1 - book.price / (book.original_price || book.originalPrice)) * 100)
    : null;

  return (
    <motion.div
      className="group relative cinematic-glow"
      data-testid={`card-book-${book.id}`}
      onMouseEnter={handlePrefetch}
    >
      <Link href={`/book/${book.id}`}>
        <div className="cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
          {/* Cover Image Container */}
          <div className={`relative overflow-hidden rounded-[1.5rem] bg-card/30 transition-all duration-500 hover:shadow-[0_22px_45px_-12px_rgba(139,29,61,0.25)] hover:-translate-y-2 mb-4 group-hover:ring-1 group-hover:ring-accent/20 ${
            variant === 'compact' ? 'aspect-[2/3] h-48' : 'aspect-[2/3]'
          }`}>
            <img
              src={book.cover_url || book.coverUrl || ''}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Price Tag Floating */}
            <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'}`}>
              <div className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">
                  {book.price} <span className="text-xs opacity-70">{t.common.currency}</span>
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex flex-col gap-1.5`}>
              {(book.is_new || book.isNew) && (
                <span className="px-2.5 py-1 bg-accent/90 backdrop-blur-sm text-primary text-xs font-bold rounded-lg shadow-sm">
                  {isRTL ? 'جديد' : 'NEW'}
                </span>
              )}
              {discount && (
                <span className="px-2.5 py-1 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl/90 backdrop-blur-sm text-red-600 text-xs font-bold rounded-lg shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Hover View Detail */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
               <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                 <Eye size={20} />
               </div>
            </div>
          </div>

          {/* Info Area */}
          <div className={`${isRTL ? 'text-right' : 'text-left'} px-1`}>
            <p className={`text-accent font-bold uppercase tracking-[0.1em] text-xs mb-1.5 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
              {authorName}
            </p>
            <h3 className={`font-bold text-primary leading-snug line-clamp-1 mb-2 group-hover:text-accent transition-colors ${
              isRTL ? 'font-arabic text-md' : 'text-md group-hover:tracking-wide'
            }`}>
              {title}
            </h3>
            
            {/* Rating & Footer */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className="flex items-center gap-1">
                 <Star size={12} className="fill-accent text-accent" />
                 <span className="text-[11px] font-bold text-primary/80">{book.rating}</span>
               </div>
               <div className="h-3 w-px bg-border" />
               <span className="text-xs uppercase font-bold text-primary/40 tracking-wider">
                 {book.format || 'Hardcover'}
               </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
