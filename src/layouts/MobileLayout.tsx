import React from 'react';
import { useRouter } from '../lib/router';
import { useAppState } from '../state/AppState';
import {
  Home,
  Wrench,
  Calendar,
  User,
  Laptop,
  Briefcase,
  DollarSign,
  Radio,
  ChevronLeft,
  Shield,
  Layers,
} from '../components/icons';
import { Badge, cx } from '../components/ui';

interface MobileLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  darkSurface?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showBottomNav = true,
  title,
  showBackButton = false,
  onBack,
  rightAction,
  darkSurface = false,
}) => {
  const { path, navigate, goBack } = useRouter();
  const { currentRole, setCurrentRole, activeBooking } = useAppState();

  const isTechnician = path.startsWith('/technician');

  const customerNavItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'Help', icon: Wrench, path: '/help' },
    { label: 'Bookings', icon: Calendar, path: '/bookings', badge: activeBooking?.status === 'matched' ? '1' : undefined },
    { label: 'Devices', icon: Laptop, path: '/devices' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  const technicianNavItems = [
    { label: 'Dashboard', icon: Home, path: '/technician/home' },
    { label: 'Requests', icon: Radio, path: '/technician/requests', badge: '2' },
    { label: 'Bookings', icon: Calendar, path: '/technician/bookings' },
    { label: 'Earnings', icon: DollarSign, path: '/technician/earnings' },
    { label: 'Profile', icon: User, path: '/technician/profile' },
  ];

  const currentNavItems = isTechnician ? technicianNavItems : customerNavItems;

  return (
    <div className="min-h-screen bg-[#E5E8EE] flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4">
      {/* Top Prototype Surface Switcher Bar (Visible on desktop/tablet to test easily) */}
      <div className="w-full max-w-xl mb-3 hidden sm:flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur rounded-lg border border-border shadow-soft text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="font-bold text-text-primary">SETU Prototype</span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary font-mono">{path}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentRole('customer');
              navigate('/home');
            }}
            className={cx(
              'px-2.5 py-1 rounded font-semibold transition-colors',
              !isTechnician && !path.startsWith('/admin')
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-sunken'
            )}
          >
            Customer
          </button>
          <button
            onClick={() => {
              setCurrentRole('technician');
              navigate('/technician/home');
            }}
            className={cx(
              'px-2.5 py-1 rounded font-semibold transition-colors',
              isTechnician ? 'bg-primary text-white' : 'text-text-secondary hover:bg-sunken'
            )}
          >
            Technician
          </button>
          <button
            onClick={() => {
              setCurrentRole('admin');
              navigate('/admin');
            }}
            className="px-2.5 py-1 rounded font-semibold text-text-secondary hover:bg-sunken"
          >
            Admin Console ↗
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-2 py-1 text-text-muted hover:text-text-primary"
            title="Overview & Route Index"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 440px Framed Mobile Shell */}
      <div
        className={cx(
          'mobile-device-shell shadow-raised flex flex-col',
          darkSurface ? 'bg-ink text-white' : 'bg-surface text-text-primary'
        )}
      >
        {/* Status Bar */}
        <div
          className={cx(
            'h-11 px-6 flex items-center justify-between text-xs font-semibold shrink-0 select-none',
            darkSurface ? 'bg-ink text-gray-300' : 'bg-surface text-text-primary'
          )}
        >
          <span className="font-mono text-xs">9:41</span>
          <div className="w-20 h-4 bg-black/80 rounded-full mx-auto hidden sm:block opacity-75" />
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span>5G</span>
            <div className="w-4 h-2 border border-current rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-current rounded-xs" />
            </div>
          </div>
        </div>

        {/* Optional Page Top Nav Header */}
        {(title || showBackButton || rightAction) && (
          <div
            className={cx(
              'h-13 px-4 border-b flex items-center justify-between shrink-0 select-none z-10',
              darkSurface
                ? 'bg-ink-2 border-gray-800 text-white'
                : 'bg-surface border-border text-text-primary'
            )}
          >
            <div className="flex items-center gap-2">
              {showBackButton && (
                <button
                  onClick={onBack || goBack}
                  className="p-1 -ml-1 text-text-secondary hover:text-text-primary active:scale-95 transition-all"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {title && (
                <h1 className="font-bold text-base tracking-tight truncate max-w-[240px]">
                  {title}
                </h1>
              )}
            </div>
            {rightAction && <div>{rightAction}</div>}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
          {children}
        </div>

        {/* Fixed Mobile Bottom Navigation */}
        {showBottomNav && (
          <nav
            className={cx(
              'h-16 border-t px-2 flex items-center justify-around shrink-0 select-none z-20',
              darkSurface
                ? 'bg-ink-2 border-gray-800'
                : 'bg-surface/95 backdrop-blur border-border'
            )}
          >
            {currentNavItems.map((item) => {
              const isActive = path === item.path || (item.path !== '/home' && item.path !== '/technician/home' && path.startsWith(item.path));
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cx(
                    'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative',
                    isActive ? 'text-primary font-bold' : 'text-text-muted hover:text-text-secondary font-medium'
                  )}
                >
                  <div className="relative">
                    <Icon className={cx('w-5 h-5 transition-transform', isActive && 'scale-110 stroke-[2.5]')} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 bg-error text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
