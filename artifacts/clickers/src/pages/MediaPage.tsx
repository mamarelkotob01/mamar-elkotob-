import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Music, Video, Clock, Filter, ExternalLink } from 'lucide-react';
import { useMedia, type Media } from '@/services/supabase.hooks';

const TYPE_CONFIG = {
  all: { label: 'الكل', labelEn: 'All', icon: Filter, color: 'text-primary', bg: 'bg-primary/5' },
  video: { label: 'المقاطع', labelEn: 'Videos', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
  music: { label: 'الموسيقى', labelEn: 'Music', icon: Music, color: 'text-purple-600', bg: 'bg-purple-50' },
  trailer: { label: 'الإعلانات', labelEn: 'Trailers', icon: Play, color: 'text-accent', bg: 'bg-accent/5' },
};

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function MediaPage() {
  const [filter, setFilter] = useState<'all' | 'video' | 'music' | 'trailer'>('all');
  const { data: media, isLoading } = useMedia(filter);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.h1 
            className="text-6xl md:text-8xl font-black text-primary/10 absolute -top-10 left-1/2 -translate-x-1/2 select-none tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            THE ARCHIVES
          </motion.h1>
          <motion.h2 
            className="text-5xl md:text-6xl font-black text-primary font-cinematic relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            الوسائط
          </motion.h2>
          <motion.p 
            className="text-primary/40 text-lg font-bold mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            إعلانات سينمائية وموسيقى تجريبية ومقاطع حصرية
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`
                  flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition-all
                  ${isActive 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                    : 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border text-primary/40 hover:text-primary hover:border-primary/30'}
                `}
              >
                <Icon size={16} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Media Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {(media ?? []).map((m: Media) => {
                const ytId = getYouTubeID(m.url);
                const cfg = TYPE_CONFIG[m.type as keyof typeof TYPE_CONFIG];
                const TypeIcon = cfg.icon;

                return (
                  <motion.div
                    key={m.id}
                    variants={item}
                    className="group"
                  >
                    <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                        {playingId === m.id ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <img 
                              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as any).src = `https://img.youtube.com/vi/${ytId}/0.jpg`;
                              }}
                            />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button 
                                onClick={() => setPlayingId(m.id)}
                                className="w-14 h-14 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl/90 backdrop-blur rounded-full flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500"
                              >
                                <Play fill="currentColor" size={24} className="ml-1" />
                              </button>
                            </div>
                            {/* Duration Badge */}
                            {m.duration && (
                              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1">
                                <Clock size={10} />
                                {m.duration}
                              </div>
                            )}
                            {/* Type Badge */}
                            <div className={`absolute top-3 right-3 ${cfg.bg} ${cfg.color} px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/20 shadow-lg`}>
                              <TypeIcon size={12} />
                              <span className="text-xs font-black uppercase tracking-wider">{cfg.label}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="text-primary font-black text-lg line-clamp-1 mb-2 font-cinematic leading-tight group-hover:text-accent transition-colors" dir="rtl">
                          {m.title_ar}
                        </h3>
                        <p className="text-primary/40 text-xs font-bold line-clamp-2 leading-relaxed h-8" dir="rtl">
                          {m.description_ar}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                          <button 
                            onClick={() => setPlayingId(m.id)}
                            className="text-xs font-black uppercase tracking-wider text-accent hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <Play size={10} fill="currentColor" />
                            {m.type === 'music' ? 'استماع' : 'مشاهدة'}
                          </button>
                          <a 
                            href={m.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary/20 hover:text-primary transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isLoading && (media ?? []).length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-primary/30"
          >
            <Video size={48} strokeWidth={1} className="mb-4" />
            <p className="font-black">لا توجد وسائط متاحة حالياً في هذا التصنيف</p>
          </motion.div>
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
