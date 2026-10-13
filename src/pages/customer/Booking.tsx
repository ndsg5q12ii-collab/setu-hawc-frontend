import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import { ReceiptSummary, CategoryIcon } from '../../components/domain';
import {
  Button,
  Card,
  Badge,
  Input,
  Avatar,
  Modal,
  cx,
  useToast,
} from '../../components/ui';
import {
  Calendar,
  Clock,
  Video,
  Wrench,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Camera,
  Mic,
  ArrowRight,
  Phone,
  RefreshCw,
  Copy,
} from '../../components/icons';

export const BookingFormScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { selectedTechnician, supportDraft, customer, createSupportBooking } = useAppState();

  const [serviceType, setServiceType] = useState<'remote_video' | 'in_person_visit'>(
    (supportDraft.serviceType as any) || 'remote_video'
  );
  const [slot, setSlot] = useState('Immediate (In 90 seconds)');
  const [address, setAddress] = useState(customer.address);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slots = [
    'Immediate (In 90 seconds)',
    'Today, 3:30 PM - 4:15 PM',
    'Today, 6:00 PM - 6:45 PM',
    'Tomorrow, 10:30 AM',
  ];

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newBk = createSupportBooking(selectedTechnician?.id, serviceType === 'in_person_visit');
      navigate(`/booking/confirmed?id=${newBk.id}`);
    }, 600);
  };

  const isVisit = serviceType === 'in_person_visit';
  const basePrice = isVisit ? (selectedTechnician?.visitRate || 599) : (selectedTechnician?.sessionRate || 299);
  const platformFee = Math.round(basePrice * 0.1);
  const gst = Math.round((basePrice + platformFee) * 0.18);
  const total = basePrice + platformFee + gst;

  return (
    <MobileLayout title="Confirm Booking" showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Support Service Choice */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            Select Service Type
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setServiceType('remote_video')}
              className={cx(
                'p-3 rounded-lg border text-left transition-all',
                serviceType === 'remote_video'
                  ? 'border-primary bg-primary-soft/40 ring-2 ring-primary/20'
                  : 'border-border bg-surface hover:bg-sunken'
              )}
            >
              <div className="flex items-center justify-between">
                <Video className="w-5 h-5 text-primary" />
                <span className="font-mono text-xs font-bold text-primary">₹{selectedTechnician?.sessionRate || 299}</span>
              </div>
              <h4 className="font-bold text-xs text-text-primary mt-2">Remote Video</h4>
              <p className="text-[11px] text-text-muted mt-0.5 leading-tight">Fastest. Fix in 90 seconds.</p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType('in_person_visit')}
              className={cx(
                'p-3 rounded-lg border text-left transition-all',
                serviceType === 'in_person_visit'
                  ? 'border-primary bg-primary-soft/40 ring-2 ring-primary/20'
                  : 'border-border bg-surface hover:bg-sunken'
              )}
            >
              <div className="flex items-center justify-between">
                <Wrench className="w-5 h-5 text-success" />
                <span className="font-mono text-xs font-bold text-success">₹{selectedTechnician?.visitRate || 599}</span>
              </div>
              <h4 className="font-bold text-xs text-text-primary mt-2">Doorstep Visit</h4>
              <p className="text-[11px] text-text-muted mt-0.5 leading-tight">Hands-on repair at home.</p>
            </button>
          </div>
        </div>

        {/* Selected Technician Card */}
        {selectedTechnician && (
          <div className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={selectedTechnician.avatar} name={selectedTechnician.name} size="md" verified />
              <div>
                <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <span>{selectedTechnician.name}</span>
                  <Badge variant="verified" size="sm">{selectedTechnician.badge}</Badge>
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  ⭐ {selectedTechnician.rating} • {selectedTechnician.location}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/technicians')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Change
            </button>
          </div>
        )}

        {/* Time Slot Picker */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            Schedule Slot
          </label>
          <div className="space-y-1.5">
            {slots.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlot(s)}
                className={cx(
                  'w-full p-3 rounded-md border text-left text-xs font-medium flex items-center justify-between transition-all',
                  slot === s
                    ? 'border-primary bg-primary-soft/30 text-primary font-bold'
                    : 'border-border bg-surface text-text-secondary hover:bg-sunken'
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span>{s}</span>
                </div>
                {slot === s && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Doorstep Address if In-Person */}
        {isVisit && (
          <div className="animate-fade-up">
            <Input
              label="Doorstep Address (Delhi NCR)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat no., Building, Sector, Locality"
            />
          </div>
        )}

        {/* Bill Breakdown Summary */}
        <div className="p-4 rounded-lg bg-surface border border-border text-xs space-y-2 font-mono">
          <div className="flex justify-between font-sans font-bold text-text-primary text-sm pb-1 border-b border-border">
            <span>Price Summary</span>
            <Badge variant="neutral">Pre-Authorization</Badge>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>{isVisit ? 'Doorstep Inspection Fee' : 'Remote Diagnostic Fee'}</span>
            <span>₹{basePrice}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Platform Service Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between font-bold text-text-primary text-sm pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary font-extrabold text-base">₹{total}</span>
          </div>
          <p className="text-[10px] text-text-muted font-sans pt-1">
            * Payment is collected ONLY after the session is completed or solved.
          </p>
        </div>

        {/* Action Button */}
        <Button
          size="lg"
          className="w-full mt-4"
          isLoading={isSubmitting}
          onClick={handleConfirm}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Confirm & Schedule
        </Button>
      </div>
    </MobileLayout>
  );
};

export const BookingConfirmedScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { activeBooking } = useAppState();

  const booking = activeBooking || {
    id: 'BK-8902',
    technician: { name: 'Vikram Sharma', rating: 4.9, avatar: '' },
    scheduledTime: 'Immediate (In 90 seconds)',
    totalAmount: 387,
    serviceType: 'remote_video',
  };

  const isVideo = booking.serviceType === 'remote_video';

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex-1 flex flex-col justify-between p-6 text-center animate-fade-up">
        <div className="my-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-success flex items-center justify-center mb-4 shadow-soft">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Booking Confirmed!</h2>
          <p className="text-xs font-mono font-bold text-primary mt-1">Order ID: {booking.id}</p>

          <p className="text-xs text-text-secondary mt-3 max-w-xs leading-relaxed">
            {isVideo
              ? 'Your video room is initialized and your technician is ready to connect.'
              : 'Technician has received your home visit request and will arrive in the scheduled window.'}
          </p>

          <div className="w-full max-w-xs p-4 bg-surface rounded-lg border border-border mt-6 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Technician</span>
              <span className="font-bold text-text-primary">{booking.technician?.name || 'Assigned Tech'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Time Slot</span>
              <span className="font-bold text-text-primary">{booking.scheduledTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Estimated Total</span>
              <span className="font-mono font-bold text-primary">₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pb-2">
          {isVideo ? (
            <Button
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(`/waiting/${booking.id}`)}
            >
              Enter Video Waiting Room
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(`/visit/arrival/${booking.id}`)}
            >
              Track Technician Arrival
            </Button>
          )}

          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => navigate(`/booking/${booking.id}`)}
          >
            View Full Booking Details
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export const BookingDetailScreen: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const { navigate } = useRouter();
  const { bookings, cancelBooking } = useAppState();

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];
  const isVideo = booking.serviceType === 'remote_video';

  return (
    <MobileLayout title={`Booking #${booking.id}`} showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Status Header */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Status</span>
            <Badge variant="primary">{booking.status.toUpperCase()}</Badge>
          </div>
          <h3 className="font-extrabold text-base text-text-primary">{booking.scheduledTime}</h3>
          <p className="text-xs text-text-secondary mt-1">{booking.issueDescription}</p>
        </div>

        {/* Assigned Technician */}
        {booking.technician && (
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={booking.technician.avatar} name={booking.technician.name} size="lg" verified />
              <div>
                <h4 className="font-bold text-sm text-text-primary">{booking.technician.name}</h4>
                <div className="text-xs text-text-muted">⭐ {booking.technician.rating} • {booking.technician.location}</div>
                <Badge variant="verified" size="sm" className="mt-1">{booking.technician.badge}</Badge>
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

        {/* Visit Security Code if Doorstep */}
        {booking.visitCode && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Doorstep Verification PIN</div>
              <div className="font-mono text-2xl font-extrabold text-emerald-900 tracking-widest">{booking.visitCode}</div>
              <p className="text-[11px] text-emerald-700 mt-0.5">Share with technician upon arrival.</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
        )}

        {/* Receipt / Cost Summary */}
        <ReceiptSummary booking={booking} />

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {booking.status === 'matched' || booking.status === 'in_session' ? (
            <Button
              size="lg"
              className="w-full"
              rightIcon={<Video className="w-4 h-4" />}
              onClick={() => navigate(`/waiting/${booking.id}`)}
            >
              Join Live Video Call
            </Button>
          ) : booking.status === 'completed' ? (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/review')}
            >
              Rate & Review Technician
            </Button>
          ) : null}

          {booking.status === 'matched' && (
            <Button
              variant="ghost"
              size="md"
              className="w-full text-error hover:bg-red-50"
              onClick={() => {
                cancelBooking(booking.id);
                navigate('/home');
              }}
            >
              Cancel Request (Free Cancellation)
            </Button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export const WaitingScreen: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { bookings } = useAppState();

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  // Pre-call test states (Flowchart 2: Tech assigned -> Permissions -> Video session)
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [permissionDeniedModal, setPermissionDeniedModal] = useState(false);
  const [noShowTimer, setNoShowTimer] = useState(45);

  useEffect(() => {
    const t = setInterval(() => {
      setNoShowTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSimulatePermissionDenied = () => {
    setPermissionDeniedModal(true);
  };

  return (
    <MobileLayout title="Waiting Room" showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Pre-Call Video Preview Card */}
        <div className="p-4 rounded-xl bg-ink text-white flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden shadow-raised">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ink-3 border border-gray-700 flex items-center justify-center mb-2">
              <Camera className={cx('w-8 h-8', camEnabled ? 'text-emerald-400' : 'text-gray-500')} />
            </div>
            <div className="text-xs font-bold text-gray-200">
              {camEnabled ? 'Camera Preview Active' : 'Camera Muted'}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5 font-mono">
              <Mic className={cx('w-3 h-3', micEnabled ? 'text-emerald-400' : 'text-red-400')} />
              <span>{micEnabled ? 'Mic: Good audio level' : 'Mic Muted'}</span>
            </div>
          </div>

          {/* Camera / Mic toggle buttons */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 z-20">
            <button
              onClick={() => setCamEnabled(!camEnabled)}
              className={cx('px-3 py-1 rounded-full text-xs font-bold', camEnabled ? 'bg-ink-3 text-white' : 'bg-red-500/30 text-red-300')}
            >
              {camEnabled ? 'Cam On' : 'Cam Off'}
            </button>
            <button
              onClick={() => setMicEnabled(!micEnabled)}
              className={cx('px-3 py-1 rounded-full text-xs font-bold', micEnabled ? 'bg-ink-3 text-white' : 'bg-red-500/30 text-red-300')}
            >
              {micEnabled ? 'Mic On' : 'Mic Off'}
            </button>
          </div>
        </div>

        {/* Technician Assigned Status */}
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={booking.technician?.avatar} name={booking.technician?.name || 'Tech'} size="md" verified />
            <div>
              <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <span>{booking.technician?.name || 'Vikram Sharma'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-success font-medium">Technician is in room & ready</div>
            </div>
          </div>

          <Badge variant="verified">HD Ready</Badge>
        </div>

        {/* Join CTA */}
        <Button
          size="lg"
          className="w-full text-base py-3.5"
          rightIcon={<Video className="w-5 h-5" />}
          onClick={() => navigate(`/session/${booking.id}`)}
        >
          Join Video Session Now
        </Button>

        {/* Edge Case Simulators (Flowchart 2) */}
        <div className="p-3 bg-sunken rounded-lg border border-border text-xs text-text-secondary space-y-2">
          <div className="font-bold text-text-primary text-[11px] uppercase tracking-wider">
            Edge Case Testing Controls
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSimulatePermissionDenied}
              className="flex-1 py-1.5 px-2 bg-surface hover:bg-border/60 rounded border border-border text-[11px] font-semibold text-text-secondary"
            >
              Simulate Permission Denied
            </button>
            <button
              onClick={() => {
                addToast({ title: 'Rematched', message: 'Assigned new technician Priya Nair.', type: 'info' });
                navigate('/matching');
              }}
              className="flex-1 py-1.5 px-2 bg-surface hover:bg-border/60 rounded border border-border text-[11px] font-semibold text-text-secondary"
            >
              Simulate Tech No-Show
            </button>
          </div>
        </div>

        {/* Permission Denied Modal */}
        <Modal
          isOpen={permissionDeniedModal}
          onClose={() => setPermissionDeniedModal(false)}
          title="Camera & Mic Permissions Needed"
          description="Setu needs camera and microphone access so the technician can guide you through the device repair."
        >
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              Go to your device browser settings and allow Camera & Microphone access for this page.
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setPermissionDeniedModal(false);
                addToast({ title: 'Permissions Granted', type: 'success' });
              }}
            >
              I Allowed Permissions, Retry
            </Button>
          </div>
        </Modal>
      </div>
    </MobileLayout>
  );
};
