import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookOpen, Award, Sparkles, Heart, Feather, Globe, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { SEO } from '@/components/SEO';

const GOLD = '#c8a84b';
const GOLD_LIGHT = '#f0e0c0';

export function AboutPage() {
  const { isRTL, language } = useLanguage();

  return (
    <>
      <SEO 
        title={isRTL ? 'من نحن | دار ممر الكتب للنشر والتوزيع' : 'About Us | Mamar Elkotob Publishing'}
        description={isRTL ? 'تعرف على دار ممر الكتب للنشر والتوزيع، الدار الرائدة ومؤسستها حلا المنشاوي في دعم الأدب والإبداع.' : 'Learn about Mamar Elkotob Publishing House and founder Hala Al-Minshawi.'}
      />

      <div className="min-h-screen pt-32 pb-32 bg-transparent text-primary overflow-hidden">
        {/* Background Subtle Glows */}
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 blur-[140px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* ─── HERO HEADER ────────────────────────────────────────────── */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-accent/30 bg-accent/10 mb-6 backdrop-blur-md"
            >
              <Sparkles size={16} style={{ color: GOLD }} />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                {isRTL ? 'رحلة الفكر والإبداع' : 'Journey of Thought & Creativity'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}
              style={{ color: GOLD_LIGHT }}
            >
              {isRTL ? (
                <>
                  دار ممر الكتب <span style={{ color: GOLD }}>للنشر والتوزيع</span>
                </>
              ) : (
                <>
                  Mamar Elkotob <span style={{ color: GOLD }}>Publishing House</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary/80 leading-relaxed font-arabic"
            >
              {isRTL
                ? 'ممرٌ عبَر منه مئات الكُتاب والمبدعين نحو عالم الكلمة والضوء.. صرحٌ ثقافي تأسس ليصنع فارقاً في عالم النشر العربي وليحتضن كل فكرة تستحق أن تُقرأ.'
                : 'A corridor through which hundreds of authors and creators step into the world of literature and light. A cultural cornerstone built to transform Arabic publishing.'}
            </motion.p>
          </div>

          {/* ─── FOUNDER SECTION (حلا المنشاوي) ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-28 relative"
          >
            <div className="bg-card/60 backdrop-blur-xl border border-card-border/60 rounded-[3rem] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Founder Visual Card */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-accent to-yellow-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-500" />
                    <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-[2.2rem] overflow-hidden bg-gradient-to-b from-[#2a1b0e] to-[#120904] border border-accent/40 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
                      <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center mb-6 shadow-inner text-accent">
                        <Feather size={44} />
                      </div>
                      <h3 className="text-2xl font-black text-primary font-arabic mb-1" style={{ color: GOLD_LIGHT }}>
                        حلا المنشاوي
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                        {isRTL ? 'مؤسِسة دار ممر الكتب' : 'Founder of Mamar Elkotob'}
                      </p>
                      <div className="h-0.5 w-16 bg-accent/40 rounded-full mb-4" />
                      <p className="text-xs text-primary/70 italic font-arabic leading-relaxed">
                        "الكلمة أمانة، وممر الكتب هو البيت الذي يُراعي هذه الأمانة بكل حب وشغف."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Founder Content */}
                <div className={`lg:col-span-7 ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                  <div className="inline-flex items-center gap-2 text-accent font-bold text-sm mb-4">
                    <Heart size={18} />
                    <span>{isRTL ? 'رؤية المؤسس' : "Founder's Vision"}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-snug" style={{ color: GOLD_LIGHT }}>
                    {isRTL ? (
                      <>
                        عن المؤسسة <span style={{ color: GOLD }}>حلا المنشاوي</span>
                      </>
                    ) : (
                      <>
                        About Founder <span style={{ color: GOLD }}>Hala Al-Minshawi</span>
                      </>
                    )}
                  </h2>

                  <div className="space-y-4 text-primary/80 text-base sm:text-lg leading-relaxed">
                    <p>
                      تأسست <strong>دار ممر الكتب للنشر والتوزيع</strong> بشغف ورؤية ثاقبة من المؤسِسة <strong>حلا المنشاوي</strong>، والتي آمنت منذ البداية بأن الكتاب ليس مجرد أوراق مطبوعة، بل هو تجربة إنسانية وفريدة تحمل روح كاتبها وتبني جسوراً من الوعي والإلهام.
                    </p>
                    <p>
                      بقلمها وفكرها وإيمانها العميق بطاقات الشباب والكتّاب، قادت <strong>حلا المنشاوي</strong> الدار لتكون منارة أدبية تحتفي بالإبداع والتنوع، وتوفر للكتّاب بيئة داعمة ترافقهم في كافة مراحل صناعة الكتاب: من الفكرة والمراجعة والتنسيق، وحتى الإخراج الفني الراقي والطباعة والتوزيع الواسع في المعارض المحلية والدولية.
                    </p>
                    <p>
                      وتحرص المؤسِسة دائماً على تقديم نموذج نشر يتسم بالشفافية والاحترافية، مع الحفاظ على الهوية الأدبية لكل إصدار، لتبقى دار ممر الكتب علامة فارقة في عالم النشر العربي.
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-card-border/50">
                    <div className="p-4 rounded-2xl bg-card/40 border border-card-border/40 text-center">
                      <div className="text-accent font-black text-2xl mb-1">+100</div>
                      <div className="text-xs font-bold text-primary/70">{isRTL ? 'إصدار أدبي' : 'Published Titles'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/40 border border-card-border/40 text-center">
                      <div className="text-accent font-black text-2xl mb-1">100%</div>
                      <div className="text-xs font-bold text-primary/70">{isRTL ? 'دعم وتوجيه' : 'Author Support'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/40 border border-card-border/40 text-center col-span-2 sm:col-span-1">
                      <div className="text-accent font-black text-2xl mb-1">دولية</div>
                      <div className="text-xs font-bold text-primary/70">{isRTL ? 'مشاركات المعارض' : 'Book Fairs'}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* ─── OUR PILLARS / VALUES ────────────────────────────────────── */}
          <div className="mb-28">
            <div className="text-center mb-16">
              <h2 className={`text-3xl sm:text-5xl font-black mb-4 ${isRTL ? 'font-arabic' : 'font-cinematic'}`} style={{ color: GOLD_LIGHT }}>
                {isRTL ? 'ركائز دار ممر الكتب' : 'Our Core Pillars'}
              </h2>
              <p className="text-primary/70 max-w-2xl mx-auto font-arabic text-base sm:text-lg">
                {isRTL ? 'نلتزم بقيم وأسس تجعل تجربة النشر والقراءة تجربة فريدة ومتميزة' : 'Core values driving our publishing excellence.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-card-border/50 hover:border-accent/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-bold font-arabic mb-3" style={{ color: GOLD_LIGHT }}>
                  {isRTL ? 'جودة وتأنٍ في النشر' : 'High Quality Standards'}
                </h3>
                <p className="text-primary/70 font-arabic text-sm leading-relaxed">
                  {isRTL 
                    ? 'نهتم بكل تفصيلة في الكتاب؛ من التدقيق اللغوي الدقيق والتنسيق الداخلي الأنيق، إلى أحدث تقنيات تصميم الغلاف والطباعة.' 
                    : 'Meticulous proofreading, elegant interior formatting, and world-class cover design.'}
                </p>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-card-border/50 hover:border-accent/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold font-arabic mb-3" style={{ color: GOLD_LIGHT }}>
                  {isRTL ? 'احتضان المواهب' : 'Nurturing Talent'}
                </h3>
                <p className="text-primary/70 font-arabic text-sm leading-relaxed">
                  {isRTL 
                    ? 'نؤمن بالأقلام الشابة والواعدة ونوفر لها الفرصة الكاملة للظهور والوصول للمجتمع القارئ بكل احترام وتقدير.' 
                    : 'Providing emerging authors with a dedicated platform to reach avid readers across the region.'}
                </p>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-card-border/50 hover:border-accent/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Globe size={32} />
                </div>
                <h3 className="text-xl font-bold font-arabic mb-3" style={{ color: GOLD_LIGHT }}>
                  {isRTL ? 'انتشار وتوزيع واسع' : 'Widespread Distribution'}
                </h3>
                <p className="text-primary/70 font-arabic text-sm leading-relaxed">
                  {isRTL 
                    ? 'حضور دائم ومميز في معرض القاهرة الدولي للكتاب والمعارض الدولية، إلى جانب التوزيع الرقمي والمكتبات الشريكة.' 
                    : 'Active participation in international book fairs and digital distribution channels.'}
                </p>
              </motion.div>
            </div>
          </div>

          {/* ─── CALL TO ACTION ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-10 sm:p-16 rounded-[3rem] bg-gradient-to-br from-[#24150a] via-[#1a0f07] to-[#0d0602] border border-accent/40 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <BookOpen size={48} className="mx-auto mb-6 text-accent" />
              <h2 className={`text-3xl sm:text-5xl font-black mb-6 ${isRTL ? 'font-arabic' : 'font-cinematic'}`} style={{ color: GOLD_LIGHT }}>
                {isRTL ? 'هل تملك كتاباً ترغب في نشره؟' : 'Have a Manuscript Ready to Publish?'}
              </h2>
              <p className="text-primary/80 font-arabic text-base sm:text-xl mb-10 leading-relaxed">
                {isRTL 
                  ? 'انضم إلى عائلة ممر الكتب اليوم ودعنا نرافقك خطوة بخطوة لنرى عملك الأدبي يرى النور بين أيدي القراء.'
                  : 'Join Mamar Elkotob family today and let us take your literary creation to readers everywhere.'}
              </p>

              <div className={`flex flex-wrap gap-4 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link href="/auth">
                  <motion.span
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm cursor-pointer shadow-xl transition-all ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}
                    style={{ background: GOLD, color: '#1a0f05' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span>{isRTL ? 'انشر كتابك معنا' : 'Publish With Us'}</span>
                    {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </motion.span>
                </Link>

                <Link href="/store">
                  <motion.span
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm cursor-pointer border backdrop-blur-md transition-all ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}
                    style={{ border: '1px solid rgba(200,168,75,0.4)', color: GOLD_LIGHT, background: 'rgba(200,168,75,0.08)' }}
                    whileHover={{ scale: 1.05, background: 'rgba(200,168,75,0.18)' }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span>{isRTL ? 'تصفح الإصدارات' : 'Browse Releases'}</span>
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
