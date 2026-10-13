import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  CustomerProfile,
  Device,
  DeviceCategory,
  Dispute,
  Review,
  ServiceType,
  SupportDraft,
  Technician,
  TechRequest,
  Transaction,
  UrgencyLevel,
} from '../types';
import {
  mockBookings,
  mockCategories,
  mockCustomer,
  mockDevices,
  mockDisputes,
  mockIncomingRequests,
  mockReviews,
  mockTechnicians,
  mockTransactions,
} from '../services/mock/data';
import { useToast } from '../components/ui';

interface AppStateContextType {
  // Surfaces & Role
  currentRole: 'customer' | 'technician' | 'admin';
  setCurrentRole: (role: 'customer' | 'technician' | 'admin') => void;

  // Customer & Profile
  customer: CustomerProfile;
  devices: Device[];
  addDevice: (device: Omit<Device, 'id' | 'userId'>) => void;

  // Support Draft & Creation Flow
  supportDraft: SupportDraft;
  updateSupportDraft: (partial: Partial<SupportDraft>) => void;
  resetSupportDraft: () => void;

  // Categories & Technicians
  categories: DeviceCategory[];
  technicians: Technician[];
  selectedTechnician: Technician | null;
  setSelectedTechnicianId: (id: string | null) => void;

  // Bookings & Lifecycle
  bookings: Booking[];
  activeBooking: Booking | null;
  setActiveBookingId: (id: string | null) => void;
  createSupportBooking: (techId?: string, isVisit?: boolean) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;
  submitOutcome: (bookingId: string, solved: boolean, resolutionNote?: string) => void;
  submitReview: (bookingId: string, rating: number, comment: string, tags: string[]) => void;
  completePayment: (bookingId: string, method: string) => void;

  // Technician Specific State
  technicianOnline: boolean;
  setTechnicianOnline: (online: boolean) => void;
  incomingRequests: TechRequest[];
  acceptTechRequest: (requestId: string) => void;
  rejectTechRequest: (requestId: string) => void;
  todayEarnings: number;

