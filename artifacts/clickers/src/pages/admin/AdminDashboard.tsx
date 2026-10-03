import { motion } from 'framer-motion';
import { BookOpen, Users, ShoppingBag, TrendingUp, Package, BarChart3, PlusCircle, FileDown, Eye } from 'lucide-react';
import { Link } from 'wouter';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import { AdminLayout, AdminPageHeader, StatCard } from '@/components/admin/AdminLayout';
import { useAnalytics } from '@/services/supabase.hooks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

// Fetch live counts directly from tables (works without DB views)
function useAdminCounts() {
  return useQuery({
    queryKey: ['admin', 'counts'],
    queryFn: async () => {
      const [booksRes, authorsRes] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('authors').select('id', { count: 'exact', head: true }),
      ]);
      return {
        totalBooks: booksRes.count ?? 0,
        totalAuthors: authorsRes.count ?? 0,
      };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
}

// Custom Recharts tooltip for the admin dark theme
const AdminTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="admin-chart-tooltip px-3 py-2 text-xs font-semibold shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'revenue' ? `${p.value.toLocaleString()} EGP` : p.value}
        </p>
      ))}
    </div>
  );
};

export function AdminDashboard() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: counts } = useAdminCounts();

  const chartData = analytics?.salesByDay?.slice(0, 14).reverse().map((d: any) => ({
    date: d.sale_date ? format(new Date(d.sale_date), 'MM/dd') : '—',
    revenue: Number(d.revenue ?? 0),
    orders: Number(d.order_count ?? 0),
  })) ?? [];

  // If no view data, build a 7-day skeleton for UX
  const hasChartData = chartData.length > 0 && chartData.some(d => d.revenue > 0);

  const stats = [
    {
      label: 'Total Revenue',
      value: `${(analytics?.totalRevenue ?? 0).toLocaleString()} EGP`,
      icon: TrendingUp,
      trend: undefined,
      color: 'violet' as const,
    },
    {
      label: 'Total Orders',
      value: analytics?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'sky' as const,
    },
    {
      label: 'Users',
      value: analytics?.totalUsers ?? 0,
      icon: Users,
      color: 'emerald' as const,
    },
    {
      label: 'Pending Orders',
      value: analytics?.pendingOrders ?? 0,
      icon: Package,
      color: 'amber' as const,
    },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's what's happening today."
      />

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-card rounded-2xl h-36 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Extra info row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Books', value: counts?.totalBooks ?? '—', color: '#a78bfa' },
          { label: 'Total Authors', value: counts?.totalAuthors ?? '—', color: '#60a5fa' },
          { label: 'Delivered', value: (analytics?.totalOrders ?? 0) - (analytics?.pendingOrders ?? 0), color: '#34d399' },
          { label: 'Cancelled', value: 0, color: '#f87171' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="admin-card border border-white/5 rounded-xl px-5 py-4 flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <div>
              <p className="text-white font-bold text-xl tabular-nums">{item.value}</p>
              <p className="text-slate-500 text-xs uppercase tracking-wider">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Area Chart */}
        <motion.div
          className="lg:col-span-2 admin-card border border-white/5 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Revenue Overview</h2>
              <p className="text-slate-500 text-xs mt-0.5">Last 14 days</p>
            </div>
            <BarChart3 className="text-violet-400" size={18} />
          </div>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGradAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.7)', fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<AdminTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#revenueGradAdmin)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#7c3aed', stroke: '#0d0f14', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[210px] flex flex-col items-center justify-center gap-3">
              <BarChart3 size={32} className="text-slate-700" />
              <p className="text-slate-600 text-sm font-medium">No sales data yet</p>
              <p className="text-slate-700 text-xs">Revenue will appear here once orders are placed</p>
            </div>
          )}
        </motion.div>

        {/* Top Books */}
        <motion.div
          className="admin-card border border-white/5 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">Top Books</h2>
            <Link href="/admin/analytics">
              <span className="text-violet-400 text-xs font-semibold cursor-pointer hover:text-violet-300 transition-colors uppercase tracking-wider">
                See All
              </span>
            </Link>
          </div>
          <div className="space-y-4">
            {(analytics?.topBooks ?? []).slice(0, 5).map((book: any, i: number) => (
              <motion.div
                key={book.id}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <span className="text-2xl font-bold text-slate-700 font-mono w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt=""
                    className="w-9 h-12 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-12 rounded-lg flex-shrink-0 bg-white/5 flex items-center justify-center">
                    <BookOpen size={14} className="text-slate-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-semibold text-sm line-clamp-1">{book.title_ar || book.title_en}</p>
                  <p className="text-violet-400 font-bold text-xs mt-0.5">{book.total_sold ?? 0} sold</p>
                </div>
              </motion.div>
            ))}
            {(analytics?.topBooks ?? []).length === 0 && (
              <div className="py-8 flex flex-col items-center gap-2">
                <BookOpen size={28} className="text-slate-700" />
                <p className="text-slate-600 text-sm">No sales data yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {[
          { href: '/admin/books',     label: 'Add Book',       icon: PlusCircle,  color: '#7c3aed' },
          { href: '/admin/authors',   label: 'Authors',        icon: Users,       color: '#4f46e5' },
          { href: '/admin/orders',    label: 'Orders',         icon: Eye,         color: '#0ea5e9' },
          { href: '/admin/exports',   label: 'Export Data',    icon: FileDown,    color: '#10b981' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <motion.div
                className="admin-card border border-white/5 rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer group hover:border-white/10 transition-all"
                whileHover={{ y: -3 }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: `${action.color}20`, color: action.color }}
                >
                  <Icon size={20} />
                </div>
                <span className="text-slate-400 group-hover:text-slate-200 font-semibold text-xs uppercase tracking-wider text-center transition-colors">
                  {action.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </AdminLayout>
  );
}
