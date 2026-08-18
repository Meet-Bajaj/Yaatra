# Yaatra Frontend — Directory Structure & Pages (Next.js)

> Target structure for the Next.js app under `client/`. `[EXISTS]` = already present. Conventions: App Router, route groups `(public)` and `(app)`, one folder per page under `app/`, shared UI in `components/`, hooks in `lib/hooks/`, state in `stores/`.

```
client/
├── .env.local                          → NEXT_PUBLIC_API_URL, NEXT_PUBLIC_MAPS_KEY, NEXT_PUBLIC_PLACES_KEY
├── .gitignore               [EXISTS]
├── next.config.ts           [EXISTS]
├── package.json             [EXISTS]
├── postcss.config.mjs       [EXISTS]
├── tsconfig.json            [EXISTS]
├── eslint.config.mjs        [EXISTS]
├── AGENTS.md                [EXISTS]
├── public/                  [EXISTS]
│   └── (brand assets: logo, illustrations for empty states)
├── app/
│   ├── layout.tsx           [EXISTS]  → fonts + Providers + Toaster
│   ├── globals.css          [EXISTS]  → design tokens (Yaatra palette, semantic states)
│   ├── page.tsx             [EXISTS]  → redirect → /dashboard (or /login)
│   ├── providers.tsx                 → React Query + zustand store init
│   │
│   ├── (public)/                      # NO auth shell — onboarding screens
│   │   ├── layout.tsx                 # centered auth layout (logo, back)
│   │   ├── login/
│   │   │   └── page.tsx               # phone entry → OTP
│   │   ├── otp/
│   │   │   └── page.tsx               # 6-digit OTP, resend, lockout
│   │   ├── role/
│   │   │   └── page.tsx               # role selection (rider/carpool/pro/both)
│   │   ├── profile-setup/
│   │   │   └── page.tsx               # name/gender/city/photo
│   │   └── driver-documents/
│   │       └── page.tsx               # vehicle + document upload (driver only)
│   │
│   ├── (app)/                          # AUTHENTICATED shell — sidebar + topbar
│   │   ├── layout.tsx                 # RequireAuth + AppShell (nav, user menu)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # dual CTA (Ride Now / Plan Commute) + upcoming ride
│   │   ├── ride-now/
│   │   │   ├── page.tsx               # destination search + map (step 1)
│   │   │   ├── options/
│   │   │   │   └── page.tsx           # ride options list + filters (step 2)
│   │   │   ├── searching/
│   │   │   │   └── page.tsx           # animated matching (WS) (step 3)
│   │   │   └── confirm/
│   │   │       └── page.tsx           # fare breakdown + payment + confirm (step 4)
│   │   ├── active-trip/
│   │   │   └── page.tsx               # live map, driver card, emergency, share, cancel
│   │   ├── plan-commute/
│   │   │   ├── page.tsx               # destination + schedule (single/recurring)
│   │   │   ├── matches/
│   │   │   │   └── page.tsx           # matched carpool cards
│   │   │   └── confirm/
│   │   │       └── page.tsx           # booking confirmation
│   │   ├── schedules/
│   │   │   └── page.tsx               # my recurring subscriptions (pause/edit/cancel)
│   │   ├── driver/
│   │   │   ├── layout.tsx             # driver sub-nav (offers / online / earnings)
│   │   │   ├── offer-seat/
│   │   │   │   └── page.tsx           # publish commute (stepper)
│   │   │   ├── offers/
│   │   │   │   └── page.tsx           # my offers list + manage
│   │   │   ├── requests/
│   │   │   │   └── page.tsx           # incoming rider requests (accept/reject)
│   │   │   ├── online/
│   │   │   │   └── page.tsx           # pro driver online toggle + zone + earnings
│   │   │   ├── queue/
│   │   │   │   └── page.tsx           # pooled ride request queue (pro)
│   │   │   ├── active/
│   │   │   │   └── page.tsx           # driver active trip (navigate → complete)
│   │   │   ├── earnings/
│   │   │   │   └── page.tsx           # earnings + settlements + payout
│   │   │   └── vehicles/
│   │   │       └── page.tsx           # vehicle CRUD
│   │   ├── rides/
│   │   │   ├── page.tsx               # tabs: upcoming / history
│   │   │   └── [id]/
│   │   │       └── page.tsx           # ride detail (receipt, rebook, report, rate)
│   │   ├── wallet/
│   │   │   ├── page.tsx               # balance, topup, auto-pay
│   │   │   └── transactions/
│   │   │       └── page.tsx           # history + receipts
│   │   ├── notifications/
│   │   │   └── page.tsx               # notification center (read/unread)
│   │   ├── safety/
│   │   │   ├── page.tsx               # emergency contacts, trust profile, report
│   │   │   └── report/
│   │   │       └── page.tsx           # report issue form
│   │   ├── profile/
│   │   │   ├── page.tsx               # profile info + role switch
│   │   │   └── places/
│   │   │       └── page.tsx           # saved places CRUD
│   │   └── settings/
│   │       └── page.tsx               # language, notifications prefs, payments, block list
│   │
│   ├── admin/                          # ADMIN ONLY
│   │   ├── layout.tsx                 # RequireAdmin + admin nav
│   │   ├── page.tsx                   # stats dashboard
│   │   ├── users/
│   │   │   └── page.tsx               # user list + search
│   │   ├── verification/
│   │   │   └── page.tsx               # doc verification queue
│   │   └── disputes/
│   │       └── page.tsx               # dispute resolution
│   │
│   └── not-found.tsx                  # 404 page
│
├── components/                         # shared UI
│   ├── ui/                             # primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── chip.tsx
│   │   ├── bottom-sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   ├── stepper.tsx
│   │   ├── rating-bar.tsx
│   │   └── badge.tsx                   # Carpool/Pro/WomenOnly trust badges
│   ├── auth/
│   │   ├── require-auth.tsx
│   │   ├── require-admin.tsx
│   │   ├── require-driver.tsx
│   │   └── otp-input.tsx
│   ├── ride/
│   │   ├── ride-option-card.tsx
│   │   ├── fare-breakdown.tsx
│   │   ├── driver-card.tsx
│   │   ├── filter-bar.tsx              # carpool/pro/women/sort chips
│   │   └── live-map.tsx                # google maps wrapper
│   ├── driver/
│   │   ├── offer-stepper.tsx
│   │   ├── request-card.tsx
│   │   └── earnings-chart.tsx
│   ├── shell/
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── user-menu.tsx
│   └── payment/
│       └── payment-methods.tsx         # UPI / card / wallet
│
├── lib/
│   ├── api.ts                          # axios instance + interceptors
│   ├── endpoints.ts                    # all backend routes (mirror backend-structure.md)
│   ├── socket.ts                       # socket.io client + event hub
│   ├── utils.ts                        # format INR, time, distance
│   └── validators.ts                   # phone, OTP, forms
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-rides.ts                # React Query: available/upcoming/history
│   │   ├── use-trip.ts                 # live trip + WS subscription
│   │   └── use-wallet.ts
│   └── i18n/                           # Phase 3: en.ts, hi.ts dictionaries
│       ├── en.ts
│       └── hi.ts
│
└── stores/                             # zustand
    ├── authStore.ts
    ├── rideSearchStore.ts
    ├── activeTripStore.ts
    ├── notificationStore.ts
    └── walletStore.ts
```

