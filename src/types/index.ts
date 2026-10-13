export type ServiceType = 'remote_video' | 'in_person_visit';

export type BookingStatus =
  | 'pending'
  | 'matched'
  | 'in_session'
  | 'completed'
  | 'visit_requested'
  | 'visit_confirmed'
  | 'visit_arrived'
  | 'cancelled';

export type TechnicianAvailability = 'available' | 'busy' | 'offline';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';

export type UrgencyLevel = 'normal' | 'urgent' | 'emergency';

export interface DeviceCategory {
  id: string;
  key: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
  popularIssues: string[];
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  sessionRate: number;
  visitRate: number;
  location: string;
  distance: string;
  eta: string;
  skills: string[];
  categories: string[];
  verified: boolean;
  verificationStatus: VerificationStatus;
  experienceYears: number;
  bio: string;
  badge: 'Top Rated' | 'Verified Pro' | 'Fast Responder' | 'Hardware Specialist';
  completedSessions: number;
  resolutionRate: number;
  availability: TechnicianAvailability;
  aadhaarVerified: boolean;
  policeVerification: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  technicianId?: string;
  technician?: Technician;
  serviceType: ServiceType;
  deviceCategory: string;
  deviceModel?: string;
  issueDescription: string;
  issuePhotoUrl?: string;
  urgency: UrgencyLevel;
  status: BookingStatus;
  scheduledTime: string;
  durationMinutes?: number;
  baseAmount: number;
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentId?: string;
  rating?: number;
  reviewText?: string;
  visitCode?: string;
  resolutionNote?: string;
  wasSolved?: boolean;
  createdAt: string;
}

export interface Device {
  id: string;
  userId: string;
  categoryKey: string;
  brand: string;
  modelName: string;
  os: string;
  serialNumber?: string;
  purchaseYear?: string;
  notes?: string;
  lastServicedDate?: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  customerName: string;
  technicianName: string;
  serviceType: ServiceType;
  grossAmount: number;
  platformCommission: number;
  technicianPayout: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  status: PaymentStatus;
  timestamp: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerName: string;
  technicianName: string;
  reason: string;
  claimedAmount: number;
  status: DisputeStatus;
  date: string;
  resolutionNotes?: string;
}

export interface TechRequest {
  id: string;
  bookingId: string;
  customerName: string;
  deviceCategory: string;
  issueDescription: string;
  serviceType: ServiceType;
  location: string;
  distance: string;
  potentialEarnings: number;
  expiresInSeconds: number;
  urgency: UrgencyLevel;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  avatar: string;
  savedDevicesCount: number;
  completedBookingsCount: number;
  totalSpent: number;
  memberSince: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerName: string;
  customerAvatar: string;
  technicianId: string;
  rating: number;
  comment: string;
  tags: string[];
  date: string;
  technicianReply?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'technician' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isTip?: boolean;
}

export interface SupportDraft {
  categoryKey?: string;
  deviceModel?: string;
  description?: string;
  photoUrl?: string;
  urgency?: UrgencyLevel;
  serviceType?: ServiceType;
}

// Server-Driven UI (SDUI) Schema Types
export interface UIScreen {
  id: string;
  key: string;
  audience: 'customer' | 'technician' | 'admin';
  title?: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

export interface UIElement {
  id: string;
  screenId: string;
  parentId?: string;
  type:
    | 'service_card'
    | 'device_tile'
    | 'banner'
    | 'carousel'
    | 'recent_requests'
    | 'section_header'
    | 'quick_action'
    | 'search_bar';
  props: Record<string, any>;
  action?: {
    type: 'navigate' | 'open_flow' | 'open_url' | 'call_rpc' | 'show_modal';
    target: string;
    params?: Record<string, any>;
  };
  dataSource?: string;
  position: number;
  status: 'draft' | 'published';
}
