import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import {
  CategoryTile,
  CategoryIcon,
  BookingCard,
} from '../../components/domain';
import {
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  Avatar,
  cx,
  useToast,
} from '../../components/ui';
import {
  Wrench,
  Video,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Camera,
  X,
  Upload,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Radio,
} from '../../components/icons';

export const HomeScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { customer, categories, activeBooking, bookings, updateSupportDraft } = useAppState();

  const handleSelectCategory = (catKey: string) => {
    updateSupportDraft({ categoryKey: catKey });
    navigate('/problem');
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Top Header & Greeting */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Avatar src={customer.avatar} name={customer.name} size="md" />
            <div>
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Welcome back</div>
              <h2 className="text-lg font-extrabold text-text-primary leading-tight">{customer.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sunken rounded-full border border-border text-xs text-text-secondary">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-[11px]">South Delhi</span>
          </div>
        </div>

        {/* Active Booking Banner (if in session or matched) */}
        {activeBooking && (activeBooking.status === 'matched' || activeBooking.status === 'in_session') && (
          <div className="p-4 rounded-lg bg-primary text-white shadow-raised relative overflow-hidden animate-fade-up">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary-soft">
                    {activeBooking.status === 'in_session' ? 'Live Session In Progress' : 'Technician Ready'}
                  </span>
                </div>
                <h4 className="font-bold text-base leading-tight">
                  {activeBooking.technician?.name || 'Assigned Technician'}
                </h4>
                <p className="text-xs text-primary-soft mt-1 line-clamp-1">
                  {activeBooking.deviceModel || activeBooking.deviceCategory}: {activeBooking.issueDescription}
                </p>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="shrink-0"
                onClick={() => navigate(`/waiting/${activeBooking.id}`)}
              >
                Join Now
              </Button>
            </div>
          </div>
        )}

        {/* Hero Card: Get Technical Help */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary-soft via-white to-sunken border border-primary/20 shadow-soft relative overflow-hidden">
          <div className="relative z-10">
            <Badge variant="primary" size="sm" className="mb-2">
              Instant Diagnosis · 90s SLA
            </Badge>
            <h3 className="text-xl font-extrabold text-text-primary tracking-tight leading-snug">
              Got a broken device?
              <br />
              Talk to an expert right now.
            </h3>
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed max-w-xs">
              Over 70% of laptop and electronics issues are solved remotely via guided video call without going to a repair market.
            </p>

            <div className="mt-4 flex gap-2">
              <Button
                size="md"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/help')}
              >
                Get Technical Help
              </Button>
            </div>
          </div>
        </div>

        {/* Select Device Category Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">
              Select Device to Fix
            </h3>
            <button
              onClick={() => navigate('/help')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {categories.slice(0, 4).map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                compact
                onClick={() => handleSelectCategory(cat.key)}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success shrink-0" />
            <div>
              <div className="font-bold text-text-primary text-[11px]">Delhi NCR Vetted</div>
              <div className="text-[10px] text-text-muted">ID & skill checked</div>
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary shrink-0" />
            <div>
              <div className="font-bold text-text-primary text-[11px]">Video First</div>
              <div className="text-[10px] text-text-muted">Doorstep escalation</div>
            </div>
          </div>
        </div>

        {/* Recent Requests / History Excerpt */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">
              Recent Requests
            </h3>
            <button
              onClick={() => navigate('/bookings')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 2).map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onClick={() => navigate(`/booking/${b.id}`)}
                onAction={() => {
                  if (b.status === 'matched' || b.status === 'in_session') {
                    navigate(`/waiting/${b.id}`);
                  } else {
                    navigate(`/booking/${b.id}`);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export const HelpScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { categories, updateSupportDraft } = useAppState();
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (key: string) => {
    updateSupportDraft({ categoryKey: key });
    navigate('/problem');
  };

  return (
    <MobileLayout title="Select Your Device" showBackButton>
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search laptops, phones, WiFi, printers..."
            className="w-full h-11 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Category List */}
        <div className="space-y-2.5">
          {filtered.map((cat) => (
            <CategoryTile
              key={cat.id}
              category={cat}
              onClick={() => handleSelect(cat.key)}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export const ProblemScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { supportDraft, updateSupportDraft, categories } = useAppState();

  const selectedCat = categories.find((c) => c.key === supportDraft.categoryKey) || categories[0];

  const [description, setDescription] = useState(supportDraft.description || '');
  const [deviceModel, setDeviceModel] = useState(supportDraft.deviceModel || 'MacBook Pro 14" (M1 Pro)');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>(
    (supportDraft.urgency as 'normal' | 'urgent') || 'urgent'
  );
  const [servicePreference, setServicePreference] = useState<'remote_video' | 'in_person_visit'>('remote_video');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    supportDraft.photoUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  );

  const handleSimulatePhotoUpload = () => {
    setPhotoPreview('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80');
    addToast({ title: 'Photo Attached', message: 'Error screen photo uploaded successfully.', type: 'info' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 8) {
      addToast({
        title: 'Please describe the issue',
        message: 'Enter at least 8 characters explaining what went wrong.',
        type: 'error',
      });
      return;
    }

    updateSupportDraft({
      description,
      deviceModel,
      urgency,
      serviceType: servicePreference,
      photoUrl: photoPreview || undefined,
    });

    navigate('/matching');
  };

  return (
    <MobileLayout title="Describe Problem" showBackButton>
      <form onSubmit={handleSubmit} className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Selected Category Header */}
        <div className="p-3.5 bg-primary-soft/50 rounded-lg border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center">
              <CategoryIcon name={selectedCat.icon || selectedCat.key} className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Device Category</div>
              <h4 className="font-bold text-sm text-text-primary">{selectedCat.name}</h4>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Change
          </button>
        </div>

        {/* Device Brand / Model */}
        <Input
          label="Model / Specifications"
          value={deviceModel}
          onChange={(e) => setDeviceModel(e.target.value)}
          placeholder="e.g. MacBook Pro M1, Dell XPS 15, iPhone 14"
        />

        {/* Problem Description */}
        <Textarea
          label="What is happening? (Min 8 characters)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe symptoms, error codes, lights flashing, or what caused it..."
          rows={3}
        />

        {/* Quick Issue Chips */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            Quick Suggestions
          </label>
          <div className="flex flex-wrap gap-1.5">
            {selectedCat.popularIssues.map((issue, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setDescription((prev) => (prev ? `${prev} · ${issue}` : issue))}
                className="text-xs px-2.5 py-1 bg-sunken hover:bg-border/60 text-text-secondary rounded-full transition-colors text-left"
              >
                + {issue}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Photo Attachment (Flowchart 3: Text + 1 Photo) */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            Attach Photo of Screen / Device (Optional)
          </label>
          {photoPreview ? (
            <div className="relative rounded-md overflow-hidden border border-border max-h-40">
              <img src={photoPreview} alt="Issue preview" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 bg-ink/70 text-white p-1 rounded-full hover:bg-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulatePhotoUpload}
              className="w-full h-24 border-2 border-dashed border-border hover:border-primary rounded-md flex flex-col items-center justify-center text-text-muted hover:text-primary transition-colors bg-sunken/40"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Tap to attach photo or error screenshot</span>
            </button>
          )}
        </div>

        {/* Support Channel Preference */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            Preferred Initial Support
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setServicePreference('remote_video')}
              className={cx(
                'p-3 rounded-md border text-left transition-all',
                servicePreference === 'remote_video'
                  ? 'border-primary bg-primary-soft/40 ring-1 ring-primary'
                  : 'border-border bg-surface hover:bg-sunken'
              )}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Video className="w-4 h-4" />
                <span>Remote Video</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-tight">
                Recommended. Instant in 90s, ₹299.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setServicePreference('in_person_visit')}
              className={cx(
                'p-3 rounded-md border text-left transition-all',
                servicePreference === 'in_person_visit'
                  ? 'border-primary bg-primary-soft/40 ring-1 ring-primary'
                  : 'border-border bg-surface hover:bg-sunken'
              )}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                <Wrench className="w-4 h-4" />
                <span>Doorstep Visit</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-tight">
                Physical parts repair at home, ₹599.
              </p>
            </button>
          </div>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
            Urgency
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUrgency('urgent')}
              className={cx(
                'flex-1 py-2 px-3 rounded-md border text-xs font-bold transition-all',
                urgency === 'urgent'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-800 ring-1 ring-amber-500'
                  : 'border-border bg-surface text-text-secondary'
              )}
            >
              ⚡ Urgent (Connect in 90s)
            </button>
            <button
              type="button"
              onClick={() => setUrgency('normal')}
              className={cx(
                'flex-1 py-2 px-3 rounded-md border text-xs font-bold transition-all',
                urgency === 'normal'
                  ? 'bg-primary-soft border-primary text-primary ring-1 ring-primary'
                  : 'border-border bg-surface text-text-secondary'
              )}
            >
              Standard (Today)
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full mt-4"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Find Available Technicians
        </Button>
      </form>
    </MobileLayout>
  );
};