---

## Page Specification Table (every page, its data & actions)

| # | Page (route) | Data from API | Key actions |
|---|---------------|---------------|-------------|
| 1 | Login `(public)/login` | — | send OTP → `POST /auth/otp` |
| 2 | OTP `(public)/otp` | — | `POST /auth/verify`, resend `POST /auth/resend-otp` |
| 3 | Role `(public)/role` | — | `POST /auth/roles` |
| 4 | Profile setup `(public)/profile-setup` | — | `PATCH /auth/profile` |
| 5 | Driver documents `(public)/driver-documents` | — | `POST /users/me/documents` (multipart) |
| 6 | Dashboard `(app)/dashboard` | `GET /rides/upcoming`, `GET /wallet` | navigate Ride Now / Plan Commute |
| 7 | Ride search `(app)/ride-now` | Places autocomplete | set pickup/drop |
| 8 | Ride options `(app)/ride-now/options` | `GET /rides/available?type=on_demand` | filters, sort, select |
| 9 | Matching `(app)/ride-now/searching` | WS `ride.match` | cancel search |
| 10 | Confirmation `(app)/ride-now/confirm` | `GET /pricing/estimate` | `POST /rides/book`, pay |
| 11 | Active trip `(app)/active-trip` | WS `trip.*` | emergency, share, cancel, call |
| 12 | Plan commute `(app)/plan-commute` | — | build schedule |
| 13 | Scheduled matches `(app)/plan-commute/matches` | `GET /rides/available?type=scheduled` | select carpool |
| 14 | Commute confirm `(app)/plan-commute/confirm` | — | `POST /rides/book` |
| 15 | Schedules `(app)/schedules` | `GET /rides/schedules` | pause/edit/cancel |
| 16 | Offer seat `(app)/driver/offer-seat` | — | `POST /driver/offer` |
| 17 | My offers `(app)/driver/offers` | `GET /driver/offers` | edit/pause/delete |
| 18 | Requests `(app)/driver/requests` | `GET /driver/offers/:id/requests` | accept/reject |
| 19 | Online `(app)/driver/online` | — | `POST /driver/go-online|offline` |
| 20 | Queue `(app)/driver/queue` | `GET /driver/requests` | accept/reject |
| 21 | Driver active `(app)/driver/active` | WS `trip.*` | arrive, pickup, complete, `location:update` |
| 22 | Earnings `(app)/driver/earnings` | `GET /driver/earnings` | `POST /wallet/withdraw` |
| 23 | Vehicles `(app)/driver/vehicles` | CRUD `/driver/vehicles` | add/edit/delete |
| 24 | Rides `(app)/rides` | `GET /rides/upcoming`, `GET /rides/history` | cancel, rebook, report, rate |
| 25 | Ride detail `(app)/rides/[id]` | `GET /rides/:id` | receipt, `POST /rides/:id/rebook`, `POST /ratings` |
| 26 | Wallet `(app)/wallet` | `GET /wallet`, `GET /wallet/transactions` | `POST /wallet/topup`, auto-pay toggle |
| 27 | Transactions `(app)/wallet/transactions` | `GET /wallet/transactions` | view receipt |
| 28 | Notifications `(app)/notifications` | `GET /notifications` | mark read, read-all |
| 29 | Safety `(app)/safety` | `GET /safety/trust/:id` | manage contacts, report |
| 30 | Report `(app)/safety/report` | — | `POST /safety/report` |
| 31 | Profile `(app)/profile` | `GET /auth/profile` | update info, switch role |
| 32 | Places `(app)/profile/places` | CRUD `/users/me/places` | add/edit/delete |
| 33 | Settings `(app)/settings` | — | language, prefs, payments, block |
| 34 | Admin stats `(admin)/` | `GET /admin/stats` | — |
| 35 | Admin users `(admin)/users` | `GET /admin/users` | search/filter |
| 36 | Admin verification `(admin)/verification` | `GET /admin/docs/queue` | approve/reject |
| 37 | Admin disputes `(admin)/disputes` | `GET /admin/disputes` | resolve |

---

## API Endpoint Mirror
Every API in `backend-structure.md` → defined once in `lib/endpoints.ts` and reused by hooks. No hardcoded URLs in components.

---

## Guard Rules
| Route group | Guard |
|-------------|-------|
| `(public)/*` | none (redirect to dashboard if already authed) |
| `(app)/*` | RequireAuth (token in authStore) |
| `(app)/driver/*` | RequireAuth + role includes DRIVER |
| `(app)/driver/online`, `queue` | + role PROFESSIONAL |
| `admin/*` | RequireAuth + role ADMIN |

---

## Navigation (sidebar)
- Dashboard · Ride Now · Plan Commute · Schedules · My Rides · Wallet · Notifications · Safety · Profile · Settings
- Driver section (visible only for driver roles): Offer Seat / Offers / Requests · Go Online / Queue · Earnings · Vehicles
- Admin section (ADMIN only): Stats · Users · Verification · Disputes