# Yaatra Mobile — Directory Structure & Screens (Flutter)

> Target structure for the Flutter app under `mobile/` (create with `flutter create --org com.yaatra --project-name yaatra_mobile mobile`).
> Architecture: **features-first**, Riverpod for state, go_router for navigation. The mobile app is the **primary product** (PRD is mobile-first).

```
mobile/
├── pubspec.yaml                        → deps from mobile-implementation-plan §1.1
├── analysis_options.yaml               → flutter_lints
├── android/
│   └── app/src/main/AndroidManifest.xml  → perms: INTERNET, LOCATION, CAMERA, READ_SMS
│       (gradle: minSdk, targetSdk)
├── ios/Runner/Info.plist               → iOS 13+, usage descriptions (location, camera, notifications)
├── assets/
│   ├── images/                         → logo, illustrations (empty/error states)
│   ├── fonts/                          → brand fonts (Inter/Poppins, Devanagari for hi)
│   └── i18n/                           → en.json, hi.json
├── test/                               → widget + unit tests per feature
│   ├── auth_test.dart
│   ├── formatters_test.dart
│   └── repositories_test.dart
└── lib/
    ├── main.dart                       → Firebase init, register providers, runApp
    ├── app.dart                        → MaterialApp.router, theme, localization, routes
    │
    ├── router/
    │   └── app_router.dart             → go_router config + auth redirect (Redirect based on authProvider)
    │
    ├── core/
    │   ├── api/
    │   │   ├── dio_client.dart         → dio + baseURL + JWT interceptor + 401 logout
    │   │   └── api_endpoints.dart      → all backend routes (mirror backend-structure.md)
    │   ├── socket/
    │   │   └── socket_service.dart     → socket.io client, join:user/join:trip, event stream
    │   ├── storage/
    │   │   ├── token_storage.dart      → flutter_secure_storage (JWT)
    │   │   └── cache.dart              → shared_preferences (upcoming rides offline)
    │   ├── theme/
    │   │   ├── app_theme.dart          → ThemeData (light/dark), TextTheme, components theme
    │   │   └── app_colors.dart         → palette + semantic colors
    │   ├── localization/
    │   │   └── app_localizations.dart  → en/hi resolution, format INR, Indian locale
    │   ├── utils/
    │   │   ├── formatters.dart         → currency, distance, time-ago, masked phone
    │   │   └── validators.dart         → phone, OTP, forms
    │   └── widgets/                    → reusable primitives
    │       ├── primary_button.dart
    │       ├── text_field.dart
    │       ├── chip_filter.dart
    │       ├── bottom_sheet.dart
    │       ├── skeleton.dart
    │       ├── empty_state.dart
    │       ├── error_state.dart
    │       ├── rating_bar.dart
    │       ├── trust_badge.dart        → Carpool/Pro/WomenOnly/Verified badges
    │       ├── driver_card.dart
    │       └── ride_option_card.dart
    │
    └── features/
        ├── auth/
        │   ├── models/
        │   │   └── user_model.dart
        │   ├── data/
        │   │   └── auth_repository.dart    → /auth/otp, /auth/verify, /auth/profile, /auth/roles
        │   ├── providers/
        │   │   └── auth_providers.dart     → authStateProvider, auto-login
        │   └── presentation/
        │       └── pages/
        │           ├── splash_page.dart
        │           ├── login_page.dart
        │           ├── otp_page.dart
        │           ├── role_selection_page.dart
        │           ├── profile_setup_page.dart
        │           └── driver_documents_page.dart
        │
        ├── home/
        │   ├── models/home_data.dart
        │   ├── providers/home_providers.dart
        │   └── presentation/pages/home_page.dart
        │
        ├── ride_now/
        │   ├── models/
        │   │   ├── ride_option.dart
        │   │   └── trip_model.dart
        │   ├── data/ride_repository.dart   → /rides/available, /rides/book, /pricing/estimate
        │   ├── providers/ride_providers.dart
        │   └── presentation/pages/
        │       ├── search_destination_page.dart
        │       ├── ride_options_page.dart
        │       ├── searching_page.dart
        │       ├── ride_confirmation_page.dart
        │       └── active_trip_page.dart
        │
        ├── plan_commute/
        │   ├── models/schedule_model.dart
        │   ├── data/schedule_repository.dart → /rides/available?scheduled, /rides/schedules
        │   ├── providers/schedule_providers.dart
        │   └── presentation/pages/
        │       ├── plan_commute_page.dart
        │       ├── scheduled_matches_page.dart
        │       ├── booking_confirm_page.dart
        │       └── schedule_manager_page.dart
        │
        ├── driver/
        │   ├── models/
        │   │   ├── offer_model.dart
        │   │   ├── vehicle_model.dart
        │   │   ├── ride_request_model.dart
        │   │   └── earnings_model.dart
        │   ├── data/driver_repository.dart  → /driver/offer, /driver/offers, /driver/go-online,
        │   │                                 /driver/requests, /driver/accept, /driver/earnings,
        │   │                                 /driver/vehicles
        │   ├── providers/driver_providers.dart
        │   └── presentation/pages/
        │       ├── offer_seat_page.dart
        │       ├── driver_offers_page.dart
        │       ├── incoming_requests_page.dart
        │       ├── go_online_page.dart
        │       ├── ride_request_queue_page.dart
        │       ├── driver_active_trip_page.dart
        │       └── driver_earnings_page.dart
        │
        ├── rides/
        │   ├── data/ride_history_repository.dart → /rides/upcoming, /rides/history, /rides/:id
        │   ├── providers/rides_providers.dart
        │   └── presentation/pages/
        │       ├── upcoming_rides_page.dart
        │       ├── ride_history_page.dart
        │       └── ride_detail_page.dart
        │
        ├── wallet/
        │   ├── data/wallet_repository.dart   → /wallet, /wallet/transactions, /wallet/topup
        │   ├── providers/wallet_providers.dart
        │   └── presentation/pages/
        │       ├── wallet_page.dart
        │       └── transaction_history_page.dart
        │
        ├── notifications/
        │   ├── data/notification_repository.dart → /notifications
        │   ├── providers/notification_providers.dart
        │   └── presentation/pages/notification_center_page.dart
        │
        ├── safety/
        │   ├── data/safety_repository.dart   → /safety/emergency, /safety/report, /safety/trip-share
        │   ├── providers/safety_providers.dart
        │   └── presentation/pages/
        │       ├── safety_page.dart
        │       └── emergency_sheet.dart      → modal SOS overlay
        │
        ├── profile/
        │   ├── data/profile_repository.dart  → /auth/profile, /users/me/places, /users/me/documents
        │   ├── providers/profile_providers.dart
        │   └── presentation/pages/
        │       ├── profile_page.dart
        │       ├── saved_places_page.dart
        │       └── settings_page.dart
        │
        └── admin/
            └── presentation/pages/
                ├── admin_dashboard_page.dart
                ├── admin_users_page.dart
                ├── admin_verification_page.dart
                └── admin_disputes_page.dart
```

