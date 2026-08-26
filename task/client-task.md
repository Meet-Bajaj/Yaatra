# Yaatra Client (Next.js Web) — Pending Tasks, Implementations & Cleanup

> **Generated:** 2026-08-26 · Audited against actual code in `client/app`, `client/components`, `client/lib`, `client/stores`
> **Sources:** `PRD.md` · `task/to-do-list.md` · `backend-task.md` (many client items are blocked by backend stubs)
> Legend: `[ ]` = not started · `[~]` = partial/stub exists · `[!]` = bug or blocker found during audit

---

## 0. Actual State Snapshot (verified in code)

### Stack (installed & configured)
Next.js 16.3 (App Router) · React 19.2 · Tailwind 4 · Zustand 5 (+persist) · TanStack Query 5 · axios · socket.io-client 4.8 · react-hook-form + zod + @hookform/resolvers · lucide-react · cva/clsx/tailwind-merge · date-fns

### DONE — working implementations
| Area | Detail |
|------|--------|
| App skeleton | Route groups `(public)` / `(app)` / `admin`, root layout with fonts + Providers (QueryClient with staleTime/retry config), `not-found.tsx`, dark theme globals.css |
| Pages created (~35) | Public: login, register, otp, role, profile-setup, driver-documents. App: dashboard, ride-now ×4, plan-commute ×3, rides ×2, schedules, wallet ×2, safety ×2, notifications, profile ×2, settings, active-trip. Driver ×8: online, offer-seat, offers, queue, requests, active, earnings, vehicles. Admin ×4: dashboard, users, disputes, verification |
| UI kit (`components/ui`) | badge, bottom-sheet, button, chip, empty-state, error-state, input, rating-bar, skeleton, stepper — complete |
| Shell | app-shell + sidebar + topbar (search box, notification bell w/ unread count) |
| Auth guards | RequireAuth (wraps `(app)` layout), RequireDriver (wraps driver layout), RequireAdmin (wraps admin layout) — hydration-aware redirect |
| lib/api.ts | axios instance, JWT request interceptor, 401 → clear + redirect `/login` |
| lib/endpoints.ts | Complete endpoint map matching backend-structure.md (auth/users/documents/admin/driver/rides/payments/pricing/rating/safety/wallet/location) |
| lib/socket.ts | Socket.IO singleton with token auth handshake (autoConnect false) |
| Stores | authStore (zustand persist), rideSearchStore, notificationStore, activeTripStore, walletStore |
| API-connected pages | ONLY 6 public pages: register, login, otp, role, profile-setup, driver-documents |

### NOT CONNECTED — everything else is static UI
No page under `(app)/`, `driver/`, or `admin/` calls the API. Zero usage of `useQuery`/`useMutation` anywhere despite react-query being installed and provisioned.

---

## 1. P0 — Blockers (fix before wiring anything)

- [ ] **[!] Token storage mismatch — auth is silently broken for ALL authenticated requests:** auth pages call `setAuth()` → zustand persists token under localStorage key `"yaatra-auth"`, but `lib/api.ts` interceptor reads `"yaatra-token"` — **which nothing ever writes**. Every API call from protected pages would go out without a Bearer header. Fix: read token from the persisted zustand store (or mirror it into a single shared key). Also `logout()` in authStore removes only `"yaatra-auth"` while api.ts clears `"yaatra-token"`/`"yaatra-user"` — unify.
- [ ] **[!] OTP flow mismatch with backend:** `app/(public)/otp/page.tsx` posts `POST /auth/otp` and `POST /auth/login` with `{ phone, otp }` — the backend has **neither** endpoint (login expects password; no OTP endpoints exist yet). Blocked on backend task §2; coordinate contract first.
- [ ] **[!] api.ts baseURL fallback is wrong:** falls back to `http://localhost:3000` but the NestJS backend runs on **5001** (works today only because `.env.local` sets it).
- [ ] **Role enum mismatch ripple:** role page posts `CARPOOL`/`PROFESSIONAL` etc. — same Prisma enum bug documented in backend-task §1. Client must align once backend decides final values.
- [ ] **Create `.env.example` for client** (only `.env.local` exists; gitignored `.env*`): document `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAPS_KEY`; resolve why both `NEXT_PUBLIC_MAPS_KEY` **and** `NEXT_PUBLIC_PLACES_KEY` exist (Maps JS API key can serve both).

## 2. Wire All Static Pages to Real APIs *(the core pending work)*

Use TanStack Query hooks (already installed/provisioned) + existing `lib/endpoints.ts`.

