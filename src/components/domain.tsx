import React from 'react';
import {
  DeviceCategory,
  Technician,
  Booking,
  Device,
  Review,
  ServiceType,
} from '../types';
import {
  Laptop,
  Smartphone,
  Monitor,
  Wifi,
  Printer,
  Tv,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Video,
  Navigation,
  FileText,
  BadgeCheck,
  Wrench,
  CheckCircle2,
} from './icons';
import { Badge, Button, Avatar, Card, cx } from './ui';

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'laptop':
      return <Laptop className={className} />;
    case 'phone':
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'pc':
    case 'monitor':
      return <Monitor className={className} />;
    case 'wifi':
      return <Wifi className={className} />;
    case 'printer':
      return <Printer className={className} />;
    case 'tv':
      return <Tv className={className} />;
    default:
      return <Wrench className={className} />;
  }
};

export const CategoryTile: React.FC<{
  category: DeviceCategory;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}> = ({ category, selected, onClick, compact }) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        'group flex flex-col p-3.5 rounded-md border transition-all duration-150 cursor-pointer select-none text-left',
        selected
          ? 'bg-primary-soft/60 border-primary ring-2 ring-primary/20 shadow-soft'
          : 'bg-surface border-border hover:border-primary/50 hover:shadow-soft',
        compact ? 'gap-2' : 'gap-3'
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cx(
            'w-10 h-10 rounded-md flex items-center justify-center transition-colors',
            selected ? 'bg-primary text-white' : 'bg-sunken text-primary group-hover:bg-primary-soft'
          )}
        >
          <CategoryIcon name={category.icon || category.key} className="w-5 h-5" />
        </div>
        <span className="font-mono text-xs font-semibold text-text-secondary">
          ₹{category.basePrice}
        </span>
      </div>

      <div>
        <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
          {category.name}
        </h4>
        {!compact && (
          <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
};

export const TechnicianCard: React.FC<{
  technician: Technician;
  selected?: boolean;
  onSelect?: () => void;
  showActions?: boolean;
}> = ({ technician, selected, onSelect, showActions = true }) => {
  return (
    <Card
      hover={!!onSelect}
      onClick={onSelect}
      className={cx(
        'flex flex-col gap-3 text-left relative overflow-hidden',
        selected && 'border-primary ring-2 ring-primary/20 bg-primary-soft/20'
      )}
    >
      <div className="flex items-start gap-3.5">
        <Avatar src={technician.avatar} name={technician.name} size="lg" verified={technician.verified} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-base text-text-primary truncate">{technician.name}</h4>
            <Badge variant="verified">{technician.badge}</Badge>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-amber-500 font-bold text-xs gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{technician.rating}</span>
            </div>
            <span className="text-text-muted text-xs">({technician.reviewsCount} reviews)</span>
            <span className="text-text-muted text-xs">•</span>
            <span className="text-text-secondary text-xs font-medium">{technician.experienceYears}y exp</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
            <MapPin className="w-3 h-3 text-text-muted shrink-0" />
            <span className="truncate">{technician.location}</span>
            <span>•</span>
            <span className="text-success font-medium shrink-0">{technician.eta}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {technician.skills.slice(0, 3).map((skill, i) => (
          <span key={i} className="text-[11px] px-2 py-0.5 bg-sunken text-text-secondary rounded font-medium">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
        <div>
          <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Remote Session</div>
          <div className="font-mono text-base font-bold text-text-primary">
            ₹{technician.sessionRate} <span className="text-xs font-normal text-text-muted">/ fix</span>
          </div>
        </div>

        {showActions && (
          <Button size="sm" variant={selected ? 'primary' : 'outline'}>
            {selected ? 'Selected' : 'Choose Tech'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export const BookingCard: React.FC<{
  booking: Booking;
  onClick?: () => void;
  onAction?: () => void;
}> = ({ booking, onClick, onAction }) => {
  const isVideo = booking.serviceType === 'remote_video';

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'in_session':
        return <Badge variant="warning">In Call</Badge>;
      case 'matched':
        return <Badge variant="primary">Tech Assigned</Badge>;
      case 'completed':
        return <Badge variant="success">Solved & Paid</Badge>;
      case 'visit_requested':
        return <Badge variant="warning">Visit Pending</Badge>;
      case 'visit_confirmed':
        return <Badge variant="info">Tech En Route</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  return (
    <Card hover={!!onClick} onClick={onClick} className="flex flex-col gap-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary">{booking.id}</span>
          <span className="text-text-muted text-xs">•</span>
          <span className="text-text-muted text-xs">{booking.createdAt}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-sunken flex items-center justify-center text-primary shrink-0">
          <CategoryIcon name={booking.deviceCategory} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-text-primary truncate">
            {booking.deviceModel || booking.deviceCategory.toUpperCase()}
          </div>
          <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{booking.issueDescription}</p>
        </div>
      </div>

      {booking.technician && (
        <div className="flex items-center justify-between p-2 rounded bg-sunken text-xs">
          <div className="flex items-center gap-2">
            <Avatar src={booking.technician.avatar} name={booking.technician.name} size="sm" />
            <div>
              <span className="font-semibold text-text-primary">{booking.technician.name}</span>
              <div className="text-text-muted text-[11px]">{booking.technician.badge}</div>
            </div>
          </div>
          <div className="text-right font-mono font-bold text-text-primary">₹{booking.totalAmount}</div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          {isVideo ? <Video className="w-3.5 h-3.5 text-primary" /> : <Navigation className="w-3.5 h-3.5 text-success" />}
          <span>{isVideo ? 'Remote Video Support' : 'In-Person Home Visit'}</span>
        </div>

        {booking.status === 'matched' || booking.status === 'in_session' ? (
          <Button size="sm" variant="primary" onClick={onAction}>
            Join Call
          </Button>
        ) : booking.status === 'visit_confirmed' ? (
          <Button size="sm" variant="outline" onClick={onAction}>
            Track Visit
          </Button>
        ) : (
          <span className="text-xs font-semibold text-primary inline-flex items-center gap-0.5">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </Card>
  );
};

export const DeviceCard: React.FC<{
  device: Device;
  onSelect?: () => void;
  selected?: boolean;
}> = ({ device, onSelect, selected }) => {
  return (
    <Card
      hover={!!onSelect}
      onClick={onSelect}
      className={cx('flex items-start gap-3 text-left', selected && 'border-primary ring-2 ring-primary/20 bg-primary-soft/20')}
    >
      <div className="w-10 h-10 rounded-md bg-primary-soft flex items-center justify-center text-primary shrink-0">
        <CategoryIcon name={device.categoryKey} className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-text-primary truncate">{device.modelName}</h4>
          <span className="text-xs font-mono text-text-muted">{device.brand}</span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5">{device.os}</p>
        {device.notes && <p className="text-[11px] text-text-muted mt-1 italic line-clamp-1">{device.notes}</p>}
      </div>
    </Card>
  );
};

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <Card className="flex flex-col gap-2.5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar src={review.customerAvatar} name={review.customerName} size="sm" />
          <div>
            <div className="font-semibold text-sm text-text-primary">{review.customerName}</div>
            <div className="text-[11px] text-text-muted">{review.date}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{review.rating}.0</span>
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">{review.comment}</p>

      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {review.tags.map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-sunken text-text-muted rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {review.technicianReply && (
        <div className="p-2.5 rounded bg-sunken text-xs text-text-secondary border-l-2 border-primary">
          <span className="font-semibold text-text-primary">Technician response: </span>
          {review.technicianReply}
        </div>
      )}
    </Card>
  );
};

export const ReceiptSummary: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="bg-surface rounded-md border border-border p-4 text-left flex flex-col gap-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <span className="font-sans font-bold text-sm text-text-primary">Bill Breakdown</span>
        <Badge variant="verified">Tax Invoice</Badge>
      </div>

      <div className="flex justify-between text-text-secondary">
        <span>Session / Diagnostic Fee</span>
        <span>₹{booking.baseAmount}</span>
      </div>
      <div className="flex justify-between text-text-secondary">
        <span>Platform Marketplace Fee</span>
        <span>₹{booking.platformFee}</span>
      </div>
      <div className="flex justify-between text-text-secondary">
        <span>GST (18% SGST + CGST)</span>
        <span>₹{booking.taxAmount}</span>
      </div>

      <div className="flex justify-between pt-2 border-t border-border font-bold text-sm text-text-primary">
        <span>Total Payable</span>
        <span className="text-primary font-mono text-base">₹{booking.totalAmount}</span>
      </div>
    </div>
  );
};
