# Yaatra — Master To-Do List

> Single source of truth for tracking ALL work across **Backend (NestJS)**, **Frontend (Next.js)**, and **Mobile (Flutter)**.
> Trace every item back to `PRD.md` sections. Status legend: `[ ]` = pending, `[x]` = done, `[~]` = in progress.

---

## Phase 0 — Project Setup & Foundations

### Backend (NestJS + Prisma + PostgreSQL)
- [ ] Verify `.env` is complete (`PORT`, `DATABASE_URL`, `JWT_SECRET`, OTP/Gateway provider keys, cloud keys).
- [ ] Add missing env vars: `OTP_PROVIDER`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `FCM_SERVER_KEY`, `S3_BUCKET`, `GOOGLE_MAPS_API_KEY`.
- [ ] Complete `prisma/schema.prisma` (add fields: user gender, OTP models, saved places, etc. — see backend plan §3).
- [ ] Enable `datasource.url = env("DATABASE_URL")` (currently commented out).
- [ ] Run `npx prisma migrate dev --name init` and `npx prisma generate`.
- [ ] Install required packages (redis, twilio/msg91, razorpay, @nestjs/schedule, etc. — see backend plan §2.4).
- [ ] Create global `ValidationPipe`, exception filter, and response interceptor in `main.ts`.
- [ ] Configure CORS + Swagger (already present, enhance with bearer auth).
- [ ] Write e2e test setup (supertest, test DB).

### Frontend (Next.js)
- [ ] Install UI/utility deps (Tailwind already present, add: zustand/react-query, axios, google-maps, shadcn/ui or similar).
- [ ] Set up API client (`lib/api.ts`) with base URL + axios interceptors for JWT.
- [ ] Set up global state (auth store, ride store).
- [ ] Create shared UI components library (Button, Input, Chip, BottomSheet, Skeleton, EmptyState).
- [ ] Add ESLint + prettier config (already present via create-next-app).

### Mobile (Flutter)
- [ ] `flutter create yaatra_mobile` in `mobile/` dir.
- [ ] Add pubspec deps: dio, riverpod (or bloc), go_router, google_maps_flutter, flutter_local_notifications, firebase_messaging, shared_preferences, etc.
- [ ] Set up project folder structure (features-first — see mobile structure doc).
- [ ] Configure Android (min SDK 21+ → target Android 8.0+ per PRD) and iOS (iOS 13+).
- [ ] Set up theming, routing (go_router), and localization (en + hi).

---

## Phase 1 — MVP (3 months per PRD §9)

### 1. Auth & Onboarding  *(PRD §3.1)*
- [ ] **Backend:** OTP send/verify endpoints (`/auth/otp`, `/auth/verify`) with rate limiting + resend cooldown (30s) + lockout after 5 wrong attempts.
- [ ] **Backend:** Role selection & profile setup (rider/carpool/pro/both).
- [ ] **Backend:** Vehicle & driver document models + upload + verification status (manual review + DigiLocker).
- [ ] **Frontend:** Login/OTP screen, onboarding flow, role selection, profile setup, document upload.
- [ ] **Mobile:** Login/OTP screen (auto-read SMS), onboarding, role selection, profile setup, document upload.
- [ ] Edge cases: wrong OTP lockout, refused location permission (manual city selection), doc rejection reason + re-upload.

### 2. Rider — Find & Book a Ride  *(PRD §3.2)*
- [ ] **Backend:** `/rides/available` (on-demand + scheduled), `/rides/book`, `/rides/{id}`, `/rides/{id}/cancel`.
- [ ] **Backend:** Google Maps autocomplete proxy + filters (carpool/pro/women-only/price/time sort).
- [ ] **Backend:** Recurring schedule management (pause/edit/cancel instance).
- [ ] **Frontend:** Ride Now flow (destination → options → confirm), Plan Commute flow, filters, fare breakdown.
- [ ] **Mobile:** Ride Now flow, Plan Commute flow, filters, fare breakdown, scheduled ride management.
- [ ] Book within 3 taps; scheduled ride auto-notify if no driver accepts 2h before.

### 3. Driver — Offer a Seat / Go Online  *(PRD §3.3)*
- [ ] **Backend:** `/driver/offer` (carpool commute publish), `/driver/go-online`, `/driver/accept`.
- [ ] **Backend:** Ride request management for carpool drivers; pooled request queue for pro drivers (≤2 pickups).
- [ ] **Frontend:** Carpool driver "Offer a Seat" flow, pro driver "Go Online" toggle, request accept/reject, earnings.
- [ ] **Mobile:** Carpool driver offer flow, pro driver online toggle, request accept/reject, earnings.

