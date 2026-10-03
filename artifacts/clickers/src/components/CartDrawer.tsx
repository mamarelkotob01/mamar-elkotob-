import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { isRTL, t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-transparent shadow-2xl z-50 flex flex-col`}
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-border">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ShoppingBag className="text-primary" size={22} />
                <h2 className={`font-black text-primary text-xl uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                  {isRTL ? 'السلة' : 'Cart'}
                </h2>
                {totalItems > 0 && (
                  <span className="w-6 h-6 bg-accent text-primary rounded-full flex items-center justify-center text-xs font-black">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="touch-target rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} className="text-primary" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-primary/20" />
                  </div>
                  <p className={`text-primary/40 font-bold text-lg ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                    {isRTL ? 'السلة فارغة' : 'Your cart is empty'}
                  </p>
                  <p className={`text-primary/30 text-sm mt-2 ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'ابدأ باستكشاف مكتبتنا' : 'Start exploring our library'}
                  </p>
                  <Link href="/store">
                    <button
                      onClick={closeCart}
                      className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-accent hover:text-primary transition-all text-sm uppercase tracking-wider"
                    >
                      {isRTL ? 'تصفح الكتب' : 'Browse Books'}
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.bookId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-2xl p-4 border border-border shadow-sm"
                    >
                      <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-xl flex-shrink-0 shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-primary text-sm line-clamp-2 mb-2 ${isRTL ? 'font-arabic text-right' : ''}`}>
                            {item.title}
                          </h4>
                          <p className="text-accent font-black text-sm">
                            {item.price} <span className="text-xs opacity-70">{t.common.currency}</span>
                          </p>

                          <div className={`flex items-center gap-3 mt-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-primary/5 rounded-2xl p-1">
                              <button
                                onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-primary hover:text-white transition-all text-primary active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-primary font-bold text-base w-6 text-center select-none">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-primary hover:text-white transition-all text-primary active:scale-95"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.bookId)}
                              className="touch-target text-red-400 hover:text-red-600 transition-colors bg-red-50/50 rounded-xl hover:bg-red-50 ml-2"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-primary/50 font-bold text-sm uppercase tracking-wider ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'الإجمالي' : 'Total'}
                  </span>
                  <span className="text-primary font-black text-2xl">
                    {totalPrice.toFixed(2)}{' '}
                    <span className="text-sm font-bold text-primary/50">{t.common.currency}</span>
                  </span>
                </div>
                <Link href="/checkout">
                  <motion.button
                    onClick={closeCart}
                    className={`w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{isRTL ? 'إتمام الطلب' : 'Checkout'}</span>
                    <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
