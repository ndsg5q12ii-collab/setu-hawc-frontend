import {
  mockCategories,
  mockTechnicians,
  mockCustomer,
  mockDevices,
  mockBookings,
  mockTransactions,
  mockDisputes,
  mockIncomingRequests,
  mockReviews,
  mockAdminStats,
} from './mock/data';
import {
  Booking,
  Device,
  DeviceCategory,
  Dispute,
  Technician,
  TechRequest,
  Transaction,
  Review,
  BookingStatus,
  ServiceType,
  UrgencyLevel,
} from '../types';

export const categoryService = {
  getCategories: async (): Promise<DeviceCategory[]> => {
    return [...mockCategories];
  },
  getCategoryByKey: async (key: string): Promise<DeviceCategory | undefined> => {
    return mockCategories.find((c) => c.key === key);
  },
};

export const technicianService = {
  getTechnicians: async (category?: string): Promise<Technician[]> => {
    if (!category) return [...mockTechnicians];
    return mockTechnicians.filter((t) => t.categories.includes(category));
  },
  getTechnicianById: async (id: string): Promise<Technician | undefined> => {
    return mockTechnicians.find((t) => t.id === id);
  },
  getIncomingRequests: async (): Promise<TechRequest[]> => {
    return [...mockIncomingRequests];
  },
};

export const bookingService = {
  getBookings: async (customerId?: string): Promise<Booking[]> => {
    if (customerId) {
      return mockBookings.filter((b) => b.customerId === customerId);
    }
    return [...mockBookings];
  },
  getBookingById: async (id: string): Promise<Booking | undefined> => {
    return mockBookings.find((b) => b.id === id);
  },
  createBooking: async (params: {
    deviceCategory: string;
    issueDescription: string;
    serviceType: ServiceType;
    urgency: UrgencyLevel;
    technicianId?: string;
    scheduledTime?: string;
  }): Promise<Booking> => {
    const tech = params.technicianId
      ? mockTechnicians.find((t) => t.id === params.technicianId)
      : mockTechnicians[0];

    const baseAmount = params.serviceType === 'in_person_visit' ? (tech?.visitRate || 599) : (tech?.sessionRate || 299);
    const platformFee = Math.round(baseAmount * 0.1);
    const taxAmount = Math.round((baseAmount + platformFee) * 0.18);
    const totalAmount = baseAmount + platformFee + taxAmount;

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: mockCustomer.id,
      customerName: mockCustomer.name,
      customerPhone: mockCustomer.phone,
      customerAddress: mockCustomer.address,
      technicianId: tech?.id,
      technician: tech,
      serviceType: params.serviceType,
      deviceCategory: params.deviceCategory,
      issueDescription: params.issueDescription,
      urgency: params.urgency,
      status: 'matched',
      scheduledTime: params.scheduledTime || 'Immediate (Instant Video Call)',
      baseAmount,
      platformFee,
      taxAmount,
      totalAmount,
      paymentStatus: 'pending',
      visitCode: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: 'Just now',
    };

    mockBookings.unshift(newBooking);
    return newBooking;
  },
};

export const deviceService = {
  getDevices: async (userId: string): Promise<Device[]> => {
    return mockDevices.filter((d) => d.userId === userId);
  },
  addDevice: async (device: Omit<Device, 'id'>): Promise<Device> => {
    const newDev: Device = {
      id: `dev-${Date.now()}`,
      ...device,
    };
    mockDevices.push(newDev);
    return newDev;
  },
};

export const adminService = {
  getStats: async () => {
    return { ...mockAdminStats };
  },
  getDisputes: async (): Promise<Dispute[]> => {
    return [...mockDisputes];
  },
  getTransactions: async (): Promise<Transaction[]> => {
    return [...mockTransactions];
  },
  getReviews: async (): Promise<Review[]> => {
    return [...mockReviews];
  },
};