### 4. Matching & Pricing  *(PRD §3.4)*
- [ ] **Backend:** Matching service (route overlap within X km, time window, detour ≤ acceptable).
- [ ] **Backend:** Scheduled match suggestions within 5s; on-demand matching < 2s (cached locations via Redis/WS).
- [ ] **Backend:** Pricing service: carpool ₹/km cost-share; professional base+per-km+per-min with capped surge.
- [ ] On-demand no-match → radius extension + private cab suggestion (front/mobile).

### 5. Payments & Wallet  *(PRD §3.5)*
- [ ] **Backend:** Payment gateway integration (UPI/card/wallet) + `/payments/charge`, `/payments/payout`.
- [ ] **Backend:** Wallet module (balance, transactions, topup, refund, adjustment).
- [ ] **Backend:** Commission auto-deduction (carpool 10–15%, pro 20–25%) before payout.
- [ ] **Backend:** Transaction history + receipts; payment failure retry + dispute handling (24h adjust).
- [ ] **Frontend/Mobile:** Payment method selection, wallet screen, earnings screen, transaction history, receipts.

### 6. Safety & Trust  *(PRD §3.6)*
- [ ] **Backend:** KYC (Aadhaar, document upload, selfie), trust badges.
- [ ] **Backend:** Emergency alert endpoint (SMS/notification to emergency contacts + safety team), trip sharing link.
- [ ] **Backend:** Masked in-app call/message.
- [ ] **Frontend/Mobile:** Emergency button in active ride screen, share trip, report issue, post-ride rating.

### 7. Notifications  *(PRD §3.7)*
- [ ] **Backend:** In-app notification center (read/unread), FCM push, booking/cancel/reminder/promo events.
- [ ] **Backend:** WebSocket gateway for real-time events (ride accepted, live location).
- [ ] **Frontend/Mobile:** Notification center screen, push notification handling, badge counts.

### 8. Ride Management  *(PRD §3.8)*
- [ ] **Backend:** Upcoming/completed ride endpoints, rebook, report issue.
- [ ] **Backend:** Recurring commute group management (co-riders list, remove/block rider).
- [ ] **Backend:** Favorites / saved places CRUD.
- [ ] **Frontend/Mobile:** Upcoming tab, history tab, rebook, report issue, saved places, co-rider management.

### 9. Real-Time Tracking  *(PRD §7.2)*
- [ ] **Backend:** Location WebSocket channel (`/trips/{id}/location`) with location history.
- [ ] **Frontend/Mobile:** Live map tracking during trip.

### 10. Admin Dashboard (minimal)  *(PRD §2.1)*
- [ ] **Backend:** Admin-only endpoints (list users, disputes, doc verification queue, ride stats).
- [ ] **Frontend:** Minimal admin dashboard (support + dispute resolution).

---

## Phase 2 — Enhanced (3–6 months)  *(PRD §9)*
- [ ] Professional driver pooled on-demand rides (multi-passenger corridor matching).
- [ ] Automated matching algorithm improvements (corridor + detour-time based).
- [ ] Recurring schedule management refinement.
- [ ] Wallet + driver daily payouts.
- [ ] Expand to 3 more cities (config-driven city support).

---

## Phase 3 — Scale (6–12 months)  *(PRD §9)*
- [ ] Women-only mode (driver + co-riders female).
- [ ] Corporate tie-ups.
- [ ] Advanced route optimization (multi-pickup/dropoff).
- [ ] Multi-language support (hi + en).
- [ ] Referral program.

---

## Out of Scope (MVP)  *(PRD §2.2)*
- [ ] Bike-taxi pooling, inter-city carpooling, corporate transport, full chat, web platform (mobile-first).

---

## Cross-Cutting / NFR  *(PRD §4)*
- [ ] TLS 1.2+ in transit, AES-256 at rest; PCI DSS via gateway.
- [ ] OTP rate limiting; masked phone numbers.
- [ ] App launch < 2s mid-range Android; 60fps maps on 2GB RAM devices.
- [ ] Offline mode for upcoming rides (cached data).
- [ ] Accessibility: WCAG 2.1 AA, 48dp touch targets, 4.5:1 contrast, screen-reader support.
- [ ] Localization: EN + HI, ₹ currency, Indian locale date/time.
- [ ] Analytics events (funnel/ride/driver/safety/system) — Mixpanel/Amplitude + Crashlytics.

---

## Definition of Done (per module)
1. Code follows repo conventions (see `AGENTS.md` / README patterns).
2. Backend: schema migrated, endpoints Swagger-tested, unit + e2e tests passing, `npm run lint` clean.
3. Frontend: `npm run lint` + `npm run build` clean; pages responsive + accessible.
4. Mobile: `flutter analyze` clean, `flutter test` passing, works on Android 8+ / iOS 13+.
5. Every feature traces back to a PRD requirement (no scope creep).
