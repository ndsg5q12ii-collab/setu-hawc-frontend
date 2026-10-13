import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import { BookingCard, DeviceCard } from '../../components/domain';
import {
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  Avatar,
  Rating,
  Modal,
  cx,
  useToast,
} from '../../components/ui';
import {
  Laptop,
  Plus,
  Calendar,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  HelpCircle,
  LogOut,
  ArrowRight,
  ExternalLink,
} from '../../components/icons';

export const BookingsListScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { bookings } = useAppState();
  const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = bookings.filter((b) => {
    if (tab === 'active') return b.status === 'matched' || b.status === 'in_session' || b.status === 'visit_confirmed';
    if (tab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <MobileLayout title="My Bookings">
      <div className="p-4 space-y-4 pb-8 animate-fade-up">
        {/* Tabs */}
        <div className="flex bg-sunken p-1 rounded-lg border border-border">
          <button
            onClick={() => setTab('all')}
            className={cx('flex-1 py-1.5 rounded-md text-xs font-bold transition-all', tab === 'all' ? 'bg-surface text-primary shadow-xs' : 'text-text-secondary')}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setTab('active')}
            className={cx('flex-1 py-1.5 rounded-md text-xs font-bold transition-all', tab === 'active' ? 'bg-surface text-primary shadow-xs' : 'text-text-secondary')}
          >
            Active
          </button>
          <button
            onClick={() => setTab('completed')}
            className={cx('flex-1 py-1.5 rounded-md text-xs font-bold transition-all', tab === 'completed' ? 'bg-surface text-primary shadow-xs' : 'text-text-secondary')}
          >
            Completed
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onClick={() => navigate(`/booking/${b.id}`)}
              onAction={() => {
                if (b.status === 'matched' || b.status === 'in_session') {
                  navigate(`/waiting/${b.id}`);
                } else if (b.status === 'visit_confirmed') {
                  navigate(`/visit/arrival/${b.id}`);
                } else {
                  navigate(`/booking/${b.id}`);
                }
              }}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export const DevicesScreen: React.FC = () => {
  const { devices, addDevice, categories } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [catKey, setCatKey] = useState('laptop');
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [os, setOs] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) return;

    addDevice({
      categoryKey: catKey,
      brand: brand || 'Generic',
      modelName,
      os: os || 'Latest OS',
      notes,
    });

    setBrand('');
    setModelName('');
    setOs('');
    setNotes('');
    setModalOpen(false);
  };

  return (
    <MobileLayout
      title="My Saved Devices"
      rightAction={
        <button
          onClick={() => setModalOpen(true)}
          className="p-1.5 rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-white transition-colors"
          title="Add Device"
        >
          <Plus className="w-4 h-4" />
        </button>
      }
    >
      <div className="p-4 space-y-4 pb-8 animate-fade-up">
        <p className="text-xs text-text-secondary leading-relaxed">
          Save your computers, phones, and peripherals for 1-tap diagnosis and historical specs logs.
        </p>

        <div className="space-y-3">
          {devices.map((dev) => (
            <DeviceCard key={dev.id} device={dev} />
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Add Another Device
        </Button>

        {/* Add Device Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New Device"
          description="Register specs to speed up remote diagnostics."
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={catKey}
                onChange={(e) => setCatKey(e.target.value)}
                className="w-full h-11 px-3 bg-surface border border-border rounded-md text-sm text-text-primary focus:border-primary outline-none"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Brand / Make"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Apple, Dell, Samsung, Lenovo..."
            />
            <Input
              label="Model Name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. MacBook Air M2, Galaxy S23"
              required
            />
            <Input
              label="Operating System / Firmware"
              value={os}
              onChange={(e) => setOs(e.target.value)}
              placeholder="macOS 15, Windows 11, Android 14"
            />
            <Input
              label="Notes / Specs"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="RAM, SSD, graphics card"
            />

            <Button type="submit" className="w-full mt-4">
              Save Device to Profile
            </Button>
          </form>
        </Modal>
      </div>
    </MobileLayout>
  );
};

export const ProfileScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { customer, devices, bookings, setCurrentRole } = useAppState();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <MobileLayout title="My Account">
      <div className="p-4 space-y-5 pb-8 animate-fade-up">
        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-soft flex items-center gap-4">
          <Avatar src={customer.avatar} name={customer.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-text-primary truncate">{customer.name}</h3>
            <p className="text-xs font-mono text-text-muted">{customer.phone}</p>
            <p className="text-xs text-text-secondary truncate mt-0.5">{customer.address}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-sunken rounded-lg border border-border text-center">
          <div>
            <div className="font-mono font-extrabold text-base text-primary">{bookings.length}</div>
            <div className="text-[10px] text-text-muted mt-0.5">Total Fixes</div>
          </div>
          <div className="border-x border-border">
            <div className="font-mono font-extrabold text-base text-text-primary">{devices.length}</div>
            <div className="text-[10px] text-text-muted mt-0.5">Devices</div>
          </div>
          <div>
            <div className="font-mono font-extrabold text-base text-text-primary">₹{customer.totalSpent}</div>
            <div className="text-[10px] text-text-muted mt-0.5">Spent</div>
          </div>
        </div>

        {/* Delhi NCR Settings & Language */}
        <div className="p-4 rounded-lg bg-surface border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-text-primary">Market Location</div>
              <div className="text-[11px] text-text-muted">Delhi NCR Region (Active)</div>
            </div>
            <Badge variant="verified">Delhi NCR</Badge>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <div className="font-bold text-xs text-text-primary">Language Preference</div>
              <div className="text-[11px] text-text-muted">English / हिन्दी</div>
            </div>
            <button
              onClick={() => setLanguage((p) => (p === 'en' ? 'hi' : 'en'))}
              className="text-xs font-bold text-primary px-2.5 py-1 rounded bg-primary-soft hover:bg-primary hover:text-white transition-colors"
            >
              {language === 'en' ? 'English (EN)' : 'हिन्दी (HI)'}
            </button>
          </div>
        </div>

        {/* Help & Switcher */}
        <div className="p-4 rounded-lg bg-surface border border-border space-y-2">
          <button
            onClick={() => {
              setCurrentRole('technician');
              navigate('/technician/home');
            }}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-sunken text-xs font-semibold text-text-primary"
          >
            <span>Switch to Technician Partner App</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={() => {
              setCurrentRole('admin');
              navigate('/admin');
            }}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-sunken text-xs font-semibold text-text-primary"
          >
            <span>Open Admin Management Console</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
        </div>

        <Button
          variant="outline"
          size="md"
          className="w-full text-error hover:bg-red-50"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={() => navigate('/login')}
        >
          Sign Out
        </Button>
      </div>
    </MobileLayout>
  );
};

export const ReviewScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { activeBooking, submitReview } = useAppState();

  const [ratingVal, setRatingVal] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Patient', 'Fixed in 15 mins']);

  const booking = activeBooking || {
    id: 'BK-8902',
    technician: { name: 'Vikram Sharma', avatar: '' },
  };

  const availableTags = [
    'Super Patient',
    'Fixed in 15 mins',
    'Clear Instructions',
    'Apple Expert',
    'Saved Repair Shop Trip',
    'Professional & Polite',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(booking.id, ratingVal, comment || 'Great diagnostic session!', selectedTags);
    navigate('/home');
  };

  return (
    <MobileLayout title="Rate Technician" showBackButton={false}>
      <form onSubmit={handleSubmit} className="p-4 space-y-5 pb-8 animate-fade-up">
        <div className="text-center pt-2">
          <Avatar
            src={booking.technician?.avatar}
            name={booking.technician?.name || 'Technician'}
            size="xl"
            verified
            className="mx-auto mb-3"
          />
          <h3 className="font-extrabold text-lg text-text-primary">
            How was your session with {booking.technician?.name || 'Vikram Sharma'}?
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Your review helps other users in Delhi NCR pick trustworthy technicians.
          </p>

          <div className="my-5 flex justify-center">
            <Rating
              value={ratingVal}
              interactive
              onChange={setRatingVal}
              size="lg"
            />
          </div>
        </div>

        {/* Compliment Tags */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            What went best?
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cx(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    isSelected
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-sunken text-text-secondary hover:bg-border'
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Review */}
        <Textarea
          label="Leave a review comment (Optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe how the technician guided your fix..."
          rows={3}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full mt-4"
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Submit Review & Return Home
        </Button>
      </form>
    </MobileLayout>
  );
};
