import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Clock, Tag, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { BookCard } from '@/components/BookCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { offers } from '@/services/mock/offers';
import { getBookById } from '@/services/mock/books';

function Countdown({ endDate }: { endDate: string }) {
  const { t, isRTL } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const units = [
    { value: timeLeft.days, label: t.offers.days },
    { value: timeLeft.hours, label: t.offers.hours },
    { value: timeLeft.minutes, label: t.offers.minutes },
    { value: timeLeft.seconds, label: t.offers.seconds },
  ];

  return (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="text-center">
            <div className="w-10 h-10 bg-maroon/5 border border-maroon/10 rounded-lg flex items-center justify-center">
              <span className="text-maroon font-bold text-sm font-mono">
                {String(value).padStart(2, '0')}
              </span>
            </div>
            <p className="text-maroon/40 text-xs mt-1">{label}</p>
          </div>
          {i < 3 && <span className="text-maroon font-bold mb-4">:</span>}
        </div>
      ))}
    </div>
  );
}

export function OffersPage() {
  const { t, isRTL, language } = useLanguage();

  const typeIcons = {
    bundle: Tag,
    seasonal: Clock,
    flash: Zap,
    launch: Zap,
  };

  const typeColors = {
    bundle: 'text-[hsl(270_55%_65%)] bg-[hsl(270_45%_12%)]',
    seasonal: 'text-[hsl(200_70%_60%)] bg-[hsl(200_50%_12%)]',
    flash: 'text-[hsl(45_85%_52%)] bg-[hsl(45_85%_52%/0.1)]',
    launch: 'text-[hsl(120_55%_50%)] bg-[hsl(120_55%_10%)]',
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.offers.title}
          subtitle={t.offers.subtitle}
        />

        <div className="space-y-6">
          {offers.map((offer, i) => {
            const Icon = typeIcons[offer.type];
            const offerBooks = offer.bookIds?.map(getBookById).filter(Boolean) || [];

            return (
              <motion.div
                key={offer.id}
                className="relative rounded-2xl overflow-hidden border border-border hover:border-maroon/25 transition-all duration-300 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`offer-${offer.id}`}
              >
                {/* Banner */}
                <div className="relative h-40 md:h-52 overflow-hidden">
                  <img
                    src={offer.bannerUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

                  <div className={`absolute inset-0 flex flex-col justify-center p-6 md:p-8 ${isRTL ? 'text-right items-end' : ''}`}>
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[offer.type]}`}>
                        <Icon size={12} />
                        {offer.type === 'flash' ? (language === 'ar' ? 'عرض البرق' : 'Flash Sale') :
                         offer.type === 'bundle' ? (language === 'ar' ? 'حزمة' : 'Bundle') :
                         offer.type === 'launch' ? (language === 'ar' ? 'إطلاق' : 'Launch') :
                         (language === 'ar' ? 'موسمي' : 'Seasonal')}
                      </span>
                      <span className="px-2.5 py-1 bg-[hsl(0_72%_51%/0.15)] border border-[hsl(0_72%_51%/0.3)] text-[hsl(0_72%_65%)] text-xs font-bold rounded-full">
                        -{offer.discountPercent}%
                      </span>
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold text-maroon mb-2 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                      {language === 'ar' ? offer.titleAr : offer.titleEn}
                    </h3>
                    <p className={`text-maroon/70 text-sm mb-4 max-w-lg ${isRTL ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? offer.descriptionAr : offer.descriptionEn}
                    </p>
                    <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-1.5 text-[hsl(240_5%_50%)] text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock size={12} />
                        <span>{t.offers.endsIn}:</span>
                        <Countdown endDate={offer.endDate} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-card">
                  <div className={`flex flex-wrap items-center justify-between gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {offer.code && (
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-maroon/60 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'كود الخصم:' : 'Promo Code:'}
                        </span>
                        <span className="px-3 py-1.5 bg-background border border-border text-maroon text-sm font-mono rounded-lg tracking-wider shadow-sm">
                          {offer.code}
                        </span>
                      </div>
                    )}
                    <motion.button
                      className="px-6 py-2.5 bg-gradient-to-r from-[hsl(45_85%_52%)] to-[hsl(40_90%_48%)] text-[hsl(240_15%_4%)] rounded-xl font-bold text-sm glow-gold"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      data-testid={`claim-offer-${offer.id}`}
                    >
                      {t.offers.claimOffer}
                    </motion.button>
                  </div>

                  {offerBooks.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[hsl(240_12%_12%)]">
                      {offerBooks.map((book, bi) => book && (
                        <BookCard key={book.id} book={book} index={bi} variant="compact" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
