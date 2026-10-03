import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ShoppingBag, X, ArrowRight, Bell } from 'lucide-react';
import type { NewOrderPayload } from '@/hooks/useAdminOrderNotifications';

const PM_LABEL: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  instapay: 'InstaPay',
  vodafone_cash: 'Vodafone Cash',
  stripe: 'Online (Stripe)',
};

interface OrderToast extends NewOrderPayload {
  toastId: string;
}

interface Props {
  orders: OrderToast[];
  onDismiss: (toastId: string) => void;
}

/** Stacked toast notifications that appear in the bottom-right corner */
export function OrderNotificationToasts({ orders, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {orders.slice(0, 5).map((order) => (
          <motion.div
            key={order.toastId}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto"
          >
            <div className="w-80 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-2xl shadow-2xl shadow-primary/20 border border-border overflow-hidden">
              {/* Header bar */}
              <div className="bg-primary flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center animate-pulse">
                    <ShoppingBag size={12} className="text-primary" />
                  </div>
                  <span className="text-white font-black text-xs uppercase tracking-wider">
                    🛒 New Order Received!
                  </span>
                </div>
                <button
                  onClick={() => onDismiss(order.toastId)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-primary/40">Payment</p>
                    <p className="font-black text-primary text-sm">
                      {PM_LABEL[order.payment_method] ?? order.payment_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-wider text-primary/40">Total</p>
                    <p className="font-black text-primary text-lg">
                      {Number(order.total_amount).toFixed(2)} <span className="text-xs text-primary/40">EGP</span>
                    </p>
                  </div>
                </div>
                <Link href="/admin/orders" onClick={() => onDismiss(order.toastId)}>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-accent hover:text-primary transition-all">
                    View Order <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
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
      className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent/20 hover:bg-accent/30 transition-all group"
    >
      <Bell
        size={16}
        className={`text-accent ${pulse ? 'animate-bounce' : ''}`}
      />
      <span className="text-accent font-black text-xs">
        {count} new order{count > 1 ? 's' : ''}
      </span>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-\[11px\] font-black flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  );
}
