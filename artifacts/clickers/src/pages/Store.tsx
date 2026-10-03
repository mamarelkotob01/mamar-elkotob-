import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBooks } from '@/services/supabase.hooks';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { useDiscovery } from '@/hooks/useDiscovery';

type SortOption = 'newest' | 'popular' | 'priceAsc' | 'priceDesc';
type GenreFilter = 'all' | 'Fantasy' | 'Sci-Fi' | 'Historical' | 'Horror' | 'Romance' | 'Adventure' | 'Literary' | 'Mystery';
type FormatFilter = 'all' | 'digital' | 'physical';

export function Store() {
  const { t, isRTL, language } = useLanguage();
  const { data: books, isLoading } = useBooks({ status: undefined });
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('all');
  const [selectedFormat, setSelectedFormat] = useState<FormatFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const { results: searchResults, totalFound } = useSmartSearch(search);
  const { trackSearch } = useDiscovery();

  const genres: GenreFilter[] = ['all', 'Fantasy', 'Sci-Fi', 'Historical', 'Horror', 'Romance', 'Adventure', 'Literary', 'Mystery'];
  const genreLabels: Record<GenreFilter, string> = {
    all: language === 'ar' ? 'الكل' : 'All',
    Fantasy: language === 'ar' ? 'الخيال' : 'Fantasy',
    'Sci-Fi': language === 'ar' ? 'الخيال العلمي' : 'Sci-Fi',
    Historical: language === 'ar' ? 'التاريخي' : 'Historical',
    Horror: language === 'ar' ? 'الرعب' : 'Horror',
    Romance: language === 'ar' ? 'الرومانسية' : 'Romance',
    Adventure: language === 'ar' ? 'المغامرة' : 'Adventure',
    Literary: language === 'ar' ? 'الأدبي' : 'Literary',
    Mystery: language === 'ar' ? 'الغموض' : 'Mystery',
  };

  const filteredBooks = useMemo(() => {
    let result = [...(books || [])];

    if (search.trim()) {
      // Use the smart fuzzy results if search is active
      result = searchResults;
      trackSearch(search);
    }

    if (selectedGenre !== 'all') {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (selectedFormat !== 'all') {
      result = result.filter((b) => b.format === selectedFormat || b.format === 'both');
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.published_date || 0).getTime() - new Date(a.published_date || 0).getTime());
        break;
      case 'popular':
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [books, search, selectedGenre, selectedFormat, sortBy]);

  return (
    <div className="min-h-screen pt-32 pb-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.store.title}
          subtitle={t.store.subtitle}
        />

        {/* Search and Action Bar */}
        <div className={`flex flex-col lg:flex-row gap-6 mb-12 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
           {/* Search Input */}
           <div className="relative flex-1 w-full group">
              <div className="absolute inset-y-0 flex items-center px-4 pointer-events-none text-primary/30 group-focus-within:text-accent transition-colors">
                 <Search size={20} />
              </div>
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.nav.search}
                className={`w-full py-5 px-12 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-[2rem] text-primary font-bold placeholder:text-primary/20 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all duration-300 shadow-sm ${isRTL ? 'text-right' : ''}`}
              />
           </div>

           <div className={`flex items-center gap-4 w-full lg:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <motion.button
                 onClick={() => setShowFilters(!showFilters)}
                 className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] border transition-all duration-300 font-bold text-sm ${
                   showFilters 
                    ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' 
                    : 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border-border text-primary hover:border-accent'
                 }`}
                 whileTap={{ scale: 0.95 }}
              >
                 <SlidersHorizontal size={18} />
                 <span>{t.store.filters}</span>
              </motion.button>

              <div className="relative flex-1 lg:flex-none">
                 <select
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value as SortOption)}
                   className="w-full appearance-none bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-[2rem] px-8 py-5 pr-12 font-bold text-sm text-primary focus:outline-none focus:border-accent cursor-pointer shadow-sm hover:border-accent transition-colors"
                 >
                    <option value="popular">{t.store.popular}</option>
                    <option value="newest">{t.store.newest}</option>
                    <option value="priceAsc">{t.store.priceAsc}</option>
                    <option value="priceDesc">{t.store.priceDesc}</option>
                 </select>
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/30">
                    <SlidersHorizontal size={14} className="rotate-90" />
                 </div>
              </div>
           </div>
        </div>



        {/* Filters Panel */}
        <AnimatePresence>
           {showFilters && (
             <motion.div
               initial={{ opacity: 0, y: -20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -20, scale: 0.95 }}
               className="mb-12 p-10 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-[3rem] border border-border shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                   <div>
                      <h4 className="text-accent font-black text-xs uppercase tracking-[0.3em] mb-6">Discovery Genres</h4>
                      <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                         {genres.map((g) => (
                           <button
                             key={g}
                             onClick={() => setSelectedGenre(g)}
                             className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                               selectedGenre === g 
                                ? 'bg-primary text-primary-foreground shadow-lg' 
                                : 'bg-primary/5 text-primary/60 hover:bg-primary/10'
                             }`}
                           >
                              {genreLabels[g]}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <h4 className="text-accent font-black text-xs uppercase tracking-[0.3em] mb-6">Preferred Format</h4>
                      <div className={`flex gap-3 ${isRTL ? 'justify-end' : ''}`}>
                        {(['all', 'digital', 'physical'] as FormatFilter[]).map((f) => (
                          <button
                            key={f}
                            onClick={() => setSelectedFormat(f)}
                            className={`flex-1 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                              selectedFormat === f 
                                ? 'bg-primary text-primary-foreground shadow-lg' 
                                : 'bg-primary/5 text-primary/60 hover:bg-primary/10'
                            }`}
                          >
                             {f === 'all' ? (language === 'ar' ? 'الكل' : 'All') : f === 'digital' ? t.store.digital : t.store.physical}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Results Info */}
        <div className={`flex items-center justify-between mb-10 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
           <p className="text-primary font-bold text-sm">
              {filteredBooks.length} <span className="opacity-40">{language === 'ar' ? 'كتاب متاح' : 'Available Titles'}</span>
           </p>
           {(selectedGenre !== 'all' || selectedFormat !== 'all' || search) && (
              <button 
                onClick={() => { setSearch(''); setSelectedGenre('all'); setSelectedFormat('all'); }}
                className="text-accent font-black text-xs uppercase tracking-wider hover:text-primary transition-colors"
              >
                Reset All
              </button>
           )}
        </div>

        {/* Store Grid */}
        <AnimatePresence mode="wait">
          {filteredBooks.length > 0 ? (
            <motion.div
              key="grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-primary/5 rounded-3xl animate-pulse" />
                ))
              ) : (
                filteredBooks.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              className="py-40 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
               <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 text-primary/20">
                  <Search size={40} />
               </div>
               <h3 className={`text-3xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                 {t.store.noResults}
               </h3>
               <p className="text-primary/40 text-lg mb-8">We couldn't find any stories matching your current path.</p>
               <button 
                 onClick={() => { setSearch(''); setSelectedGenre('all'); setSelectedFormat('all'); }}
                 className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-accent hover:text-primary transition-all"
               >
                 Go Back to All Stories
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
