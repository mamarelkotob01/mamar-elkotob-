import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Star, BookOpen, Users, ArrowLeft, ArrowRight, Globe, Instagram, Twitter, ShieldCheck } from 'lucide-react';
import { AuthorCard } from '@/components/AuthorCard';
import { BookCard } from '@/components/BookCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuthors, useAuthor, useBooks, useAuthorRating, useRateAuthor } from '@/services/supabase.hooks';
import { useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHTML } from '@/lib/sanitize';

export function AuthorsPage() {
  const { t, isRTL } = useLanguage();
  const { data: authors, isLoading } = useAuthors();

  return (
    <div className="min-h-screen pt-24 pb-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.authors.title}
          subtitle={t.authors.subtitle}
        />
        
        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => <div key={i} className="h-60 bg-primary/5 animate-pulse rounded-[3rem]" />)}
           </div>
        ) : authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {authors.map((author, i) => (
              <AuthorCard key={author.id} author={author} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
            <p className="text-primary/30 font-bold uppercase tracking-wider">No scribes have been registered in the Great Archive yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthorDetail() {
  const { t, isRTL, language } = useLanguage();
  const [, params] = useRoute('/authors/:id');
  const authorId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: author, isLoading: authorLoading } = useAuthor(authorId);
  const { data: books, isLoading: booksLoading } = useBooks({ authorId });
  const { data: rating } = useAuthorRating(authorId);
  const rateAuthor = useRateAuthor();

  const [hoverRating, setHoverRating] = useState(0);

  if (authorLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-transparent">
        <h2 className="text-3xl font-black text-primary mb-4 font-cinematic uppercase tracking-wider">{t.common.notFound}</h2>
        <Link href="/authors">
          <button className="flex items-center gap-2 text-primary/40 font-bold uppercase tracking-wider text-xs hover:text-primary transition-all">
             {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
             <span>{t.common.backToHome}</span>
          </button>
        </Link>
      </div>
    );
  }

  const name = language === 'ar' ? author.name_ar : author.name_en;
  const bio = language === 'ar' ? author.bio_ar : author.bio_en;

  const handleRate = async (value: number) => {
    if (!user?.id) {
      toast({ title: 'Please login to rate experts', variant: 'destructive' });
      return;
    }
    try {
      await rateAuthor.mutateAsync({ authorId: author.id as string, rating: value, userId: user.id as string });
      toast({ title: 'Thank you for your rating!' });
    } catch (err) {
      toast({ title: 'Error submitting rating', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* Cinematic Profile Header */}
      <div className="relative py-20 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-[#FDFBF7]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/authors">
            <motion.button
              className={`flex items-center gap-2 text-primary/40 font-black uppercase tracking-wider text-xs mb-12 hover:text-primary transition-all ${isRTL ? 'flex-row-reverse ml-auto' : ''}`}
            >
              {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{t.authors.title}</span>
            </motion.button>
          </Link>

          <div className={`flex flex-col md:flex-row gap-12 items-center md:items-start ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
             {/* Portrait */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
               animate={{ opacity: 1, scale: 1, rotate: 0 }}
               className="relative"
             >
               <div className="w-48 h-48 md:w-64 md:h-64 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative z-10">
                  <img src={author.photo_url ?? undefined} alt={name} className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white shadow-xl z-20 border-4 border-white">
                  <ShieldCheck size={32} />
               </div>
             </motion.div>

             {/* Info */}
             <div className="flex-1 space-y-6">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                 <span className="text-accent font-black uppercase tracking-[0.3em] text-xs mb-4 block">Master Architect</span>
                 <h1 className={`text-5xl md:text-7xl font-black text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                   {name}
                 </h1>
                 <p className="text-primary/40 text-lg font-bold uppercase tracking-wider">{author.nationality || 'Independent Writer'}</p>
               </motion.div>

               <div className={`flex items-center gap-10 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-wider text-primary/20 mb-1">Works</span>
                    <div className={`flex items-center gap-2 text-primary font-black text-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <BookOpen size={20} className="text-accent" />
                       <span>{books?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-wider text-primary/20 mb-1">Global Rating</span>
                    <div className={`flex items-center gap-2 text-primary font-black text-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <Star size={20} fill="currentColor" className="text-yellow-400" />
                       <span>{rating?.average?.toFixed(1) || '0.0'}</span>
                       <span className="text-primary/20 text-xs ml-1 font-bold">({rating?.count || 0})</span>
                    </div>
                  </div>
               </div>

               <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {author.instagram && (
                    <a href={author.instagram} target="_blank" className="w-12 h-12 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-2xl flex items-center justify-center text-primary/40 hover:text-accent hover:shadow-xl transition-all border border-border">
                      <Instagram size={20} />
                    </a>
                  )}
                  {author.twitter && (
                    <a href={author.twitter} target="_blank" className="w-12 h-12 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-2xl flex items-center justify-center text-primary/40 hover:text-accent hover:shadow-xl transition-all border border-border">
                      <Twitter size={20} />
                    </a>
                  )}
                  {author.website && (
                    <a href={author.website} target="_blank" className="w-12 h-12 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-2xl flex items-center justify-center text-primary/40 hover:text-accent hover:shadow-xl transition-all border border-border">
                      <Globe size={20} />
                    </a>
                  )}
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           {/* Sidebar: Rating & Actions */}
           <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-24 space-y-8">
                 <div className={`bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl p-10 rounded-[3.5rem] border border-border shadow-2xl shadow-primary/5 ${isRTL ? 'text-right' : ''}`}>
                    <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-8">Writer's Legacy</h3>
                    <p className="text-primary/60 text-sm mb-10 leading-relaxed">
                       Support this architect by rating their contributions to the great archive. Your appreciation builds the realm.
                    </p>
                    
                    <div className={`flex items-center justify-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                       {[1,2,3,4,5].map(i => (
                         <button
                           key={i}
                           onMouseEnter={() => setHoverRating(i)}
                           onMouseLeave={() => setHoverRating(0)}
                           onClick={() => handleRate(i)}
                           className="transition-transform active:scale-95"
                         >
                           <Star 
                             size={32} 
                             fill={i <= (hoverRating || 0) ? 'currentColor' : 'none'}
                             className={`${i <= (hoverRating || 0) ? 'text-yellow-400' : 'text-primary/10'}`} 
                           />
                         </button>
                       ))}
                    </div>
                    <p className="text-center text-xs font-black text-primary/20 uppercase tracking-wider">Rate this expert</p>
                 </div>
              </div>
           </div>

           {/* Main Content: Bio & Works */}
           <div className="lg:col-span-8 order-1 lg:order-2">
              <section className="mb-24">
                <h2 className={`text-2xl font-black text-primary mb-8 uppercase tracking-wider ${isRTL ? 'text-right font-arabic' : 'font-cinematic'}`}>
                   {t.authors.biography}
                </h2>
                <div className={`text-xl text-primary/70 leading-[1.8] space-y-6 ${isRTL ? 'text-right font-arabic' : ''}`}>
                   <p dangerouslySetInnerHTML={{ __html: sanitizeHTML(bio?.replace(/\n/g, '<br/>') ?? '') }} />
                </div>
              </section>

              <section>
                 <div className={`flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4 ${isRTL ? 'md:flex-row-reverse text-right' : ''}`}>
                    <h2 className={`text-4xl font-black text-primary ${isRTL ? 'font-arabic' : 'font-cinematic uppercase tracking-wider'}`}>
                       Bibliography
                    </h2>
                    <span className="text-primary/20 font-black uppercase text-xs tracking-wider leading-none">The Complete Collection</span>
                 </div>

                 {booksLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                       {[1,2,3].map(i => <div key={i} className="aspect-[2/3] bg-primary/5 animate-pulse rounded-[2rem]" />)}
                    </div>
                 ) : books && books.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                       {books.map((book, i) => (
                         <BookCard key={book.id} book={book} index={i} />
                       ))}
                    </div>
                 ) : (
                    <div className="py-20 text-center bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                       <p className="text-primary/30 font-bold uppercase tracking-wider">No works have been cataloged for this scribe yet.</p>
                    </div>
                 )}
              </section>
           </div>
        </div>
      </div>
    </div>
  );
}


