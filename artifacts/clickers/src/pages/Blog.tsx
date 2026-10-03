import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBlogPosts } from '@/services/supabase.hooks';

export default function Blog() {
  const { t, isRTL, language } = useLanguage();
  const { data: posts, isLoading } = useBlogPosts({ status: 'published' });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const blogPosts = posts || [];
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold text-primary mb-4">{isRTL ? 'لا توجد مقالات حالياً' : 'No posts yet'}</h2>
           <p className="text-primary/60">{isRTL ? 'عد إلينا قريباً لمتابعة أحدث أخبار الدار.' : 'Check back soon for the latest literary insights.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-accent/40" />
            <span className="text-accent font-bold uppercase tracking-[0.4em] text-xs">
              {isRTL ? 'مدونة الدار' : 'Editorial Journal'}
            </span>
            <div className="h-px w-10 bg-accent/40" />
          </div>
          <h1 className={`text-5xl md:text-8xl font-black text-primary mb-8 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
            {t.nav.blog}
          </h1>
          <p className={`text-primary/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL 
              ? 'رحلة بين الكلمات، وفصول من المعرفة بانتظارك.'
              : 'A journey between words, and chapters of knowledge awaiting you.'}
          </p>
        </motion.div>

        {/* Featured Story */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`}>
            <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
               className="relative rounded-[4rem] overflow-hidden bg-primary shadow-[0_60px_100px_-20px_rgba(139,29,61,0.4)] mb-32 group cursor-pointer"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                    <img 
                       src={featuredPost.image_url || undefined} 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                       alt=""
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-700" />
                 </div>
                 <div className="p-12 md:p-20 flex flex-col justify-center bg-primary text-primary-foreground">
                    <span className="text-accent font-bold tracking-wider text-xs uppercase mb-6 block">Featured Story</span>
                    <h2 className={`text-4xl md:text-6xl font-bold mb-8 group-hover:text-accent transition-colors leading-[1.1] ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                       {language === 'ar' ? featuredPost.title_ar : featuredPost.title_en}
                    </h2>
                    <p className={`text-primary-foreground/60 text-lg mb-12 line-clamp-3 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                       {language === 'ar' ? featuredPost.excerpt_ar : featuredPost.excerpt_en}
                    </p>
                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <div className="w-14 h-14 rounded-2xl bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl/10 flex items-center justify-center text-accent">
                          {featuredPost.authors?.photo_url ? (
                            <img src={featuredPost.authors.photo_url} className="w-full h-full object-cover rounded-2xl" alt="" />
                          ) : (
                            <User size={24} />
                          )}
                       </div>
                       <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="font-bold text-white text-lg">
                            {language === 'ar' ? featuredPost.authors?.name_ar : featuredPost.authors?.name_en}
                          </p>
                          <p className="text-primary-foreground/40 text-sm font-bold uppercase tracking-wider">
                            {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main List */}
          <div className="lg:col-span-2 flex flex-col gap-24">
            {remainingPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative cinematic-glow cursor-pointer"
                >
                  <div className="flex flex-col gap-10">
                    <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(139,29,61,0.3)]">
                        <img 
                          src={post.image_url || undefined} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          alt="" 
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <div className={`flex items-center gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-accent font-bold uppercase tracking-[0.2em] text-xs">{post.category}</span>
                          <div className="h-4 w-px bg-border" />
                          <span className="text-primary/40 font-bold text-xs uppercase tracking-wider">{post.read_time} {isRTL ? 'قراءة' : 'Read'}</span>
                        </div>
                        <h3 className={`text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug group-hover:text-accent transition-colors ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                          {language === 'ar' ? post.title_ar : post.title_en}
                        </h3>
                        <p className={`text-primary/60 text-lg line-clamp-2 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? post.excerpt_ar : post.excerpt_en}
                        </p>
                        <div className={`flex items-center gap-3 text-primary font-bold group-hover:gap-5 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span>{isRTL ? 'اقرأ المزيد' : 'Read Full Story'}</span>
                          {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                        </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:border-l lg:border-border lg:pl-16">
            <div className="sticky top-32">
              <h3 className={`text-2xl font-black text-primary mb-12 uppercase tracking-wider leading-none ${isRTL ? 'font-arabic text-right mb-12' : 'font-cinematic'}`}>
                {isRTL ? 'الأكثر قراءة' : 'Trending'}
              </h3>
              <div className="flex flex-col gap-12">
                {blogPosts.slice(0, 4).map((post, i) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <motion.div 
                      className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''} group cursor-pointer`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-5xl font-black text-accent/10 font-cinematic leading-none group-hover:text-accent/30 transition-colors">0{i+1}</span>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="text-accent font-bold text-\[11px\] uppercase tracking-wider mb-1">{post.category}</p>
                        <h4 className={`text-base font-bold text-primary mb-2 group-hover:text-accent transition-colors leading-snug ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? post.title_ar : post.title_en}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs font-bold text-primary/30 uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span>{language === 'ar' ? post.authors?.name_ar : post.authors?.name_en}</span>
                          <div className="w-1 h-1 rounded-full bg-border" />
                          <span>{post.read_time}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
