import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import { VideoStage } from '../../components/VideoStage';
import { ReceiptSummary } from '../../components/domain';
import { Button, Card, Badge, Input, Modal, cx, useToast } from '../../components/ui';
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Navigation,
  Phone,
  Clock,
  Sparkles,
} from '../../components/icons';

export const CustomerSessionScreen: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const { navigate } = useRouter();
  const { bookings, customer } = useAppState();
  const [showEndModal, setShowEndModal] = useState(false);

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];
  const technician = booking.technician || {
    id: 'tech-101',
    name: 'Vikram Sharma',
    avatar: '',
    rating: 4.9,
    reviewsCount: 340,
    sessionRate: 299,
    visitRate: 599,
    location: 'Nehru Place, New Delhi',
    distance: '2.4 km',
    eta: 'Now',
    skills: ['Apple ACMT', 'Hardware Diagnostic'],
    categories: ['laptop'],
    verified: true,
    verificationStatus: 'verified' as any,
    experienceYears: 8,
    bio: '',
    badge: 'Top Rated' as any,
    completedSessions: 420,
    resolutionRate: 94.5,
    availability: 'available' as any,
    aadhaarVerified: true,
    policeVerification: true,
    phone: '+91 98112 34567',
    email: '',
  };

  return (
    <div className="w-full h-screen bg-ink flex flex-col justify-center items-center">
      <div className="w-full max-w-[440px] h-full sm:h-[844px] bg-ink relative sm:rounded-shell overflow-hidden shadow-floating flex flex-col">
        <VideoStage
          role="customer"
          technician={technician}
          customerName={customer.name}
          bookingId={booking.id}
          deviceCategory={booking.deviceCategory}
          issueDescription={booking.issueDescription}
          onEndCall={() => setShowEndModal(true)}
        />

        {/* End Call Confirmation Modal */}
        <Modal
          isOpen={showEndModal}
          onClose={() => setShowEndModal(false)}
          title="End Video Session?"
          description="Are you sure you want to end this diagnostic session with your technician?"
        >
          <div className="space-y-3 pt-2">
            <Button
              variant="danger"
              className="w-full"
              onClick={() => {
                setShowEndModal(false);
                navigate(`/resolution/${booking.id}`);
              }}
            >
              Yes, End Session & Proceed to Outcome
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowEndModal(false)}
            >
              Resume Video Call
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export const ResolutionScreen: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const { navigate } = useRouter();
  const { bookings, submitOutcome } = useAppState();

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  const handleSolved = () => {
    submitOutcome(booking.id, true, 'Issue successfully fixed over video call.');
    navigate('/payment');
  };

  const handleNeedVisit = () => {
    submitOutcome(booking.id, false, 'Hardware part replacement needed. Doorstep visit requested.');
    navigate(`/visit/arrival/${booking.id}`);
  };

  const handleRefund = () => {
    submitOutcome(booking.id, false, 'Customer requested refund review due to unsolvable remote session.');
    navigate('/home');
  };

  return (
    <MobileLayout title="Session Outcome" showBackButton={false}>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Header */}
        <div className="text-center pt-2">
          <Badge variant="primary" size="md">Step 1 of 2</Badge>
          <h2 className="text-xl font-extrabold text-text-primary mt-2">Was your issue solved?</h2>
          <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
            Tell us how the remote diagnostic with {booking.technician?.name || 'Vikram Sharma'} went.
          </p>
        </div>

        {/* Option 1: Solved */}
        <button
          onClick={handleSolved}
          className="w-full p-4 rounded-xl border border-emerald-500/40 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 text-left transition-all active:scale-[0.99] shadow-soft group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-success flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-success group-hover:underline">Proceed to Pay →</span>
          </div>
          <h4 className="font-extrabold text-sm text-emerald-950 mt-3">Yes, Issue Completely Solved!</h4>
          <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
            The technician helped me identify and fix the issue. Proceed to session fee payment & receipt.
          </p>
        </button>

        {/* Option 2: Need In-Person Visit */}
        <button
          onClick={handleNeedVisit}
          className="w-full p-4 rounded-xl border border-primary/40 bg-primary-soft/40 hover:bg-primary-soft hover:border-primary text-left transition-all active:scale-[0.99] shadow-soft group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-primary group-hover:underline">Schedule Visit →</span>
          </div>
          <h4 className="font-extrabold text-sm text-text-primary mt-3">No, Need In-Person Doorstep Visit</h4>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            The problem needs hands-on hardware soldering or replacement parts. Dispatch same technician to home.
          </p>
        </button>

        {/* Option 3: Unsolved / Refund Claim */}
        <button
          onClick={handleRefund}
          className="w-full p-3.5 rounded-lg border border-border bg-surface hover:bg-sunken text-left transition-all text-xs"
        >
          <div className="font-bold text-text-primary">Neither / Technical Dropped Call?</div>
          <p className="text-[11px] text-text-muted mt-0.5">
            Claim 100% money-back refund or free credit under Setu Guarantee.
          </p>
        </button>
      </div>
    </MobileLayout>
  );
};

