import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ShoppingBag, X, ArrowLeft, ArrowRight, Bell } from 'lucide-react';
import type { NewOrderPayload } from '@/hooks/useAdminOrderNotifications';
import { useLanguage } from '@/i18n/LanguageContext';

const PM_LABEL: Record<string, { ar: string; en: string }> = {
  bank_transfer: { ar: 'تحويل بنكي', en: 'Bank Transfer' },
  instapay: { ar: 'انستاباي (InstaPay)', en: 'InstaPay' },
  vodafone_cash: { ar: 'فودافون كاش', en: 'Vodafone Cash' },
  etisalat_cash: { ar: 'اتصالات كاش', en: 'Etisalat Cash' },
  stripe: { ar: 'دفع إلكتروني', en: 'Online (Stripe)' },
};

interface OrderToast extends NewOrderPayload {
  toastId: string;
}

interface Props {
  orders: OrderToast[];
  onDismiss: (toastId: string) => void;
}

/** Stacked toast notifications that appear in the corner */
export function OrderNotificationToasts({ orders, onDismiss }: Props) {
  const { isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-[9999] flex flex-col gap-3 pointer-events-none font-arabic`} dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatePresence mode="popLayout">
        {orders.slice(0, 5).map((order) => {
          const pm = PM_LABEL[order.payment_method] 
            ? (isRTL ? PM_LABEL[order.payment_method].ar : PM_LABEL[order.payment_method].en)
            : order.payment_method;

          return (
            <motion.div
              key={order.toastId}
              layout
              initial={{ opacity: 0, x: isRTL ? -80 : 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRTL ? -80 : 80, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto"
            >
              <div className="w-80 bg-slate-900/95 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl border overflow-hidden">
                {/* Header bar */}
                <div className="bg-violet-600 flex items-center justify-between px-5 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center animate-pulse text-slate-950">
                      <ShoppingBag size={12} />
                    </div>
                    <span className="font-black text-xs">
                      {isRTL ? '🛒 تم استلام طلب جديد!' : '🛒 New Order Received!'}
                    </span>
                  </div>
                  <button
                    onClick={() => onDismiss(order.toastId)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-[10px] font-bold text-slate-400">
                        {isRTL ? 'طريقة الدفع' : 'Payment'}
                      </p>
                      <p className="font-bold text-white text-sm">
                        {pm}
                      </p>
                    </div>
                    <div className={isRTL ? 'text-left' : 'text-right'}>
                      <p className="text-[10px] font-bold text-slate-400">
                        {isRTL ? 'الإجمالي' : 'Total'}
                      </p>
                      <p className="font-bold text-emerald-400 text-lg">
                        {Number(order.total_amount).toFixed(2)} <span className="text-xs text-slate-400">{isRTL ? 'ج.م' : 'EGP'}</span>
                      </p>
                    </div>
                  </div>
                  <Link href="/admin/orders" onClick={() => onDismiss(order.toastId)}>
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-all">
                      <span>{isRTL ? 'عرض تفاصيل الطلب' : 'View Order'}</span>
                      {isRTL ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/** Bell icon with badge — shows unread count in the nav */
export function AdminNotificationBell({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const [pulse, setPulse] = useState(false);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (count > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [count]);

  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 transition-all group font-arabic"
    >
      <Bell
        size={16}
        className={`text-amber-400 ${pulse ? 'animate-bounce' : ''}`}
      />
      <span className="text-amber-300 font-bold text-xs">
        {isRTL
          ? `${count} ${count === 1 ? 'طلب جديد' : count === 2 ? 'طلبان جديدان' : 'طلبات جديدة'}`
          : `${count} new order${count > 1 ? 's' : ''}`}
      </span>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[11px] font-black flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  );
}


