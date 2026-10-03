import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import type { World } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';

interface WorldCardProps {
  world: World;
  index?: number;
}

export function WorldCard({ world, index = 0 }: WorldCardProps) {
  const { t, isRTL, language } = useLanguage();

  const name = language === 'ar' ? world.name_ar : world.name_en;
  const description = language === 'ar' ? world.description_ar : world.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative cinematic-glow"
      data-testid={`card-world-${world.id}`}
    >
      <Link href={`/worlds/${world.id}`}>
        <div className="cursor-pointer relative rounded-[2.5rem] overflow-hidden aspect-[16/10] bg-primary/20 transition-all duration-700 hover:scale-[1.01] hover:shadow-[0_40px_80px_-20px_rgba(139,29,61,0.5)] border border-white/5">
          {/* Background Image */}
          {world.banner_url ? (
            <img
              src={world.banner_url}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: world.color_primary || '#8B1D3D' }} />
          )}
          
          {/* Sophisticated Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Animated Glow depending on world color */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
            style={{ background: `radial-gradient(circle at center, ${world.color_primary || '#8B1D3D'} 0%, transparent 70%)` }}
          />

          {/* Top Detail Badge - Styled for Premium feel */}
          <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
             <div className="flex items-center gap-3 px-5 py-2.5 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <BookOpen size={14} className="text-accent" />
                <span className="text-white text-xs font-black tracking-wider uppercase">
                  {t.worlds.books}
                </span>
             </div>
          </div>

          {/* Content Area */}
          <div className={`absolute inset-0 flex flex-col justify-end p-10 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className={`text-accent font-black text-xs tracking-[0.4em] uppercase mb-3 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
              {isRTL ? 'أكوان قصصية' : 'Narrative Universe'}
            </span>
            <h3 className={`font-black text-3xl md:text-4xl text-white mb-4 group-hover:tracking-wide transition-all duration-500 leading-tight ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
              {name}
            </h3>
            <p className={`text-white/60 text-base line-clamp-2 mb-8 max-w-sm ${isRTL ? 'font-arabic ml-auto' : 'mr-auto'} transition-colors group-hover:text-white/80 leading-relaxed`}>
              {description}
            </p>

            <motion.div
              className={`inline-flex items-center gap-4 text-accent text-sm font-black uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className="relative">
                {t.worlds.explore}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
              </span>
              <motion.div
                animate={{ x: isRTL ? [0, -4, 0] : [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
