export type UserRole = 'rider' | 'driver' | 'admin';

export interface User {
  _id: string;
  name?: string;
  phone: string;
  email?: string;
  role: UserRole;
  walletBalance?: number;
  rating?: number;
  avatarUrl?: string;
  fcmToken?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface Vehicle {
  _id: string;
  type: 'CAR' | 'RICKSHAW';
  registrationNumber?: string;
  reg_number?: string;
  capacity?: number;
  capicity?: number;
  make?: string;
  model?: string;
  year?: number;
  rcDocUrl?: string;
  insuranceDocUrl?: string;
  photoUrl?: string;
}

export interface DriverProfile {
  _id: string;
  userId: User;
  vehicle?: Vehicle | null;
  licenseNumber: string;
  operatingZone?: string;
  status: 'offline' | 'online' | 'onTrip';
  totalRides?: number;
  earnings?: number;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface Trip {
  _id: string;
  driver: DriverProfile;
  origin: {
    type: 'Point';
    coordinates: [number, number];
  };
  destination: {
    type: 'Point';
    coordinates: [number, number];
  };
  distance: number;
  departureTime?: string;
  dipartureTime?: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: 'open' | 'full' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Booking {
  _id: string;
  rider: User;
  trip?: Trip | null;
  autoDriver?: DriverProfile | null;
  seats: number;
  fare: number;
  paymentMethod: 'RAZORPAY' | 'CASH' | 'WALLET';
  paymentReference?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

export interface Payment {
  _id: string;
  booking: string;
  amount: number;
  gateway: 'RAZORPAY' | 'CASH' | 'WALLET';
  gatewayOrderId?: string;
  gatewayTransactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  rawResponse?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    count?: number;
    total?: number;
    page?: number;
    totalPages?: number;
  };
}
