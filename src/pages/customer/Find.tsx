import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import { TechnicianCard, ReviewCard } from '../../components/domain';
import { Button, Badge, Card, Avatar, Rating, cx, useToast } from '../../components/ui';
import {
  Search,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  X,
  Phone,
  Video,
  MapPin,
  Calendar,
  Sparkles,
} from '../../components/icons';

export const MatchingScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { technicians, setSelectedTechnicianId, createSupportBooking } = useAppState();
  const [matchingStep, setMatchingStep] = useState(0);
  const [simulateNoTechFound, setSimulateNoTechFound] = useState(false);

  const steps = [
    'Scanning verified experts in South Delhi & Nehru Place...',
    'Matching hardware diagnostic skills with your issue...',
    'Technician accepted! Assigning Vikram Sharma...',
  ];

  useEffect(() => {
    if (simulateNoTechFound) return;

    const t1 = setTimeout(() => setMatchingStep(1), 1400);
    const t2 = setTimeout(() => setMatchingStep(2), 2800);
    const t3 = setTimeout(() => {
      setSelectedTechnicianId('tech-101');
      createSupportBooking('tech-101');
      navigate('/technician/tech-101');
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [simulateNoTechFound, navigate, setSelectedTechnicianId, createSupportBooking]);

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex-1 flex flex-col justify-between p-6 text-center">
        {/* Top Cancel */}
        <div className="flex items-center justify-between pt-2">
          <Badge variant="primary" size="sm">
            Live Matching Radar
          </Badge>
          <button
            onClick={() => navigate('/home')}
            className="text-xs font-semibold text-text-secondary hover:text-error transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Central Radar Animation */}
        {!simulateNoTechFound ? (
          <div className="my-auto flex flex-col items-center animate-fade-up">
            <div className="relative w-56 h-56 flex items-center justify-center my-6">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-radar-1" />
              <div className="absolute inset-4 rounded-full border border-primary/30 animate-radar-2" />
              <div className="absolute inset-8 rounded-full border border-primary/40 animate-radar-3" />

              <div className="relative z-10 w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-raised">
                <Radio className="w-9 h-9 animate-pulse" />
              </div>

              {/* Ping dots on radar representing technicians */}
              <div className="absolute top-8 right-10 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div className="absolute bottom-10 left-8 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <h3 className="font-extrabold text-lg text-text-primary px-4 leading-tight">
              {steps[matchingStep]}
            </h3>
            <p className="text-xs text-text-muted mt-2 max-w-xs leading-relaxed">
              Average response time in Delhi NCR is under 60 seconds.
            </p>

            <button
              onClick={() => setSimulateNoTechFound(true)}
              className="mt-6 text-[11px] text-text-muted underline hover:text-text-primary"
            >
              Test edge case: Simulate "No Tech Online"
            </button>
          </div>
        ) : (
          <div className="my-auto flex flex-col items-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary">No Technicians Online Right Now</h3>
            <p className="text-xs text-text-secondary mt-2 max-w-xs leading-relaxed">
              All our vetted hardware experts in South Delhi are currently on calls. You can schedule a confirmed slot for later today.
            </p>

            <div className="mt-6 space-y-2 w-full max-w-xs">
              <Button
                size="md"
                className="w-full"
                onClick={() => {
                  setSimulateNoTechFound(false);
                  navigate('/booking');
                }}
              >
                Schedule Slot for Later
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setSimulateNoTechFound(false)}
              >
                Retry Search
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Safety Footnote */}
        <div className="text-xs text-text-muted border-t border-border pt-4 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Setu Guarantee: No fix, no fee.</span>
        </div>
      </div>
    </MobileLayout>
  );
};

export const TechniciansListScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { technicians, setSelectedTechnicianId } = useAppState();
  const [filter, setFilter] = useState<'all' | 'top_rated' | 'fastest'>('all');

  const filtered = technicians.filter((t) => {
    if (filter === 'top_rated') return t.rating >= 4.9;
    if (filter === 'fastest') return t.eta.includes('now');
    return true;
  });

  const handleSelect = (techId: string) => {
    setSelectedTechnicianId(techId);
    navigate(`/technician/${techId}`);
  };

  return (
    <MobileLayout title="Available Experts" showBackButton>
      <div className="p-4 space-y-4 pb-8">
        {/* Filter Chips */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cx(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              filter === 'all' ? 'bg-primary text-white' : 'bg-sunken text-text-secondary hover:bg-border'
            )}
          >
            All Verified ({technicians.length})
          </button>
          <button
            onClick={() => setFilter('top_rated')}
            className={cx(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              filter === 'top_rated' ? 'bg-primary text-white' : 'bg-sunken text-text-secondary hover:bg-border'
            )}
          >
            ⭐ Top Rated (4.9+)
          </button>
          <button
            onClick={() => setFilter('fastest')}
            className={cx(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              filter === 'fastest' ? 'bg-primary text-white' : 'bg-sunken text-text-secondary hover:bg-border'
            )}
          >
            ⚡ Available Now
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((tech) => (
            <TechnicianCard
              key={tech.id}
              technician={tech}
              onSelect={() => handleSelect(tech.id)}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export const TechnicianProfileScreen: React.FC<{ technicianId?: string }> = ({ technicianId }) => {
  const { navigate } = useRouter();
  const { technicians, setSelectedTechnicianId, reviews } = useAppState();

  const tech = technicians.find((t) => t.id === technicianId) || technicians[0];
  const techReviews = reviews.filter((r) => r.technicianId === tech.id);

  const handleBook = () => {
    setSelectedTechnicianId(tech.id);
    navigate('/booking');
  };

  return (
    <MobileLayout title={tech.name} showBackButton>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft flex flex-col items-center text-center">
          <Avatar src={tech.avatar} name={tech.name} size="xl" verified={tech.verified} />

          <h3 className="font-extrabold text-lg text-text-primary mt-3 leading-tight">{tech.name}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{tech.location}</p>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="verified">{tech.badge}</Badge>
            <Badge variant="success">Aadhaar & Police Verified</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full mt-4 p-3 bg-sunken rounded-lg">
            <div>
              <div className="font-mono font-extrabold text-base text-text-primary">⭐ {tech.rating}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{tech.reviewsCount} reviews</div>
            </div>
            <div className="border-x border-border">
              <div className="font-mono font-extrabold text-base text-text-primary">{tech.completedSessions}</div>
              <div className="text-[10px] text-text-muted mt-0.5">Sessions Solved</div>
            </div>
            <div>
              <div className="font-mono font-extrabold text-base text-emerald-600">{tech.resolutionRate}%</div>
              <div className="text-[10px] text-text-muted mt-0.5">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-4 rounded-lg bg-surface border border-border">
          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">About Technician</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{tech.bio}</p>

          <div className="mt-3">
            <h5 className="font-bold text-[11px] text-text-primary mb-1.5">Specialized Skills</h5>
            <div className="flex flex-wrap gap-1.5">
              {tech.skills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-primary-soft text-primary font-semibold rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-4 rounded-lg bg-sunken border border-border flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Session Rates</div>
            <div className="font-mono text-lg font-extrabold text-text-primary">
              ₹{tech.sessionRate} <span className="text-xs font-normal text-text-muted">Remote Video</span>
            </div>
            <div className="text-[11px] text-text-secondary">₹{tech.visitRate} for In-Person Visit</div>
          </div>

          <Button size="md" onClick={handleBook} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Proceed to Book
          </Button>
        </div>

        {/* Recent Customer Reviews */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-3">Customer Reviews</h4>
          <div className="space-y-3">
            {techReviews.length > 0 ? (
              techReviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
            ) : (
              <p className="text-xs text-text-muted italic">No public reviews yet for this category.</p>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};
