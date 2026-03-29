# RickRide Platform

## 1. Project Overview
RickRide is a unified Expo Router app for the passenger app, driver app, and admin dashboard of the RickRide platform. The frontend is built with React Native, Expo SDK 54, and NativeWind, and it talks directly to the Node.js backend through shared service modules.

## 2. Product Architecture
The system consists of three distinct interfaces served within a single repository via Expo Router:
- **Passenger Interface (`/app/(passenger)`)**: Mobile app layout optimized for passengers.
- **Driver Interface (`/app/(driver)`)**: Mobile app layout optimized for the driver experience and ride management.
- **Admin Dashboard (`/app/(admin)`)**: Responsive admin layout for platform operations.
- **Authentication (`/app/(auth)`)**: Shared auth flows leading to the appropriate interface based on user roles.

## 3. Current Frontend Features
- OTP-based login and signup with role-aware redirects.
- Driver onboarding tied to backend driver and vehicle endpoints.
- Passenger ride discovery, booking confirmation, payment setup, and live activity tracking.
- Driver dashboard, status updates, trip management, and demo location streaming.
- Admin overview, stats, and analytics screens backed by backend APIs where available.

## 4. Folder Structure
```text
/app
  /(admin)       # Admin pages
  /(auth)        # Auth and onboarding flow
  /(driver)      # Driver app screens
  /(passenger)   # Passenger app screens
/components      # Reusable UI components
/constants       # Runtime config and theme constants
/hooks           # Shared React hooks
/services        # Axios and Socket.IO integrations
/store           # Zustand auth and ride stores
/utils           # Storage, formatting, and error helpers
```

## 5. Navigation Flow
Expo Router handles file-based routing:
- **Boot**: The app starts in `/(auth)` until session hydration completes.
- **Routing**: After OTP verification, users are redirected by role:
  - Passenger => `/(passenger)`
  - Driver => `/(driver)`
  - Admin => `/(admin)`

## 6. Backend Integration
The app talks directly to the backend through `services/`:
- `authService` for register, login, and OTP verification
- `userService` and `driverService` for profile management
- `tripService` and `bookingService` for ride flow
- `paymentService` for Razorpay order and verification calls
- `socketService` for live driver location tracking
- `adminService`, `ratingService`, and `vehicleService` for supporting flows

## 7. Environment Setup
Create a `.env` from `.env.example` and configure:
- `EXPO_PUBLIC_APP_ENV`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_SOCKET_URL`
- `EXPO_PUBLIC_RAZORPAY_KEY_ID`

## 8. How to Run the Project
1. Install dependencies with `npm install`
2. Start Expo with `npm start`
3. Run a target:
   - `npm run ios`
   - `npm run android`
   - `npm run web`
