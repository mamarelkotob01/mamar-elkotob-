import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Play } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBooks, useAuthors } from '@/services/supabase.hooks';
import { SEO } from '@/components/SEO';

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden" data-testid="hero-section">
      {/* Full bleed background image with dark vignette on the left only */}
      <div className="absolute inset-0 z-0">
        <img
          src="/library-bg.jpg"
          alt="library background"
          className="w-full h-full object-cover object-center"
        />
        {/* Vignette: heavy dark on left (where text lives), transparent on right (image) */}
        <div
          className="absolute inset-0"
          style={{
            background: isRTL
              ? 'linear-gradient(to left, rgba(10,5,2,0.10) 0%, rgba(10,5,2,0.55) 45%, rgba(10,5,2,0.93) 75%, rgba(10,5,2,0.97) 100%)'
              : 'linear-gradient(to right, rgba(10,5,2,0.10) 0%, rgba(10,5,2,0.55) 45%, rgba(10,5,2,0.93) 75%, rgba(10,5,2,0.97) 100%)',
          }}
        />
        {/* Bottom fade so the books section blends smoothly */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0502] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-28 pb-20">
          {/* Text block – sits on the dark side */}
          <motion.div
            className={`max-w-xl ${isRTL ? 'text-right mr-auto ml-0' : 'text-left'}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Headline */}
            <h1 className={`font-black leading-tight mb-6 ${isRTL ? 'font-arabic text-5xl sm:text-6xl lg:text-7xl' : 'font-cinematic text-5xl sm:text-6xl lg:text-7xl'}`}
              style={{ color: '#f0e0c0' }}
            >
              <span className="block">
                {isRTL ? 'حيث تبدأ الحكايات' : 'Where Stories Begin'}
              </span>
              <span className="block mt-2" style={{ color: '#c8a84b' }}>
                {isRTL ? 'رحلتها إلى القراء' : 'Their Journey to Readers'}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg leading-relaxed mb-10 ${isRTL ? 'font-arabic' : ''}`}
              style={{ color: 'rgba(240,224,192,0.7)' }}
            >
              {isRTL
                ? 'ممر الكتب دار نشر تهدف إلى نشر الإبداع والمعرفة، وإيصال الكتب إلى كل قارئ في كل مكان.'
                : 'Book Corridor is a publishing house dedicated to spreading creativity and knowledge, delivering books to every reader everywhere.'}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/store">
                <motion.span
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm cursor-pointer transition-all ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}
                  style={{ background: '#c8a84b', color: '#1a0f05' }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isRTL ? 'تصفح الإصدارات' : 'Browse Releases'}
                </motion.span>
              </Link>

              <Link href="/auth">
                <motion.span
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm cursor-pointer border transition-all ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}
                  style={{ border: '1px solid rgba(200,168,75,0.5)', color: '#c8a84b', background: 'rgba(200,168,75,0.08)' }}
                  whileHover={{ scale: 1.04, y: -2, background: 'rgba(200,168,75,0.18)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isRTL ? 'انشر كتابك معنا' : 'Publish With Us'}
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Latest Books Carousel ────────────────────────────────────────────────────
function LatestBooksSection() {
  const { isRTL, language } = useLanguage();
  const { data: booksData } = useBooks({ status: undefined });
  const books = (booksData ?? []).slice(0, 10);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Placeholder cards when no data yet
  const placeholders = Array.from({ length: 5 });

  return (
    <section className="py-16 relative" style={{ background: 'rgba(10,5,2,0.97)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Row header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* "View All" link on left (or right in RTL) */}
          <Link href="/store">
            <motion.span
              className={`flex items-center gap-2 text-sm font-bold cursor-pointer transition-colors hover:opacity-80 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
              style={{ color: '#c8a84b' }}
              whileHover={{ x: isRTL ? 4 : -4 }}
            >
              {isRTL ? 'عرض جميع الإصدارات' : 'View All Releases'}
              {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </motion.span>
          </Link>

          {/* Section title */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xl" style={{ color: '#c8a84b' }}>✦</span>
            <h2 className={`text-2xl font-bold ${isRTL ? 'font-arabic' : 'font-cinematic'}`}
              style={{ color: '#f0e0c0' }}>
              {isRTL ? 'أحدث الإصدارات' : 'Latest Releases'}
            </h2>
          </div>
        </div>

        {/* Carousel wrapper */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll(isRTL ? 'right' : 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-80 hover:opacity-100 -translate-x-4"
            style={{ background: 'rgba(200,168,75,0.15)', border: '1px solid rgba(200,168,75,0.3)', color: '#c8a84b' }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {books.length > 0
              ? books.map((book, i) => (
                  <motion.div
                    key={book.id}
                    className="flex-shrink-0 w-44 cursor-pointer group/card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link href={`/books/${book.id}`}>
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl mb-3"
                        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={language === 'ar' ? book.title_ar : book.title_en}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #2a1a08, #3d2810)' }}>
                            <BookOpen size={32} style={{ color: '#c8a84b', opacity: 0.5 }} />
                          </div>
                        )}
                        {/* Hover shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      </div>
                      <h3
                        className={`text-sm font-bold line-clamp-2 mb-1 ${isRTL ? 'text-right font-arabic' : ''}`}
                        style={{ color: '#f0e0c0' }}
                      >
                        {language === 'ar' ? book.title_ar : book.title_en}
                      </h3>
                      <p className={`text-xs ${isRTL ? 'text-right font-arabic' : ''}`}
                        style={{ color: 'rgba(200,168,75,0.75)' }}>
                        {(book as any).authors?.name_ar || (book as any).authors?.name_en || ''}
                      </p>
                    </Link>
                  </motion.div>
                ))
              : placeholders.map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-44 animate-pulse">
                    <div className="aspect-[2/3] rounded-2xl mb-3"
                      style={{ background: 'rgba(200,168,75,0.08)' }} />
                    <div className="h-4 rounded mb-2 w-3/4"
                      style={{ background: 'rgba(200,168,75,0.08)' }} />
                    <div className="h-3 rounded w-1/2"
                      style={{ background: 'rgba(200,168,75,0.06)' }} />
                  </div>
                ))
            }
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll(isRTL ? 'left' : 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-80 hover:opacity-100 translate-x-4"
            style={{ background: 'rgba(200,168,75,0.15)', border: '1px solid rgba(200,168,75,0.3)', color: '#c8a84b' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Authors Section ─────────────────────────────────────────────────────────
function AuthorsSection() {
  const { isRTL, language } = useLanguage();
  const { data: authorsData } = useAuthors();
  const authors = (authorsData ?? []).slice(0, 6);

  return (
    <section className="py-16 relative" style={{ background: 'rgba(12,7,3,0.98)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link href="/authors">
            <motion.span
              className={`flex items-center gap-2 text-sm font-bold cursor-pointer ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
              style={{ color: '#c8a84b' }}
              whileHover={{ x: isRTL ? 4 : -4 }}
            >
              {isRTL ? 'عرض جميع المؤلفين' : 'View All Authors'}
              {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </motion.span>
          </Link>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xl" style={{ color: '#c8a84b' }}>✦</span>
            <h2 className={`text-2xl font-bold ${isRTL ? 'font-arabic' : 'font-cinematic'}`}
              style={{ color: '#f0e0c0' }}>
              {isRTL ? 'مؤلفونا' : 'Our Authors'}
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {authors.length > 0
            ? authors.map((author, i) => (
                <motion.div key={author.id}
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/authors`}>
                    <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-amber-600/50 group-hover:ring-4 group-hover:ring-amber-500 transition-all"
                      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {(author as any).photo_url ? (
                        <img src={(author as any).photo_url} alt={language === 'ar' ? (author as any).name_ar : (author as any).name_en}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                          style={{ background: 'linear-gradient(135deg,#2a1a08,#3d2810)', color: '#c8a84b' }}>
                          {((language === 'ar' ? (author as any).name_ar : (author as any).name_en) || '?')[0]}
                        </div>
                      )}
                    </div>
                    <p className={`text-xs font-bold line-clamp-1 ${isRTL ? 'font-arabic' : ''}`}
                      style={{ color: '#f0e0c0' }}>
                      {language === 'ar' ? (author as any).name_ar : (author as any).name_en}
                    </p>
                  </Link>
                </motion.div>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-20 h-20 rounded-full mx-auto mb-3"
                    style={{ background: 'rgba(200,168,75,0.08)' }} />
                  <div className="h-3 rounded w-16 mx-auto"
                    style={{ background: 'rgba(200,168,75,0.06)' }} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTASection() {
  const { isRTL } = useLanguage();
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0d04 0%, #2d1a08 50%, #1a0d04 100%)' }}>
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] rounded-full blur-[120px]"
          style={{ background: 'rgba(200,168,75,0.08)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-3xl mb-6" style={{ color: '#c8a84b' }}>✦</div>
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 leading-tight ${isRTL ? 'font-arabic' : 'font-cinematic'}`}
            style={{ color: '#f0e0c0' }}>
            {isRTL ? 'انشر كتابك مع ممر الكتب' : 'Publish Your Book With Us'}
          </h2>
          <p className={`text-lg mb-10 ${isRTL ? 'font-arabic' : ''}`}
            style={{ color: 'rgba(240,224,192,0.6)' }}>
            {isRTL
              ? 'انضم إلى مجتمع المؤلفين لدينا واوصل قصتك إلى آلاف القراء حول العالم.'
              : 'Join our author community and reach thousands of readers around the world.'}
          </p>
          <div className={`flex flex-wrap gap-4 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/auth">
              <motion.span
                className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold cursor-pointer ${isRTL ? 'font-arabic' : ''}`}
                style={{ background: '#c8a84b', color: '#1a0f05' }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {isRTL ? 'ابدأ الآن' : 'Get Started'}
              </motion.span>
            </Link>
            <Link href="/store">
              <motion.span
                className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold cursor-pointer border ${isRTL ? 'font-arabic' : ''}`}
                style={{ border: '1px solid rgba(200,168,75,0.4)', color: '#c8a84b', background: 'transparent' }}
                whileHover={{ scale: 1.05, y: -2, background: 'rgba(200,168,75,0.1)' }}
                whileTap={{ scale: 0.97 }}
              >
                {isRTL ? 'تصفح الكتب' : 'Browse Books'}
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function Homepage() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen" style={{ background: '#0a0502' }}>
      <SEO
        title={isRTL ? 'ممر الكتب - دار نشر' : 'Book Corridor — Publishing House'}
        description={isRTL
          ? 'ممر الكتب دار نشر تهدف إلى نشر الإبداع والمعرفة، وإيصال الكتب إلى كل قارئ في كل مكان.'
          : 'Book Corridor Publishing House — Spreading creativity and knowledge to every reader.'}
        type="website"
      />
      <HeroSection />
      <LatestBooksSection />
      <AuthorsSection />
      <CTASection />
    </div>
  );
}
