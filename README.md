# Yaatra — Unified Shared Mobility Platform

A full-stack shared mobility platform for India that connects riders with carpool drivers and professional drivers for affordable, trusted commuting.

---

## Table of Contents

- [About](#about)
- [Architecture Overview](#architecture-overview)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend](#backend)
- [Client (Web Admin Dashboard)](#client-web-admin-dashboard)
- [Mobile App (Flutter)](#mobile-app-flutter)
- [Infrastructure & Services](#infrastructure--services)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Building & Deployment](#building--deployment)
- [Troubleshooting](#troubleshooting)

---

## About

**Yaatra** is a unified shared mobility app for India that blends **instant shared rides** and **planned daily carpooling**. It connects riders with nearby drivers — whether they're carpool owners sharing their commute or professional drivers — to make every journey shared, affordable, and reliable.

### Target Market

- **Country:** India
- **Initial Cities:** Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune
- **Users:** Daily commuters, car owners willing to share seats, professional cab drivers

### Core Features

| Feature | Description |
|---------|-------------|
| **Ride Now** | Find and book instant shared rides |
| **Plan Commute** | Schedule recurring daily carpools (Mon-Fri, specific times) |
| **Offer Seat** | Drivers publish daily commute with seats, schedule, pricing |
| **Go Online** | Professional drivers toggle online to receive pooled ride requests |
| **Wallet** | In-app balance, top-up via UPI/Card, transaction history |
| **Safety** | Emergency SOS, trip sharing, trust badges, report issues |
| **Ratings** | Post-ride ratings for both riders and drivers |
| **Admin** | User management, KYC verification, dispute resolution |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Flutter App  │  │  Next.js Web │  │  Future Clients  │   │
│  │  (Mobile)     │  │  (Dashboard) │  │  (React Native)  │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
└─────────┼─────────────────┼────────────────────┼─────────────┘
          │                 │                    │
          └─────────────────┼────────────────────┘
                            │ HTTP / WebSocket
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                     BACKEND (NestJS)                          │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────────┐  │
│  │  Auth    │ │  Rides   │ │ Matching│ │  Payment/Wallet  │  │
│  │  Module  │ │  Module  │ │ Module  │ │  Module          │  │
│  └────┬────┘ └────┬─────┘ └────┬────┘ └────┬─────────────┘  │
│       │           │            │            │                 │
│  ┌────┴───────────┴────────────┴────────────┴─────────────┐  │
│  │                    Prisma ORM                           │  │
│  └────────────────────────┬───────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ PostgreSQL  │  │    Redis    │  │    MinIO    │
   │  + PostGIS  │  │   (Cache)   │  │ (S3 Storage)│
   └─────────────┘  └─────────────┘  └─────────────┘
```

---

## Monorepo Structure

```
Yaatra/
├── backend/                # NestJS API server
│   ├── src/
│   │   ├── auth/           # OTP login, JWT, roles
│   │   ├── modules/        # Feature modules (14 total)
│   │   │   ├── users/
│   │   │   ├── driver/
│   │   │   ├── ride/
│   │   │   ├── matching/   # Ride matching algorithm
│   │   │   ├── pricing/    # Fare calculation
│   │   │   ├── payment/    # Razorpay integration
│   │   │   ├── wallet/
│   │   │   ├── rating/
│   │   │   ├── notification/ # Push + WebSocket
│   │   │   ├── location/   # Real-time tracking
│   │   │   ├── safety/     # SOS, reports
│   │   │   ├── kyc/        # Document verification
│   │   │   └── admin/      # Admin operations
│   │   ├── common/         # Guards, pipes, interceptors
│   │   ├── config/         # App & DB configuration
│   │   └── prisma/         # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma   # 18 database models
│   │   └── migrations/
│   └── package.json
│
├── client/                 # Next.js web dashboard
│   ├── app/                # App Router pages
│   │   ├── (public)/       # Login, OTP, register
│   │   ├── (app)/          # Authenticated dashboard
│   │   └── admin/          # Admin panel
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── stores/             # Zustand state stores
│   └── package.json
│
├── yaatra_application/     # Flutter mobile app
│   ├── lib/
│   │   ├── core/           # API, storage, theme, utils, widgets
│   │   ├── features/       # 10 feature modules
│   │   └── router/         # GoRouter navigation
│   ├── assets/             # Fonts, images, i18n
│   ├── android/
│   ├── ios/
│   └── pubspec.yaml
│
├── task/                   # Planning & implementation docs
├── docker-compose.yml      # Infrastructure services
├── PRD.md                  # Product Requirements Document
└── README.md               # This file
```

---

## Prerequisites

### Required for All Development

| Tool | Version | Purpose |
|------|---------|---------|
| **Git** | 2.30+ | Version control |
| **Docker Desktop** | Latest | Database & services |
| **Node.js** | 20+ | Backend & web client |
| **npm** | 10+ | Package management |

### Required for Backend Development

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **npm** | 10+ | Packages |
| **Docker** | Latest | PostgreSQL, Redis, MinIO |

### Required for Web Client Development

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **npm** | 10+ | Packages |

### Required for Mobile Development

| Tool | Version | Purpose |
|------|---------|---------|
| **Flutter SDK** | 3.13.2+ | Mobile framework |
| **Dart SDK** | Bundled | Language |
| **Android Studio** | Latest | Android dev & emulator |
| **Xcode** | 14.0+ | iOS dev (macOS only) |
| **CocoaPods** | 1.15+ | iOS deps (macOS only) |

### Verify Installation

```bash
# Check all tools
git --version
node --version
npm --version
docker --version
flutter --version    # If doing mobile dev
```

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/Yaatra.git
cd Yaatra
```

### 2. Start Infrastructure Services

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** (port 5432) — PostGIS-enabled database
- **Redis** (port 6379) — Caching layer
- **MinIO** (port 9000/9001) — S3-compatible file storage
- **Prisma Studio** (port 5555) — Database GUI

### 3. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run seed

# Start development server
npm run start:dev
```

Backend runs at `http://localhost:5001`.

### 4. Set Up Web Client

```bash
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

Web dashboard runs at `http://localhost:3000`.

### 5. Set Up Mobile App (Optional)

```bash
cd yaatra_application

# Install Flutter dependencies
flutter pub get

# Run on connected device or emulator
flutter run
```

---

## Backend

**Framework:** NestJS 11.x
**ORM:** Prisma 7.x
**Database:** PostgreSQL 16 + PostGIS
**Language:** TypeScript

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `@nestjs/core` | NestJS framework |
| `@prisma/client` | Database ORM |
| `@nestjs/passport` + `passport-jwt` | JWT authentication |
| `twilio` / `msg91` | OTP SMS delivery |
| `razorpay` | Payment processing |
| `@nestjs/websockets` + `socket.io` | Real-time communication |
| `ioredis` | Redis client for caching |
| `minio` | S3-compatible file storage |
| `firebase-admin` | Push notifications (FCM) |
| `@googlemaps/google-maps-services-js` | Maps & geocoding |

### Backend Scripts

```bash
cd backend

npm run start:dev       # Start development server with hot reload
npm run build           # Build for production
npm run start:prod      # Start production server
npm run seed            # Seed database with sample data
npm run test:e2e        # Run end-to-end tests
npx prisma studio       # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Run database migrations
npx prisma generate     # Regenerate Prisma client
```

### Backend Modules

| Module | Responsibility |
|--------|---------------|
| `auth` | OTP login, JWT tokens, role-based access |
| `users` | User profiles, registration |
| `driver` | Driver profiles, vehicle management |
| `ride` | Ride offers, scheduling, instances |
| `matching` | Route-based ride matching algorithm |
| `pricing` | Fare calculation (carpool cost-sharing, professional dynamic) |
| `payment` | Razorpay integration, webhooks |
| `wallet` | Balance, top-up, withdrawals |
| `rating` | Post-ride ratings and reviews |
| `notification` | Push notifications, WebSocket alerts |
| `location` | Real-time driver location tracking |
| `safety` | Emergency SOS, trip sharing, reports |
| `kyc` | Document upload & verification |
| `admin` | User management, disputes, verification |

---

## Client (Web Admin Dashboard)

**Framework:** Next.js 16.3.0 (App Router)
**UI:** React 19 + Tailwind CSS 4
**State:** Zustand + TanStack React Query
**Language:** TypeScript

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` | UI library |
| `zustand` | Client state management |
| `@tanstack/react-query` | Server state / data fetching |
| `axios` | HTTP client |
| `socket.io-client` | Real-time updates |
| `react-hook-form` + `zod` | Forms & validation |
| `@googlemaps/react-wrapper` | Maps integration |
| `tailwindcss` | Utility-first CSS |
| `lucide-react` | Icons |

### Client Scripts

```bash
cd client

npm run dev             # Start development server (port 3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Check code quality
```

### Client Pages

**Public (unauthenticated):**
- `/login` — Phone number login
- `/otp` — OTP verification
- `/register` — New user registration
- `/role` — Role selection
- `/profile-setup` — Initial profile setup
- `/driver-documents` — KYC document upload

**Authenticated Dashboard:**
- `/dashboard` — Main dashboard
- `/ride-now` — Book instant rides
- `/plan-commute` — Schedule recurring carpools
- `/schedules` — View scheduled rides
- `/driver/*` — Driver management (offers, requests, earnings, etc.)
- `/rides` — Ride history
- `/wallet` — Wallet & transactions
- `/notifications` — Notification center
- `/safety` — Safety features
- `/profile` — User profile & settings

**Admin Panel:**
- `/admin` — Admin dashboard
- `/admin/users` — User management
- `/admin/verification` — KYC verification
- `/admin/disputes` — Dispute resolution

---

## Mobile App (Flutter)

**Framework:** Flutter 3.13.2+
**Language:** Dart
**State Management:** Riverpod 2.6.1
**Navigation:** GoRouter 14.8.1

See [`yaatra_application/README.md`](yaatra_application/README.md) for the complete Flutter documentation, and [`yaatra_application/FLUTTER_LEARNING_GUIDE.md`](yaatra_application/FLUTTER_LEARNING_GUIDE.md) for a Flutter learning guide.

### Quick Start

```bash
cd yaatra_application
flutter pub get
flutter run
```

### Key Features

- 10 feature modules (auth, home, ride_now, plan_commute, driver, rides, wallet, notifications, safety, profile)
- 23 navigable screens
- 9 reusable UI components
- Phone + OTP authentication
- Riverpod state management
- Dio HTTP client with auth interceptors
- Secure token storage
- Google Maps integration
- Poppins font family (all weights)

---

## Infrastructure & Services

All services are containerized via Docker Compose.

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **PostgreSQL** | `postgis/postgis:16-3.4-alpine` | 5432 | Primary database with geospatial support |
| **Redis** | `redis:7-alpine` | 6379 | Caching, rate limiting, sessions |
| **MinIO** | `minio/minio:latest` | 9000 (API), 9001 (Console) | S3-compatible object storage for KYC documents |
| **Prisma Studio** | `node:20-alpine` | 5555 | Database management GUI |

### Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f postgres
docker compose logs -f redis

# Check status
docker compose ps

# Reset database (destroy data)
docker compose down -v
docker compose up -d
```

### Service Credentials (Development Only)

| Service | User | Password |
|---------|------|----------|
| PostgreSQL | admin | SuperSecurePassword123! |
| MinIO | minio_admin | MinioSecurePassword789! |

> **Warning:** These are development credentials. Never use them in production.

---

## API Overview

The backend exposes a REST API at `http://localhost:5001`.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/otp` | Send OTP to phone number |
| POST | `/auth/verify` | Verify OTP, return JWT |
| POST | `/auth/resend-otp` | Resend OTP |
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET | `/auth/profile` | Get current user profile |

### Rides

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rides/available` | Get available rides |
| POST | `/rides/book` | Book a ride |
| GET | `/rides/upcoming` | Get upcoming rides |
| GET | `/rides/history` | Get ride history |
| GET | `/rides/:id` | Get ride details |
| POST | `/rides/:id/cancel` | Cancel a ride |
| POST | `/rides/:id/rebook` | Rebook a ride |

### Driver

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/driver/offer` | Publish ride offer |
| GET | `/driver/offers` | Get driver's offers |
| POST | `/driver/go-online` | Go online |
| POST | `/driver/go-offline` | Go offline |
| GET | `/driver/earnings` | Get earnings |
| GET | `/driver/requests` | Get ride requests |
| POST | `/driver/accept` | Accept request |
| POST | `/driver/reject` | Reject request |

### Wallet & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet` | Get wallet balance |
| POST | `/wallet/topup` | Add money |
| GET | `/wallet/transactions` | Transaction history |
| POST | `/wallet/withdraw` | Withdraw funds |

### Safety & Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/safety/emergency` | Trigger SOS |
| POST | `/safety/report` | Report issue |
| GET | `/notifications` | Get notifications |
| POST | `/notifications/read-all` | Mark all read |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ratings` | Submit rating |
| POST | `/kyc/upload` | Upload KYC document |
| GET | `/admin/users` | List all users (admin) |

All endpoints require JWT authentication via `Authorization: Bearer <token>` header, except `/auth/otp` and `/auth/verify`.

---

## Database Schema

The PostgreSQL database uses **PostGIS** for geospatial queries. The Prisma schema defines **18 models**:

### Core Models

| Model | Purpose |
|-------|---------|
| `User` | User accounts (riders, drivers, admins) |
| `DriverProfile` | Driver-specific data (type, rating, vehicle) |
| `Vehicle` | Vehicle details (make, model, number, seats) |
| `KycDocument` | KYC verification documents |

### Ride Models

| Model | Purpose |
|-------|---------|
| `RecurringRide` | Published carpool schedule (driver's daily commute) |
| `RideInstance` | Individual occurrence of a recurring ride |
| `Trip` | Active or completed trip between rider and driver |
| `TripLocation` | Real-time location updates during trip |
| `Booking` | Rider's reservation on a ride |

### Financial Models

| Model | Purpose |
|-------|---------|
| `Payment` | Payment records (Razorpay transactions) |
| `Wallet` | User wallet balance |
| `WalletTransaction` | Wallet top-up, withdrawal, ride payment records |

### Other Models

| Model | Purpose |
|-------|---------|
| `Otp` | OTP storage for phone verification |
| `Rating` | Post-ride ratings and reviews |
| `Notification` | In-app notifications |
| `Dispute` | Payment/ride disputes |
| `SavedPlace` | User's saved locations (Home, Work) |
| `EmergencyAlert` | SOS alerts triggered during trips |

### Key Enums

| Enum | Values |
|------|--------|
| `UserRole` | RIDER, DRIVER, CARPOOL, PROFESSIONAL, BOTH, ADMIN |
| `RideStatus` | ACTIVE, PAUSED, CANCELLED |
| `TripStatus` | SEARCHING, DRIVER_ASSIGNED, ARRIVING, IN_PROGRESS, COMPLETED, CANCELLED |
| `BookingStatus` | PENDING, CONFIRMED, CANCELLED, COMPLETED |
| `PaymentStatus` | PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED |
| `VerificationStatus` | PENDING, PASSED, FAILED |

---

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and configure:

```bash
# Server
PORT=5001

# Database
DATABASE_URL=postgresql://admin:SuperSecurePassword123!@localhost:5432/yaatri

# JWT
JWT_SECRET=your-secure-jwt-secret

# OTP (twilio or msg91)
OTP_PROVIDER=twilio
OTP_API_KEY=your_otp_api_key
MASTER_OTP=TRUE              # Set to TRUE for dev (accepts 123456)
MASTER_OTP_VALUE=123456

# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM_NUMBER=+1234567890

# Redis
REDIS_URL=redis://localhost:6379

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Firebase (Push Notifications)
FCM_SERVER_KEY=your_key

# MinIO (File Storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio_admin
MINIO_SECRET_KEY=MinioSecurePassword789!
MINIO_BUCKET=yaatra-documents

# Google Maps
GOOGLE_MAPS_API_KEY=your_key

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:8081
```

### Client (`client/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_MAPS_KEY=your_google_maps_key
```

> **Never commit `.env` files.** They are gitignored.

---

## Development Workflow

### Recommended Workflow

1. **Start infrastructure:** `docker compose up -d`
2. **Start backend:** `cd backend && npm run start:dev`
3. **Start client:** `cd client && npm run dev`
4. **Start mobile (optional):** `cd yaatra_application && flutter run`
5. **Make changes** in the relevant service
6. **Test changes** against the running backend
7. **Commit and push** when ready

### Working on a New Feature

1. Create a feature branch: `git checkout -b feature/my-feature`
2. **Backend:** Add module in `backend/src/modules/`, register in `app.module.ts`
3. **Client:** Add page in `client/app/`, add components in `client/components/`
4. **Mobile:** Add feature in `yaatra_application/lib/features/`, add route in `app_router.dart`
5. Test across all clients
6. Create a pull request

### Code Quality

```bash
# Backend
cd backend
npm run lint           # ESLint
npx prettier --check . # Prettier

# Client
cd client
npm run lint           # ESLint

# Mobile
cd yaatra_application
flutter analyze        # Dart analyzer
dart format .          # Code formatter
```

---

## Building & Deployment

### Backend

```bash
cd backend
npm run build                              # Build for production
NODE_ENV=production node dist/main.js      # Run production server
```

### Client

```bash
cd client
npm run build                              # Build for production
npm run start                              # Start production server
```

### Mobile (Flutter)

```bash
cd yaatra_application

# Android APK
flutter build apk --release

# Android App Bundle (for Play Store)
flutter build appbundle --release

# iOS (requires macOS + Xcode)
flutter build ios --release
```

### Docker (Full Stack)

For production deployment, extend `docker-compose.yml` with:

- Backend service (NestJS)
- Client service (Next.js)
- Nginx reverse proxy
- SSL/TLS certificates
- Environment-specific `.env` files

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `docker compose up` fails | Ensure Docker Desktop is running. Check ports 5432, 6379, 9000 are free. |
| Backend can't connect to DB | Run `docker compose up -d postgres` first. Verify `DATABASE_URL` in `.env`. |
| `Prisma Client not generated` | Run `npx prisma generate` in the backend directory. |
| OTP not received in dev | Set `MASTER_OTP=TRUE` in `.env`. Use `123456` as OTP. |
| Flutter `pub get` fails | Run `flutter clean` then `flutter pub get`. |
| Maps not loading | Verify Google Maps API key has Maps SDK enabled for Android/iOS. |
| MinIO console not accessible | Visit `http://localhost:9001`. Use `minio_admin` / `MinioSecurePassword789!`. |
| Port already in use | Find process: `lsof -i :<port>` (macOS/Linux) or `netstat -ano | findstr :<port>` (Windows). Kill it or change the port. |

### Useful Commands

```bash
# Reset everything
docker compose down -v          # Remove all data
docker compose up -d            # Restart fresh
cd backend && npx prisma migrate dev  # Re-run migrations

# Check backend health
curl http://localhost:5001

# Check database
docker compose exec postgres psql -U admin -d yaatri

# View backend logs
docker compose logs -f postgres
```

---

## Task & Planning Documents

The `task/` directory contains planning and implementation documents:

| Document | Description |
|----------|-------------|
| `PRD.md` (root) | Full Product Requirements Document |
| `backend-structure.md` | Backend target structure & API endpoint map |
| `backend-implementation-plan.md` | Backend implementation phases |
| `backend-task.md` | Backend task breakdown |
| `frontend-structure.md` | Web client target structure & pages |
| `frontend-implementation-plan.md` | Frontend implementation phases |
| `client-task.md` | Frontend task breakdown |
| `mobile-structure.md` | Flutter app target structure & screens |
| `mobile-implementation-plan.md` | Mobile implementation phases |
| `to-do-list.md` | Master tracking for all phases |
| `yaatra-presentation.html` | Project presentation |

---

## Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Root README | `README.md` (this file) | Full project overview |
| Backend README | `backend/README.md` | NestJS backend docs |
| Client README | `client/README.md` | Next.js client docs |
| Flutter README | `yaatra_application/README.md` | Flutter app docs |
| Flutter Learning Guide | `yaatra_application/FLUTTER_LEARNING_GUIDE.md` | Complete Flutter tutorial |
| PRD | `PRD.md` | Product Requirements Document |

---

## License

This project is private and proprietary.

---

*Last updated: September 2026*