### Rider flows
- [ ] `ride-now/page.tsx` — destination search via Google Places autocomplete (no maps lib installed yet — see §3); persist pickup/dropoff via rideSearchStore (store exists, partially used)
- [ ] `[!] ride-now/options/page.tsx` — **replace `mockRides` array** with `GET /rides/available` + filters from rideSearchStore; blocked until backend ride module implemented
- [ ] `ride-now/confirm/page.tsx` — fare breakdown via `GET /pricing/estimate`; book via `POST /rides/book`
- [ ] `ride-now/searching/page.tsx` — connect WS `ride.match` / `trip.assigned` events (socket.ts unused)
- [ ] `active-trip/page.tsx` — live tracking via WS `trip.location` + map; depends on activeTripStore (created, **never imported anywhere**)
- [ ] `plan-commute/page.tsx` + `confirm` — recurring schedule form → booking API; currently local state only
- [ ] `[!] plan-commute/matches/page.tsx` — **replace `mockMatches` array** with scheduled matches API
- [ ] `rides/page.tsx` + `rides/[id]/page.tsx` — upcoming/history/detail/cancel/rebook endpoints
- [ ] `schedules/page.tsx` — pause/edit/cancel subscriptions + instance cancel

### Wallet & payments (blocked by backend payments module)
- [ ] `[!] wallet/page.tsx` — hardcoded ₹11,250 balance + hardcoded transactions array → wire `GET /wallet`, `GET /wallet/transactions`, topup sheet → `POST /wallet/topup`
- [ ] `wallet/transactions/page.tsx` — same mock problem
- [ ] walletStore exists but **never imported** — either use it or delete (see removal list)
- [ ] Ride confirmation → payment method selection (UPI/card/wallet per PRD §3.5) — UI doesn't exist yet

