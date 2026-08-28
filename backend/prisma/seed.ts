/**
 * Prisma Seed — Yaatra
 *
 * Run:  npx prisma db seed
 *       — or —  npm run seed
 *
 * Requirements:
 *   - PostgreSQL with PostGIS extension enabled (recurring_rides.route uses geography(LINESTRING,4326))
 *   - Database seeded AFTER the latest migration has been applied
 *
 * The seed is idempotent — deletes all data before re-inserting.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** ST_GeographyFromText string for a LINESTRING */
function linestring(coords: [number, number][]) {
  const body = coords.map(([lng, lat]) => `${lng} ${lat}`).join(", ");
  return `SRID=4326;LINESTRING(${body})`;
}

/** TIME(0) column needs midnight-based Date objects */
function time(h: number, m: number) {
  return new Date(1970, 0, 1, h, m, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. USERS
// ─────────────────────────────────────────────────────────────────────────────

const USERS = [
  // ── Admin ──────────────────────────────────────────────────
  {
    id: "user-admin-001",
    phone: "9000000001",
    name: "Yaatra Admin",
    email: "admin@yaatra.in",
    role: "ADMIN" as const,
    gender: "MALE",
    city: "Bangalore",
    referralCode: "ADMIN001",
  },
  // ── Carpool / professional drivers ─────────────────────────
  {
    id: "user-driver-001",
    phone: "9000000010",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    role: "BOTH" as const,
    gender: "MALE",
    city: "Bangalore",
    referralCode: "RAJ001",
    emergencyContacts: [
      { label: "Wife", phone: "9000000011" },
      { label: "Brother", phone: "9000000012" },
    ],
  },
  {
    id: "user-driver-002",
    phone: "9000000020",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    role: "BOTH" as const,
    gender: "FEMALE",
    city: "Bangalore",
    referralCode: "PRI001",
  },
  {
    id: "user-driver-003",
    phone: "9000000030",
    name: "Vikram Patel",
    email: "vikram.p@example.com",
    role: "DRIVER" as const,
    gender: "MALE",
    city: "Delhi NCR",
    referralCode: "VIK001",
    emergencyContacts: [{ label: "Father", phone: "9000000031" }],
  },
  {
    id: "user-driver-004",
    phone: "9000000040",
    name: "Anil Singh",
    email: "anil.s@example.com",
    role: "PROFESSIONAL" as const,
    gender: "MALE",
    city: "Bangalore",
    referralCode: "ANI001",
  },
  // ── Riders ─────────────────────────────────────────────────
  {
    id: "user-rider-001",
    phone: "9000000100",
    name: "Asha Reddy",
    email: "asha.r@example.com",
    role: "RIDER" as const,
    gender: "FEMALE",
    city: "Bangalore",
    referralCode: "ASH001",
    emergencyContacts: [
      { label: "Mom", phone: "9000000101" },
      { label: "Friend", phone: "9000000102" },
    ],
  },
  {
    id: "user-rider-002",
    phone: "9000000200",
    name: "Deepak Nair",
    email: "deepak.n@example.com",
    role: "RIDER" as const,
    gender: "MALE",
    city: "Bangalore",
    referralCode: "DEE001",
  },
  {
    id: "user-rider-003",
    phone: "9000000300",
    name: "Kavitha Menon",
    email: "kavitha.m@example.com",
    role: "RIDER" as const,
    gender: "FEMALE",
    city: "Mumbai",
    referralCode: "KAV001",
  },
  {
    id: "user-rider-004",
    phone: "9000000400",
    name: "Arjun Gupta",
    email: "arjun.g@example.com",
    role: "RIDER" as const,
    gender: "MALE",
    city: "Delhi NCR",
    referralCode: "ARJ001",
  },
  {
    id: "user-rider-005",
    phone: "9000000500",
    name: "Sneha Iyer",
    email: "sneha.i@example.com",
    role: "RIDER" as const,
    gender: "FEMALE",
    city: "Hyderabad",
    referralCode: "SNE001",
  },
  {
    id: "user-rider-006",
    phone: "9000000600",
    name: "Mohammed Farhan",
    email: "farhan@example.com",
    role: "RIDER" as const,
    gender: "MALE",
    city: "Pune",
    referralCode: "FAR001",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 2. DRIVER PROFILES
// ─────────────────────────────────────────────────────────────────────────────

const DRIVER_PROFILES = [
  {
    driverId: "user-driver-001",
    driverType: "BOTH" as const,
    isOnline: false,
    currentLat: 12.9716,
    currentLng: 77.5946,
    currentZone: "Whitefield",
    verificationStatus: "PASSED" as const,
    totalRating: 4.7,
    ratingCount: 142,
    badges: { verifiedIdentity: true, verifiedVehicle: true, experienced: true },
  },
  {
    driverId: "user-driver-002",
    driverType: "CARPOOL" as const,
    isOnline: false,
    currentLat: 12.9352,
    currentLng: 77.6245,
    currentZone: "Koramangala",
    verificationStatus: "PASSED" as const,
    totalRating: 4.9,
    ratingCount: 87,
    badges: {
      verifiedIdentity: true,
      verifiedVehicle: true,
      womenOnly: true,
      experienced: true,
    },
  },
  {
    driverId: "user-driver-003",
    driverType: "CARPOOL" as const,
    isOnline: false,
    currentLat: 28.6139,
    currentLng: 77.209,
    currentZone: "Connaught Place",
    verificationStatus: "PASSED" as const,
    totalRating: 4.5,
    ratingCount: 203,
    badges: { verifiedIdentity: true, verifiedVehicle: true, experienced: true },
  },
  {
    driverId: "user-driver-004",
    driverType: "PROFESSIONAL" as const,
    isOnline: true,
    currentLat: 12.9784,
    currentLng: 77.6408,
    currentZone: "Koramangala",
    verificationStatus: "PASSED" as const,
    totalRating: 4.3,
    ratingCount: 510,
    badges: {
      verifiedIdentity: true,
      verifiedVehicle: true,
      commercialPermit: true,
      experienced: true,
    },
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 3. VEHICLES
// ─────────────────────────────────────────────────────────────────────────────

const VEHICLES = [
  {
    id: "veh-001",
    driverId: "user-driver-001",
    make: "Maruti Suzuki",
    model: "Ciaz",
    color: "Pearl White",
    licensePlate: "KA 01 AB 1234",
    capacity: 4,
    isCommercial: false,
    verificationStatus: "PASSED" as const,
  },
  {
    id: "veh-002",
    driverId: "user-driver-001",
    make: "Hyundai",
    model: "Verna",
    color: "Midnight Blue",
    licensePlate: "KA 02 MN 5678",
    capacity: 4,
    isCommercial: false,
    verificationStatus: "PASSED" as const,
  },
  {
    id: "veh-003",
    driverId: "user-driver-002",
    make: "Honda",
    model: "City",
    color: "Silver",
    licensePlate: "KA 05 CD 9012",
    capacity: 4,
    isCommercial: false,
    verificationStatus: "PASSED" as const,
  },
  {
    id: "veh-004",
    driverId: "user-driver-003",
    make: "Toyota",
    model: "Innova Crysta",
    color: "White",
    licensePlate: "DL 01 EF 3456",
    capacity: 6,
    isCommercial: false,
    verificationStatus: "PASSED" as const,
  },
  {
    id: "veh-005",
    driverId: "user-driver-004",
    make: "Maruti Suzuki",
    model: "Dzire",
    color: "Graphene Grey",
    licensePlate: "KA 03 GH 7890",
    capacity: 4,
    isCommercial: true,
    fitnessCertUrl: "kyc/veh-005/fitness.pdf",
    permitUrl: "kyc/veh-005/permit.pdf",
    verificationStatus: "PASSED" as const,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECURRING RIDES (PostGIS LINESTRING — raw SQL)
// ─────────────────────────────────────────────────────────────────────────────

const RECURRING_RIDES = [
  {
    id: "ride-001",
    driverId: "user-driver-001",
    vehicleId: "veh-001",
    route: linestring([
      [77.75, 12.969],   // Whitefield
      [77.7, 12.965],
      [77.65, 12.955],
      [77.6245, 12.9352], // Koramangala
    ]),
    schedule: {
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      departureTime: "08:30",
      returnDeparture: "18:00",
    },
    pricePerSeat: 150,
    maxPassengers: 3,
    womenOnly: false,
    status: "ACTIVE" as const,
  },
  {
    id: "ride-002",
    driverId: "user-driver-002",
    vehicleId: "veh-003",
    route: linestring([
      [77.6245, 12.9352], // Koramangala
      [77.64, 12.92],
      [77.66, 12.9],
      [77.68, 12.885],    // Electronic City
    ]),
    schedule: {
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      departureTime: "09:00",
    },
    pricePerSeat: 120,
    maxPassengers: 2,
    womenOnly: true,
    status: "ACTIVE" as const,
  },
  {
    id: "ride-003",
    driverId: "user-driver-003",
    vehicleId: "veh-004",
    route: linestring([
      [77.209, 28.6139],  // Connaught Place
      [77.2, 28.52],
      [77.09, 28.46],     // Gurgaon Cyber Hub
    ]),
    schedule: {
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      departureTime: "08:00",
    },
    pricePerSeat: 200,
    maxPassengers: 3,
    womenOnly: false,
    status: "ACTIVE" as const,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 5. RIDE INSTANCES (next N business days)
// ─────────────────────────────────────────────────────────────────────────────

function nextBusinessDays(n: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) {
      days.push(new Date(d));
    }
  }
  return days;
}

const bdays = nextBusinessDays(5);

const RIDE_INSTANCES = [
  // Rajesh's commute — 5 weekdays
  ...bdays.map((date, i) => ({
    id: `inst-001-${i + 1}`,
    rideId: "ride-001",
    date,
    departureTime: time(8, 30),
    status: (i < 3 ? "COMPLETED" : "SCHEDULED") as "COMPLETED" | "SCHEDULED",
  })),
  // Priya's women-only — 5 weekdays
  ...bdays.map((date, i) => ({
    id: `inst-002-${i + 1}`,
    rideId: "ride-002",
    date,
    departureTime: time(9, 0),
    status: (i < 2 ? "COMPLETED" : "SCHEDULED") as "COMPLETED" | "SCHEDULED",
  })),
  // Vikram's CP→Gurgaon — 3 weekdays
  ...bdays.slice(0, 3).map((date, i) => ({
    id: `inst-003-${i + 1}`,
    rideId: "ride-003",
    date,
    departureTime: time(8, 0),
    status: (i < 1 ? "COMPLETED" : "SCHEDULED") as "COMPLETED" | "SCHEDULED",
  })),
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. BOOKINGS
// ─────────────────────────────────────────────────────────────────────────────

const BOOKINGS = [
  // Completed — Asha on Rajesh's first 3 instances
  { id: "booking-001", instanceId: "inst-001-1", riderId: "user-rider-001", seatCount: 1, fareTotal: 150, commission: 15, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  { id: "booking-002", instanceId: "inst-001-2", riderId: "user-rider-001", seatCount: 1, fareTotal: 150, commission: 15, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  { id: "booking-003", instanceId: "inst-001-3", riderId: "user-rider-001", seatCount: 1, fareTotal: 150, commission: 15, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  // Deepak on Rajesh's first instance
  { id: "booking-004", instanceId: "inst-001-1", riderId: "user-rider-002", seatCount: 1, fareTotal: 150, commission: 15, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  // Kavitha on Priya's completed instances
  { id: "booking-005", instanceId: "inst-002-1", riderId: "user-rider-003", seatCount: 1, fareTotal: 120, commission: 12, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  { id: "booking-006", instanceId: "inst-002-2", riderId: "user-rider-003", seatCount: 1, fareTotal: 120, commission: 12, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  // Sneha on Priya's upcoming (women-only)
  { id: "booking-007", instanceId: "inst-002-3", riderId: "user-rider-005", seatCount: 1, fareTotal: 120, commission: 12, paymentStatus: "AUTHORIZED" as const, bookingStatus: "CONFIRMED" as const },
  // Arjun on Vikram's CP→Gurgaon
  { id: "booking-008", instanceId: "inst-003-1", riderId: "user-rider-004", seatCount: 1, fareTotal: 200, commission: 20, paymentStatus: "CAPTURED" as const, bookingStatus: "COMPLETED" as const },
  // Mohammed on Vikram's upcoming
  { id: "booking-009", instanceId: "inst-003-2", riderId: "user-rider-006", seatCount: 1, fareTotal: 200, commission: 20, paymentStatus: "PENDING" as const, bookingStatus: "CONFIRMED" as const },
  // Cancelled
  { id: "booking-010", instanceId: "inst-001-5", riderId: "user-rider-002", seatCount: 1, fareTotal: 150, commission: 0, paymentStatus: "REFUNDED" as const, bookingStatus: "CANCELLED" as const },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. ON-DEMAND TRIPS
// ─────────────────────────────────────────────────────────────────────────────

const TRIPS = [
  {
    id: "trip-001",
    riderId: "user-rider-001",
    driverId: "user-driver-004",
    status: "COMPLETED" as const,
    pickupLat: 12.9716,
    pickupLng: 77.5946,
    dropLat: 12.9063,
    dropLng: 77.5857,
    pickupAddress: "MG Road, Bangalore",
    dropAddress: "Jayanagar 4th Block, Bangalore",
    fareEstimate: 280,
    fareFinal: 265,
    distanceKm: 12.5,
    durationMin: 35,
    pickupTime: new Date(Date.now() - 86400000 * 2),
    startTime: new Date(Date.now() - 86400000 * 2 + 300000),
    endTime: new Date(Date.now() - 86400000 * 2 + 2400000),
    surgeMultiplier: 1.0,
  },
  {
    id: "trip-002",
    riderId: "user-rider-002",
    driverId: "user-driver-001",
    status: "IN_PROGRESS" as const,
    pickupLat: 12.965,
    pickupLng: 77.61,
    dropLat: 12.935,
    dropLng: 77.625,
    pickupAddress: "HSR Layout Sector 2, Bangalore",
    dropAddress: "Koramangala 5th Block, Bangalore",
    fareEstimate: 180,
    distanceKm: 8.2,
    durationMin: 22,
    pickupTime: new Date(),
    startTime: new Date(),
    surgeMultiplier: 1.0,
  },
  {
    id: "trip-003",
    riderId: "user-rider-004",
    driverId: null,
    status: "SEARCHING" as const,
    pickupLat: 28.6139,
    pickupLng: 77.209,
    dropLat: 28.5245,
    dropLng: 77.2065,
    pickupAddress: "Connaught Place, Delhi",
    dropAddress: "Hauz Khas Village, Delhi",
    fareEstimate: 320,
    surgeMultiplier: 1.2,
  },
  {
    id: "trip-004",
    riderId: "user-rider-003",
    driverId: null,
    status: "COMPLETED" as const,
    pickupLat: 19.076,
    pickupLng: 72.8777,
    dropLat: 19.0596,
    dropLng: 72.8295,
    pickupAddress: "Bandra West, Mumbai",
    dropAddress: "Lower Parel, Mumbai",
    fareEstimate: 250,
    fareFinal: 240,
    distanceKm: 10.1,
    durationMin: 28,
    pickupTime: new Date(Date.now() - 86400000),
    startTime: new Date(Date.now() - 86400000 + 180000),
    endTime: new Date(Date.now() - 86400000 + 1860000),
    surgeMultiplier: 1.0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. TRIP LOCATIONS (in-progress trip-002)
// ─────────────────────────────────────────────────────────────────────────────

const TRIP_LOCATIONS = Array.from({ length: 12 }, (_, i) => ({
  id: `loc-002-${i + 1}`,
  tripId: "trip-002",
  lat: 12.965 + i * 0.0008,
  lng: 77.61 + i * 0.001,
  speedKmh: 25 + Math.round(Math.random() * 20),
  recordedAt: new Date(Date.now() - (12 - i) * 30000),
}));

// ─────────────────────────────────────────────────────────────────────────────
// 9. PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

const BOOKING_PAYMENTS = BOOKINGS.filter(
  (b) => b.paymentStatus === "CAPTURED" || b.paymentStatus === "AUTHORIZED",
).map((b, i) => ({
  id: `pay-bk-${String(i + 1).padStart(3, "0")}`,
  bookingId: b.id,
  tripId: null as string | null,
  providerTransactionId: `rzp_${b.id.replace("booking-", "")}`,
  amount: b.fareTotal,
  type: (b.paymentStatus === "CAPTURED" ? "CAPTURE" : "AUTH") as "CAPTURE" | "AUTH",
  status: "SUCCEEDED" as const,
}));

const TRIP_PAYMENTS = [
  {
    id: "pay-trip-001",
    bookingId: null as string | null,
    tripId: "trip-001",
    providerTransactionId: "rzp_trip001",
    amount: 265,
    type: "CAPTURE" as const,
    status: "SUCCEEDED" as const,
  },
  {
    id: "pay-trip-004",
    bookingId: null as string | null,
    tripId: "trip-004",
    providerTransactionId: "rzp_trip004",
    amount: 240,
    type: "CAPTURE" as const,
    status: "SUCCEEDED" as const,
  },
];

const PAYMENTS = [...BOOKING_PAYMENTS, ...TRIP_PAYMENTS];

// ─────────────────────────────────────────────────────────────────────────────
// 10. WALLETS & TRANSACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const WALLETS = [
  { id: "wallet-001", userId: "user-rider-001", balance: 850 },
  { id: "wallet-002", userId: "user-rider-002", balance: 1200 },
  { id: "wallet-003", userId: "user-rider-003", balance: 2100 },
  { id: "wallet-004", userId: "user-rider-004", balance: 340 },
  { id: "wallet-005", userId: "user-rider-005", balance: 500 },
  { id: "wallet-006", userId: "user-rider-006", balance: 175 },
  { id: "wallet-007", userId: "user-driver-001", balance: 3200 },
  { id: "wallet-008", userId: "user-driver-002", balance: 2850 },
  { id: "wallet-009", userId: "user-driver-003", balance: 5400 },
  { id: "wallet-010", userId: "user-driver-004", balance: 8750 },
];

const WALLET_TXNS = [
  // Asha
  { id: "txn-001", walletId: "wallet-001", amount: 1000, type: "TOPUP" as const, referenceId: null as string | null },
  { id: "txn-002", walletId: "wallet-001", amount: -150, type: "DEBIT" as const, referenceId: "booking-001" },
  { id: "txn-003", walletId: "wallet-001", amount: -150, type: "DEBIT" as const, referenceId: "booking-002" },
  { id: "txn-004", walletId: "wallet-001", amount: -150, type: "DEBIT" as const, referenceId: "booking-003" },
  { id: "txn-005", walletId: "wallet-001", amount: 1000, type: "TOPUP" as const, referenceId: null },
  // Deepak
  { id: "txn-006", walletId: "wallet-002", amount: 1500, type: "TOPUP" as const, referenceId: null },
  { id: "txn-007", walletId: "wallet-002", amount: -150, type: "DEBIT" as const, referenceId: "booking-004" },
  { id: "txn-008", walletId: "wallet-002", amount: -150, type: "DEBIT" as const, referenceId: "booking-010" },
  { id: "txn-009", walletId: "wallet-002", amount: 150, type: "REFUND" as const, referenceId: "booking-010" },
  // Kavitha
  { id: "txn-010", walletId: "wallet-003", amount: 2500, type: "TOPUP" as const, referenceId: null },
  { id: "txn-011", walletId: "wallet-003", amount: -120, type: "DEBIT" as const, referenceId: "booking-005" },
  { id: "txn-012", walletId: "wallet-003", amount: -120, type: "DEBIT" as const, referenceId: "booking-006" },
  // Rajesh (driver earnings)
  { id: "txn-013", walletId: "wallet-007", amount: 450, type: "TOPUP" as const, referenceId: null },
  { id: "txn-014", walletId: "wallet-007", amount: 135, type: "ADJUSTMENT" as const, referenceId: "booking-001" },
  { id: "txn-015", walletId: "wallet-007", amount: 135, type: "ADJUSTMENT" as const, referenceId: "booking-002" },
  { id: "txn-016", walletId: "wallet-007", amount: 135, type: "ADJUSTMENT" as const, referenceId: "booking-003" },
  // Anil (pro: fare 265, 25% commission = 66.25, net 198.75)
  { id: "txn-017", walletId: "wallet-010", amount: 198.75, type: "ADJUSTMENT" as const, referenceId: "trip-001" },
  // Vikram
  { id: "txn-018", walletId: "wallet-009", amount: 180, type: "ADJUSTMENT" as const, referenceId: "booking-008" },
  // Priya
  { id: "txn-019", walletId: "wallet-008", amount: 3000, type: "TOPUP" as const, referenceId: null },
];

// ─────────────────────────────────────────────────────────────────────────────
// 11. RATINGS
// ─────────────────────────────────────────────────────────────────────────────

const RATINGS = [
  {
    id: "rat-001",
    reviewerId: "user-rider-001",
    revieweeId: "user-driver-001",
    rideInstanceId: "inst-001-1" as string | null,
    tripId: null as string | null,
    score: 5,
    comment: "Punctual and drove carefully. Great carpool experience!",
    tags: { punctual: true, safeDriver: true, comfortable: true },
  },
  {
    id: "rat-002",
    reviewerId: "user-rider-002",
    revieweeId: "user-driver-001",
    rideInstanceId: "inst-001-1" as string | null,
    tripId: null,
    score: 4,
    comment: "Good ride, on time. AC was slightly warm.",
    tags: { punctual: true, safeDriver: true },
  },
  {
    id: "rat-003",
    reviewerId: "user-rider-003",
    revieweeId: "user-driver-002",
    rideInstanceId: "inst-002-1" as string | null,
    tripId: null,
    score: 5,
    comment: "Felt very safe and comfortable. Highly recommend!",
    tags: { punctual: true, safeDriver: true, comfortable: true },
  },
  {
    id: "rat-004",
    reviewerId: "user-rider-001",
    revieweeId: "user-driver-004",
    rideInstanceId: null,
    tripId: "trip-001" as string | null,
    score: 4,
    comment: "Smooth ride, knew the shortcuts. Fair pricing.",
    tags: { punctual: true, safeDriver: true },
  },
  {
    id: "rat-005",
    reviewerId: "user-rider-004",
    revieweeId: "user-driver-003",
    rideInstanceId: null,
    tripId: "trip-004" as string | null,
    score: 5,
    comment: "Excellent driver. Very professional and safe.",
    tags: { punctual: true, safeDriver: true, experienced: true },
  },
  {
    id: "rat-006",
    reviewerId: "user-rider-003",
    revieweeId: "user-driver-002",
    rideInstanceId: "inst-002-2" as string | null,
    tripId: null,
    score: 5,
    comment: "Always on time and keeps the car spotless.",
    tags: { punctual: true, cleanCar: true, comfortable: true },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 12. KYC DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────

const KYC_DOCS = [
  { id: "doc-001", userId: "user-driver-001", type: "DRIVING_LICENSE" as const, s3Key: "kyc/user-driver-001/driving-license.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 30) },
  { id: "doc-002", userId: "user-driver-001", type: "AADHAAR" as const, s3Key: "kyc/user-driver-001/aadhaar.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 30) },
  { id: "doc-003", userId: "user-driver-002", type: "DRIVING_LICENSE" as const, s3Key: "kyc/user-driver-002/driving-license.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 25) },
  { id: "doc-004", userId: "user-driver-002", type: "AADHAAR" as const, s3Key: "kyc/user-driver-002/aadhaar.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 25) },
  { id: "doc-005", userId: "user-driver-003", type: "DRIVING_LICENSE" as const, s3Key: "kyc/user-driver-003/driving-license.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 15) },
  { id: "doc-006", userId: "user-driver-004", type: "DRIVING_LICENSE" as const, s3Key: "kyc/user-driver-004/driving-license.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 60) },
  { id: "doc-007", userId: "user-driver-004", type: "AADHAAR" as const, s3Key: "kyc/user-driver-004/aadhaar.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 60) },
  { id: "doc-008", userId: "user-driver-004", type: "PAN" as const, s3Key: "kyc/user-driver-004/pan.pdf", status: "PASSED" as const, verifiedAt: new Date(Date.now() - 86400000 * 60) },
  { id: "doc-009", userId: "user-rider-001", type: "AADHAAR" as const, s3Key: "kyc/user-rider-001/aadhaar.pdf", status: "PENDING" as const, verifiedAt: null },
  { id: "doc-010", userId: "user-rider-002", type: "AADHAAR" as const, s3Key: "kyc/user-rider-002/aadhaar.pdf", status: "FAILED" as const, verifiedAt: null, rejectionReason: "Image is blurry and text is not readable. Please re-upload a clearer photo." },
];

// ─────────────────────────────────────────────────────────────────────────────
// 13. SAVED PLACES
// ─────────────────────────────────────────────────────────────────────────────

const SAVED_PLACES = [
  // Asha
  { id: "place-001", userId: "user-rider-001", label: "Home", name: "Asha's Apartment", address: "HSR Layout Sector 3, Bangalore, Karnataka 560102", lat: 12.9116, lng: 77.6389 },
  { id: "place-002", userId: "user-rider-001", label: "Work", name: "Infosys Electronics City", address: "Electronics City Phase 1, Hosur Road, Bangalore", lat: 12.8456, lng: 77.6602 },
  { id: "place-003", userId: "user-rider-001", label: "College", name: "BMS College of Engineering", address: "Bull Temple Road, Basavanagudi, Bangalore", lat: 12.9414, lng: 77.5624 },
  // Deepak
  { id: "place-004", userId: "user-rider-002", label: "Home", name: "Deepak's PG", address: "Koramangala 4th Block, Bangalore, Karnataka 560034", lat: 12.9352, lng: 77.6245 },
  { id: "place-005", userId: "user-rider-002", label: "Work", name: "Flipkart Office", address: "Outer Ring Road, Bellandur, Bangalore", lat: 12.9352, lng: 77.67 },
  // Kavitha
  { id: "place-006", userId: "user-rider-003", label: "Home", name: "Kavitha's Flat", address: "Bandra West, Mumbai, Maharashtra 400050", lat: 19.0596, lng: 72.8295 },
  { id: "place-007", userId: "user-rider-003", label: "Work", name: "ICICI Bank Tower", address: "Lower Parel, Mumbai, Maharashtra 400013", lat: 19.0096, lng: 72.8405 },
  // Rajesh
  { id: "place-008", userId: "user-driver-001", label: "Home", name: "Rajesh's House", address: "Whitefield Main Road, Bangalore, Karnataka 560066", lat: 12.969, lng: 77.75 },
  { id: "place-009", userId: "user-driver-001", label: "Work", name: "Wipro SEZ", address: "Sarjapur Road, Bangalore, Karnataka 560103", lat: 12.9121, lng: 77.6446 },
  // Arjun
  { id: "place-010", userId: "user-rider-004", label: "Home", name: "Arjun's Residence", address: "Dwarka Sector 7, Delhi, Delhi 110077", lat: 28.5733, lng: 77.0587 },
  { id: "place-011", userId: "user-rider-004", label: "Work", name: "NASSCOM Office", address: "Connaught Place, Delhi, Delhi 110001", lat: 28.6315, lng: 77.2167 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 14. NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

const NOTIFICATIONS = [
  { id: "notif-001", userId: "user-rider-001", type: "BOOKING_CONFIRMED", payload: { message: "Your booking with Rajesh Kumar for tomorrow is confirmed.", rideId: "ride-001", instanceId: "inst-001-4" }, readAt: new Date(Date.now() - 86400000) },
  { id: "notif-002", userId: "user-rider-001", type: "RIDE_COMPLETED", payload: { message: "Your ride with Anil Singh is complete. Please rate your experience.", tripId: "trip-001" }, readAt: null },
  { id: "notif-003", userId: "user-rider-001", type: "RIDE_REMINDER", payload: { message: "Reminder: Your carpool with Rajesh Kumar departs in 1 hour.", rideId: "ride-001", instanceId: "inst-001-5" }, readAt: null },
  { id: "notif-004", userId: "user-driver-001", type: "BOOKING_REQUEST", payload: { message: "Deepak Nair wants to join your morning commute tomorrow.", bookingId: "booking-004", riderName: "Deepak Nair" }, readAt: new Date(Date.now() - 86400000) },
  { id: "notif-005", userId: "user-driver-001", type: "DRIVER_ASSIGNMENT", payload: { message: "You have been assigned a new trip. Pickup at HSR Layout.", tripId: "trip-002" }, readAt: null },
  { id: "notif-006", userId: "user-rider-004", type: "SEARCH_TIMEOUT", payload: { message: "No drivers found nearby within 2 minutes. Try expanding your search radius." }, readAt: null },
  { id: "notif-007", userId: "user-driver-003", type: "PAYOUT_PROCESSED", payload: { message: "Your earnings of ₹180 from booking #booking-008 have been credited.", bookingId: "booking-008" }, readAt: new Date(Date.now() - 3600000) },
  { id: "notif-008", userId: "user-rider-005", type: "BOOKING_CONFIRMED", payload: { message: "Your women-only carpool with Priya Sharma is confirmed for tomorrow 9 AM.", rideId: "ride-002", instanceId: "inst-002-3" }, readAt: null },
];

// ─────────────────────────────────────────────────────────────────────────────
// 15. DISPUTES
// ─────────────────────────────────────────────────────────────────────────────

const DISPUTES = [
  { id: "dispute-001", bookingId: "booking-010", raisedBy: "user-rider-002", reason: "Driver cancelled less than 30 minutes before pickup. Requesting penalty refund.", status: "OPEN", refundAmount: null },
  { id: "dispute-002", bookingId: "booking-008", raisedBy: "user-rider-004", reason: "Fare was ₹320 estimate but ₹200 charged — expected higher fare.", status: "RESOLVED", resolution: "Fare was recalculated based on actual route. ₹200 was correct.", refundAmount: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 16. EMERGENCY ALERTS
// ─────────────────────────────────────────────────────────────────────────────

const EMERGENCY_ALERTS = [
  { id: "alert-001", userId: "user-rider-001", tripId: "trip-001", lat: 12.9716, lng: 77.5946, status: "RESOLVED" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding Yaatra database...\n");

  // Clean in dependency order (children first)
  console.log("  Cleaning existing data...");
  await prisma.emergencyAlert.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.tripLocation.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.kycDocument.deleteMany();
  await prisma.savedPlace.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.rideInstance.deleteMany();
  await prisma.recurringRide.deleteMany();
  await prisma.vehicles.deleteMany();
  await prisma.driverProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log("  Cleaned.\n");

  // 1. Users
  console.log("  [1/17] Users...");
  for (const u of USERS) {
    await prisma.user.create({ data: { ...u } });
  }
  console.log(`        ${USERS.length} created`);

  // 2. Driver profiles
  console.log("  [2/17] Driver profiles...");
  for (const dp of DRIVER_PROFILES) {
    await prisma.driverProfile.create({ data: { ...dp } });
  }
  console.log(`        ${DRIVER_PROFILES.length} created`);

  // 3. Vehicles
  console.log("  [3/17] Vehicles...");
  for (const v of VEHICLES) {
    await prisma.vehicles.create({ data: { ...v } });
  }
  console.log(`        ${VEHICLES.length} created`);

  // 4. Recurring rides (raw SQL for PostGIS geography)
  console.log("  [4/17] Recurring rides (PostGIS LINESTRING)...");
  for (const rr of RECURRING_RIDES) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO recurring_rides (ride_id, driverId, vehicleId, route, "schedule", "pricePerSeat", maxPassengers, "womenOnly", status, created_at, updated_at)
       VALUES ($1, $2, $3, ST_GeographyFromText($4), $5::jsonb, $6, $7, $8, $9, NOW(), NOW())`,
      rr.id,
      rr.driverId,
      rr.vehicleId,
      rr.route,
      JSON.stringify(rr.schedule),
      rr.pricePerSeat,
      rr.maxPassengers,
      rr.womenOnly,
      rr.status,
    );
  }
  console.log(`        ${RECURRING_RIDES.length} created`);

  // 5. Ride instances
  console.log("  [5/17] Ride instances...");
  for (const ri of RIDE_INSTANCES) {
    await prisma.rideInstance.create({ data: { ...ri } });
  }
  console.log(`        ${RIDE_INSTANCES.length} created`);

  // 6. On-demand trips
  console.log("  [6/17] On-demand trips...");
  for (const t of TRIPS) {
    await prisma.trip.create({ data: { ...t } });
  }
  console.log(`        ${TRIPS.length} created`);

  // 7. Bookings
  console.log("  [7/17] Bookings...");
  for (const b of BOOKINGS) {
    await prisma.booking.create({ data: { ...b } });
  }
  console.log(`        ${BOOKINGS.length} created`);

  // 8. Payments
  console.log("  [8/17] Payments...");
  for (const p of PAYMENTS) {
    await prisma.payment.create({ data: { ...p } });
  }
  console.log(`        ${PAYMENTS.length} created`);

  // 9. Trip locations
  console.log("  [9/17] Trip locations...");
  for (const loc of TRIP_LOCATIONS) {
    await prisma.tripLocation.create({ data: { ...loc } });
  }
  console.log(`        ${TRIP_LOCATIONS.length} created`);

  // 10. Wallets
  console.log("  [10/17] Wallets...");
  for (const w of WALLETS) {
    await prisma.wallet.create({ data: { ...w } });
  }
  console.log(`        ${WALLETS.length} created`);

  // 11. Wallet transactions
  console.log("  [11/17] Wallet transactions...");
  for (const wt of WALLET_TXNS) {
    await prisma.walletTransaction.create({ data: { ...wt } });
  }
  console.log(`        ${WALLET_TXNS.length} created`);

  // 12. Ratings
  console.log("  [12/17] Ratings...");
  for (const r of RATINGS) {
    await prisma.rating.create({ data: { ...r } });
  }
  console.log(`        ${RATINGS.length} created`);

  // 13. KYC documents
  console.log("  [13/17] KYC documents...");
  for (const d of KYC_DOCS) {
    await prisma.kycDocument.create({ data: { ...d } });
  }
  console.log(`        ${KYC_DOCS.length} created`);

  // 14. Saved places
  console.log("  [14/17] Saved places...");
  for (const sp of SAVED_PLACES) {
    await prisma.savedPlace.create({ data: { ...sp } });
  }
  console.log(`        ${SAVED_PLACES.length} created`);

  // 15. Notifications
  console.log("  [15/17] Notifications...");
  for (const n of NOTIFICATIONS) {
    await prisma.notification.create({ data: { ...n } });
  }
  console.log(`        ${NOTIFICATIONS.length} created`);

  // 16. Disputes
  console.log("  [16/17] Disputes...");
  for (const d of DISPUTES) {
    await prisma.dispute.create({ data: { ...d } });
  }
  console.log(`        ${DISPUTES.length} created`);

  // 17. Emergency alerts
  console.log("  [17/17] Emergency alerts...");
  for (const ea of EMERGENCY_ALERTS) {
    await prisma.emergencyAlert.create({ data: { ...ea } });
  }
  console.log(`        ${EMERGENCY_ALERTS.length} created`);

  // ── Summary ────────────────────────────────────────────────
  console.log("\n  ═══════════════════════════════════════════");
  console.log("  SEED COMPLETE");
  console.log("  ═══════════════════════════════════════════");
  console.log(`  Users:             ${USERS.length}`);
  console.log(`  Driver profiles:   ${DRIVER_PROFILES.length}`);
  console.log(`  Vehicles:          ${VEHICLES.length}`);
  console.log(`  Recurring rides:   ${RECURRING_RIDES.length}`);
  console.log(`  Ride instances:    ${RIDE_INSTANCES.length}`);
  console.log(`  Trips (on-demand): ${TRIPS.length}`);
  console.log(`  Bookings:          ${BOOKINGS.length}`);
  console.log(`  Payments:          ${PAYMENTS.length}`);
  console.log(`  Trip locations:    ${TRIP_LOCATIONS.length}`);
  console.log(`  Wallets:           ${WALLETS.length}`);
  console.log(`  Wallet txns:       ${WALLET_TXNS.length}`);
  console.log(`  Ratings:           ${RATINGS.length}`);
  console.log(`  KYC docs:          ${KYC_DOCS.length}`);
  console.log(`  Saved places:      ${SAVED_PLACES.length}`);
  console.log(`  Notifications:     ${NOTIFICATIONS.length}`);
  console.log(`  Disputes:          ${DISPUTES.length}`);
  console.log(`  Emergency alerts:  ${EMERGENCY_ALERTS.length}`);
  console.log("  ═══════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("\nSeed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
