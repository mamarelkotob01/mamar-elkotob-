import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Bookmark, BookmarkCheck, ArrowLeft, ArrowRight,
  ChevronLeft, ChevronRight, Sun, Moon, Settings, List, X,
  Minus, Plus,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getBookById } from '@/services/mock/books';

type ReaderTheme = 'dark' | 'light' | 'golden';

const SAMPLE_CONTENT_AR = `في البداية كان الصمت.

لم يكن الصمت فراغاً — بل كان كياناً حياً، يتنفس ببطء في أعماق الكون الذي لم يتشكل بعد. كانت الظلال تسبح في مكان ما بين الوجود واللاوجود، ترسم خطوطاً لا ترى إلا حين تغمض العينان.

ثم جاء الضوء الأول.

ليس ذلك الضوء الذي يشق الظلام — بل ضوء يولد من قلب الظلام نفسه، كأن الكون أدرك أنه لا يمكنه أن يكون مكتملاً دون أن يحمل في داخله تناقضه الأول.

كايروس كان هناك. لم يكن قد اختار أن يكون — الوجود فرض نفسه عليه كما تفرض الأحلام نفسها على النائم. فتح عينيه على عالم لم يضع قواعده، ووجد نفسه يحمل وزن مصير لم يفهمه بعد.`;

const SAMPLE_CONTENT_EN = `In the beginning, there was silence.

Not empty silence — but a living entity, breathing slowly in the depths of a cosmos not yet formed. Shadows swam somewhere between existence and non-existence, drawing lines that can only be seen when eyes are closed.

Then came the first light.

Not that light which cleaves darkness — but a light born from the very heart of darkness itself, as if the universe realized it could not be complete without bearing within it its first contradiction.

Kairos was there. He had not chosen to be — existence imposed itself upon him as dreams impose themselves upon the sleeping. He opened his eyes to a world whose rules he had not set, and found himself carrying the weight of a destiny he did not yet understand.`;

const themes: Record<ReaderTheme, { bg: string; text: string; card: string; name: string }> = {
  dark: {
    bg: 'hsl(240 15% 4%)',
    text: 'hsl(45 20% 85%)',
    card: 'hsl(240 14% 7%)',
    name: 'dark',
  },
  light: {
    bg: 'hsl(40 20% 95%)',
    text: 'hsl(240 20% 15%)',
    card: 'hsl(40 20% 98%)',
    name: 'light',
  },
  golden: {
    bg: 'hsl(35 30% 8%)',
    text: 'hsl(45 60% 80%)',
    card: 'hsl(35 25% 10%)',
    name: 'golden',
  },
};

const MOCK_CHAPTERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  titleAr: `الفصل ${i + 1}: ${['البداية', 'الظلام', 'النور الأول', 'الصراع', 'الكشف', 'المواجهة', 'التحول', 'النهاية'][i]}`,
  titleEn: `Chapter ${i + 1}: ${['The Beginning', 'Darkness', 'First Light', 'The Conflict', 'Revelation', 'Confrontation', 'Transformation', 'The End'][i]}`,
}));

