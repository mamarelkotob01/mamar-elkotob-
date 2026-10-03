import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/useAuth';
import { useMyOrders } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending', labelAr: 'قيد الانتظار', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  paid: { label: 'Paid', labelAr: 'مدفوع', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  delivered: { label: 'Delivered', labelAr: 'تم التسليم', icon: Package, color: 'text-blue-600 bg-blue-50' },
  cancelled: { label: 'Cancelled', labelAr: 'ملغي', icon: XCircle, color: 'text-red-500 bg-red-50' },
} as const;

export function MyOrdersPage() {
  const { profile } = useAuth();
  const { isRTL, t } = useLanguage();
  const { data: orders, isLoading } = useMyOrders(profile?.id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center pt-32">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-primary/10 mb-6" />
          <p className={`text-primary/40 font-bold text-xl mb-6 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
            {isRTL ? 'يجب تسجيل الدخول لعرض طلباتك' : 'Sign in to view your orders'}
          </p>
          <Link href="/auth">
            <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20">
              {isRTL ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
            <p className={`text-accent font-black uppercase tracking-[0.3em] text-xs mb-3 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL ? 'حسابي' : 'My Account'}
            </p>
            <h1 className={`text-5xl font-black text-primary ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
              {isRTL ? 'طلباتي' : 'My Orders'}
            </h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mb-10 p-6 rounded-[2rem] bg-accent/5 border border-accent/10 flex flex-col sm:flex-row items-center sm:items-start gap-5 ${isRTL ? 'sm:flex-row-reverse text-center sm:text-right' : 'text-center sm:text-left'}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
              <Package size={24} />
            </div>
            <div>
              <h3 className={`font-black text-primary mb-2 ${isRTL ? 'font-arabic text-lg' : 'uppercase tracking-wider text-sm'}`}>
                {isRTL ? 'معلومات التوصيل' : 'Delivery Information'}
              </h3>
              <p className={`text-primary/70 font-bold leading-relaxed ${isRTL ? 'font-arabic text-sm' : 'text-sm'}`}>
                {isRTL 
                  ? 'شكراً لثقتكم بنا! يرجى العلم أن مدة التوصيل المعتادة هي خلال 5 أيام عمل كحد أقصى. نحن نعمل جاهدين لضمان وصول طلباتكم في أسرع وقت وبأفضل جودة.' 
                  : 'Thank you for your trust! Please note that our standard delivery time is a maximum of 5 working days. We are working hard to ensure your orders arrive as quickly and safely as possible.'}
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-8 animate-pulse h-32" />
              ))}
            </div>
          ) : !orders?.length ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={36} className="text-primary/20" />
              </div>
              <p className={`text-primary/40 font-bold text-xl mb-6 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
              </p>
              <Link href="/store">
                <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20">
                  {isRTL ? 'ابدأ التسوق' : 'Start Shopping'}
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, i) => {
                const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const StatusIcon = status.icon;
                const orderItems = (order as Record<string, unknown> & { order_items?: Array<{ books?: { title_ar: string; title_en: string; cover_url?: string }; quantity: number; unit_price: number }> }).order_items ?? [];

                return (
                  <motion.div
                    key={order.id}
                    className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {/* Order Header */}
                    <div className={`flex items-center justify-between p-6 border-b border-border ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="text-primary/40 font-bold text-xs uppercase tracking-wider mb-1">
                          {isRTL ? 'رقم الطلب' : 'Order'} #{(order.id as string).slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-primary/60 font-bold text-sm">
                          {format(new Date(order.created_at), 'dd MMM yyyy — HH:mm')}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm ${status.color}`}>
                        <StatusIcon size={14} />
                        <span>{isRTL ? status.labelAr : status.label}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        {orderItems.slice(0, 3).map((item, j) => (
                          <div key={j} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {item.books?.cover_url && (
                              <img src={item.books.cover_url} alt="" className="w-10 h-14 object-cover rounded-lg shadow-sm flex-shrink-0" />
                            )}
                            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                              <p className={`text-primary font-bold text-sm ${isRTL ? 'font-arabic' : ''}`}>
                                {isRTL ? item.books?.title_ar : item.books?.title_en}
                              </p>
                              <p className="text-primary/40 text-xs font-bold">
                                ×{item.quantity} — {(item.quantity * item.unit_price).toFixed(2)} {t.common.currency}
                              </p>
                            </div>
                          </div>
                        ))}
                        {orderItems.length > 3 && (
                          <p className="text-primary/30 text-sm font-bold">+{orderItems.length - 3} {isRTL ? 'كتب أخرى' : 'more books'}</p>
                        )}
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-primary/40 font-bold text-sm ${isRTL ? 'font-arabic' : ''}`}>
                          {isRTL ? 'الإجمالي' : 'Total'}
                        </span>
                        <span className="text-primary font-black text-xl">
                          {Number(order.total_amount).toFixed(2)} <span className="text-sm text-primary/40">{t.common.currency}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

