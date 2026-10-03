import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Package, Eye, ShoppingBag, Users, PenTool, BookOpen, CreditCard, Copy } from 'lucide-react';
import { AdminLayout, AdminPageHeader } from '@/components/admin/AdminLayout';
import { useAllOrders, useUpdateOrderStatus } from '@/services/supabase.hooks';

const STATUSES = ['pending', 'paid', 'delivered', 'cancelled'] as const;
type OrderStatus = typeof STATUSES[number];

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  paid:      { label: 'Paid',      icon: CheckCircle,  color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  delivered: { label: 'Delivered', icon: Package,      color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200' },
  cancelled: { label: 'Cancelled', icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50 border-red-200' },
};

const PM_LABEL: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  instapay: 'InstaPay',
  vodafone_cash: 'Vodafone Cash',
  stripe: 'Online (Stripe)',
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
        title="Orders Management"
        subtitle={`${orders?.length ?? 0} total orders · ${totalRevenue.toLocaleString()} EGP revenue`}
      />

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${filterStatus === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border text-primary/50 hover:text-primary'}`}
        >
          All ({orders?.length ?? 0})
        </button>
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          const count = (orders ?? []).filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all border ${filterStatus === s ? `${cfg.bg} ${cfg.color}` : 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border-border text-primary/50 hover:text-primary'}`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-primary/40">{h}</th>
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
                    <>
                      <motion.tr
                        key={order.id}
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
                          <p className="font-bold text-primary text-sm">{customer?.full_name || '—'}</p>
                          <p className="text-primary/40 text-xs">{customer?.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-primary font-bold">{(items as unknown[]).length}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-primary">{Number(order.total_amount).toFixed(2)}</span>
                          <span className="text-primary/30 text-xs ml-1">EGP</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={12} />
                            {cfg.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-primary/60 font-bold text-xs">
                            {format(new Date(order.created_at), 'dd/MM/yy HH:mm')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : order.id as string); }}
                              className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
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
                              className="text-xs font-bold text-primary border border-border rounded-xl px-2 py-1.5 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
                                    <p className="text-xs font-black uppercase tracking-wider text-primary/40">Payment Method</p>
                                    <p className="font-black text-primary text-base">{PM_LABEL[pm] ?? pm}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black uppercase tracking-wider text-primary/40">Order Total</p>
                                  <p className="font-black text-primary text-xl">{(order.total_amount as number).toFixed(2)} <span className="text-sm text-primary/30">EGP</span></p>
                                </div>
                              </div>

                              {/* Transaction ID row */}
                              {['bank_transfer', 'instapay', 'vodafone_cash'].includes(pm) && (
                                <div className={`flex items-center justify-between px-6 py-4 border-t ${txId ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                                  <div>
                                    <p className={`text-xs font-black uppercase tracking-wider mb-1 ${txId ? 'text-green-600' : 'text-amber-600'}`}>
                                      {txId ? '✓ Transaction ID — Submitted' : '⚠ No Transaction ID Submitted Yet'}
                                    </p>
                                    <p className={`font-mono font-bold text-sm ${txId ? 'text-primary' : 'text-amber-500'}`}>
                                      {txId || 'Customer has not provided a payment reference'}
                                    </p>
                                  </div>
                                  {txId && (
                                    <button
                                      onClick={() => { navigator.clipboard.writeText(txId); }}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-green-200 transition-colors"
                                    >
                                      <Copy size={11} /> Copy ID
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
                                  <h4 className="text-xs font-black uppercase tracking-wider text-primary/30 mb-4 flex items-center gap-2">
                                    <Users size={12} /> Recipient Information
                                  </h4>
                                  <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-500" />
                                    <div className="relative z-10">
                                      <p className="text-primary font-black text-xl mb-1">{customer?.full_name || 'N/A'}</p>
                                      <p className="text-primary/40 text-sm font-bold mb-4">{customer?.email}</p>
                                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                                            <Users size={14} />
                                          </div>
                                          <p className="text-primary font-black text-sm">{customer?.phone || 'No Phone Number'}</p>
                                        </div>
                                        {customer?.phone && (
                                          <button
                                            onClick={() => { navigator.clipboard.writeText(customer.phone as string); }}
                                            className="text-xs font-black uppercase text-accent hover:text-primary transition-colors"
                                          >
                                            Copy
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-primary/30 mb-4 flex items-center gap-2">
                                    <Package size={12} /> Shipping Destination
                                  </h4>
                                  <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-6 shadow-sm">
                                    <p className="text-primary font-bold text-base whitespace-pre-wrap leading-relaxed mb-4">
                                      {(order as any).shipping_address || 'No address provided'}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                      <span className="text-xs font-black uppercase text-primary/30 tracking-wider">Address Details</span>
                                      <button
                                        onClick={() => { navigator.clipboard.writeText((order as any).shipping_address || ''); }}
                                        className="text-xs font-black uppercase text-accent hover:text-primary transition-colors"
                                      >
                                        Copy Full Address
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Order Manifest */}
                              <div className="flex-1">
                                <h4 className="text-xs font-black uppercase tracking-wider text-primary/30 mb-4 flex items-center gap-2">
                                  <ShoppingBag size={12} /> Order Manifest
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
                                            <p className="text-primary font-black text-sm mb-1" dir="rtl">{item.books?.title_ar}</p>
                                            <p className="text-primary/40 text-xs font-bold uppercase tracking-wider">{item.books?.title_en}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-primary font-black text-sm">{(item.quantity * item.unit_price).toFixed(2)} <span className="text-xs opacity-30">EGP</span></p>
                                            <p className="text-primary/40 text-xs font-bold uppercase tracking-wider">Qty: {item.quantity}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {order.notes && (
                                    <div className="mt-4 p-6 bg-accent/5 rounded-[1.5rem] border border-accent/10">
                                      <div className="flex items-center gap-2 mb-2">
                                        <PenTool size={12} className="text-accent" />
                                        <h5 className="text-xs font-black uppercase tracking-wider text-accent">Customer Instructions</h5>
                                      </div>
                                      <p className="text-primary font-bold text-xs italic">"{order.notes}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-primary/30 font-bold">No orders found</div>
        )}
      </div>
    </AdminLayout>
  );
}
