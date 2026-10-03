import { useState, useCallback, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, Globe, PenTool,
  ShoppingBag, BarChart3, Download, LogOut, ChevronRight,
  Play, Bell, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { useAdminOrderNotifications, type NewOrderPayload } from '@/hooks/useAdminOrderNotifications';
import { OrderNotificationToasts } from '@/components/admin/OrderNotifications';

interface OrderToast extends NewOrderPayload { toastId: string; }

let toastCounter = 0;

const navItems = [
  { href: '/admin',           label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/books',     label: 'Books',           icon: BookOpen },
  { href: '/admin/authors',   label: 'Authors',         icon: Users },
  { href: '/admin/worlds',    label: 'Worlds',          icon: Globe },
  { href: '/admin/blog',      label: 'Blog',            icon: PenTool },
  { href: '/admin/orders',    label: 'Orders',          icon: ShoppingBag },
  { href: '/admin/analytics', label: 'Analytics',       icon: BarChart3 },
  { href: '/admin/media',     label: 'Media Hub',       icon: Play },
  { href: '/admin/exports',   label: 'Export Reports',  icon: Download },
];

function AdminSidebar({
  newOrderCount,
  onBellClick,
  collapsed,
  onToggle,
}: {
  newOrderCount: number;
  onBellClick: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [location] = useLocation();
  const { profile, signOut } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 admin-sidebar flex flex-col relative z-20"
      style={{ minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 flex-shrink-0 rounded-xl admin-logo-icon flex items-center justify-center shadow-lg text-sm">
          <span>🚪</span>
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-w-0"
          >
            <p className="text-white font-bold text-sm font-arabic truncate">ممر الكتب</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Admin Panel</p>
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* New order notification */}
      {newOrderCount > 0 && !collapsed && (
        <div className="px-3 pt-3">
          <button
            onClick={onBellClick}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl admin-alert-btn font-bold text-xs animate-pulse hover:animate-none transition-all"
          >
            <Bell size={14} />
            <span className="flex-1 text-left">{newOrderCount} New Order{newOrderCount > 1 ? 's' : ''}!</span>
            <span className="w-5 h-5 bg-white/20 rounded-full text-[10px] font-black flex items-center justify-center">
              {newOrderCount > 9 ? '9+' : newOrderCount}
            </span>
          </button>
        </div>
      )}
      {newOrderCount > 0 && collapsed && (
        <div className="px-3 pt-3 flex justify-center">
          <button onClick={onBellClick} className="relative p-2 rounded-xl admin-alert-btn">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
              {newOrderCount > 9 ? '9+' : newOrderCount}
            </span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== '/admin' && location.startsWith(item.href));
          const Icon = item.icon;
          const isOrders = item.href === '/admin/orders';
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group relative ${
                  isActive
                    ? 'admin-nav-active text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="font-semibold text-sm flex-1 truncate">{item.label}</span>
                )}
                {isOrders && newOrderCount > 0 && !collapsed && (
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {newOrderCount > 9 ? '9+' : newOrderCount}
                  </span>
                )}
                {isActive && !collapsed && <ChevronRight size={12} className="text-white/40 flex-shrink-0" />}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="admin-tooltip absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + Sign Out */}
      <div className="p-3 border-t border-white/5">
        {profile && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 flex-shrink-0 admin-avatar rounded-lg flex items-center justify-center text-sm font-bold">
              {(profile.full_name || profile.email)[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{profile.full_name || profile.email}</p>
              <p className="text-slate-500 text-[10px] capitalize">{profile.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          title={collapsed ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-150 font-semibold text-sm"
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [toasts, setToasts] = useState<OrderToast[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNewOrder = useCallback((order: NewOrderPayload) => {
    const toastId = `toast-${++toastCounter}`;
    setToasts((prev) => [{ ...order, toastId }, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 12000);
  }, []);

  const { requestPermission } = useAdminOrderNotifications(handleNewOrder, isAdmin);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  if (isLoading) {
    return (
      <div className="min-h-screen admin-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="flex min-h-screen admin-bg">
      <AdminSidebar
        newOrderCount={toasts.length}
        onBellClick={() => navigate('/admin/orders')}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />
      <main className="flex-1 overflow-auto min-w-0">
        {/* Permission banner */}
        {typeof Notification !== 'undefined' && Notification.permission === 'default' && (
          <div className="admin-banner border-b px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell size={15} className="text-violet-400 flex-shrink-0" />
              <p className="text-sm font-medium text-slate-300">
                Enable browser notifications to receive order alerts even when you're on another tab.
              </p>
            </div>
            <button
              onClick={requestPermission}
              className="px-4 py-1.5 admin-btn-primary font-semibold text-xs uppercase tracking-wide rounded-lg flex-shrink-0"
            >
              Enable
            </button>
          </div>
        )}
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      <OrderNotificationToasts orders={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ── Re-usable Admin page header ──────────────────────────────────

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-white mb-0.5">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────

export function StatCard({
  label, value, icon: Icon, trend, color = 'violet',
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: { value: number; label: string };
  color?: 'violet' | 'emerald' | 'amber' | 'sky' | 'rose';
}) {
  const colorMap = {
    violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    amber:   'from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    sky:     'from-sky-600/20 to-sky-600/5 border-sky-500/20 text-sky-400',
    rose:    'from-rose-600/20 to-rose-600/5 border-rose-500/20 text-rose-400',
  };

  return (
    <motion.div
      className={`admin-card rounded-2xl p-6 border bg-gradient-to-br ${colorMap[color]}`}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-current/10 ${colorMap[color].split(' ').pop()}`}>
          <Icon size={20} className="opacity-90" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
            trend.value >= 0
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-rose-500/15 text-rose-400'
          }`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1 tabular-nums">{value}</p>
      <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}
