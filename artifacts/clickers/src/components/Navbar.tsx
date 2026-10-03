import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/useAuth';
import { useCart } from '@/contexts/CartContext';

// ── NAV LINK CONFIG ──────────────────────────────────────────────
const NAV_LINKS_AR = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'من نحن' },
  { href: '/store', label: 'الإصدارات' },
  { href: '/authors', label: 'المؤلفون' },
  { href: '/auth', label: 'انشر كتابك معنا' },
  { href: '/blog', label: 'الأخبار والفعاليات' },
  { href: '/worlds', label: 'المعارض' },
  { href: '/store', label: 'تواصل معنا' },
];

const NAV_LINKS_EN = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/store', label: 'Releases' },
  { href: '/authors', label: 'Authors' },
  { href: '/auth', label: 'Publish With Us' },
  { href: '/blog', label: 'News & Events' },
  { href: '/worlds', label: 'Exhibitions' },
  { href: '/store', label: 'Contact Us' },
];

const GOLD = '#c8a84b';
const GOLD_DIM = 'rgba(200,168,75,0.7)';
const DARK_BG = 'rgba(10,5,2,0.82)';

export function Navbar() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { profile, isAdmin, signOut } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [location] = useLocation();

  const navLinks = isRTL ? NAV_LINKS_AR : NAV_LINKS_EN;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setShowUserMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isScrolled ? DARK_BG : 'rgba(10,5,2,0.6)',
          backdropFilter: 'blur(12px)',
          borderBottom: isScrolled ? '1px solid rgba(200,168,75,0.12)' : 'none',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-14 md:h-16 gap-4">

            {/* ── Logo ── */}
            <Link href="/">
              <motion.div
                className={`flex items-center gap-2.5 cursor-pointer flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
                whileHover={{ scale: 1.02 }}
                data-testid="nav-logo"
              >
                {/* Door icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0"
                  style={{ background: 'rgba(200,168,75,0.15)', border: '1px solid rgba(200,168,75,0.3)', color: GOLD }}
                >
                  🚪
                </div>
                {/* Text */}
                <div className={`flex flex-col leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span
                    className="font-arabic font-black text-base md:text-lg leading-tight"
                    style={{ color: '#f0e0c0' }}
                  >
                    ممر الكتب
                  </span>
                  <span
                    className="font-arabic text-[10px] tracking-wider mt-0.5"
                    style={{ color: GOLD_DIM }}
                  >
                    دار نشر
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* ── Desktop Nav Links (center) ── */}
            <div className="hidden lg:flex items-center gap-0 flex-1 justify-center">
              {navLinks.map((link) => {
                const isActive = location === link.href && link.href === '/';
                return (
                  <Link key={link.label} href={link.href}>
                    <motion.span
                      className={`relative px-3 py-1.5 text-[12.5px] font-medium cursor-pointer transition-colors duration-200 font-arabic whitespace-nowrap ${
                        isActive ? 'font-bold' : ''
                      }`}
                      style={{ color: isActive ? '#f0e0c0' : GOLD_DIM }}
                      whileHover={{ color: '#f0e0c0' }}
                      data-testid={`nav-link-${link.label}`}
                    >
                      {link.label}
                      {/* Active underline */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-indicator"
                          className="absolute bottom-0 left-2 right-2 h-px rounded-full"
                          style={{ background: GOLD }}
                        />
                      )}
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right actions ── */}
            <div className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>

              {/* Cart icon */}
              <motion.button
                className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
                style={{ color: GOLD_DIM }}
                whileHover={{ color: '#f0e0c0', scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                data-testid="cart-button"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-black rounded-full flex items-center justify-center"
                    style={{ background: GOLD, color: '#1a0f05' }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Language toggle */}
              <motion.button
                onClick={toggleLanguage}
                className="hidden md:flex text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                style={{ color: GOLD_DIM, border: '1px solid rgba(200,168,75,0.2)' }}
                whileHover={{ color: GOLD, borderColor: 'rgba(200,168,75,0.5)' }}
              >
                {isRTL ? 'EN' : 'عربي'}
              </motion.button>

              {/* User menu or auth */}
              {profile ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.span
                        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black cursor-pointer font-arabic"
                        style={{ background: 'rgba(200,168,75,0.18)', border: '1px solid rgba(200,168,75,0.4)', color: GOLD }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <LayoutDashboard size={14} />
                        {isRTL ? 'لوحة التحكم' : 'Admin'}
                      </motion.span>
                    </Link>
                  )}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <motion.button
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
                      style={{ border: '1px solid rgba(200,168,75,0.25)', color: '#f0e0c0' }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      whileTap={{ scale: 0.96 }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: GOLD, color: '#1a0f05' }}
                      >
                        {profile.email[0].toUpperCase()}
                      </div>
                      <span className="hidden md:block text-xs font-bold max-w-[80px] truncate font-arabic">
                        {profile.full_name || profile.email.split('@')[0]}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-48 rounded-xl overflow-hidden z-50 shadow-2xl`}
                          style={{ background: 'rgba(20,10,3,0.97)', border: '1px solid rgba(200,168,75,0.2)' }}
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(200,168,75,0.1)' }}>
                            <p className="font-bold text-sm truncate font-arabic" style={{ color: '#f0e0c0' }}>{profile.full_name || 'قارئ'}</p>
                            <p className="text-xs truncate" style={{ color: GOLD_DIM }}>{profile.email}</p>
                          </div>
                          <div className="p-2">
                            <Link href="/my-orders">
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all font-arabic text-sm"
                                style={{ color: GOLD_DIM }}
                                onClick={() => setShowUserMenu(false)}>
                                <ShoppingCart size={14} />
                                {isRTL ? 'طلباتي' : 'My Orders'}
                              </div>
                            </Link>
                            {isAdmin && (
                              <Link href="/admin">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all font-arabic text-sm"
                                  style={{ color: GOLD_DIM }}
                                  onClick={() => setShowUserMenu(false)}>
                                  <LayoutDashboard size={14} />
                                  {isRTL ? 'لوحة التحكم' : 'Admin'}
                                </div>
                              </Link>
                            )}
                            <button
                              onClick={() => { signOut(); setShowUserMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-arabic text-sm text-red-400 hover:bg-red-900/20"
                            >
                              <LogOut size={14} />
                              {isRTL ? 'خروج' : 'Sign Out'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link href="/auth">
                  <motion.span
                    className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer font-arabic"
                    style={{ border: '1px solid rgba(200,168,75,0.3)', color: GOLD }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </motion.span>
                </Link>
              )}

              {/* Gold CTA: "تصفح الكتب" */}
              <Link href="/store">
                <motion.span
                  className="hidden sm:inline-flex items-center px-5 py-2 rounded-lg text-sm font-black cursor-pointer font-arabic"
                  style={{ background: GOLD, color: '#1a0f05' }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  data-testid="nav-cta"
                >
                  تصفح الكتب
                </motion.span>
              </Link>

              {/* Mobile hamburger */}
              <motion.button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg"
                style={{ border: '1px solid rgba(200,168,75,0.25)', color: GOLD }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                data-testid="mobile-menu-button"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(10,5,2,0.95)', backdropFilter: 'blur(16px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 pb-10 z-50 max-h-[80vh] overflow-y-auto"
              style={{ background: 'rgba(18,9,3,0.99)', border: '1px solid rgba(200,168,75,0.15)', borderBottom: 'none' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(200,168,75,0.3)' }} />
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link href={link.href}>
                      <span
                        className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold cursor-pointer font-arabic transition-all"
                        style={{ color: location === link.href ? GOLD : GOLD_DIM }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-6 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(200,168,75,0.1)' }}>
                  <Link href="/store">
                    <span
                      className="block w-full text-center py-3 rounded-xl text-base font-black cursor-pointer font-arabic"
                      style={{ background: GOLD, color: '#1a0f05' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      تصفح الكتب
                    </span>
                  </Link>
                  {profile ? (
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold font-arabic text-red-400"
                      style={{ border: '1px solid rgba(200,50,50,0.2)' }}
                    >
                      <LogOut size={16} />
                      {isRTL ? 'خروج' : 'Sign Out'}
                    </button>
                  ) : (
                    <Link href="/auth">
                      <span
                        className="block w-full text-center py-3 rounded-xl text-base font-bold cursor-pointer font-arabic"
                        style={{ border: '1px solid rgba(200,168,75,0.3)', color: GOLD }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
