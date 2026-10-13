import React, { Suspense } from 'react';
import { RouterProvider, useRouter, matchPath } from './lib/router';
import { AppStateProvider } from './state/AppState';
import { ToastProvider, LoadingSpinner, Badge, Button, cx } from './components/ui';

// Customer Pages
import {
  SplashScreen,
  WelcomeScreen,
  LoginScreen,
} from './pages/customer/Auth';
import {
  HomeScreen,
  HelpScreen,
  ProblemScreen,
} from './pages/customer/Home';
import {
  MatchingScreen,
  TechniciansListScreen,
  TechnicianProfileScreen,
} from './pages/customer/Find';
import {
  BookingFormScreen,
  BookingConfirmedScreen,
  BookingDetailScreen,
  WaitingScreen,
} from './pages/customer/Booking';
import {
  CustomerSessionScreen,
  ResolutionScreen,
  VisitArrivalScreen,
  PaymentScreen,
} from './pages/customer/Session';
import {
  BookingsListScreen,
  DevicesScreen,
  ProfileScreen,
  ReviewScreen,
} from './pages/customer/Account';

// Technician Pages
import {
  TechnicianHomeScreen,
  TechnicianRequestsScreen,
  TechnicianBookingsScreen,
  TechnicianSessionScreen,
  TechnicianEarningsScreen,
  TechnicianProfileScreen as TechProfileScreen,
  TechnicianOnboardingScreen,
} from './pages/technician/Technician';

// Admin Pages
import {
  AdminDashboardScreen,
  AdminTechniciansScreen,
  AdminBookingsScreen,
  AdminSessionsScreen,
  AdminPaymentsScreen,
  AdminDisputesScreen,
  AdminCommissionScreen,
  AdminSettingsScreen,
} from './pages/admin/Admin';

import {
  Smartphone,
  Briefcase,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Video,
  Wrench,
  DollarSign,
  AlertCircle,
} from './components/icons';

