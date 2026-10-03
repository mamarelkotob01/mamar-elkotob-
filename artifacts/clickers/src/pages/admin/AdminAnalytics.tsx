import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { AdminLayout, AdminPageHeader, StatCard } from '@/components/admin/AdminLayout';
import { useAnalytics, useBooks } from '@/services/supabase.hooks';

const GENRE_COLORS = ['#8B1D3D', '#C9A84C', '#B5896B', '#6B4C3B', '#D4A574', '#8B3A3A', '#4A7C59', '#2C5F8A'];

export function AdminAnalytics() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: books } = useBooks({ status: undefined });

  const revenueData = (analytics?.salesByDay ?? []).slice(0, 30).reverse().map((d) => ({
    date: format(new Date((d as { sale_date: string }).sale_date), 'MM/dd'),
    revenue: Number((d as { revenue: number }).revenue),
    orders: Number((d as { order_count: number }).order_count),
  }));

  // Genre distribution from books
  const genreMap = (books ?? []).reduce((acc: Record<string, number>, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1;
    return acc;
  }, {});
  const genreData = Object.entries(genreMap).map(([name, value]) => ({ name, value }));

  // Format distribution
  const formatMap = (books ?? []).reduce((acc: Record<string, number>, b) => {
    acc[b.format] = (acc[b.format] || 0) + 1;
    return acc;
  }, {});
  const formatData = Object.entries(formatMap).map(([name, value]) => ({ name, value }));

  return (
    <AdminLayout>
      <AdminPageHeader title="Analytics" subtitle="Business insights and performance metrics" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Revenue" value={`${(analytics?.totalRevenue ?? 0).toLocaleString()} EGP`} icon={TrendingUp} />
        <StatCard label="Total Orders" value={analytics?.totalOrders ?? 0} icon={ShoppingBag} />
        <StatCard label="Total Users" value={analytics?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Total Books" value={books?.length ?? 0} icon={BookOpen} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Over Time */}
        <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl p-8 border border-border shadow-sm lg:col-span-2">
          <h2 className="text-xl font-black text-primary font-cinematic mb-2">Revenue & Orders — Last 30 Days</h2>
          <p className="text-primary/40 text-sm font-bold mb-8">Daily sales performance</p>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(345 65% 33%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(345 65% 33%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(345 65% 33% / 0.4)', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E8E0DC', borderRadius: '16px', boxShadow: '0 8px 32px rgba(139,29,61,0.1)' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue (EGP)" stroke="hsl(345 65% 33%)" strokeWidth={2.5} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="#C9A84C" strokeWidth={2.5} fill="url(#ordGrad)" />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-primary/20 font-bold">No sales data yet</div>
          )}
        </div>

        {/* Top Books Bar Chart */}
        <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl p-8 border border-border shadow-sm">
          <h2 className="text-xl font-black text-primary font-cinematic mb-2">Top Selling Books</h2>
          <p className="text-primary/40 text-sm font-bold mb-8">By units sold</p>
          {(analytics?.topBooks ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={(analytics?.topBooks ?? []).slice(0, 6).map((b) => ({ name: (b as { title_en: string }).title_en?.slice(0, 15) + '…', sold: Number((b as { total_sold: number }).total_sold) }))}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(345 65% 33% / 0.5)', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E8E0DC', borderRadius: '16px', boxShadow: '0 8px 32px rgba(139,29,61,0.1)' }} />
                <Bar dataKey="sold" name="Units Sold" fill="hsl(345 65% 33%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-primary/20 font-bold">No sales yet</div>
          )}
        </div>

        {/* Genre Pie Chart */}
        <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl p-8 border border-border shadow-sm">
          <h2 className="text-xl font-black text-primary font-cinematic mb-2">Catalog by Genre</h2>
          <p className="text-primary/40 text-sm font-bold mb-8">Book distribution across genres</p>
          {genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                  {genreData.map((_, index) => (
                    <Cell key={index} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E8E0DC', borderRadius: '16px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-primary/20 font-bold">No books yet</div>
          )}
        </div>
      </div>

      {/* Top Books Table */}
      <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border">
          <h2 className="text-xl font-black text-primary font-cinematic">Top Books — Revenue Breakdown</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Rank', 'Book', 'Units Sold', 'Revenue (EGP)'].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-primary/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(analytics?.topBooks ?? []).map((book, i) => (
              <motion.tr
                key={(book as { id: string }).id}
                className="border-b border-border hover:bg-primary/2 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="px-6 py-4">
                  <span className="text-3xl font-black text-accent/20 font-cinematic">0{i + 1}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {(book as { cover_url?: string }).cover_url && (
                      <img src={(book as { cover_url: string }).cover_url} alt="" className="w-8 h-12 object-cover rounded-lg shadow-sm" />
                    )}
                    <div>
                      <p className="font-bold text-primary text-sm" dir="rtl">{(book as { title_ar: string }).title_ar}</p>
                      <p className="text-primary/40 text-xs">{(book as { title_en: string }).title_en}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-primary">{(book as { total_sold: number }).total_sold}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-accent">{Number((book as { total_revenue: number }).total_revenue).toFixed(2)}</span>
                </td>
              </motion.tr>
            ))}
            {(analytics?.topBooks ?? []).length === 0 && (
              <tr><td colSpan={4} className="text-center py-12 text-primary/30 font-bold">No sales data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
