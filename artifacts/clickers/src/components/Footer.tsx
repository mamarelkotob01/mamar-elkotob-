import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t, isRTL } = useLanguage();

  const platformLinks = [
    { href: '/store', label: t.nav.store },
    { href: '/worlds', label: t.nav.worlds },
    { href: '/authors', label: t.nav.authors },
    { href: '/blog', label: t.nav.blog },
    { href: '/media', label: t.nav.media },
  ];

  const companyLinks = [
    { href: '/about', label: isRTL ? 'من نحن' : 'About Us' },
    { href: '/contact', label: isRTL ? 'تواصل معنا' : 'Contact Us' },
    { href: '/faq', label: isRTL ? 'الأسئلة الشائعة' : 'FAQ' },
    { href: '/shipping', label: isRTL ? 'الشحن والإرجاع' : 'Shipping & Returns' },
  ];

  const legalLinks = [
    { href: '/privacy', label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy' },
    { href: '/terms', label: isRTL ? 'شروط الخدمة' : 'Terms of Service' },
  ];

  return (
    <footer
      className="relative mt-24 text-primary"
      style={{
        background: 'linear-gradient(180deg, #1f1107 0%, #120904 100%)',
        borderTop: '1px solid rgba(200, 168, 75, 0.25)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,168,75,0.2) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/">
                <div className="flex items-center gap-4 mb-6 cursor-pointer w-fit group">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{ background: 'rgba(200, 168, 75, 0.15)', border: '1px solid rgba(200, 168, 75, 0.35)', color: '#c8a84b' }}
                  >
                    🚪
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-arabic font-black text-2xl md:text-3xl leading-none" style={{ color: '#f0e0c0' }}>
                      ممر الكتب
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.25em] font-cinematic font-bold" style={{ color: '#c8a84b' }}>
                      Dar Nashr
                    </span>
                  </div>
                </div>
              </Link>
              <p className={`text-sm leading-relaxed mb-8 max-w-[280px] ${isRTL ? 'font-arabic' : ''}`} style={{ color: 'rgba(240, 224, 192, 0.7)' }}>
                {t.footer.tagline}
              </p>
            </div>
            
            {/* Social Links */}
            <div className={`flex gap-4 ${isRTL ? 'justify-start' : 'justify-start'}`}>
              {[
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
                { icon: FaTiktok, href: '#', label: 'TikTok' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
                  style={{
                    background: 'rgba(200, 168, 75, 0.08)',
                    border: '1px solid rgba(200, 168, 75, 0.2)',
                    color: '#c8a84b',
                  }}
                  whileHover={{ y: -4, background: 'rgba(200, 168, 75, 0.2)', borderColor: '#c8a84b' }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-1">
            <h4 className={`font-bold text-[11px] mb-8 uppercase tracking-[0.2em] ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`} style={{ color: '#c8a84b' }}>
              {t.footer.platform}
            </h4>
            <ul className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {platformLinks.map((link: { href: string; label: string }) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span 
                      className={`font-bold text-[13px] transition-colors duration-300 cursor-pointer ${isRTL ? 'font-arabic' : ''}`}
                      style={{ color: 'rgba(240, 224, 192, 0.7)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#c8a84b')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240, 224, 192, 0.7)')}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-1">
            <h4 className={`font-bold text-[11px] mb-8 uppercase tracking-[0.2em] ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`} style={{ color: '#c8a84b' }}>
              {t.footer.company}
            </h4>
            <ul className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {companyLinks.map((link: { href: string; label: string }) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`font-bold text-[13px] transition-colors duration-300 ${isRTL ? 'font-arabic' : ''}`}
                    style={{ color: 'rgba(240, 224, 192, 0.7)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c8a84b')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240, 224, 192, 0.7)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
             <h4 className={`font-bold text-[11px] mb-8 uppercase tracking-[0.2em] ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`} style={{ color: '#c8a84b' }}>
              {t.footer.newsletter}
            </h4>
            <p className={`text-[13px] mb-6 leading-relaxed ${isRTL ? 'font-arabic text-right' : ''}`} style={{ color: 'rgba(240, 224, 192, 0.7)' }}>
              {t.footer.newsletterDesc}
            </p>
            <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
               <input
                  type="email"
                  placeholder={t.footer.emailPlaceholder}
                  className="w-full rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(10, 5, 2, 0.6)',
                    border: '1px solid rgba(200, 168, 75, 0.3)',
                    color: '#f0e0c0',
                  }}
                  data-testid="newsletter-email"
                />
                <button
                  className={`absolute top-1.5 bottom-1.5 px-6 rounded-xl text-xs font-bold transition-all ${isRTL ? 'left-1.5' : 'right-1.5'}`}
                  style={{ background: '#c8a84b', color: '#1a0f05' }}
                  data-testid="newsletter-subscribe"
                >
                  {t.footer.subscribe}
                </button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className={`flex flex-col md:flex-row items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <p className="text-[11px] font-bold uppercase tracking-wider leading-none" style={{ color: 'rgba(240, 224, 192, 0.5)' }}>
              {t.footer.copyright}
            </p>
            <div className="hidden md:block h-4 w-px bg-accent/20" />
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-[11px] font-bold uppercase tracking-wider transition-colors" style={{ color: 'rgba(240, 224, 192, 0.5)' }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
             <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className={`flex flex-col justify-center ${isRTL ? 'text-left' : 'text-right'}`}>
                  <span className="text-xs md:text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(240, 224, 192, 0.5)' }}>
                     {isRTL ? 'شريك الابتكار التكنولوجي' : 'Technology & Innovation Partner'}
                  </span>
                  <span className="text-[8px] md:text-[11px] uppercase tracking-[0.1em]" style={{ color: 'rgba(240, 224, 192, 0.3)' }}>
                     {isRTL ? 'تم التطوير والتصميم بواسطة' : 'Designed & Developed by'}
                  </span>
               </div>
               
               <div className="h-10 w-px bg-accent/20 hidden md:block" />
               
               <a href="#" className={`flex items-center gap-4 group transition-all duration-500 scale-100 hover:scale-105 origin-right ${isRTL ? 'flex-row-reverse origin-left' : ''}`}>
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(45,136,255,0.1)] border border-white/10 group-hover:border-[#2d88ff]/40 transition-[border-color,box-shadow,transform] duration-500">
                     <img src="/clickers-logo.jpg" alt="Clickers Creations" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-[#2d88ff]/0 group-hover:bg-[#2d88ff]/10 transition-colors duration-500 Mix-blend-overlay" />
                  </div>
                  <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="font-black text-white text-base md:text-lg uppercase tracking-[0.2em] group-hover:text-[#2d88ff] transition-colors duration-500 font-sans">
                       Clickers
                    </span>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-[0.4em] group-hover:text-white/60 transition-colors">
                       Creations
                    </span>
                  </div>
               </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