### Driver flows (all static, blocked by backend driver module)
- [ ] `[!] driver/online/page.tsx` — toggle uses **local useState only** → `POST /driver/go-online/offline`; "Today's Summary" numbers are hardcoded 0s → earnings API
- [ ] `driver/offer-seat/page.tsx` — publish commute form → `POST /driver/offer` (form doesn't even submit anywhere)
- [ ] `driver/offers/page.tsx` — list/pause/delete my offers
- [ ] `driver/requests/page.tsx` + `driver/queue/page.tsx` — accept/reject rider & trip requests
- [ ] `driver/vehicles/page.tsx` — **inputs are uncontrolled with no state/handler at all** → vehicle CRUD API (note: backend canonical endpoint is `/users/me/vehicles`)
- [ ] `driver/earnings/page.tsx` — earnings overview API
- [ ] `driver/active/page.tsx` — active trip management + WS events

### Profile, safety, notifications
- [ ] `profile/page.tsx` — load/update profile, avatar upload, logout button behavior
- [ ] `profile/places/page.tsx` — saved places CRUD (backend ready!) — page currently uses local state arrays only
- [ ] `settings/page.tsx` — audit contents vs PRD (role switch, language, emergency contacts link)
- [ ] `safety/page.tsx` — emergency contacts wired to `PUT /users/me/emergency-contacts` (page has local add/remove only); emergency SOS button → `POST /safety/emergency`
- [ ] `safety/report/page.tsx` — submit issue → `POST /safety/report`
- [ ] `notifications/page.tsx` — wire to notificationStore + `GET /notifications` + mark-read APIs (topbar already reads store's unreadCount but nothing ever populates it)

### Admin panel (all hardcoded, backend admin module IS ready)
- [ ] `[!] admin/page.tsx` — stats are **hardcoded literals ("1,234", "₹12.4L")** → `GET /admin/stats`
- [ ] `admin/users/page.tsx` — search/list/status → `GET /admin/users`, `PATCH /admin/users/:id/status`
- [ ] `admin/verification/page.tsx` — doc queue → `GET /admin/docs/queue`, `PATCH /admin/docs/:id`
- [ ] `admin/disputes/page.tsx` — `GET /admin/disputes`, `PATCH /admin/disputes/:id`
- [ ] Topbar search input is decorative — implement or remove

## 3. Google Maps Integration — completely missing *(PRD §3.2)*

- [ ] Install maps library (`@vis.gl/react-google-maps` recommended for React 19) — no mapping package in package.json
- [ ] Address autocomplete (pickup/dropoff/home/work) on ride-now, plan-commute, offer-seat, places pages
- [ ] Map rendering: ride options screen, active trip live-tracking map, driver corridor view
- [ ] Populate lat/lng into rideSearchStore (currently only addresses are typed as free text)
- [ ] Set real value for `NEXT_PUBLIC_MAPS_KEY`

## 4. Real-Time / Socket Integration — zero usage

- [ ] `lib/socket.ts` exists but **never imported anywhere**. Wire connect/disconnect into auth lifecycle (login/logout/RequireAuth)
- [ ] Event handlers per backend WS map: `ride.match`, `trip.assigned`, `trip.arriving`, `trip.started`, `trip.location`, `trip.completed`, `trip.cancelled`, `booking.confirmed`, `notification.new`, `driver.online`
- [ ] Push `notification.new` → notificationStore (unreadCount in topbar already consumes it)
- [ ] Reconnection handling + auth-token refresh on reconnect

## 5. Auth Flow Gaps

- [ ] OTP auto-read SMS hint (web fallback: autofill/OTP input component exists — `components/auth/otp-input.tsx`)
- [ ] Resend OTP cooldown timer (30s) + lockout error states (5 attempts) in otp page
- [ ] Post-login routing by role (RIDER→dashboard, DRIVER→driver home, ADMIN→admin) — verify current behavior
- [ ] Role-switch from profile (PRD §3.1 "switch roles later") — no UI entry point
- [ ] Document upload UX: rejection reason display + re-upload flow (PRD edge case) — driver-documents page only handles first upload
- [ ] Session expiry UX: api.ts hard-redirects on 401 — consider toast + preserve return URL

## 6. NFR / Cross-Cutting *(PRD §4)*

- [ ] **Localization EN + HI (PRD §4.4)** — nothing exists: no i18n lib, all strings hardcoded English. Install `next-intl` (or equivalent), extract strings, Indian locale date/time via date-fns locales, ₹ formatting
- [ ] **Accessibility WCAG 2.1 AA (PRD §4.3)** — `[!]` risk: pervasive `text-white/30`, `text-white/40`, `text-white/50` grays on black likely fail 4.5:1 contrast; verify touch targets ≥48px; keyboard nav on bottom-sheet/stepper; aria labels on icon-only buttons
- [ ] Offline mode for upcoming rides (cached query persistence) — PRD §4.1
- [ ] Error/loading/empty states on every data page (empty-state/error-state/skeleton components exist but unused)
- [ ] Analytics events (funnel/ride/driver/safety per PRD §8) — no analytics SDK present; decide tool (Mixpanel/Amplitude) + event instrumentation
- [ ] SEO/metadata per page + favicon replacement (default Next favicon.ico still in app/)
- [ ] Performance: bundle-analyze pass; lazy-load map SDK; image optimization for avatars

## 7. Testing & Quality — completely missing

- [ ] Zero tests: no test runner, no test files, no CI script beyond lint/build. Add Vitest + React Testing Library (or Playwright for e2e flows: login → ride-now → confirm)
- [ ] Run `npm run lint` and `npm run build` clean; fix any type errors before wiring APIs
- [ ] Add zod schemas shared between forms and API responses (zod installed; validators.ts exists — check coverage of all forms)
- [ ] TypeScript strictness pass on stores/pages (any leaks)

---

## 8. REMOVAL / CLEANUP LIST (unnecessary things found in project)

| # | Item | Action | Reason |
|---|------|--------|--------|
| 1 | `stores/walletStore.ts` | **DELETE or wire** | Created, never imported. Wallet pages use hardcoded data instead. If kept, wire in §2; otherwise dead code |
| 2 | `stores/activeTripStore.ts` | **DELETE or wire** | Same — never imported; active-trip page is static |
| 3 | `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | **DELETE** | Default create-next-app assets, unreferenced |
| 4 | `CLAUDE.md` containing only `@AGENTS.md` | **KEEP/DECIDE** | Redundant pointer file; harmless but duplicate agent-instruction entry point |
| 5 | `NEXT_PUBLIC_PLACES_KEY` in .env.local | **REMOVE or merge** | Duplicate of MAPS_KEY; nothing reads either yet |
| 6 | `api.ts` legacy keys `"yaatra-token"` / `"yaatra-user"` | **REMOVE after fix** | Superseded by zustand persist `"yaatra-auth"` (see P0 #1) |
| 7 | `endpoints.ts` → `rating.list: "/rating"` + `byId` | **FIX/ALIGN** | Backend plan defines `POST /ratings` + `GET /ratings/user/:id`; client map points at nonexistent generic CRUD paths |
| 8 | `endpoints.ts` → `payments.webhook` | **REMOVE from client map** | Server-to-server gateway callback; a web client should never call it |
| 9 | `endpoints.ts` → `driver.vehicles/vehicleById` (`/driver/vehicles`) | **REMOVE** | Canonical implementation lives at `/users/me/vehicles` (see backend-task removal #2); pointing at the stub invites drift |
| 10 | Hardcoded mock datasets | **DELETE when wiring** (§2): admin/page stats, ride-now/options `mockRides`, plan-commute/matches `mockMatches`, wallet balance+transactions, driver/online summary zeros, rides/schedules/profile local arrays | Will mislead testing once backend goes live |
| 11 | Topbar global search box | **IMPLEMENT or REMOVE** | Purely decorative input; no search feature exists in PRD scope |
| 12 | `rides/[id]`, settings, and other unvisited pages | **AUDIT** | Verify each page traces to a PRD requirement (per repo DoD rule #5); delete screens that don't |

**Dependency notes:** all installed deps are appropriate for scope; nothing needs uninstalling. **Missing installs:** Google Maps lib (§3), i18n lib (§6), test runner (§7), optional analytics SDK.

---

## 9. Suggested Execution Order

1. §1 P0 fixes (token storage, env example) → 2. §2 wire already-live backend modules first: **profile/places, safety contacts, admin panel, driver-documents refinements** → 3. §5 auth flow polish once backend OTP lands → 4. §3 maps + ride-now/search flows → 5. §4 sockets + active trip → 6. wallet/payments UI (after backend §6) → 7. §6 i18n + a11y + analytics → 8. §7 tests → 9. §8 cleanup throughout.

*(Blocked-on-backend items are cross-referenced to `task/backend-task.md`; do not mock-wire them permanently — use temporary MSW/query mocks only if parallel work is needed.)*
