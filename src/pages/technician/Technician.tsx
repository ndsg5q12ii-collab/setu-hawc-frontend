import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import { VideoStage } from '../../components/VideoStage';
import { BarChart } from '../../components/charts';
import {
  Button,
  Card,
  Badge,
  Input,
  Avatar,
  Rating,
  Modal,
  cx,
  useToast,
} from '../../components/ui';
import {
  Radio,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  X,
  Phone,
  Video,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Briefcase,
  Wrench,
  Sparkles,
} from '../../components/icons';

export const TechnicianHomeScreen: React.FC = () => {
  const { navigate } = useRouter();
  const {
    technicians,
    technicianOnline,
    setTechnicianOnline,
    todayEarnings,
    incomingRequests,
    acceptTechRequest,
    rejectTechRequest,
    bookings,
  } = useAppState();

  const currentTech = technicians[0]; // Vikram Sharma
  const activeIncoming = incomingRequests[0];

  return (
    <MobileLayout>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Header & Online/Offline Status Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Avatar src={currentTech.avatar} name={currentTech.name} size="md" verified />
            <div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Partner Console</div>
              <h3 className="font-extrabold text-base text-text-primary leading-tight">{currentTech.name}</h3>
            </div>
          </div>

          <button
            onClick={() => setTechnicianOnline(!technicianOnline)}
            className={cx(
              'px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs',
              technicianOnline ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-sunken text-text-muted border border-border'
            )}
          >
            <span className={cx('w-2 h-2 rounded-full', technicianOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
            <span>{technicianOnline ? 'Online (Accepting)' : 'Offline'}</span>
          </button>
        </div>

        {/* Live Incoming Job Notification Card (Realtime matching trigger) */}
        {technicianOnline && activeIncoming && (
          <div className="p-4 rounded-xl bg-primary text-white shadow-raised relative overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-soft">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Customer Diagnostic Request
              </span>
              <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                ⚡ 90s SLA
              </span>
            </div>

            <h4 className="font-extrabold text-lg leading-snug">{activeIncoming.customerName}</h4>
            <p className="text-xs text-primary-soft line-clamp-2 mt-1">
              {activeIncoming.deviceCategory.toUpperCase()}: {activeIncoming.issueDescription}
            </p>

            <div className="flex items-center justify-between mt-3 text-xs pt-2 border-t border-white/20">
              <div className="flex items-center gap-1 text-primary-soft">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeIncoming.location} ({activeIncoming.distance})</span>
              </div>
              <div className="font-mono font-bold text-emerald-300 text-sm">
                +₹{activeIncoming.potentialEarnings} payout
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="md"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  acceptTechRequest(activeIncoming.id);
                  navigate(`/technician/session/${activeIncoming.bookingId}`);
                }}
              >
                Accept & Start Call
              </Button>
              <button
                onClick={() => rejectTechRequest(activeIncoming.id)}
                className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Earnings Snapshot Card */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Today's Payouts</span>
            <button
              onClick={() => navigate('/technician/earnings')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ledger →
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-mono text-3xl font-extrabold text-text-primary">₹{todayEarnings}</div>
              <div className="text-xs text-success font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18% compared to yesterday</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-sm text-text-primary">4 Calls</div>
              <div className="text-[11px] text-text-muted">94.5% Solved</div>
            </div>
          </div>
        </div>

        {/* Assigned Bookings for Today */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Today's Queue</h4>
            <span className="text-xs font-semibold text-primary">{bookings.length} jobs</span>
          </div>

          <div className="space-y-2.5">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between text-left hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => navigate(`/technician/session/${b.id}`)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
                    <Badge variant={b.status === 'in_session' ? 'warning' : 'neutral'} size="sm">
                      {b.status}
                    </Badge>
                  </div>
                  <h5 className="font-bold text-sm text-text-primary mt-1">{b.customerName}</h5>
                  <p className="text-xs text-text-secondary line-clamp-1">{b.issueDescription}</p>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-text-primary">
                    ₹{Math.round(b.totalAmount * 0.8)}
                  </div>
                  <span className="text-[11px] text-primary font-semibold">Open Call →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export const TechnicianRequestsScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { incomingRequests, acceptTechRequest, rejectTechRequest } = useAppState();

  return (
    <MobileLayout title="Incoming Customer Jobs">
      <div className="p-4 space-y-4 pb-8 animate-fade-up">
        <p className="text-xs text-text-secondary">
          Live requests waiting for technical diagnosis in South Delhi, Gurgaon, and Noida.
        </p>

        {incomingRequests.length === 0 ? (
          <div className="p-8 text-center bg-surface rounded-lg border border-dashed border-border-strong text-xs text-text-muted">
            <Radio className="w-8 h-8 mx-auto mb-2 text-text-muted animate-pulse" />
            No pending requests at this moment. You will hear an alert sound when a new job arrives.
          </div>
        ) : (
          incomingRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-surface border border-border shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary">{req.deviceCategory.toUpperCase()}</Badge>
                <span className="font-mono text-xs font-bold text-emerald-600">
                  +₹{req.potentialEarnings} Net Payout
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-text-primary">{req.customerName}</h4>
                <p className="text-xs text-text-secondary mt-1">{req.issueDescription}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <MapPin className="w-3.5 h-3.5" />
                <span>{req.location} ({req.distance})</span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    acceptTechRequest(req.id);
                    navigate(`/technician/session/${req.bookingId}`);
                  }}
                >
                  Accept & Connect
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectTechRequest(req.id)}
                >
                  Pass
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </MobileLayout>
  );
};

export const TechnicianBookingsScreen: React.FC = () => {
  const { bookings } = useAppState();

  return (
    <MobileLayout title="Technician Schedule">
      <div className="p-4 space-y-3 pb-8 animate-fade-up">
        {bookings.map((b) => (
          <div key={b.id} className="p-4 rounded-xl bg-surface border border-border space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
              <Badge variant={b.status === 'completed' ? 'success' : 'primary'}>{b.status}</Badge>
            </div>
            <h4 className="font-bold text-sm text-text-primary">{b.customerName}</h4>
            <p className="text-xs text-text-secondary">{b.issueDescription}</p>
            <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
              <span>{b.scheduledTime}</span>
              <span className="font-mono font-bold text-text-primary">Net ₹{Math.round(b.totalAmount * 0.8)}</span>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export const TechnicianSessionScreen: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const { navigate } = useRouter();
  const { technicians, customer, bookings, submitOutcome } = useAppState();

  const currentTech = technicians[0];
  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  const handleEndCall = () => {
    submitOutcome(booking.id, true, 'Issue diagnosed and solved by technician Vikram.');
    navigate('/technician/home');
  };

  return (
    <div className="w-full h-screen bg-ink flex flex-col justify-center items-center">
      <div className="w-full max-w-[440px] h-full sm:h-[844px] bg-ink relative sm:rounded-shell overflow-hidden shadow-floating flex flex-col">
        <VideoStage
          role="technician"
          technician={currentTech}
          customerName={booking.customerName || customer.name}
          bookingId={booking.id}
          deviceCategory={booking.deviceCategory}
          issueDescription={booking.issueDescription}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};

export const TechnicianEarningsScreen: React.FC = () => {
  const { todayEarnings, transactions } = useAppState();
  const { addToast } = useToast();

  const weeklyData = [
    { label: 'Mon', value: 2100 },
    { label: 'Tue', value: 2850 },
    { label: 'Wed', value: 3400 },
    { label: 'Thu', value: 2450 },
    { label: 'Fri', value: 3900 },
    { label: 'Sat', value: 4200 },
    { label: 'Sun', value: 2900 },
  ];

  return (
    <MobileLayout title="Earnings & Payouts">
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Total Balance Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary to-primary-pressed text-white shadow-raised">
          <div className="text-xs font-semibold text-primary-soft">Available Payout Balance</div>
          <div className="font-mono text-3xl font-extrabold mt-1">₹{todayEarnings + 4200}</div>
          <p className="text-[11px] text-primary-soft mt-1">Direct Bank / UPI transfer enabled</p>

          <Button
            size="md"
            variant="secondary"
            className="w-full mt-4 font-bold"
            onClick={() => addToast({ title: 'Payout Initiated', message: '₹2,450 sent to HDFC Bank A/c ending 4812 via IMPS.', type: 'success' })}
          >
            Withdraw to Bank Account
          </Button>
        </div>

        {/* Weekly Chart */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Weekly Earnings (₹)</h4>
          <BarChart data={weeklyData} height={150} />
        </div>

        {/* Transactions List */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Recent Job Payouts</h4>
          <div className="space-y-2">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-text-primary">{tx.customerName}</div>
                  <div className="text-[10px] text-text-muted">{tx.timestamp}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-success text-sm">+₹{tx.technicianPayout}</div>
                  <div className="text-[10px] text-text-muted font-mono">fee -₹{tx.platformCommission}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export const TechnicianProfileScreen: React.FC = () => {
  const { technicians } = useAppState();
  const currentTech = technicians[0];

  return (
    <MobileLayout title="Partner Profile">
      <div className="p-4 space-y-4 pb-8 animate-fade-up">
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft flex flex-col items-center text-center">
          <Avatar src={currentTech.avatar} name={currentTech.name} size="xl" verified />
          <h3 className="font-extrabold text-lg text-text-primary mt-3">{currentTech.name}</h3>
          <p className="text-xs text-text-secondary">{currentTech.email} • {currentTech.phone}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="verified">{currentTech.badge}</Badge>
            <Badge variant="success">Aadhaar KYC Approved</Badge>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-text-muted">Aadhaar Card</span>
            <span className="font-mono font-bold text-success">Verified (XXXX-8921)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-text-muted">Police Clearance</span>
            <span className="font-mono font-bold text-success">Verified (Delhi Police)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-text-muted">Bank Account</span>
            <span className="font-mono font-bold text-text-primary">HDFC Bank ••4812</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export const TechnicianOnboardingScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [techName, setTechName] = useState('Vikram Sharma');
  const [phone, setPhone] = useState('9811234567');
  const [specialty, setSpecialty] = useState('Apple & Laptop Hardware');

  const handleFinish = () => {
    addToast({ title: 'Application Submitted', message: 'Your partner KYC has been submitted for admin review.', type: 'success' });
    navigate('/technician/home');
  };

  return (
    <MobileLayout title="Partner Onboarding" showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        <div className="flex justify-between items-center text-xs font-bold text-text-muted uppercase tracking-wider">
          <span>Step {step} of 3</span>
          <Badge variant="primary">{step === 1 ? 'Personal Info' : step === 2 ? 'KYC Verification' : 'Payout Details'}</Badge>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Input label="Full Legal Name" value={techName} onChange={(e) => setTechName(e.target.value)} />
            <Input label="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Primary Technical Specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            <Button size="lg" className="w-full mt-4" onClick={() => setStep(2)}>
              Next: Upload Documents
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-border rounded-lg text-center bg-sunken">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-1" />
              <div className="text-xs font-bold text-text-primary">Aadhaar Card (Front & Back)</div>
              <div className="text-[10px] text-text-muted mt-0.5">Government ID for Delhi NCR background vetting</div>
              <Button size="sm" variant="outline" className="mt-2">Simulate Upload ID</Button>
            </div>
            <Button size="lg" className="w-full mt-4" onClick={() => setStep(3)}>
              Next: Bank Info
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input label="Bank Account Number / UPI ID" placeholder="vikram@okhdfcbank" />
            <Input label="IFSC Code" placeholder="HDFC0001234" />
            <Button size="lg" className="w-full mt-4" onClick={handleFinish}>
              Submit Partner Application
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