  // Admin Ledger & Operations
  transactions: Transaction[];
  disputes: Dispute[];
  reviews: Review[];
  resolveDispute: (disputeId: string, resolutionNotes: string) => void;
  toggleTechnicianVerification: (techId: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  const [currentRole, setCurrentRole] = useState<'customer' | 'technician' | 'admin'>('customer');
  const [customer, setCustomer] = useState<CustomerProfile>(mockCustomer);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [categories] = useState<DeviceCategory[]>(mockCategories);
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [selectedTechId, setSelectedTechId] = useState<string | null>('tech-101');

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [activeBookingId, setActiveBookingId] = useState<string | null>('BK-8902');

  // Draft state
  const [supportDraft, setSupportDraft] = useState<SupportDraft>({
    categoryKey: 'laptop',
    deviceModel: 'MacBook Pro 14" (M1 Pro)',
    description: 'Screen randomly glitches with pink line artifacts and kernel panic reboots.',
    urgency: 'urgent',
    serviceType: 'remote_video',
  });

  // Technician surface state
  const [technicianOnline, setTechnicianOnline] = useState<boolean>(true);
  const [incomingRequests, setIncomingRequests] = useState<TechRequest[]>(mockIncomingRequests);
  const [todayEarnings, setTodayEarnings] = useState<number>(2450);

  // Admin surface state
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const selectedTechnician = technicians.find((t) => t.id === selectedTechId) || technicians[0];
  const activeBooking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const updateSupportDraft = (partial: Partial<SupportDraft>) => {
    setSupportDraft((prev) => ({ ...prev, ...partial }));
  };

  const resetSupportDraft = () => {
    setSupportDraft({
      categoryKey: 'laptop',
      urgency: 'normal',
      serviceType: 'remote_video',
    });
  };

  const addDevice = (deviceData: Omit<Device, 'id' | 'userId'>) => {
    const newDev: Device = {
      id: `dev-${Date.now()}`,
      userId: customer.id,
      ...deviceData,
    };
    setDevices((prev) => [newDev, ...prev]);
    addToast({
      title: 'Device Registered',
      message: `${newDev.modelName} was saved to your profile.`,
      type: 'success',
    });
  };

  const createSupportBooking = (techId?: string, isVisit = false): Booking => {
    const tech = techId
      ? technicians.find((t) => t.id === techId) || selectedTechnician
      : selectedTechnician;

    const baseAmount = isVisit ? (tech?.visitRate || 599) : (tech?.sessionRate || 299);
    const platformFee = Math.round(baseAmount * 0.1);
    const taxAmount = Math.round((baseAmount + platformFee) * 0.18);
    const totalAmount = baseAmount + platformFee + taxAmount;

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      technicianId: tech.id,
      technician: tech,
      serviceType: isVisit ? 'in_person_visit' : 'remote_video',
      deviceCategory: supportDraft.categoryKey || 'laptop',
      deviceModel: supportDraft.deviceModel || 'General Device',
      issueDescription: supportDraft.description || 'General diagnostics requested.',
      issuePhotoUrl: supportDraft.photoUrl,
      urgency: supportDraft.urgency || 'normal',
      status: 'matched',
      scheduledTime: isVisit ? 'Today, within 2 hours' : 'Immediate (Instant Video Call)',
      baseAmount,
      platformFee,
      taxAmount,
      totalAmount,
      paymentStatus: 'pending',
      visitCode: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: 'Just now',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(newBooking.id);

    // Also push a live request to technician if remote
    setIncomingRequests((prev) => [
      {
        id: `REQ-${Date.now()}`,
        bookingId: newBooking.id,
        customerName: customer.name,
        deviceCategory: newBooking.deviceCategory,
        issueDescription: newBooking.issueDescription,
        serviceType: newBooking.serviceType,
        location: customer.address,
        distance: '2.4 km away',
        potentialEarnings: Math.round(newBooking.baseAmount * 0.8),
        expiresInSeconds: 30,
        urgency: newBooking.urgency,
      },
      ...prev,
    ]);

    addToast({
      title: 'Technician Assigned',
      message: `${tech.name} is ready for ${isVisit ? 'the home visit' : 'a video diagnostic call'}.`,
      type: 'success',
    });

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    addToast({
      title: 'Booking Cancelled',
      message: `Booking ${bookingId} has been cancelled without charge.`,
      type: 'info',
    });
  };

  const submitOutcome = (bookingId: string, solved: boolean, resolutionNote?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            wasSolved: solved,
            resolutionNote: resolutionNote || (solved ? 'Issue resolved during video call.' : 'Requires hands-on hardware inspection.'),
            status: solved ? 'completed' : 'visit_requested',
          };
        }
        return b;
      })
    );
  };

  const completePayment = (bookingId: string, method: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const paymentId = `PAY-SETU-${Math.floor(10000 + Math.random() * 90000)}`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              paymentStatus: 'completed',
              paymentMethod: method,
              paymentId,
              status: 'completed',
            }
          : b
      )
    );

    // Record new transaction in ledger
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId,
      invoiceNumber: `SETU-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: booking.customerName,
      technicianName: booking.technician?.name || 'Assigned Tech',
      serviceType: booking.serviceType,
      grossAmount: booking.totalAmount,
      platformCommission: Math.round(booking.totalAmount * 0.2),
      technicianPayout: Math.round(booking.totalAmount * 0.8),
      paymentMethod: method.includes('UPI') ? 'UPI' : 'Card',
      status: 'completed',
      timestamp: 'Just now',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setTodayEarnings((prev) => prev + newTxn.technicianPayout);

    addToast({
      title: 'Payment Successful',
      message: `₹${booking.totalAmount} paid via ${method}. Receipt generated.`,
      type: 'success',
    });
  };

  const submitReview = (bookingId: string, rating: number, comment: string, tags: string[]) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, rating, reviewText: comment } : b))
    );

    const newRev: Review = {
      id: `REV-${Date.now()}`,
      bookingId,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      technicianId: booking.technicianId || 'tech-101',
      rating,
      comment,
      tags,
      date: 'Today',
    };

    setReviews((prev) => [newRev, ...prev]);

    addToast({
      title: 'Review Submitted',
      message: 'Thank you for rating your technician!',
      type: 'success',
    });
  };

  const acceptTechRequest = (requestId: string) => {
    const req = incomingRequests.find((r) => r.id === requestId);
    if (!req) return;

    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    updateBookingStatus(req.bookingId, 'in_session');
    setActiveBookingId(req.bookingId);

    addToast({
      title: 'Request Accepted',
      message: `Starting diagnostic session with ${req.customerName}.`,
      type: 'success',
    });
  };

  const rejectTechRequest = (requestId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    addToast({
      title: 'Request Declined',
      message: 'Request returned to available technician pool.',
      type: 'info',
    });
  };

  const resolveDispute = (disputeId: string, resolutionNotes: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved', resolutionNotes } : d))
    );
    addToast({
      title: 'Dispute Resolved',
      message: `Ticket ${disputeId} closed with resolution notes.`,
      type: 'success',
    });
  };

  const toggleTechnicianVerification = (techId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === techId) {
          const nextStatus = t.verificationStatus === 'verified' ? 'pending' : 'verified';
          return {
            ...t,
            verificationStatus: nextStatus,
            verified: nextStatus === 'verified',
          };
        }
        return t;
      })
    );
  };

  return (
    <AppStateContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        customer,
        devices,
        addDevice,
        supportDraft,
        updateSupportDraft,
        resetSupportDraft,
        categories,
        technicians,
        selectedTechnician,
        setSelectedTechnicianId: setSelectedTechId,
        bookings,
        activeBooking,
        setActiveBookingId,
        createSupportBooking,
        updateBookingStatus,
        cancelBooking,
        submitOutcome,
        submitReview,
        completePayment,
        technicianOnline,
        setTechnicianOnline,
        incomingRequests,
        acceptTechRequest,
        rejectTechRequest,
        todayEarnings,
        transactions,
        disputes,
        reviews,
        resolveDispute,
        toggleTechnicianVerification,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
};
