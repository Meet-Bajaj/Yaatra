import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://admin:SuperSecurePassword123!@localhost:5432/yaatri',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ─── Passwords ──────────────────────────────────────────────
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  // ═══════════════════════════════════════════════════════════════
  //  USERS
  // ═══════════════════════════════════════════════════════════════

  const admin = await prisma.user.upsert({
    where: { phone: '+919000000001' },
    update: {},
    create: {
      phone: '+919000000001',
      name: 'Admin User',
      email: 'admin@yaatra.com',
      role: 'ADMIN',
      password: adminPass,
      gender: 'OTHER',
      city: 'Delhi',
      referralCode: 'ADMIN001',
    },
  });

  // ─── Riders ───────────────────────────────────────────────
  const rider1 = await prisma.user.upsert({
    where: { phone: '+919000000010' },
    update: {},
    create: {
      phone: '+919000000010',
      name: 'Rahul Sharma',
      email: 'rahul@yaatra.com',
      role: 'RIDER',
      password: userPass,
      gender: 'MALE',
      city: 'Delhi',
      referralCode: 'RAHUL010',
      emergencyContacts: JSON.stringify([
        { name: 'Priya Sharma', phone: '+919000000011' },
      ]),
    },
  });

  const rider2 = await prisma.user.upsert({
    where: { phone: '+919000000020' },
    update: {},
    create: {
      phone: '+919000000020',
      name: 'Anita Desai',
      email: 'anita@yaatra.com',
      role: 'RIDER',
      password: userPass,
      gender: 'FEMALE',
      city: 'Mumbai',
      referralCode: 'ANITA020',
    },
  });

  const rider3 = await prisma.user.upsert({
    where: { phone: '+919000000030' },
    update: {},
    create: {
      phone: '+919000000030',
      name: 'Vikram Patel',
      email: 'vikram@yaatra.com',
      role: 'RIDER',
      password: userPass,
      gender: 'MALE',
      city: 'Bangalore',
      referralCode: 'VIKRAM030',
    },
  });

  const rider4 = await prisma.user.upsert({
    where: { phone: '+919000000040' },
    update: {},
    create: {
      phone: '+919000000040',
      name: 'Sneha Gupta',
      email: 'sneha@yaatra.com',
      role: 'RIDER',
      password: userPass,
      gender: 'FEMALE',
      city: 'Delhi',
      referralCode: 'SNEHA040',
    },
  });

  const rider5 = await prisma.user.upsert({
    where: { phone: '+919000000050' },
    update: {},
    create: {
      phone: '+919000000050',
      name: 'Arjun Nair',
      email: 'arjun@yaatra.com',
      role: 'RIDER',
      password: userPass,
      gender: 'MALE',
      city: 'Chennai',
      referralCode: 'ARJUN050',
      status: 'SUSPENDED',
    },
  });

  // ─── Professional Drivers ──────────────────────────────────
  const proDriver1 = await prisma.user.upsert({
    where: { phone: '+919000000100' },
    update: {},
    create: {
      phone: '+919000000100',
      name: 'Suresh Kumar',
      email: 'suresh@yaatra.com',
      role: 'PROFESSIONAL',
      password: userPass,
      gender: 'MALE',
      city: 'Delhi',
      referralCode: 'SURESH100',
    },
  });

  const proDriver2 = await prisma.user.upsert({
    where: { phone: '+919000000101' },
    update: {},
    create: {
      phone: '+919000000101',
      name: 'Rajesh Verma',
      email: 'rajesh@yaatra.com',
      role: 'PROFESSIONAL',
      password: userPass,
      gender: 'MALE',
      city: 'Delhi',
      referralCode: 'RAJESH101',
    },
  });

  const proDriver3 = await prisma.user.upsert({
    where: { phone: '+919000000102' },
    update: {},
    create: {
      phone: '+919000000102',
      name: 'Mohammed Ali',
      email: 'mohammed@yaatra.com',
      role: 'PROFESSIONAL',
      password: userPass,
      gender: 'MALE',
      city: 'Mumbai',
      referralCode: 'MOHAMM102',
    },
  });

  // ─── Carpool Drivers ──────────────────────────────────────
  const carpoolDriver1 = await prisma.user.upsert({
    where: { phone: '+919000000200' },
    update: {},
    create: {
      phone: '+919000000200',
      name: 'Deepa Iyer',
      email: 'deepa@yaatra.com',
      role: 'CARPOOL',
      password: userPass,
      gender: 'FEMALE',
      city: 'Bangalore',
      referralCode: 'DEEPA200',
    },
  });

  const carpoolDriver2 = await prisma.user.upsert({
    where: { phone: '+919000000201' },
    update: {},
    create: {
      phone: '+919000000201',
      name: 'Amit Singh',
      email: 'amit@yaatra.com',
      role: 'CARPOOL',
      password: userPass,
      gender: 'MALE',
      city: 'Delhi',
      referralCode: 'AMIT201',
    },
  });

  const carpoolDriver3 = await prisma.user.upsert({
    where: { phone: '+919000000202' },
    update: {},
    create: {
      phone: '+919000000202',
      name: 'Pooja Reddy',
      email: 'pooja@yaatra.com',
      role: 'CARPOOL',
      password: userPass,
      gender: 'FEMALE',
      city: 'Hyderabad',
      referralCode: 'POOJA202',
    },
  });

  // ─── BOTH role (driver + rider) ───────────────────────────
  const bothUser = await prisma.user.upsert({
    where: { phone: '+919000000300' },
    update: {},
    create: {
      phone: '+919000000300',
      name: 'Karthik Menon',
      email: 'karthik@yaatra.com',
      role: 'BOTH',
      password: userPass,
      gender: 'MALE',
      city: 'Kochi',
      referralCode: 'KARTH300',
    },
  });

  console.log('Users seeded');

  // ═══════════════════════════════════════════════════════════════
  //  DRIVER PROFILES
  // ═══════════════════════════════════════════════════════════════

  const dp1 = await prisma.driverProfile.upsert({
    where: { driverId: proDriver1.id },
    update: { driverType: 'BOTH' },
    create: {
      driverId: proDriver1.id,
      driverType: 'PROFESSIONAL',
      isOnline: true,
      currentLat: 28.6139,
      currentLng: 77.209,
      currentZone: 'central-delhi',
      verificationStatus: 'PASSED',
      totalRating: 4.5,
      ratingCount: 120,
      badges: JSON.stringify(['top_rider', 'safe_driver']),
    },
  });

  const dp2 = await prisma.driverProfile.upsert({
    where: { driverId: proDriver2.id },
    update: {},
    create: {
      driverId: proDriver2.id,
      driverType: 'PROFESSIONAL',
      isOnline: true,
      currentLat: 28.628,
      currentLng: 77.219,
      currentZone: 'central-delhi',
      verificationStatus: 'PASSED',
      totalRating: 4.2,
      ratingCount: 80,
    },
  });

  const dp3 = await prisma.driverProfile.upsert({
    where: { driverId: proDriver3.id },
    update: {},
    create: {
      driverId: proDriver3.id,
      driverType: 'PROFESSIONAL',
      isOnline: false,
      currentLat: 19.076,
      currentLng: 72.8777,
      currentZone: 'south-mumbai',
      verificationStatus: 'PASSED',
      totalRating: 4.8,
      ratingCount: 200,
    },
  });

  const dp4 = await prisma.driverProfile.upsert({
    where: { driverId: carpoolDriver1.id },
    update: {},
    create: {
      driverId: carpoolDriver1.id,
      driverType: 'CARPOOL',
      isOnline: false,
      verificationStatus: 'PASSED',
      totalRating: 4.7,
      ratingCount: 30,
    },
  });

  const dp5 = await prisma.driverProfile.upsert({
    where: { driverId: carpoolDriver2.id },
    update: {},
    create: {
      driverId: carpoolDriver2.id,
      driverType: 'CARPOOL',
      isOnline: true,
      currentLat: 28.7041,
      currentLng: 77.1025,
      currentZone: 'north-delhi',
      verificationStatus: 'PASSED',
      totalRating: 4.0,
      ratingCount: 15,
    },
  });

  const dp6 = await prisma.driverProfile.upsert({
    where: { driverId: carpoolDriver3.id },
    update: {},
    create: {
      driverId: carpoolDriver3.id,
      driverType: 'CARPOOL',
      isOnline: false,
      verificationStatus: 'PENDING',
      totalRating: 0,
      ratingCount: 0,
    },
  });

  const dp7 = await prisma.driverProfile.upsert({
    where: { driverId: bothUser.id },
    update: {},
    create: {
      driverId: bothUser.id,
      driverType: 'BOTH',
      isOnline: false,
      verificationStatus: 'PASSED',
      totalRating: 4.3,
      ratingCount: 50,
    },
  });

  console.log('Driver profiles seeded');

  // ═══════════════════════════════════════════════════════════════
  //  VEHICLES
  // ═══════════════════════════════════════════════════════════════

  const v1 = await prisma.vehicles.upsert({
    where: { licensePlate: 'DL-01-AB-1234' },
    update: {},
    create: {
      driverId: dp1.driverId,
      make: 'Maruti',
      model: 'Swift Dzire',
      color: 'White',
      licensePlate: 'DL-01-AB-1234',
      capacity: 4,
      isCommercial: true,
      verificationStatus: 'PASSED',
    },
  });

  // Guarantee the primary test driver (Suresh / +919000000100) has a vehicle
  const v1b = await prisma.vehicles.upsert({
    where: { licensePlate: 'DL-04-XY-5678' },
    update: {},
    create: {
      driverId: dp1.driverId,
      make: 'Honda',
      model: 'City',
      color: 'White',
      licensePlate: 'DL-04-XY-5678',
      capacity: 4,
      isCommercial: false,
      verificationStatus: 'PASSED',
    },
  });

  const v2 = await prisma.vehicles.upsert({
    where: { licensePlate: 'DL-02-CD-5678' },
    update: {},
    create: {
      driverId: dp2.driverId,
      make: 'Hyundai',
      model: 'Verna',
      color: 'Black',
      licensePlate: 'DL-02-CD-5678',
      capacity: 4,
      isCommercial: true,
      verificationStatus: 'PASSED',
    },
  });

  const v3 = await prisma.vehicles.upsert({
    where: { licensePlate: 'MH-01-EF-9012' },
    update: {},
    create: {
      driverId: dp3.driverId,
      make: 'Toyota',
      model: 'Innova Crysta',
      color: 'Silver',
      licensePlate: 'MH-01-EF-9012',
      capacity: 7,
      isCommercial: true,
      verificationStatus: 'PASSED',
    },
  });

  const v4 = await prisma.vehicles.upsert({
    where: { licensePlate: 'KA-01-GH-3456' },
    update: {},
    create: {
      driverId: dp4.driverId,
      make: 'Hyundai',
      model: 'Creta',
      color: 'Blue',
      licensePlate: 'KA-01-GH-3456',
      capacity: 5,
      isCommercial: false,
      verificationStatus: 'PASSED',
    },
  });

  const v5 = await prisma.vehicles.upsert({
    where: { licensePlate: 'DL-03-IJ-7890' },
    update: {},
    create: {
      driverId: dp5.driverId,
      make: 'Maruti',
      model: 'Baleno',
      color: 'Red',
      licensePlate: 'DL-03-IJ-7890',
      capacity: 5,
      isCommercial: false,
      verificationStatus: 'PASSED',
    },
  });

  const v6 = await prisma.vehicles.upsert({
    where: { licensePlate: 'TS-01-KL-2345' },
    update: {},
    create: {
      driverId: dp6.driverId,
      make: 'Kia',
      model: 'Seltos',
      color: 'Grey',
      licensePlate: 'TS-01-KL-2345',
      capacity: 5,
      isCommercial: false,
      verificationStatus: 'PENDING',
    },
  });

  const v7 = await prisma.vehicles.upsert({
    where: { licensePlate: 'KL-07-MN-6789' },
    update: {},
    create: {
      driverId: dp7.driverId,
      make: 'Honda',
      model: 'Amaze',
      color: 'White',
      licensePlate: 'KL-07-MN-6789',
      capacity: 4,
      isCommercial: false,
      verificationStatus: 'PASSED',
    },
  });

  console.log('Vehicles seeded');

  // ═══════════════════════════════════════════════════════════════
  //  WALLETS + TRANSACTIONS
  // ═══════════════════════════════════════════════════════════════

  const w1 = await prisma.wallet.upsert({
    where: { userId: rider1.id },
    update: {},
    create: { userId: rider1.id, balance: 1500 },
  });
  const w2 = await prisma.wallet.upsert({
    where: { userId: rider2.id },
    update: {},
    create: { userId: rider2.id, balance: 3200 },
  });
  const w3 = await prisma.wallet.upsert({
    where: { userId: rider3.id },
    update: {},
    create: { userId: rider3.id, balance: 750 },
  });
  const w4 = await prisma.wallet.upsert({
    where: { userId: rider4.id },
    update: {},
    create: { userId: rider4.id, balance: 5000 },
  });
  await prisma.wallet.upsert({
    where: { userId: rider5.id },
    update: {},
    create: { userId: rider5.id, balance: 0 },
  });
  const w6 = await prisma.wallet.upsert({
    where: { userId: proDriver1.id },
    update: {},
    create: { userId: proDriver1.id, balance: 8500 },
  });
  const w7 = await prisma.wallet.upsert({
    where: { userId: proDriver2.id },
    update: {},
    create: { userId: proDriver2.id, balance: 4200 },
  });
  const w8 = await prisma.wallet.upsert({
    where: { userId: carpoolDriver1.id },
    update: {},
    create: { userId: carpoolDriver1.id, balance: 1200 },
  });
  const w9 = await prisma.wallet.upsert({
    where: { userId: carpoolDriver2.id },
    update: {},
    create: { userId: carpoolDriver2.id, balance: 600 },
  });
  await prisma.wallet.upsert({
    where: { userId: bothUser.id },
    update: {},
    create: { userId: bothUser.id, balance: 2000 },
  });

  // Wallet transactions
  await prisma.walletTransaction.createMany({
    data: [
      { walletId: w1.id, amount: 1000, type: 'TOPUP' },
      { walletId: w1.id, amount: 500, type: 'TOPUP' },
      { walletId: w1.id, amount: -250, type: 'DEBIT' },
      { walletId: w2.id, amount: 5000, type: 'TOPUP' },
      { walletId: w2.id, amount: -1800, type: 'DEBIT' },
      { walletId: w4.id, amount: 5000, type: 'TOPUP' },
      { walletId: w6.id, amount: 8500, type: 'TOPUP' },
      { walletId: w6.id, amount: -3500, type: 'DEBIT' },
      { walletId: w6.id, amount: 3500, type: 'TOPUP' },
      { walletId: w7.id, amount: 4200, type: 'TOPUP' },
      { walletId: w8.id, amount: 1200, type: 'TOPUP' },
      { walletId: w9.id, amount: 600, type: 'TOPUP' },
      { walletId: w1.id, amount: 200, type: 'REFUND' },
    ],
  });

  console.log('Wallets + transactions seeded');

  // ═══════════════════════════════════════════════════════════════
  //  SAVED PLACES
  // ═══════════════════════════════════════════════════════════════

  await prisma.savedPlace.createMany({
    data: [
      {
        userId: rider1.id,
        label: 'Home',
        name: 'Rahul\'s Home',
        address: 'Sector 14, Gurgaon',
        lat: 28.4595,
        lng: 77.0266,
      },
      {
        userId: rider1.id,
        label: 'Office',
        name: 'Tech Park',
        address: 'Cyber City, Gurgaon',
        lat: 28.4949,
        lng: 77.0883,
      },
      {
        userId: rider1.id,
        label: 'Gym',
        name: 'FitLife Gym',
        address: 'DLF Phase 3, Gurgaon',
        lat: 28.4985,
        lng: 77.0862,
      },
      {
        userId: rider2.id,
        label: 'Home',
        name: 'Anita\'s Apartment',
        address: 'Bandra West, Mumbai',
        lat: 19.0596,
        lng: 72.8295,
      },
      {
        userId: rider2.id,
        label: 'Office',
        name: 'WeWork BKC',
        address: 'Bandra Kurla Complex, Mumbai',
        lat: 19.0607,
        lng: 72.8696,
      },
      {
        userId: rider3.id,
        label: 'Home',
        name: 'Vikram\'s Villa',
        address: 'Koramangala, Bangalore',
        lat: 12.9352,
        lng: 77.6245,
      },
      {
        userId: rider3.id,
        label: 'Office',
        name: 'Prestige Tech Park',
        address: 'Outer Ring Road, Bangalore',
        lat: 12.9968,
        lng: 77.6898,
      },
      {
        userId: rider4.id,
        label: 'Home',
        name: 'Sneha\'s Place',
        address: 'Lajpat Nagar, Delhi',
        lat: 28.5689,
        lng: 77.2405,
      },
    ],
  });

  console.log('Saved places seeded');

  // ═══════════════════════════════════════════════════════════════
  //  KYC DOCUMENTS
  // ═══════════════════════════════════════════════════════════════

  await prisma.kycDocument.createMany({
    data: [
      {
        userId: proDriver1.id,
        type: 'AADHAAR',
        s3Key: 'kyc/proDriver1/aadhaar.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-07-01'),
      },
      {
        userId: proDriver1.id,
        type: 'DRIVING_LICENSE',
        s3Key: 'kyc/proDriver1/dl.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-07-01'),
      },
      {
        userId: proDriver2.id,
        type: 'AADHAAR',
        s3Key: 'kyc/proDriver2/aadhaar.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-07-15'),
      },
      {
        userId: proDriver2.id,
        type: 'DRIVING_LICENSE',
        s3Key: 'kyc/proDriver2/dl.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-07-15'),
      },
      {
        userId: proDriver3.id,
        type: 'AADHAAR',
        s3Key: 'kyc/proDriver3/aadhaar.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-06-20'),
      },
      {
        userId: proDriver3.id,
        type: 'DRIVING_LICENSE',
        s3Key: 'kyc/proDriver3/dl.pdf',
        status: 'FAILED',
        rejectionReason: 'Document is blurry, please re-upload',
      },
      {
        userId: carpoolDriver1.id,
        type: 'AADHAAR',
        s3Key: 'kyc/carpoolDriver1/aadhaar.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-08-01'),
      },
      {
        userId: carpoolDriver2.id,
        type: 'AADHAAR',
        s3Key: 'kyc/carpoolDriver2/aadhaar.pdf',
        status: 'PENDING',
      },
      {
        userId: carpoolDriver3.id,
        type: 'AADHAAR',
        s3Key: 'kyc/carpoolDriver3/aadhaar.pdf',
        status: 'PENDING',
      },
      {
        userId: rider1.id,
        type: 'AADHAAR',
        s3Key: 'kyc/rider1/aadhaar.pdf',
        status: 'PASSED',
        verifiedAt: new Date('2026-08-10'),
      },
    ],
  });

  console.log('KYC documents seeded');

  // ═══════════════════════════════════════════════════════════════
  //  ON-DEMAND TRIPS
  // ═══════════════════════════════════════════════════════════════

  // Completed trip (rider1 → proDriver1)
  const trip1 = await prisma.trip.create({
    data: {
      riderId: rider1.id,
      driverId: proDriver1.id,
      status: 'COMPLETED',
      pickupLat: 28.6139,
      pickupLng: 77.209,
      dropLat: 28.4595,
      dropLng: 77.0266,
      pickupAddress: 'Connaught Place, New Delhi',
      dropAddress: 'Sector 14, Gurgaon',
      fareEstimate: 350,
      fareFinal: 380,
      distanceKm: 18.2,
      durationMin: 42,
      pickupTime: new Date(Date.now() - 86400000),
      startTime: new Date(Date.now() - 86400000 + 300000),
      endTime: new Date(Date.now() - 86400000 + 2820000),
      surgeMultiplier: 1.0,
    },
  });

  // Completed trip (rider2 → proDriver3 in Mumbai)
  const trip2 = await prisma.trip.create({
    data: {
      riderId: rider2.id,
      driverId: proDriver3.id,
      status: 'COMPLETED',
      pickupLat: 19.076,
      pickupLng: 72.8777,
      dropLat: 19.0596,
      dropLng: 72.8295,
      pickupAddress: 'Gateway of India, Mumbai',
      dropAddress: 'Bandra West, Mumbai',
      fareEstimate: 200,
      fareFinal: 220,
      distanceKm: 10.5,
      durationMin: 30,
      pickupTime: new Date(Date.now() - 172800000),
      startTime: new Date(Date.now() - 172800000 + 180000),
      endTime: new Date(Date.now() - 172800000 + 1980000),
      surgeMultiplier: 1.2,
    },
  });

  // Completed trip with higher surge (rider4 → proDriver2)
  const trip3 = await prisma.trip.create({
    data: {
      riderId: rider4.id,
      driverId: proDriver2.id,
      status: 'COMPLETED',
      pickupLat: 28.5689,
      pickupLng: 77.2405,
      dropLat: 28.628,
      dropLng: 77.219,
      pickupAddress: 'Lajpat Nagar, Delhi',
      dropAddress: 'Nehru Place, Delhi',
      fareEstimate: 120,
      fareFinal: 180,
      distanceKm: 5.8,
      durationMin: 18,
      pickupTime: new Date(Date.now() - 43200000),
      startTime: new Date(Date.now() - 43200000 + 120000),
      endTime: new Date(Date.now() - 43200000 + 1200000),
      surgeMultiplier: 1.5,
    },
  });

  // In-progress trip (rider3 → proDriver1)
  const trip4 = await prisma.trip.create({
    data: {
      riderId: rider3.id,
      driverId: proDriver1.id,
      status: 'IN_PROGRESS',
      pickupLat: 28.628,
      pickupLng: 77.219,
      dropLat: 28.4595,
      dropLng: 77.0266,
      pickupAddress: 'AIIMS, Delhi',
      dropAddress: 'Cyber City, Gurgaon',
      fareEstimate: 400,
      distanceKm: 22.1,
      pickupTime: new Date(),
      startTime: new Date(),
      surgeMultiplier: 1.0,
    },
  });

  // Cancelled trip (rider1 cancelled)
  const trip5 = await prisma.trip.create({
    data: {
      riderId: rider1.id,
      driverId: proDriver2.id,
      status: 'CANCELLED',
      pickupLat: 28.4985,
      pickupLng: 77.0862,
      dropLat: 28.6139,
      dropLng: 77.209,
      pickupAddress: 'DLF Phase 3, Gurgaon',
      dropAddress: 'Connaught Place, New Delhi',
      fareEstimate: 380,
      distanceKm: 19.5,
      pickupTime: new Date(Date.now() - 3600000),
      surgeMultiplier: 1.0,
    },
  });

  // Searching trip (no driver yet)
  await prisma.trip.create({
    data: {
      riderId: rider4.id,
      status: 'SEARCHING',
      pickupLat: 28.5355,
      pickupLng: 77.391,
      dropLat: 28.4595,
      dropLng: 77.0266,
      pickupAddress: 'Noida Sector 62',
      dropAddress: 'Sector 14, Gurgaon',
      fareEstimate: 450,
      distanceKm: 28.3,
      pickupTime: new Date(Date.now() + 3600000),
      surgeMultiplier: 1.0,
    },
  });

  console.log('Trips seeded');

  // ═══════════════════════════════════════════════════════════════
  //  TRIP LOCATIONS (tracking history for completed trips)
  // ═══════════════════════════════════════════════════════════════

  await prisma.tripLocation.createMany({
    data: [
      {
        tripId: trip1.id,
        lat: 28.6139,
        lng: 77.209,
        speedKmh: 0,
        recordedAt: new Date(Date.now() - 86400000 + 300000),
      },
      {
        tripId: trip1.id,
        lat: 28.61,
        lng: 77.205,
        speedKmh: 25,
        recordedAt: new Date(Date.now() - 86400000 + 600000),
      },
      {
        tripId: trip1.id,
        lat: 28.58,
        lng: 77.18,
        speedKmh: 45,
        recordedAt: new Date(Date.now() - 86400000 + 1200000),
      },
      {
        tripId: trip1.id,
        lat: 28.52,
        lng: 77.1,
        speedKmh: 50,
        recordedAt: new Date(Date.now() - 86400000 + 2100000),
      },
      {
        tripId: trip1.id,
        lat: 28.4595,
        lng: 77.0266,
        speedKmh: 0,
        recordedAt: new Date(Date.now() - 86400000 + 2820000),
      },
    ],
  });

  console.log('Trip locations seeded');

  // ═══════════════════════════════════════════════════════════════
  //  PAYMENTS (for trips)
  // ═══════════════════════════════════════════════════════════════

  await prisma.payment.createMany({
    data: [
      {
        tripId: trip1.id,
        amount: 380,
        type: 'CAPTURE',
        status: 'SUCCEEDED',
        providerTransactionId: 'pay_trip1_001',
      },
      {
        tripId: trip2.id,
        amount: 220,
        type: 'CAPTURE',
        status: 'SUCCEEDED',
        providerTransactionId: 'pay_trip2_001',
      },
      {
        tripId: trip3.id,
        amount: 180,
        type: 'CAPTURE',
        status: 'SUCCEEDED',
        providerTransactionId: 'pay_trip3_001',
      },
    ],
  });

  console.log('Payments seeded');

  // ═══════════════════════════════════════════════════════════════
  //  RATINGS
  // ═══════════════════════════════════════════════════════════════

  await prisma.rating.createMany({
    data: [
      {
        reviewerId: rider1.id,
        revieweeId: proDriver1.id,
        tripId: trip1.id,
        score: 5,
        comment: 'Excellent ride! Very professional driver.',
        tags: ['punctual', 'safe', 'clean_car', 'polite'],
      },
      {
        reviewerId: proDriver1.id,
        revieweeId: rider1.id,
        tripId: trip1.id,
        score: 5,
        comment: 'Polite and punctual passenger.',
        tags: ['punctual', 'respectful'],
      },
      {
        reviewerId: rider2.id,
        revieweeId: proDriver3.id,
        tripId: trip2.id,
        score: 4,
        comment: 'Good ride, took a slightly longer route though.',
        tags: ['safe', 'clean_car'],
      },
      {
        reviewerId: rider4.id,
        revieweeId: proDriver2.id,
        tripId: trip3.id,
        score: 3,
        comment: 'Average ride, driver was on the phone.',
        tags: ['safe'],
      },
      {
        reviewerId: rider1.id,
        revieweeId: proDriver2.id,
        tripId: null,
        score: 2,
        comment: 'Driver arrived late and was rude.',
        tags: ['late', 'rude'],
      },
    ],
  });

  console.log('Ratings seeded');

  // ═══════════════════════════════════════════════════════════════
  //  NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════

  await prisma.notification.createMany({
    data: [
      {
        userId: rider1.id,
        type: 'TRIP_COMPLETED',
        payload: {
          tripId: trip1.id,
          message: 'Your trip from CP to Gurgaon is completed.',
        },
      },
      {
        userId: rider1.id,
        type: 'WALLET_TOPUP',
        payload: { amount: 1000, message: 'Wallet topped up successfully.' },
      },
      {
        userId: rider1.id,
        type: 'PAYMENT_RECEIVED',
        payload: {
          amount: 380,
          message: 'Payment of ₹380 received for your trip.',
        },
        readAt: new Date(),
      },
      {
        userId: rider2.id,
        type: 'TRIP_COMPLETED',
        payload: {
          tripId: trip2.id,
          message: 'Your Mumbai trip is completed. Rate your driver!',
        },
      },
      {
        userId: rider4.id,
        type: 'TRIP_CANCELLED',
        payload: {
          tripId: trip5.id,
          message: 'Your trip to Connaught Place was cancelled.',
        },
      },
      {
        userId: proDriver1.id,
        type: 'NEW_BOOKING',
        payload: { tripId: trip4.id, message: 'New trip assigned to you!' },
      },
      {
        userId: proDriver1.id,
        type: 'RATING_RECEIVED',
        payload: { score: 5, message: 'You received a 5-star rating!' },
        readAt: new Date(),
      },
      {
        userId: admin.id,
        type: 'SYSTEM_ALERT',
        payload: {
          message: 'New driver registration pending verification.',
        },
      },
    ],
  });

  console.log('Notifications seeded');

  // ═══════════════════════════════════════════════════════════════
  //  EMERGENCY ALERTS
  // ═══════════════════════════════════════════════════════════════

  await prisma.emergencyAlert.createMany({
    data: [
      {
        userId: rider1.id,
        tripId: trip1.id,
        lat: 28.58,
        lng: 77.18,
        status: 'RESOLVED',
      },
      {
        userId: rider4.id,
        tripId: null,
        lat: 28.5689,
        lng: 77.2405,
        status: 'OPEN',
      },
    ],
  });

  console.log('Emergency alerts seeded');

  // ═══════════════════════════════════════════════════════════════
  //  SUMMARY
  // ═══════════════════════════════════════════════════════════════

  console.log('\n=== Seeding complete! ===\n');
  console.log('Test Credentials:');
  console.log('─'.repeat(55));
  console.log('  Admin:        +919000000001 / admin123');
  console.log('─'.repeat(55));
  console.log('  RIDERS:');
  console.log('    Rahul:      +919000000010 / user123  (Delhi, active)');
  console.log('    Anita:      +919000000020 / user123  (Mumbai, active)');
  console.log('    Vikram:     +919000000030 / user123  (Bangalore, active)');
  console.log('    Sneha:      +919000000040 / user123  (Delhi, active)');
  console.log('    Arjun:      +919000000050 / user123  (Chennai, SUSPENDED)');
  console.log('─'.repeat(55));
  console.log('  PROFESSIONAL DRIVERS:');
  console.log('    Suresh:     +919000000100 / user123  (Delhi, online)');
  console.log('    Rajesh:     +919000000101 / user123  (Delhi, online)');
  console.log('    Mohammed:   +919000000102 / user123  (Mumbai, offline)');
  console.log('─'.repeat(55));
  console.log('  CARPOOL DRIVERS:');
  console.log('    Deepa:      +919000000200 / user123  (Bangalore, offline)');
  console.log('    Amit:       +919000000201 / user123  (Delhi, online)');
  console.log('    Pooja:      +919000000202 / user123  (Hyderabad, PENDING KYC)');
  console.log('─'.repeat(55));
  console.log('  DUAL ROLE (Driver + Rider):');
  console.log('    Karthik:    +919000000300 / user123  (Kochi, active)');
  console.log('─'.repeat(55));
  console.log('\nScenario Coverage:');
  console.log('  - 3 completed trips (varies: surge, ratings, locations)');
  console.log('  - 1 in-progress trip');
  console.log('  - 1 cancelled trip');
  console.log('  - 1 searching (no driver assigned)');
  console.log('  - 5 ratings (2-5 stars, with tags)');
  console.log('  - 10 KYC docs (PASSED, PENDING, FAILED)');
  console.log('  - 13 wallet transactions (TOPUP, DEBIT, REFUND)');
  console.log('  - 8 notifications (various types, read/unread)');
  console.log('  - 2 emergency alerts (OPEN, RESOLVED)');
  console.log('  - 8 saved places across 4 riders');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e: Error) => {
    console.error('Seed failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