---

## Screen Specification Table (every screen, data, actions)

| # | Screen | Route (go_router) | Data / API | Key actions |
|---|--------|-------------------|------------|-------------|
| 1 | Splash | `/splash` | — | init Firebase, restore token → redirect |
| 2 | Login | `/login` | — | send OTP `POST /auth/otp` |
| 3 | OTP | `/otp` | — | `POST /auth/verify`, auto-read SMS, resend, lockout UI |
| 4 | Role selection | `/role` | — | `POST /auth/roles` |
| 5 | Profile setup | `/profile-setup` | — | `PATCH /auth/profile`, geolocation |
| 6 | Driver documents | `/driver-documents` | — | `POST /users/me/documents` (image_picker) |
| 7 | Home | `/home` | `GET /rides/upcoming`, `GET /wallet` | Ride Now / Plan Commute CTAs |
| 8 | Search destination | `/ride-now` | Google Places | set pickup/drop, saved places |
| 9 | Ride options | `/ride-now/options` | `GET /rides/available?type=on_demand` | filters (Carpool/Pro/Women/sort) |
| 10 | Searching | `/ride-now/searching` | WS `ride.match` | animated match, cancel |
| 11 | Ride confirmation | `/ride-now/confirm` | `GET /pricing/estimate` | payment method, `POST /rides/book` |
| 12 | Active trip (rider) | `/active-trip/:id` | WS `trip.location` etc. | emergency SOS, share, call, cancel |
| 13 | Plan commute | `/plan-commute` | — | set destination + recurring schedule |
| 14 | Scheduled matches | `/plan-commute/matches` | `GET /rides/available?type=scheduled` | select carpool |
| 15 | Booking confirm | `/plan-commute/confirm` | — | `POST /rides/book` |
| 16 | Schedule manager | `/schedules` | `GET /rides/schedules` | pause/edit/cancel occurrence, co-riders |
| 17 | Offer seat | `/driver/offer` | — | `POST /driver/offer` (stepper) |
| 18 | Driver offers | `/driver/offers` | `GET /driver/offers` | edit/pause/delete |
| 19 | Incoming requests | `/driver/offers/:id/requests` | `GET /driver/offers/:id/requests` | accept/reject |
| 20 | Go online | `/driver/online` | — | `POST /driver/go-online/offline`, vehicle select |
| 21 | Request queue (pro) | `/driver/queue` | `GET /driver/requests` | accept/reject pooled |
| 22 | Driver active trip | `/driver/active/:id` | WS `trip.*` + `location:update` | arrive, pickup, complete |
| 23 | Driver earnings | `/driver/earnings` | `GET /driver/earnings` | `POST /wallet/withdraw` |
| 24 | Upcoming rides | `/rides/upcoming` | `GET /rides/upcoming` (offline-cached) | cancel/edit, contact driver |
| 25 | Ride history | `/rides/history` | `GET /rides/history` | rebook, report, rate |
| 26 | Ride detail | `/rides/:id` | `GET /rides/:id` | receipt, `POST /rides/:id/rebook`, `POST /ratings` |
| 27 | Wallet | `/wallet` | `GET /wallet` | topup, auto-pay toggle |
| 28 | Transactions | `/wallet/transactions` | `GET /wallet/transactions` | receipt view |
| 29 | Notifications | `/notifications` | `GET /notifications` | mark read/all |
| 30 | Safety | `/safety` | `GET /safety/trust/:id` | contacts mgmt, report issue |
| 31 | Emergency sheet | overlay | `POST /safety/emergency` | SOS (alerts + live location + call 112) |
| 32 | Profile | `/profile` | `GET /auth/profile` | edit info, role switch |
| 33 | Saved places | `/profile/places` | CRUD `/users/me/places` | add/edit/delete |
| 34 | Settings | `/settings` | — | language (en/hi), prefs, payments, block, logout |
| 35 | Admin dashboard | `/admin` | `GET /admin/stats` | — |
| 36 | Admin users | `/admin/users` | `GET /admin/users` | search/filter |
| 37 | Admin verification | `/admin/verification` | `GET /admin/docs/queue` | approve/reject |
| 38 | Admin disputes | `/admin/disputes` | `GET /admin/disputes` | resolve |