export function ReaderPage() {
  const { t, isRTL, language } = useLanguage();
  const [, params] = useRoute('/reader/:id');
  const book = getBookById(params?.id || 'b001');

  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [fontSize, setFontSize] = useState(18);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [readProgress] = useState(32);

  const currentTheme = themes[theme];
  const title = book ? (language === 'ar' ? book.titleAr : book.titleEn) : '';

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      {/* Reader Toolbar */}
      <motion.div
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: currentTheme.card,
          borderColor: theme === 'dark' ? 'hsl(240 12% 14%)' : 'hsl(240 12% 88%)',
        }}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`max-w-4xl mx-auto px-4 py-3 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left: Back + Title */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href={book ? `/book/${book.id}` : '/'}>
              <motion.button
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: currentTheme.text }}
                whileHover={{ scale: 1.05 }}
                data-testid="reader-back"
              >
                {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              </motion.button>
            </Link>
            <div>
              <p
                className={`font-semibold text-sm ${isRTL ? 'font-arabic text-right' : ''}`}
                style={{ color: currentTheme.text }}
              >
                {title}
              </p>
              <p className={`text-xs opacity-50 ${isRTL ? 'font-arabic text-right' : ''}`}>
                {MOCK_CHAPTERS[currentChapter - 1][language === 'ar' ? 'titleAr' : 'titleEn']}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Bookmark */}
            <motion.button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 rounded-lg hover:opacity-70 transition-all"
              style={{ color: isBookmarked ? 'hsl(45 85% 52%)' : currentTheme.text }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="reader-bookmark"
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </motion.button>

            {/* Table of Contents */}
            <motion.button
              onClick={() => setShowTOC(!showTOC)}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: showTOC ? 'hsl(45 85% 52%)' : currentTheme.text }}
              whileHover={{ scale: 1.05 }}
              data-testid="reader-toc"
            >
              <List size={18} />
            </motion.button>

            {/* Settings */}
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: showSettings ? 'hsl(45 85% 52%)' : currentTheme.text }}
              whileHover={{ scale: 1.05 }}
              data-testid="reader-settings"
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: theme === 'dark' ? 'hsl(240 12% 12%)' : 'hsl(240 10% 90%)' }}>
          <motion.div
            className="h-full bg-gradient-to-r from-[hsl(45_85%_52%)] to-[hsl(40_90%_48%)]"
            initial={{ width: 0 }}
            animate={{ width: `${readProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6"
              style={{ backgroundColor: currentTheme.card }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`font-bold text-base ${isRTL ? 'font-arabic' : ''}`} style={{ color: currentTheme.text }}>
                  {t.reader.theme} & {t.reader.fontSize}
                </h3>
                <button onClick={() => setShowSettings(false)} style={{ color: currentTheme.text }} className="opacity-60 hover:opacity-100">
                  <X size={18} />
                </button>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <p className={`text-xs opacity-60 mb-3 ${isRTL ? 'font-arabic text-right' : ''}`} style={{ color: currentTheme.text }}>
                  {t.reader.fontSize}
                </p>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setFontSize((f) => Math.max(14, f - 2))}
                    className="w-9 h-9 rounded-lg border flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{ borderColor: 'hsl(240 12% 25%)', color: currentTheme.text }}
                    data-testid="reader-font-decrease"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center font-mono text-sm" style={{ color: currentTheme.text }}>
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize((f) => Math.min(28, f + 2))}
                    className="w-9 h-9 rounded-lg border flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{ borderColor: 'hsl(240 12% 25%)', color: currentTheme.text }}
                    data-testid="reader-font-increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <p className={`text-xs opacity-60 mb-3 ${isRTL ? 'font-arabic text-right' : ''}`} style={{ color: currentTheme.text }}>
                  {t.reader.theme}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['dark', 'light', 'golden'] as ReaderTheme[]).map((th) => (
                    <button
                      key={th}
                      onClick={() => setTheme(th)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        theme === th ? 'border-[hsl(45_85%_52%)]' : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                      style={{ backgroundColor: themes[th].bg }}
                      data-testid={`reader-theme-${th}`}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: themes[th].text, opacity: 0.7 }}
                      />
                      <span className="text-xs" style={{ color: themes[th].text }}>
                        {th === 'dark' ? t.reader.darkTheme : th === 'light' ? t.reader.lightTheme : t.reader.goldenTheme}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table of Contents */}
      <AnimatePresence>
        {showTOC && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTOC(false)} />
            <motion.div
              className={`relative z-10 h-full w-72 p-6 overflow-y-auto ${isRTL ? 'border-l' : 'border-r'}`}
              style={{ backgroundColor: currentTheme.card, borderColor: 'hsl(240 12% 16%)' }}
              initial={{ x: isRTL ? -300 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRTL ? -300 : 300, opacity: 0 }}
            >
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`font-bold text-base ${isRTL ? 'font-arabic' : ''}`} style={{ color: currentTheme.text }}>
                  {t.reader.tableOfContents}
                </h3>
                <button onClick={() => setShowTOC(false)} style={{ color: currentTheme.text }} className="opacity-60 hover:opacity-100">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1">
                {MOCK_CHAPTERS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => { setCurrentChapter(ch.id); setShowTOC(false); }}
                    className={`w-full p-3 rounded-xl text-sm transition-all duration-200 ${isRTL ? 'text-right font-arabic' : 'text-left'} ${
                      ch.id === currentChapter ? 'bg-[hsl(45_85%_52%/0.15)]' : 'hover:opacity-80'
                    }`}
                    style={{ color: ch.id === currentChapter ? 'hsl(45 85% 52%)' : currentTheme.text }}
                    data-testid={`toc-chapter-${ch.id}`}
                  >
                    {language === 'ar' ? ch.titleAr : ch.titleEn}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <motion.div
          key={`${currentChapter}-${theme}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Chapter header */}
          <div className={`mb-10 ${isRTL ? 'text-right' : 'text-center'}`}>
            <p className="text-xs font-medium mb-2 opacity-40 uppercase tracking-wider" style={{ color: currentTheme.text }}>
              {language === 'ar' ? 'الفصل' : 'Chapter'} {currentChapter}
            </p>
            <h2
              className={`text-2xl sm:text-3xl font-bold mb-1 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}
              style={{ color: currentTheme.text }}
            >
              {MOCK_CHAPTERS[currentChapter - 1][language === 'ar' ? 'titleAr' : 'titleEn']}
            </h2>
            <div className="w-12 h-px bg-[hsl(45_85%_52%)] mx-auto mt-4" />
          </div>

          {/* Content */}
          <div
            className={`leading-loose prose max-w-none ${isRTL ? 'font-arabic text-right' : 'font-serif'}`}
            style={{ fontSize: `${fontSize}px`, color: currentTheme.text, lineHeight: '2.2' }}
          >
            {(language === 'ar' ? SAMPLE_CONTENT_AR : SAMPLE_CONTENT_EN).split('\n\n').map((para, i) => (
              <p key={i} className="mb-6">
                {para}
              </p>
            ))}
          </div>

          {/* Progress info */}
          <div className={`flex items-center gap-2 mt-10 opacity-40 text-xs ${isRTL ? 'flex-row-reverse justify-end' : ''}`} style={{ color: currentTheme.text }}>
            <BookOpen size={12} />
            <span>{readProgress}% {isRTL ? 'مكتمل' : 'complete'}</span>
          </div>
        </motion.div>

        {/* Chapter Navigation */}
        <div className={`flex items-center justify-between mt-16 pt-8 border-t ${isRTL ? 'flex-row-reverse' : ''}`} style={{ borderColor: theme === 'dark' ? 'hsl(240 12% 12%)' : 'hsl(240 10% 88%)' }}>
          <motion.button
            onClick={() => setCurrentChapter((c) => Math.max(1, c - 1))}
            disabled={currentChapter === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: currentTheme.text, backgroundColor: theme === 'dark' ? 'hsl(240 12% 10%)' : 'hsl(240 10% 92%)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            data-testid="reader-prev-chapter"
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t.reader.prevChapter}
          </motion.button>

          <span className="text-xs opacity-40" style={{ color: currentTheme.text }}>
            {currentChapter} / {MOCK_CHAPTERS.length}
          </span>

          <motion.button
            onClick={() => setCurrentChapter((c) => Math.min(MOCK_CHAPTERS.length, c + 1))}
            disabled={currentChapter === MOCK_CHAPTERS.length}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: currentTheme.text, backgroundColor: theme === 'dark' ? 'hsl(240 12% 10%)' : 'hsl(240 10% 92%)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            data-testid="reader-next-chapter"
          >
            {t.reader.nextChapter}
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