export const VisitArrivalScreen: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const { navigate } = useRouter();
  const { bookings } = useAppState();
  const [visitStep, setVisitStep] = useState(2); // 0: Assigned, 1: Dispatched, 2: En Route, 3: Arrived

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  return (
    <MobileLayout title="Track Home Visit" showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Status Stepper */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="info">Doorstep Technician En Route</Badge>
            <span className="font-mono text-xs font-bold text-primary">ETA: 14 mins</span>
          </div>

          <div className="relative pt-2">
            <div className="h-1.5 w-full bg-sunken rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${((visitStep + 1) / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-text-muted mt-2 uppercase tracking-wider">
              <span>Booked</span>
              <span>Dispatched</span>
              <span className="text-primary">En Route</span>
              <span>At Door</span>
            </div>
          </div>
        </div>

        {/* Doorstep Verification PIN */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Safety Arrival Code</div>
            <div className="font-mono text-3xl font-extrabold text-emerald-900 tracking-widest my-0.5">
              {booking.visitCode || '8491'}
            </div>
            <p className="text-[11px] text-emerald-700">Check technician ID and share this 4-digit code.</p>
          </div>
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>

        {/* Technician Card */}
        {booking.technician && (
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={booking.technician.avatar}
                alt={booking.technician.name}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <h4 className="font-bold text-sm text-text-primary">{booking.technician.name}</h4>
                <div className="text-xs text-text-muted">⭐ {booking.technician.rating} • 8y Experience</div>
                <Badge variant="verified" size="sm" className="mt-1">Aadhaar Verified</Badge>
              </div>
            </div>

            <a
              href={`tel:${booking.technician.phone}`}
              className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Arrival Simulation Button */}
        <div className="pt-2">
          <Button
            size="lg"
            className="w-full"
            rightIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => {
              navigate('/payment');
            }}
          >
            Technician Finished Fix → Pay & Rate
          </Button>
          <span className="text-[10px] text-text-muted text-center block mt-2">
            Once physical work is complete, technician triggers work completion for payment.
          </span>
        </div>
      </div>
    </MobileLayout>
  );
};

export const PaymentScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { activeBooking, completePayment } = useAppState();

  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [failSimulation, setFailSimulation] = useState(false);

  const booking = activeBooking || {
    id: 'BK-8902',
    baseAmount: 299,
    platformFee: 29,
    taxAmount: 59,
    totalAmount: 387,
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (failSimulation) {
        addToast({
          title: 'Payment Failed (Bank Timeout)',
          message: 'Your bank timed out. Please retry or choose another payment method.',
          type: 'error',
        });
        setFailSimulation(false); // allow retry
      } else {
        completePayment(booking.id, `UPI (${upiApp.toUpperCase()})`);
        navigate('/review');
      }
    }, 1200);
  };

  return (
    <MobileLayout title="Payment & Receipt" showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Bill Summary */}
        <ReceiptSummary booking={booking as any} />

        {/* Payment Methods */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            Select Payment Method
          </label>
          <div className="space-y-2">
            {/* UPI */}
            <div
              onClick={() => setMethod('upi')}
              className={cx(
                'p-3.5 rounded-lg border cursor-pointer transition-all',
                method === 'upi' ? 'border-primary bg-primary-soft/30 ring-1 ring-primary' : 'border-border bg-surface hover:bg-sunken'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">Instant UPI (0% Fee)</span>
                <Badge variant="success">Fastest</Badge>
              </div>

              {method === 'upi' && (
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUpiApp('gpay'); }}
                    className={cx('py-2 px-1 rounded border text-xs font-bold text-center', upiApp === 'gpay' ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary')}
                  >
                    Google Pay
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUpiApp('phonepe'); }}
                    className={cx('py-2 px-1 rounded border text-xs font-bold text-center', upiApp === 'phonepe' ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary')}
                  >
                    PhonePe
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUpiApp('paytm'); }}
                    className={cx('py-2 px-1 rounded border text-xs font-bold text-center', upiApp === 'paytm' ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary')}
                  >
                    Paytm
                  </button>
                </div>
              )}
            </div>

            {/* Cards */}
            <div
              onClick={() => setMethod('card')}
              className={cx(
                'p-3.5 rounded-lg border cursor-pointer transition-all',
                method === 'card' ? 'border-primary bg-primary-soft/30 ring-1 ring-primary' : 'border-border bg-surface hover:bg-sunken'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">Credit / Debit Card</span>
                <CreditCard className="w-4 h-4 text-text-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="p-3 bg-sunken rounded-lg text-xs text-text-secondary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-success shrink-0" />
          <span>256-bit encrypted bank checkout via Razorpay Gateway.</span>
        </div>

        {/* Edge Case Toggle (Flowchart 1: Payment Failed) */}
        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>Test Payment Failure Edge Case:</span>
          <button
            type="button"
            onClick={() => setFailSimulation(!failSimulation)}
            className={cx('px-2 py-0.5 rounded font-mono font-bold text-[11px]', failSimulation ? 'bg-error text-white' : 'bg-sunken text-text-secondary')}
          >
            {failSimulation ? 'Failure ON' : 'Failure OFF'}
          </button>
        </div>

        {/* Pay Button */}
        <Button
          size="lg"
          className="w-full mt-4"
          isLoading={isProcessing}
          onClick={handlePay}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Pay ₹{booking.totalAmount} Securely
        </Button>
      </div>
    </MobileLayout>
  );
};
