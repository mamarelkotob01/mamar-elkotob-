import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  align?: 'start' | 'center';
}

export function SectionHeader({ title, subtitle, viewAllHref, align = 'start' }: SectionHeaderProps) {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div
      className={`relative flex items-end justify-between mb-16 gap-6 ${align === 'center' ? 'flex-col items-center text-center' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col gap-3">
        <motion.div 
          className="h-1 w-12 bg-accent rounded-full mb-1" 
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          transition={{ delay: 0.3, duration: 1 }}
        />
        <h2 className={`text-3xl md:text-5xl font-black text-primary leading-tight tracking-tight ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-primary/50 text-base md:text-lg max-w-xl leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>
      
      {viewAllHref && align !== 'center' && (
        <Link href={viewAllHref}>
          <motion.span
            className={`group inline-flex items-center gap-3 text-accent text-sm font-bold whitespace-nowrap cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span className="relative">
              {t.common.viewAll}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </span>
            <motion.div
              animate={{ x: isRTL ? [0, -4, 0] : [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </motion.div>
          </motion.span>
        </Link>
      )}
    </motion.div>
  );
}
