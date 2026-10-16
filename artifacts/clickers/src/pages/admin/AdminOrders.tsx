import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Package, Eye, ShoppingBag, Users, PenTool, BookOpen, CreditCard, Copy } from 'lucide-react';
import { AdminLayout, AdminPageHeader } from '@/components/admin/AdminLayout';
import { useAllOrders, useUpdateOrderStatus } from '@/services/supabase.hooks';

const STATUSES = ['pending', 'paid', 'delivered', 'cancelled'] as const;
type OrderStatus = typeof STATUSES[number];

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:   { label: 'قيد الانتظار',   icon: Clock,        color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  paid:      { label: 'تم الدفع',      icon: CheckCircle,  color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  delivered: { label: 'تم التوصيل', icon: Package,      color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200' },
  cancelled: { label: 'ملغي', icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50 border-red-200' },
};

const PM_LABEL: Record<string, string> = {
  bank_transfer: 'تحويل بنكي',
  instapay: 'إنستاباي (InstaPay)',
  vodafone_cash: 'فودافون كاش',
  etisalat_cash: 'اتصالات كاش',
  stripe: 'دفع إلكتروني (بطاقة)',
};

export function AdminOrders() {
  const { data: orders, isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = (orders ?? []).filter(
    (o) => filterStatus === 'all' || o.status === filterStatus
  );

  const totalRevenue = (orders ?? [])
    .filter((o) => ['paid', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <AdminLayout>
      <AdminPageHeader
        title="إدارة الطلبات والمبيعات"
        subtitle={`${orders?.length ?? 0} إجمالي الطلبات · ${totalRevenue.toLocaleString()} ج.م الإيرادات الإجمالية`}
      />

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8" dir="rtl">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-5 py-2.5 rounded-xl font-black text-sm font-arabic transition-all ${filterStatus === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border text-primary/50 hover:text-primary'}`}
        >
          الكل ({orders?.length ?? 0})
        </button>
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          const count = (orders ?? []).filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-2.5 rounded-xl font-black text-sm font-arabic transition-all border ${filterStatus === s ? `${cfg.bg} ${cfg.color}` : 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border-border text-primary/50 hover:text-primary'}`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {['رقم الطلب', 'بيانات العميل', 'عدد العناصر', 'الإجمالي', 'الحالة', 'تاريخ الطلب', 'الإجراءات'].map((h, idx) => (
                <th key={h} className={`px-6 py-4 text-xs font-black uppercase tracking-wider text-primary/40 font-arabic ${idx === 6 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-primary/5 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              : filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;
                  const customer = (order as Record<string, unknown> & { profiles?: { email?: string; full_name?: string; phone?: string | null } }).profiles;
                  const items = (order as Record<string, unknown> & { order_items?: unknown[] }).order_items ?? [];
                  const isExpanded = expanded === order.id;
                  const txId = (order as any).transaction_id as string | null;
                  const pm = (order as any).payment_method as string;

                  return (
                    <tbody key={order.id}>
                      <motion.tr
                        className="border-b border-border hover:bg-primary/2 transition-colors cursor-pointer group"
                        onClick={() => setExpanded(isExpanded ? null : order.id as string)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-primary text-sm font-bold">
                            #{(order.id as string).slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-primary text-sm font-arabic">{customer?.full_name || 'عميل غير مسجل'}</p>
                          <p className="text-primary/40 text-xs font-mono" dir="ltr">{customer?.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-primary font-bold">{(items as unknown[]).length} كتب</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-primary">{Number(order.total_amount).toFixed(2)}</span>
                          <span className="text-primary/40 text-xs mr-1 font-arabic">ج.م</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black font-arabic ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={12} />
                            {cfg.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-primary/60 font-bold text-xs">
                            {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="flex items-center justify-start gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : order.id as string); }}
                              className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                              title="عرض تفاصيل الطلب"
                            >
                              <Eye size={13} />
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateStatus.mutate({ id: order.id as string, status: e.target.value });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold text-primary border border-border rounded-xl px-2 py-1.5 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-arabic"
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                            </select>
                          </div>
                        </td>
                      </motion.tr>

                      {/* ── Expanded Detail Row ── */}
                      {isExpanded && (
                        <tr className="border-b border-border bg-primary/2">
                          <td colSpan={7} className="px-6 py-10">

                            {/* ── PAYMENT BANNER (always at top) ── */}
                            <div className="mb-8 rounded-2xl overflow-hidden border border-primary/10">
                              <div className="flex items-center justify-between px-6 py-4 bg-primary/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                                    <CreditCard size={16} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-primary/40 font-arabic">طريقة الدفع</p>
                                    <p className="font-black text-primary text-base font-arabic">{PM_LABEL[pm] ?? pm}</p>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-black uppercase tracking-wider text-primary/40 font-arabic">إجمالي الطلب</p>
                                  <p className="font-black text-primary text-xl">{(order.total_amount as number).toFixed(2)} <span className="text-sm text-primary/40 font-arabic">ج.م</span></p>
                                </div>
                              </div>

                              {/* Transaction ID row */}
                              {['bank_transfer', 'instapay', 'vodafone_cash', 'etisalat_cash'].includes(pm) && (
                                <div className={`flex items-center justify-between px-6 py-4 border-t ${txId ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                                  <div>
                                    <p className={`text-xs font-black uppercase tracking-wider mb-1 font-arabic ${txId ? 'text-green-600' : 'text-amber-600'}`}>
                                      {txId ? '✓ تم إرفاق رقم العملية / مرجع التحويل' : '⚠ لم يقم العميل بتقديم رقم العملية بعد'}
                                    </p>
                                    <p className={`font-mono font-bold text-sm ${txId ? 'text-primary' : 'text-amber-600'}`} dir="ltr">
                                      {txId || 'في انتظار تأكيد التحويل'}
                                    </p>
                                  </div>
                                  {txId && (
                                    <button
                                      onClick={() => { navigator.clipboard.writeText(txId); }}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-green-200 transition-colors font-arabic"
                                    >
                                      <Copy size={11} /> نسخ الرقم
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* ── LEFT + RIGHT COLUMNS ── */}
                            <div className="flex flex-col lg:flex-row gap-12">

                              {/* Left: Customer & Shipping */}
                              <div className="lg:w-2/5 space-y-8">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-primary/30 mb-4 flex items-center gap-2 font-arabic">
                                    <Users size={12} /> بيانات المستلم والعميل
                                  </h4>
                                  <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-10 -mt-10 transition-transform group-hover:scale-125 duration-500" />
                                    <div className="relative z-10">
                                      <p className="text-primary font-black text-xl mb-1 font-arabic">{customer?.full_name || 'غير محدد'}</p>
                                      <p className="text-primary/40 text-sm font-bold mb-4 font-mono" dir="ltr">{customer?.email}</p>
                                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                                            <Users size={14} />
                                          </div>
                                          <p className="text-primary font-black text-sm font-mono" dir="ltr">{customer?.phone || 'لا يوجد رقم هاتف'}</p>
                                        </div>
                                        {customer?.phone && (
                                          <button
                                            onClick={() => { navigator.clipboard.writeText(customer.phone as string); }}
                                            className="text-xs font-black uppercase text-accent hover:text-primary transition-colors font-arabic"
                                          >
                                            نسخ
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-primary/30 mb-4 flex items-center gap-2 font-arabic">
                                    <Package size={12} /> عنوان الشحن والتوصيل
                                  </h4>
                                  <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-6 shadow-sm">
                                    <p className="text-primary font-bold text-base whitespace-pre-wrap leading-relaxed mb-4 font-arabic">
                                      {(order as any).shipping_address || 'لم يتم تقديم عنوان شحن'}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                      <span className="text-xs font-black uppercase text-primary/30 tracking-wider font-arabic">العنوان التفصيلي</span>
                                      <button
                                        onClick={() => { navigator.clipboard.writeText((order as any).shipping_address || ''); }}
                                        className="text-xs font-black uppercase text-accent hover:text-primary transition-colors font-arabic"
                                      >
                                        نسخ العنوان
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Order Manifest */}
                              <div className="flex-1">
                                <h4 className="text-xs font-black uppercase tracking-wider text-primary/30 mb-4 flex items-center gap-2 font-arabic">
                                  <ShoppingBag size={12} /> قائمة الكتب المطلوبة
                                </h4>
                                <div className="space-y-4">
                                  {(items as any[]).map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-[1.5rem] p-4 shadow-sm group hover:border-primary/20 transition-all">
                                      <div className="w-16 overflow-hidden rounded-xl shadow-md bg-primary/5 flex-shrink-0" style={{ height: '88px' }}>
                                        {item.books?.cover_url ? (
                                          <img src={item.books.cover_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-primary/20"><BookOpen size={20} /></div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <p className="text-primary font-black text-sm mb-1 font-arabic">{item.books?.title_ar || item.books?.title_en}</p>
                                            <p className="text-primary/40 text-xs font-bold uppercase tracking-wider">{item.books?.title_en}</p>
                                          </div>
                                          <div className="text-left">
                                            <p className="text-primary font-black text-sm">{(item.quantity * item.unit_price).toFixed(2)} <span className="text-xs opacity-40 font-arabic">ج.م</span></p>
                                            <p className="text-primary/40 text-xs font-bold font-arabic">الكمية: {item.quantity}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {order.notes && (
                                    <div className="mt-4 p-6 bg-accent/5 rounded-[1.5rem] border border-accent/10">
                                      <div className="flex items-center gap-2 mb-2">
                                        <PenTool size={12} className="text-accent" />
                                        <h5 className="text-xs font-black uppercase tracking-wider text-accent font-arabic">ملاحظات وتعليمات العميل</h5>
                                      </div>
                                      <p className="text-primary font-bold text-xs italic font-arabic">"{order.notes}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  );
                })}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-primary/30 font-bold font-arabic">لم يتم العثور على أي طلبات</div>
        )}
      </div>
    </AdminLayout>
  );
}