// ================= Launcher Screen (at `/`) =================
const LauncherScreen: React.FC = () => {
  const { navigate } = useRouter();

  const surfaces = [
    {
      title: 'Customer Mobile App',
      tag: 'Delhi NCR Consumers',
      icon: Smartphone,
      color: 'from-blue-600 to-indigo-700',
      badge: '440px Shell',
      desc: 'Instant 90s remote video diagnosis, verified technician matching, doorstep escalation, and UPI checkout.',
      route: '/splash',
      quickLinks: [
        { name: 'Splash & Onboarding', path: '/splash' },
        { name: 'Customer Home', path: '/home' },
        { name: 'Select Device', path: '/help' },
        { name: 'Describe Problem', path: '/problem' },
        { name: 'Matching Radar', path: '/matching' },
        { name: 'Video Waiting Room', path: '/waiting/BK-8902' },
        { name: 'Live Video Session', path: '/session/BK-8902' },
        { name: 'Outcome & Payment', path: '/payment' },
      ],
    },
    {
      title: 'Technician Partner App',
      tag: 'Local Repair Freelancers & Shops',
      icon: Briefcase,
      color: 'from-indigo-600 to-violet-700',
      badge: '440px Shell',
      desc: 'Realtime incoming job alerts, online/offline availability, diagnostic tools, and instant daily payouts.',
      route: '/technician/home',
      quickLinks: [
        { name: 'Partner Dashboard', path: '/technician/home' },
        { name: 'Live Incoming Requests', path: '/technician/requests' },
        { name: 'Technician Video Call', path: '/technician/session/BK-8902' },
        { name: 'Earnings & Bank Payout', path: '/technician/earnings' },
        { name: 'Partner Onboarding', path: '/technician/onboarding' },
      ],
    },
    {
      title: 'Admin Operations Console',
      tag: 'Central Ops & Fleet Command',
      icon: Activity,
      color: 'from-slate-800 to-slate-900',
      badge: 'Desktop Console',
      desc: 'Marketplace GMV revenue analytics, SVG chart metrics, technician KYC vetting, and dispute management.',
      route: '/admin',
      quickLinks: [
        { name: 'KPIs & Revenue Analytics', path: '/admin' },
        { name: 'Technician Fleet Directory', path: '/admin/technicians' },
        { name: 'Bookings Ledger', path: '/admin/bookings' },
        { name: 'Live WebRTC Sessions', path: '/admin/sessions' },
        { name: 'Payments & Revenue', path: '/admin/payments' },
        { name: 'Dispute Resolution Desk', path: '/admin/disputes' },
        { name: 'Commission & Pricing Rules', path: '/admin/commission' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-text-primary p-6 md:p-12 flex flex-col justify-between font-sans">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-raised">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">SETU</h1>
                <Badge variant="primary">HAWK Marketplace Prototype</Badge>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Verified Technology Support Marketplace · Delhi NCR Pre-MVP Prototype
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              3 Surfaces · All Routes Active
            </span>
          </div>
        </div>

        {/* 3 Primary Surface Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {surfaces.map((surface, idx) => {
            const Icon = surface.icon;
            return (
              <div
                key={idx}
                className="bg-surface rounded-xl border border-border shadow-soft hover:shadow-raised transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="neutral">{surface.badge}</Badge>
                  </div>

                  <h3 className="font-extrabold text-lg text-text-primary group-hover:text-primary transition-colors">
                    {surface.title}
                  </h3>
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
                    {surface.tag}
                  </div>
                  <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                    {surface.desc}
                  </p>

                  {/* Quick Route Links */}
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                      Direct Screen Links:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {surface.quickLinks.map((link, i) => (
                        <button
                          key={i}
                          onClick={() => navigate(link.path)}
                          className="text-[11px] px-2 py-1 bg-sunken hover:bg-primary-soft hover:text-primary rounded font-medium text-text-secondary transition-colors"
                        >
                          {link.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sunken/60 border-t border-border">
                  <Button
                    size="md"
                    className="w-full justify-between"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => navigate(surface.route)}
                  >
                    Open {surface.title}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture Spec Highlights */}
        <div className="p-5 rounded-xl bg-surface border border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-text-primary">Shared Architecture & Design Tokens</h4>
              <p className="text-text-secondary mt-0.5">
                Plus Jakarta Sans typography, #2B2F8F primary token, custom hash routing, SVG charts, and interactive VideoStage component.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate('/home')}>
              Customer App
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin')}>
              Admin Console
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-text-muted mt-8 border-t border-border pt-4">
        Setu Technical Support Marketplace Prototype · React + TypeScript + Vite + Tailwind CSS
      </div>
    </div>
  );
};

// ================= 404 Screen =================
const NotFoundScreen: React.FC = () => {
  const { path, navigate } = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 text-error flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-text-primary">404 - Screen Not Found</h2>
      <p className="text-xs text-text-secondary mt-1 font-mono">{path}</p>
      <div className="flex gap-2 mt-6">
        <Button onClick={() => navigate('/')}>Return to Launcher</Button>
        <Button variant="outline" onClick={() => navigate('/home')}>Go to Customer Home</Button>
      </div>
    </div>
  );
};

// ================= Route Registry Component =================
const AppRoutes: React.FC = () => {
  const { path } = useRouter();

  // Launcher
  if (path === '/' || path === '') return <LauncherScreen />;

  // 1. Customer Routes
  if (path === '/splash') return <SplashScreen />;
  if (path === '/welcome') return <WelcomeScreen />;
  if (path === '/login') return <LoginScreen />;
  if (path === '/home') return <HomeScreen />;
  if (path === '/help') return <HelpScreen />;
  if (path === '/problem') return <ProblemScreen />;
  if (path === '/matching') return <MatchingScreen />;
  if (path === '/technicians') return <TechniciansListScreen />;

  // Technician detail param route
  const techDetailMatch = matchPath('/technician/:id', path);
  if (techDetailMatch.matches) {
    return <TechnicianProfileScreen technicianId={techDetailMatch.params.id} />;
  }

  // Booking routes
  if (path === '/booking') return <BookingFormScreen />;
  if (path === '/booking/confirmed') return <BookingConfirmedScreen />;

  const bookingDetailMatch = matchPath('/booking/:id', path);
  if (bookingDetailMatch.matches) {
    return <BookingDetailScreen bookingId={bookingDetailMatch.params.id} />;
  }

  const waitingMatch = matchPath('/waiting/:id', path);
  if (waitingMatch.matches) {
    return <WaitingScreen bookingId={waitingMatch.params.id} />;
  }

  // Session routes
  const sessionMatch = matchPath('/session/:id', path);
  if (sessionMatch.matches) {
    return <CustomerSessionScreen bookingId={sessionMatch.params.id} />;
  }

  const resolutionMatch = matchPath('/resolution/:id', path);
  if (resolutionMatch.matches) {
    return <ResolutionScreen bookingId={resolutionMatch.params.id} />;
  }

  const visitArrivalMatch = matchPath('/visit/arrival/:id', path);
  if (visitArrivalMatch.matches) {
    return <VisitArrivalScreen bookingId={visitArrivalMatch.params.id} />;
  }

  // Payment, review, account routes
  if (path === '/payment') return <PaymentScreen />;
  if (path === '/review') return <ReviewScreen />;
  if (path === '/bookings') return <BookingsListScreen />;
  if (path === '/devices') return <DevicesScreen />;
  if (path === '/profile') return <ProfileScreen />;

  // 2. Technician Routes
  if (path === '/technician/home') return <TechnicianHomeScreen />;
  if (path === '/technician/requests') return <TechnicianRequestsScreen />;
  if (path === '/technician/bookings') return <TechnicianBookingsScreen />;

  const techSessionMatch = matchPath('/technician/session/:id', path);
  if (techSessionMatch.matches) {
    return <TechnicianSessionScreen bookingId={techSessionMatch.params.id} />;
  }

  if (path === '/technician/earnings') return <TechnicianEarningsScreen />;
  if (path === '/technician/profile') return <TechProfileScreen />;
  if (path === '/technician/onboarding') return <TechnicianOnboardingScreen />;

  // 3. Admin Routes
  if (path === '/admin' || path === '/admin/login') return <AdminDashboardScreen />;
  if (path === '/admin/technicians') return <AdminTechniciansScreen />;

  const adminTechDetailMatch = matchPath('/admin/technicians/:id', path);
  if (adminTechDetailMatch.matches) {
    return <AdminTechniciansScreen />;
  }

  if (path === '/admin/customers') return <AdminTechniciansScreen />;
  if (path === '/admin/bookings') return <AdminBookingsScreen />;
  if (path === '/admin/sessions') return <AdminSessionsScreen />;
  if (path === '/admin/payments') return <AdminPaymentsScreen />;
  if (path === '/admin/disputes') return <AdminDisputesScreen />;
  if (path === '/admin/reviews') return <AdminDisputesScreen />;
  if (path === '/admin/commission') return <AdminCommissionScreen />;
  if (path === '/admin/settings') return <AdminSettingsScreen />;

  // Unknown route
  return <NotFoundScreen />;
};

// ================= Main App Bootstrap =================
export function App() {
  return (
    <RouterProvider>
      <AppStateProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </ToastProvider>
      </AppStateProvider>
    </RouterProvider>
  );
}

export default App;
