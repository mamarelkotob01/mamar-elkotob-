import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, Users, PenTool } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useWorld, useBooks } from '@/services/supabase.hooks';
import { sanitizeHTML } from '@/lib/sanitize';

export function WorldDetail() {
  const { t, isRTL, language } = useLanguage();
  const [, params] = useRoute('/worlds/:id');
  const worldId = params?.id;

  const { data: world, isLoading: worldLoading } = useWorld(worldId);
  const { data: books, isLoading: booksLoading } = useBooks({ worldId });

  // Extract unique authors from books
  const writers = books ? Array.from(new Set(books.map(b => b.author_id))).map(id => {
    const book = books.find(b => b.author_id === id);
    return book?.authors;
  }).filter(Boolean) : [];

  if (worldLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!world) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-transparent">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/20 mb-6">
          <Layers size={40} />
        </div>
        <h2 className="text-3xl font-black text-primary mb-4 font-cinematic uppercase tracking-wider">{t.common.notFound}</h2>
        <Link href="/worlds">
          <button className="flex items-center gap-2 text-accent font-bold uppercase tracking-wider text-xs hover:gap-4 transition-all">
             {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
             <span>{t.common.backToHome}</span>
          </button>
        </Link>
      </div>
    );
  }

  const name = language === 'ar' ? world.name_ar : world.name_en;
  const description = language === 'ar' ? world.description_ar : world.description_en;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Cinematic Banner */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        {world.banner_url ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={world.banner_url}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: world.color_primary || '#8B1D3D' }} />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/60 to-[#FDFBF7]" />
        
        {/* Brand Color Glow */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: `radial-gradient(circle at center, ${world.color_primary || '#8B1D3D'} 0%, transparent 100%)` }}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
          <div className="max-w-7xl mx-auto w-full">
            <Link href="/worlds">
              <motion.button
                className={`flex items-center gap-2 text-white font-black uppercase tracking-wider text-xs mb-8 hover:gap-4 transition-all ${isRTL ? 'flex-row-reverse ml-auto' : ''}`}
                whileHover={{ x: isRTL ? 3 : -3 }}
              >
                {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{t.worlds.title}</span>
              </motion.button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={isRTL ? 'text-right' : 'text-left'}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-white text-xs font-black uppercase tracking-wider rounded-full mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Layers size={12} />
                <span>{isRTL ? 'عالم قصصي' : 'Narrative World'}</span>
              </div>
              
              <h1 className={`text-5xl md:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                {name}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-[4rem] p-10 md:p-16 shadow-2xl shadow-primary/10 border border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                 {/* Sidebar info */}
                 <div className={`md:col-span-1 border-primary/10 ${isRTL ? 'order-2 md:border-r md:pr-10 text-right' : 'md:border-l md:pl-10 text-left'}`}>
                    <div className="mb-10">
                      <p className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-4">World Color</p>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                         <div className="w-12 h-12 rounded-2xl shadow-xl border-4 border-white" style={{ backgroundColor: world.color_primary || '#8B1D3D' }} />
                         <span className="font-mono text-xs text-primary/30 uppercase tracking-wider">{world.color_primary || '#8B1D3D'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-4">Atlas Statistics</p>
                      <div className="space-y-6">
                         <div className={`flex items-center gap-4 text-primary/60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><BookOpen size={16} /></div>
                            <span className="text-xs font-black uppercase tracking-wider">{books?.length || 0} Chronicles</span>
                         </div>
                         <div className={`flex items-center gap-4 text-primary/60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><PenTool size={16} /></div>
                            <span className="text-xs font-black uppercase tracking-wider">{writers.length} Scribes</span>
                         </div>
                      </div>
                    </div>
                 </div>

                 {/* Main text */}
                 <div className={`md:col-span-2 ${isRTL ? 'order-1 text-right' : 'text-left'}`}>
                    <h2 className={`text-2xl font-black text-primary mb-8 uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                       {isRTL ? 'تاريخ وسرد العالم' : 'History & Lore of the Realm'}
                    </h2>
                    <div 
                      className={`text-xl text-primary/70 leading-[1.8] space-y-6 ${isRTL ? 'font-arabic' : ''}`} 
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(description?.replace(/\n/g, '<br/>') || '') }} 
                    />
                 </div>
              </div>
            </motion.div>

            {/* NEW SECTION: Architects of the World (Writers) */}
            <section className="mt-32">
                <div className={`flex flex-col md:flex-row items-end justify-between mb-16 gap-6 ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
                  <div>
                    <h2 className={`text-4xl md:text-5xl font-black text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-cinematic uppercase tracking-wider'}`}>
                      {isRTL ? 'سكان العالم والمبدعون' : 'Architects of the Realm'}
                    </h2>
                    <p className="text-primary/40 font-bold uppercase tracking-wider text-xs">The creative minds giving life to this narrative universe</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   {writers.length > 0 ? writers.map((writer: any, i: number) => (
                     <motion.div 
                        key={writer.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl p-8 rounded-[3rem] border border-border shadow-xl hover:shadow-2xl transition-all relative overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
                     >
                       <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-primary/5 rounded-full -m-10 group-hover:bg-accent/10 transition-colors`} />
                       
                       <div className={`flex items-center gap-6 mb-8 relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-20 h-20 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                             <img src={writer.photo_url} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <h3 className={`text-2xl font-black text-primary ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                               {language === 'ar' ? writer.name_ar : writer.name_en}
                            </h3>
                            <p className="text-accent text-xs font-black uppercase tracking-wider">Master Scribe</p>
                          </div>
                       </div>
                       
                       <p className={`text-primary/60 text-sm line-clamp-3 mb-8 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? writer.bio_ar : writer.bio_en}
                       </p>

                       <Link href={`/authors/${writer.id}`}>
                          <button className={`flex items-center gap-3 text-primary font-black uppercase tracking-wider text-xs hover:text-accent transition-colors ${isRTL ? 'flex-row-reverse ml-auto' : ''}`}>
                             <span>{isRTL ? 'شاهد الملف الشخصي' : 'View Profile'}</span>
                             {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                          </button>
                       </Link>
                     </motion.div>
                   )) : (
                    <div className="col-span-full py-20 text-center bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                       <p className="text-primary/30 font-bold uppercase tracking-wider">No architects have been registered for this realm.</p>
                    </div>
                   )}
                </div>
            </section>

            {/* Books in this World */}
            <section className="mt-32">
              <div className={`flex flex-col md:flex-row items-end justify-between mb-16 gap-6 ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
                <div>
                  <h2 className={`text-4xl md:text-5xl font-black text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-cinematic uppercase tracking-wider'}`}>
                    {isRTL ? 'الكتب المتوفرة' : 'Universal Chronicles'}
                  </h2>
                  <p className="text-primary/40 font-bold uppercase tracking-wider text-xs">Explore all titles currently revealed from this world</p>
                </div>
              </div>

              {booksLoading ? (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {[1,2,3,4].map(i => <div key={i} className="aspect-[2/3] bg-primary/5 animate-pulse rounded-[2rem]" />)}
                 </div>
              ) : books && books.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                  {books.map((book, i) => (
                    <BookCard key={book.id} book={book} index={i} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                  <p className="text-primary/30 font-bold uppercase tracking-wider">No books have been announced for this world yet.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

