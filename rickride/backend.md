# RickRide Backend Integration Notes

This document describes how the Expo frontend talks to the Node.js backend defined in `endpoint.md`. It is the frontend integration contract, not a backend implementation guide.

## Architecture

RickRide uses a single Expo Router app with role-based route groups for authentication, passenger flows, driver flows, and admin screens. The frontend does not own business logic for authentication, bookings, payments, or driver tracking; it delegates those concerns to the backend through `services/`.

The important integration points are:

- `services/apiClient.ts` for HTTP requests and JWT injection.
- `services/authService.ts` for login, registration, and OTP verification.
- `services/bookingService.ts` for booking creation and cancellation.
- `services/driverService.ts` for driver profile, status, location, and nearby-driver lookup.
- `services/paymentService.ts` for payment order creation and verification.
- `services/socketService.ts` for real-time driver location tracking.
- `services/tripService.ts`, `services/userService.ts`, `services/vehicleService.ts`, `services/adminService.ts`, and `services/ratingService.ts` for the remaining API surfaces.

## Request Flow

1. A screen or store calls a service function.
2. `apiClient` attaches `Authorization: Bearer <token>` when a session exists.
3. The backend validates the request and returns the standard envelope from `endpoint.md`.
4. The service unwraps the `data` field and returns the typed payload to the caller.
5. Global request failures are surfaced through a toast and a session logout on `401`.

## Auth Handling

Authentication is OTP-based.

- `POST /api/v1/auth/register` creates a new Rider or Driver account.
- `POST /api/v1/auth/login` sends an OTP.
- `POST /api/v1/auth/verify-otp` returns a JWT token plus the authenticated user payload.

The frontend persists the token and user in secure storage through `store/useAuthStore.ts` and restores it on app startup. Route guards in `app/_layout.tsx` redirect users into the correct role group after hydration.

## Data Flow By Feature

### Passenger booking

The confirmation screen loads trip details from `GET /api/v1/trip/:id`, creates a booking with `POST /api/v1/booking`, then creates a payment record with `POST /api/v1/payment/create` when Razorpay is selected. Payment verification uses `POST /api/v1/payment/verify`.

### Driver onboarding

Driver setup uses `POST /api/v1/driver/profile` and `POST /api/v1/vehicle/register`. The current frontend passes the authenticated user id when available, but the backend still owns the final association logic.

### Driver tracking

Driver availability uses `PUT /api/v1/driver/status` and `PUT /api/v1/driver/location`. Live tracking uses the Socket.IO driver-location namespace.

### Admin dashboard

Admin screens read `GET /api/v1/admin/stats` and other read-only endpoints. No admin registration flow is exposed in the final signup UI.

## Contract Notes

- `endpoint.md` is the source of truth for HTTP methods, request bodies, and response envelopes.
- The frontend must not assume fields that are not documented there.
- List endpoints should preserve both `data` and `meta` where provided.
- Coordinates are always handled as `[longitude, latitude]`.
- Public API base URL is read from `EXPO_PUBLIC_API_URL`.

## What Is Still In Progress

- Real Google Maps rendering and coordinate UX.
- Native Razorpay checkout wiring.
- Real device GPS tracking for drivers.

Those items are frontend implementation tasks only and do not require backend architecture changes.
