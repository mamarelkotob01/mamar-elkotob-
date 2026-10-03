import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, ChevronRight, Share2, Facebook, Twitter, Link2 } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBlogPost } from '@/services/supabase.hooks';
import { Button } from '@/components/ui/button';
import { sanitizeHTML } from '@/lib/sanitize';

export function BlogPostDetail() {
  const [, params] = useRoute('/blog/:id');
  const { isRTL, language } = useLanguage();
  const { data: post, isLoading } = useBlogPost(params?.id);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center pt-32">
        <h2 className="text-3xl font-bold text-primary mb-4">Post not found</h2>
        <Link href="/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const title = language === 'ar' ? post.title_ar : post.title_en;
  const content = language === 'ar' ? post.content_ar : post.content_en;

  return (
    <div className="min-h-screen bg-transparent selection:bg-accent/30">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Header */}
      <header className="relative pt-32 md:pt-48 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-[#FDFBF7]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Link href="/blog">
              <button className="flex items-center gap-2 text-accent font-bold uppercase tracking-wider text-xs hover:gap-4 transition-all group">
                {isRTL ? <ChevronRight size={14} /> : <ArrowLeft size={14} />}
                <span>{isRTL ? 'العودة للمدونة' : 'Editorial News'}</span>
              </button>
            </Link>
            <div className="h-px w-8 bg-accent/30" />
            <span className="text-primary/40 font-bold uppercase tracking-wider text-xs">{post.category}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-7xl font-black text-primary leading-[1.1] mb-12 ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`}
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center gap-10 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-accent overflow-hidden">
                {post.authors?.photo_url ? (
                  <img src={post.authors.photo_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-black text-primary text-lg">
                   {language === 'ar' ? post.authors?.name_ar : post.authors?.name_en}
                </p>
                <p className="text-primary/40 font-bold text-xs uppercase tracking-wider">Article Author</p>
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden sm:block" />

            <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar size={18} className="text-accent" />
                <span className="text-primary/60 font-bold text-sm">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock size={16} className="text-accent" />
                <span className="text-primary/60 font-bold text-sm">{post.read_time} read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image_url && (
        <section className="px-4 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-[21/9] rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(139,29,61,0.2)]"
            >
              <img src={post.image_url} className="absolute inset-0 w-full h-full object-cover" alt="" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 pb-32 flex flex-col md:flex-row gap-16">
        {/* Social Share (Desktop Sidebar) */}
        <div className="hidden md:flex flex-col gap-6 sticky top-32 h-fit">
          <Button variant="outline" size="icon" className="rounded-2xl w-14 h-14 border-primary/10 hover:bg-accent hover:text-white transition-all transform hover:-rotate-12">
            <Facebook size={20} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl w-14 h-14 border-primary/10 hover:bg-accent hover:text-white transition-all transform hover:rotate-12">
            <Twitter size={20} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl w-14 h-14 border-primary/10 hover:bg-accent hover:text-white transition-all">
            <Link2 size={20} />
          </Button>
          <div className="h-20 w-px bg-border mx-auto" />
          <span className="[writing-mode:vertical-lr] text-xs font-black uppercase tracking-wider text-primary/20 rotate-180">Share Story</span>
        </div>

        {/* Main Text Content */}
        <div className="flex-1 min-w-0">
          <div 
            className={`
              prose prose-stone prose-2xl max-w-none 
              prose-headings:text-primary prose-headings:font-cinematic prose-headings:font-black
              prose-p:text-primary/70 prose-p:leading-[1.8] prose-p:text-xl
              prose-blockquote:border-l-accent prose-blockquote:bg-accent/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic
              prose-strong:text-primary prose-strong:font-black
              prose-img:rounded-[2rem] prose-img:shadow-2xl
              break-words overflow-wrap-anywhere hyphens-auto
              ${isRTL ? 'font-arabic text-right prose-p:text-2xl' : 'font-cinematic'}
              article-dropcap
            `}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content || '') }}
          />

          {/* Footer Tags/Credits */}
          <div className="mt-24 pt-12 border-t border-border flex flex-wrap items-center justify-between gap-8">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-primary/40 font-bold uppercase tracking-wider text-xs">Category:</span>
              <span className="px-4 py-1 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-wider">{post.category}</span>
            </div>
            
            <Button variant="outline" className="rounded-2xl gap-3 font-bold border-primary/10 px-8 py-6 h-auto hover:bg-primary hover:text-white transition-all duration-500">
              <Share2 size={18} />
              <span>Share this insight</span>
            </Button>
          </div>
        </div>
      </article>

      {/* CSS Overrides for DropCap and enhanced spacing */}
      <style>{`
        .article-dropcap p:first-of-type::first-letter {
          float: ${isRTL ? 'right' : 'left'};
          font-size: 5rem;
          line-height: 1;
          margin-top: 0.15em;
          margin-${isRTL ? 'left' : 'right'}: 0.2em;
          color: var(--color-accent);
          font-weight: 900;
        }
        
        /* Ensure normal behavior for RTL Arabic dropcaps (often disabled or styled differently) */
        ${isRTL ? '.article-dropcap p:first-of-type::first-letter { font-size: 2.5rem; float: none; margin: 0; }' : ''}

        .prose p {
          margin-bottom: 2.5rem !important;
        }

        /* Prevent overflow for long strings */
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
}