---

## Navigation (go_router)
| Route group | Guard logic (redirect) |
|-------------|------------------------|
| `/splash`, `/login`, `/otp`, `/role`, `/profile-setup`, `/driver-documents` | → `/home` if authed |
| `/home`, `/ride-now*`, `/plan-commute*`, `/rides*`, `/wallet*`, `/notifications`, `/safety`, `/profile*`, `/settings` | require token |
| `/driver/*` | require role includes DRIVER |
| `/driver/online`, `/driver/queue` | require PROFESSIONAL |
| `/admin/*` | require ADMIN |

- Bottom navigation bar (persistent shell): **Home · Rides · Wallet · Notifications · Profile** (role-aware; drivers get a **Driver** tab instead of Wallet or an extra tab).
- Driver section lives behind a separate tab/entry point visible only to driver roles.

---

## Real-Time Wiring
- `SocketService` (core) connects post-login with JWT; emits `join:user`.
- Event bus → Riverpod providers:
  - `notification.new` → unread count + local push.
  - `ride.match`, `trip.assigned/arriving/started/location/completed/cancelled` → `activeTripProvider`.
  - `booking.confirmed` → schedule screen refresh.
- Active trip screen subscribes to `trip:{id}` room; driver publishes `location:update` throttled every 3–5s.

---

## API Endpoint Mirror
All endpoints from `backend-structure.md` are defined once in `core/api/api_endpoints.dart` and reused by every repository.

---

## NFR Quick Map (PRD §4)
- **Performance:** lazy `AutoDisposeProvider`s, deferred Google Maps, launch < 2s, cache upcoming rides.
- **Accessibility:** `Semantics` labels, 48dp touch targets, 4.5:1 contrast, dynamic text scale.
- **Localization:** en + hi (Phase 3), ₹ formatting, Indian locale dates.
- **Security:** JWT in `flutter_secure_storage`, no sensitive logs, masked phone UI.