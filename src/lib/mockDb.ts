// Mock In-Memory Database Backup
// Used when the main database connection is refused (ECONNREFUSED) or unconfigured,
// allowing the user to preview and test the booking funnel fully in development mode.

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface MockSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export interface MockBooking {
  id: string;
  userId: string;
  user: MockUser;
  timeSlotId: string;
  timeSlot: MockSlot;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  gender: string;
  notes: string | null;
  orderId: string;
  paymentId: string | null;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  amountPaid: number;
  currency: string;
  createdAt: Date;
}

export interface MockTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
  createdAt: Date;
}

// Global scope to persist across Next.js dev server reloads
const globalForMocks = globalThis as unknown as {
  mockSlots: MockSlot[];
  mockBookings: MockBooking[];
  mockUsers: MockUser[];
  mockTestimonials: MockTestimonial[];
};

if (!globalForMocks.mockSlots) {
  // Generate initial mock slots for the next 7 days
  const slots: MockSlot[] = [];
  const today = new Date();
  let idCounter = 1;
  
  for (let day = 1; day <= 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    
    // 10:00, 11:30, 14:00, 15:30, 17:00
    const hours = [10, 11.5, 14, 15.5, 17];
    for (const hour of hours) {
      const startTime = new Date(currentDate);
      startTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 45);

      slots.push({
        id: `mock-slot-${idCounter++}`,
        startTime,
        endTime,
        isBooked: false,
      });
    }
  }
  globalForMocks.mockSlots = slots;
  globalForMocks.mockBookings = [];
  globalForMocks.mockUsers = [];
}

if (!globalForMocks.mockTestimonials) {
  globalForMocks.mockTestimonials = [
    {
      id: "mock-testimonial-1",
      name: "Priya Sharma",
      role: "Marriage Consultation",
      quote:
        "Shubham ji's Gun Milan reading gave us so much clarity before our wedding. He explained everything in plain language, no fear-mongering, just honest guidance and practical remedies.",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "mock-testimonial-2",
      name: "Arjun Mehta",
      role: "Career & Wealth Session",
      quote:
        "I was stuck between a job offer and starting my own business. The 10th house analysis he walked me through made the decision obvious. Three months later, things are working out exactly as discussed.",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "mock-testimonial-3",
      name: "Kavita Iyer",
      role: "Family & Ancestry Reading",
      quote:
        "Incredibly thoughtful session on Pitra Dosha and family harmony. The Lal Kitab remedies were simple to follow and things at home genuinely feel calmer.",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "mock-testimonial-4",
      name: "Daniel Fischer",
      role: "General Consultation",
      quote:
        "Booked from the US expecting the usual vague answers, got the opposite. Direct, specific, and genuinely helpful guidance on my health and energy concerns.",
      rating: 4,
      approved: true,
      createdAt: new Date(),
    },
  ];
}

export const mockDb = {
  getSlots: () => {
    // Return future slots
    const now = new Date();
    return globalForMocks.mockSlots.filter(s => s.startTime > now);
  },

  getAvailableSlots: () => {
    const now = new Date();
    return globalForMocks.mockSlots.filter(s => !s.isBooked && s.startTime > now);
  },

  findSlot: (id: string) => {
    return globalForMocks.mockSlots.find(s => s.id === id);
  },

  bookSlot: (slotId: string, value: boolean) => {
    const slot = globalForMocks.mockSlots.find(s => s.id === slotId);
    if (slot) {
      slot.isBooked = value;
    }
  },

  getOrCreateUser: (name: string, email: string, phone: string | null) => {
    let user = globalForMocks.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: `mock-user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone,
      };
      globalForMocks.mockUsers.push(user);
    }
    return user;
  },

  createBooking: (bookingData: Omit<MockBooking, "id" | "createdAt" | "paymentStatus" | "paymentId">) => {
    const booking: MockBooking = {
      ...bookingData,
      id: `mock-booking-${Date.now()}`,
      paymentStatus: "PENDING",
      paymentId: null,
      createdAt: new Date(),
    };
    globalForMocks.mockBookings.push(booking);
    return booking;
  },

  finalizeBooking: (orderId: string, paymentId: string) => {
    const booking = globalForMocks.mockBookings.find(b => b.orderId === orderId);
    if (booking) {
      booking.paymentStatus = "SUCCESS";
      booking.paymentId = paymentId;
      booking.timeSlot.isBooked = true;
      return booking;
    }
    return null;
  },

  failBooking: (orderId: string) => {
    const booking = globalForMocks.mockBookings.find(b => b.orderId === orderId);
    if (booking) {
      booking.paymentStatus = "FAILED";
      booking.timeSlot.isBooked = false;
      return booking;
    }
    return null;
  },

  getBookings: () => {
    return [...globalForMocks.mockBookings].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getTimeSlots: () => {
    return globalForMocks.mockSlots;
  },

  deleteSlot: (id: string) => {
    const idx = globalForMocks.mockSlots.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (globalForMocks.mockSlots[idx].isBooked) {
        throw new Error("Cannot delete a booked slot.");
      }
      globalForMocks.mockSlots.splice(idx, 1);
      return true;
    }
    return false;
  },

  getTestimonials: () => {
    return globalForMocks.mockTestimonials
      .filter((t) => t.approved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  createTestimonial: (data: { name: string; role: string; quote: string; rating: number }) => {
    const testimonial: MockTestimonial = {
      id: `mock-testimonial-${Date.now()}`,
      name: data.name,
      role: data.role,
      quote: data.quote,
      rating: data.rating,
      approved: true,
      createdAt: new Date(),
    };
    globalForMocks.mockTestimonials.push(testimonial);
    return testimonial;
  },

  bulkCreateSlots: (dateStr: string, timeStrings: string[]) => {
    let createdCount = 0;
    for (const timeStr of timeStrings) {
      const [hStr, mStr] = timeStr.split(":");
      const startTime = new Date(dateStr);
      startTime.setHours(parseInt(hStr), parseInt(mStr), 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 45);

      // check duplicate
      const duplicate = globalForMocks.mockSlots.find(s => s.startTime.getTime() === startTime.getTime());
      if (!duplicate) {
        globalForMocks.mockSlots.push({
          id: `mock-slot-${Date.now()}-${createdCount}`,
          startTime,
          endTime,
          isBooked: false,
        });
        createdCount++;
      }
    }
    return createdCount;
  }
};
