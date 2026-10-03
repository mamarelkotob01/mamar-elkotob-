import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Star, BookOpen, Users } from 'lucide-react';
import { Author } from '@/services/mock/authors';
import { useLanguage } from '@/i18n/LanguageContext';

interface AuthorCardProps {
  author: Record<string, any>;
  index?: number;
}

export function AuthorCard({ author, index = 0 }: AuthorCardProps) {
  const { t, isRTL, language } = useLanguage();
  const name = language === 'ar' ? (author.name_ar || author.nameAr) : (author.name_en || author.nameEn);
  const bio = language === 'ar' ? (author.bio_ar || author.bioAr) : (author.bio_en || author.bioEn);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      data-testid={`card-author-${author.id}`}
    >
      <Link href={`/authors/${author.id}`}>
        <div className="cursor-pointer relative rounded-2xl overflow-hidden bg-card border border-border p-6 hover:border-maroon/30 hover:shadow-[0_8px_30px_hsl(342_63%_34%/0.1)] transition-all duration-300">
          <div className={`flex gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative flex-shrink-0">
              <img
                src={author.photo_url || author.imageUrl || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=400&q=80'}
                alt={name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[hsl(45_85%_52%/0.3)]"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[hsl(45_85%_52%)] rounded-full flex items-center justify-center">
                <Star size={10} fill="hsl(240 15% 4%)" className="text-[hsl(240_15%_4%)]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-maroon text-base mb-0.5 ${isRTL ? 'font-arabic text-right' : ''}`}>
                {name}
              </h3>
              <p className="text-maroon/60 text-xs">{author.nationality}</p>
              <div className={`flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {(author.genres || []).map((g: string) => (
                  <span key={g} className="px-1.5 py-0.5 bg-[hsl(270_45%_12%)] text-[hsl(270_55%_70%)] text-xs rounded-md">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className={`text-maroon/70 text-xs line-clamp-2 mb-4 ${isRTL ? 'font-arabic text-right' : ''}`}>
            {bio}
          </p>


        </div>
      </Link>
    </motion.div>
  );
}
