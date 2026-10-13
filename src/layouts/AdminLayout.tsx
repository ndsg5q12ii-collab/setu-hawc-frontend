import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { useAppState } from '../state/AppState';
import {
  Activity,
  Users,
  Briefcase,
  Video,
  DollarSign,
  ShieldAlert,
  Star,
  SlidersHorizontal,
  Settings,
  Search,
  Bell,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Radio,
  FileText,
  LogOut,
} from '../components/icons';
import { Avatar, Badge, cx } from '../components/ui';

export const AdminLayout: React.FC<{ children: React.ReactNode; activePath?: string }> = ({
  children,
  activePath,
}) => {
  const { path, navigate } = useRouter();
  const { disputes, incomingRequests } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Overview Dashboard', icon: Activity, path: '/admin' },
    { label: 'Technicians', icon: Users, path: '/admin/technicians', badge: '7 Pending' },
    { label: 'Customers', icon: Smartphone, path: '/admin/customers' },
    { label: 'Bookings Ledger', icon: Briefcase, path: '/admin/bookings' },
    { label: 'Active Sessions', icon: Video, path: '/admin/sessions', liveBadge: true },
    { label: 'Payments & Revenue', icon: DollarSign, path: '/admin/payments' },
    { label: 'Dispute Resolution', icon: ShieldAlert, path: '/admin/disputes', badge: disputes.filter(d => d.status === 'open').length.toString() },
    { label: 'Customer Reviews', icon: Star, path: '/admin/reviews' },
    { label: 'Commission Rules', icon: SlidersHorizontal, path: '/admin/commission' },
    { label: 'Market Settings', icon: Settings, path: '/admin/settings' },
  ];

  const currentActivePath = activePath || path;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary">
      {/* Top Banner & Header */}
      <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg shadow-soft">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-text-primary">SETU</span>
              <Badge variant="primary" size="sm">Admin Console</Badge>
            </div>
            <div className="text-[11px] text-text-muted font-medium">Delhi NCR Operations Hub</div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center relative w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, customer, technician..."
            className="w-full h-9 pl-9 pr-4 bg-sunken border border-border rounded-md text-xs text-text-primary placeholder:text-text-muted focus:bg-white focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Surface Quick-Jump Switches & Admin Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sunken hover:bg-border/60 text-text-secondary transition-colors"
            >
              <span>Customer Mobile App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/technician/home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sunken hover:bg-border/60 text-text-secondary transition-colors"
            >
              <span>Technician App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Admin Avatar */}
          <div className="flex items-center gap-2.5">
            <Avatar name="Operations Manager" size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold leading-tight">Admin Ops</div>
              <div className="text-[10px] text-text-muted">Super Administrator</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 select-none py-4">
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider px-2">
              <span>Navigation</span>
              <span className="flex items-center gap-1 text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentActivePath === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cx(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-all group text-left',
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-text-secondary hover:bg-sunken hover:text-text-primary'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cx('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-text-muted group-hover:text-primary')} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cx(
                        'text-[10px] px-2 py-0.5 rounded-full font-bold',
                        isActive ? 'bg-white/20 text-white' : 'bg-sunken text-primary border border-primary/20'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.liveBadge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick System Status Card in Sidebar */}
          <div className="p-3 mx-3 mt-4 rounded-md bg-sunken border border-border text-xs text-text-secondary">
            <div className="font-bold text-text-primary text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Delhi NCR Cluster
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Nehru Place, Cyber City Gurgaon, Noida Sec 62, CP active.
            </p>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
