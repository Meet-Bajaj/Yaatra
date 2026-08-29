

# Yaatra – Unified Shared Mobility App  
## Product Requirements Document  
**Version:** 1.0  
**Date:** 2026-08-18  
**Author:** Meet Bajaj
**Status:** Draft for Design & Engineering Alignment  

---

## 1. Product Overview

### 1.1 Vision
A single mobility app for India that blends **instant shared rides** and **planned daily carpooling**, connecting riders with nearby drivers—whether they’re carpool owners sharing their commute or professional drivers—to make every journey shared, affordable, and reliable.

### 1.2 Problem Statement
Urban Indian commuters face a painful trade-off: ride-hailing is too expensive for daily use, and existing carpooling apps are unreliable for real-time needs and lack trust. There is no seamless way to find a ride right now *or* plan a regular commute with the same community of nearby people. Drivers, meanwhile, have empty seats going to waste.

### 1.3 Product Goals
- **User Goals**  
  - Riders: Find affordable, safe, and convenient rides—either instantly or for recurring commutes.  
  - Carpool Drivers: Share empty seats, recover fuel costs, and maintain control over who they ride with.  
  - Professional Drivers: Increase trip volume and earnings through pooled ride requests.  
- **Business Goals**  
  - Capture the daily commute shared-mobility market in top 10 Indian cities.  
  - Achieve a 60%+ match rate for scheduled carpools and <5 min ETA for on-demand shared rides.  
  - Generate sustainable commission revenue per completed ride.  
  - Build trust and community-driven growth through apartment complexes, offices, and colleges.

### 1.4 Success Metrics (North Star & Counter Metrics)
| Metric | Target | Counter Metric (Watch) |
|--------|--------|------------------------|
| Weekly Active Riders | 100k in first city | Churn rate after first ride |
| Ride Match Rate (scheduled) | >60% of posted rides get at least 1 rider | Driver drop-off due to low matches |
| Avg. Passenger per Trip (pooled) | 1.8 | Ride cancellation rate |
| Driver Earnings per Hour | Positive trend | Safety incident reports |
| Net Revenue | Commission - incentives | Cost per acquisition |

### 1.5 Target Market & Geography
- **Country:** India  
- **Initial Cities:** Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune (top 5 tech/commuter hubs).  
- **Primary Users:** Daily office/college commuters, car owners willing to share, professional cab drivers.

### 1.6 User Personas
#### Persona 1: Priya (Rider, College Student)
- **Demographics:** 20, female, tech-savvy, budget-conscious.  
- **Goals:** Get to college daily without spending ₹300 on an auto; feel safe; find a ride even at odd hours.  
- **Frustrations:** Existing apps show only taxis; carpool groups on WhatsApp are messy and unsafe.  
- **Behavior:** Plans her commute the night before but sometimes needs an instant ride if she misses the bus.

#### Persona 2: Raj (Carpool Driver, IT Professional)
- **Demographics:** 32, male, owns a sedan, daily 25 km commute.  
- **Goals:** Share his daily drive to Whitefield; earn ₹150–200 per rider to cover fuel; control who he rides with.  
- **Frustrations:** No trustworthy platform to find regular co-travelers from his apartment complex; doesn’t want to become a taxi driver.  
- **Behavior:** Leaves at 8:30 AM; would like a set of vetted, recurring co-riders; open to occasional one-time passengers.

#### Persona 3: Vikram (Professional Driver)
- **Demographics:** 38, male, drives a sedan for a cab aggregator.  
- **Goals:** Maximize daily earnings; reduce empty running; get pooled ride requests consistently.  
- **Frustrations:** Pooled rides on other apps are infrequent; he wants to be matched with multiple passengers along a corridor.  
- **Behavior:** Drives in Bangalore; available on-call but prefers scheduled pooled rides to guarantee income.

### 1.7 Monetization
- **Commission per ride:**  
  - Carpool rides: 10–15% of fare (capped).  
  - Professional rides: 20–25% of fare.  
- **Additional revenue streams (future):** Subscription for frequent riders, corporate tie-ups, in-app advertising.

---

## 2. Scope

### 2.1 In Scope (MVP)
- User registration & role selection (rider, carpool driver, professional driver, or both).  
- On-demand shared ride booking (pooled, with both carpool and professional supply).  
- Scheduled recurring commute carpooling (ride offers, recurring schedules, passenger requests).  
- Basic matching algorithm (time, route overlap, user preferences).  
- Simple fare calculation with dynamic pricing for professional on-demand, fixed cost-sharing for carpool.  
- In-app payments via UPI, wallets, and cards.  
- Safety features: emergency button, trip sharing, driver/rider verification.  
- Ratings and reviews for both parties.  
- Basic notifications (booking confirmations, reminders, cancellations).  
- Minimal admin dashboard for customer support and dispute resolution.

### 2.2 Out of Scope (Future Releases)
- Two-wheeler (bike taxi) pooling.  
- Inter-city long-distance carpooling (like BlaBlaCar).  
- Corporate employee transport management.  
- Advanced route optimization with multiple pickups/dropoffs (MVP supports up to 2 pickups per trip).  
- Chat between riders and drivers (only predefined messages or call for safety).  
- Multi-language support (Hindi + English only initially).  
- Web platform (mobile-first only).

---

## 3. Feature Requirements

### 3.1 Authentication & Onboarding
**Description:** Simple phone-number-based signup with OTP, role selection, and basic profile setup.

**User Stories:**
- As a new user, I want to sign up using my phone number so I can start using the app quickly.
- As a user, I want to choose my role (rider, carpool driver, professional driver, or both) so the app can personalize my experience.
- As a professional driver, I need to upload my driving license and vehicle documents for verification before going online.

**Functional Requirements:**
- OTP login with auto-read SMS.
- Role selection with clear explanations; ability to switch roles later from profile.
- Mandatory fields for rider: name, gender (for safety filters), profile photo optional.
- Mandatory fields for carpool driver: name, gender, vehicle details (make, model, number, colour), driving license, insurance proof.
- Professional driver: additional commercial permit, vehicle fitness certificate.
- Document verification via manual review or third-party API (DigiLocker integration preferred).

**Edge Cases:**
- User enters wrong OTP multiple times -> lock after 5 attempts, allow resend after 30 sec.
- User refuses location permission -> prompt later, default city selection manually.
- Driver documents rejected -> show reason and allow re-upload.

### 3.2 Rider: Find & Book a Ride
**Description:** Two modes – **Ride Now** (on-demand) and **Plan Commute** (scheduled recurring).

**User Stories:**
- As a rider, I want to enter my destination and see available shared rides (carpool and professional) so I can choose the best option.
- As a rider, I want to set a recurring schedule (e.g., Mon-Fri 9 AM) so I don’t have to rebook daily.
- As a rider, I want to filter by driver type, women-only, or price to find a suitable ride.

**Functional Requirements:**
- Destination search with Google Maps autocomplete.
- Time selection: “Leave now” vs. schedule (single or recurring).
- Ride results list showing: driver type badge, driver name/photo/rating, vehicle, pickup/drop, ETA, fare, seats available.
- Filter chips: Carpool only, Professional only, Women only, Sort by price/time.
- Booking confirmation with fare breakdown, payment method, cancellation policy.
- For recurring rides: manage schedule (pause, edit, cancel individual occurrence).

**Acceptance Criteria:**
- User can book an on-demand ride within 3 taps after entering destination.
- Scheduled ride is confirmed only after at least one driver accepts; if no driver accepts by 2 hours before trip, rider is notified and alternatives shown.
- Cancellation after driver accepted incurs a small penalty if within 30 min of pickup.

### 3.3 Driver: Offer a Seat / Go Online
**Description:** Two distinct modes – **Carpool Driver** (scheduled commutes) and **Professional Driver** (on-demand pooled rides).

**User Stories:**
- As a carpool driver, I want to publish my daily commute with available seats, time, and route so riders can book them.
- As a professional driver, I want to go online and receive pooled ride requests along my current route.

**Functional Requirements:**
- Carpool driver flow:  
  - Set home/work addresses, departure time, return time (optional), days of week.  
  - Set number of available seats (max 3), women-only preference.  
  - Suggested price per seat (editable within min/max limits).  
  - Publish ride and manage incoming requests.  
- Professional driver flow:  
  - Toggle “Go Online” to receive ride requests.  
  - Vehicle selection, current zone display.  
  - Accept/reject requests (pooled with up to 2 pickups).  
- Both modes: trip summary, earnings overview.

**Edge Cases:**
- Driver cancels a scheduled ride -> riders get instant notification and app suggests alternatives (may be professional ride with price difference shown).  
- No riders match a carpool offer -> driver can choose to “open to on-demand” automatically during that time slot.

### 3.4 Matching & Pricing
**Description:** Intelligent matching based on route overlap, time, and user preferences.

**Functional Requirements:**
- Matching algorithm:  
  - For scheduled carpool: match riders whose start/end points are within X km of driver’s route (configurable).  
  - For on-demand: find drivers (both carpool and professional) whose current location and destination corridor can accommodate the rider within acceptable detour time.  
- Pricing:  
  - Carpool: cost-sharing based on distance (e.g., ₹8/km split among passengers + driver).  
  - Professional: dynamic base fare + per km + per minute, with surge during high demand but capped.  
- Fare displayed before booking; price may change only if route changes significantly.

**Acceptance Criteria:**
- Matching response time for on-demand < 2 seconds (cached driver locations).  
- Scheduled match suggestions must appear within 5 seconds of publishing ride.  
- Price difference between carpool and professional must be clearly communicated (carpool always cheaper).

### 3.5 Payments & Wallet
**Description:** Seamless in-app payments with multiple options, automatic deductions, and driver payouts.

**User Stories:**
- As a rider, I want to pay via UPI, card, or wallet so it’s convenient.
- As a driver, I want to receive my earnings daily to my bank account.

**Functional Requirements:**
- Rider payment methods: UPI (GPay, PhonePe, BHIM), credit/debit cards, Yaatra wallet.  
- Automatic payment after ride completion; manual retry if fails.  
- Driver wallet showing daily earnings, pending settlements, and withdrawal options.  
- Commission deducted automatically before driver payout.  
- Transaction history with receipts.

**Edge Cases:**
- Payment failure -> ride still recorded, driver paid after retry or from insurance pool.  
- Dispute on fare -> support can adjust within 24h; both parties notified.

### 3.6 Safety & Trust
**Description:** Comprehensive safety features to build confidence.

**User Stories:**
- As a rider, I want an emergency button that sends my live location to my emergency contacts.
- As a driver, I want to know that riders are verified.

**Functional Requirements:**
- Verification: Aadhaar-based KYC, document upload, selfie with ID.  
- Trust badges: verified identity, verified vehicle, women-only ride, experienced driver.  
- Emergency button within ride screen: triggers alert to emergency contacts, records audio/video, alerts Yaatra safety team.  
- Share trip status with contacts.  
- In-app call/message (masked numbers).  
- Post-ride rating and feedback; users can report safety issues.  
- Women-only mode for riders (driver and co-riders must be female).

### 3.7 Notifications
**Description:** Push notifications and in-app messages for critical events.

**Functional Requirements:**
- Booking confirmations, driver/rider updates, reminders before scheduled rides.  
- Cancellation alerts with reason if provided.  
- Promotional messages (opt-in only).  
- In-app notification center with read/unread states.

### 3.8 Ride Management (History & Upcoming)
**Description:** Manage all rides from a single dashboard.

**Functional Requirements:**
- Upcoming rides tab (as rider or driver) with cancel/edit options.  
- Completed rides with receipt, rebook option, report issue.  
- Recurring commute groups: list of co-riders for a scheduled carpool, ability to remove or block a rider.  
- Favorites/saved places.

---

## 4. Non-Functional Requirements

### 4.1 Performance
- App launch time < 2 seconds on mid-range Android (majority of Indian users).  
- Map rendering smooth at 60fps on devices with 2GB RAM.  
- API response time for ride matching < 2 seconds under normal load.  
- Support offline mode for viewing upcoming rides (cached data).

### 4.2 Security
- All user data encrypted in transit (TLS 1.2+) and at rest (AES-256).  
- Phone numbers masked during communication.  
- OTP rate limiting.  
- Secure payment tokenization (PCI DSS compliance via third-party gateway).  
- Regular security audits.

### 4.3 Accessibility
- Support screen readers (TalkBack, VoiceOver).  
- Minimum touch target size 48x48dp.  
- Color contrast ratio at least 4.5:1 for normal text.  
- Dynamic font sizing support.

### 4.4 Localization
- Languages: English and Hindi for MVP.  
- Date/time formats according to Indian locale.  
- Currency display in ₹ (INR).

### 4.5 Device & Platform Support
- Android 8.0+ (Oreo) and iOS 13+.  
- Support for low-end devices (2GB RAM, 16GB storage).  
- Responsive for tablets (iPad) – basic layout adaptation.

---

## 5. User Flows (Reference)

Key flows are documented visually in the design phase; here are the primary ones:

### 5.1 Rider: Scheduled Carpool Booking
```
Launch App → Onboarding → Home → Plan Commute → 
Enter Work Address → Choose Recurring Schedule → 
View Matched Carpools → Select Raj’s Ride → Confirm Pickup → 
Book → Calendar Sync → Reminder → Live Tracking → Ride Complete → Payment & Rating
```
**Edge Case:** No exact match -> Suggest nearby times or “Notify me when available”.

### 5.2 Rider: On-Demand Ride
```
Home → Ride Now → Enter Destination → 
View Available Shared Rides (Carpool & Pro) → 
Select Carpool Option → Confirm Booking → 
Driver Accepts → Live Tracking → Pickup → 
May Pick Up Another Rider → Drop-off → Payment
```
**Edge Case:** No driver nearby -> Extend radius, suggest private cab with price jump.

### 5.3 Carpool Driver: Offer Daily Commute
```
Home → Offer a Seat → Set Commute Details (Home, Office, Time, Days, Seats) → 
Set Price → Publish Ride → 
Receive Rider Requests → Accept Priya → 
Day of Ride: Turn-by-Turn Pickup → Complete Trip → Automatic Payout
```

---

## 6. Design & UX Requirements

Refer to the design system and component breakdown previously discussed. Key requirements:

- **Driver type distinction:** Clear badges (Carpool vs Pro) on all ride cards and driver profiles.  
- **Home screen:** Dual primary actions (Ride Now / Plan Commute) plus upcoming ride card.  
- **Empty states:** Friendly guidance with illustrations.  
- **Error states:** Clear, actionable messages; retry buttons.  
- **Loading states:** Skeleton screens for lists, animated map for searching.  
- **Accessibility:** Follow WCAG 2.1 AA.

---

## 7. API & Data Requirements (High-Level)

### 7.1 Core Entities
- User (rider, driver, both)  
- Vehicle  
- RideOffer (carpool schedule)  
- RideRequest (booking)  
- Trip (active/completed)  
- Payment  
- Rating  
- Notification

### 7.2 Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/otp | Send OTP |
| POST | /auth/verify | Verify OTP |
| GET | /rides/available | Get available rides (on-demand or scheduled) |
| POST | /rides/book | Book a ride |
| GET | /rides/{id} | Get ride details |
| POST | /rides/{id}/cancel | Cancel a ride |
| POST | /driver/offer | Publish carpool offer |
| POST | /driver/go-online | Professional driver online |
| POST | /driver/accept | Accept a ride request |
| GET | /trips/{id}/location | Get live location of trip |
| POST | /payments/charge | Charge rider |
| POST | /payments/payout | Driver payout |
| POST | /ratings | Submit rating |

All endpoints require JWT authentication. Location data is sent via WebSockets for real-time tracking.

---

## 8. Analytics & Metrics

Track these events for product improvement:

- **Funnel events:** Signup → role selection → first ride booked → first ride completed.  
- **Ride events:** Search, view options, book, cancel, complete.  
- **Driver events:** Offer published, online, accept, complete.  
- **Safety events:** Emergency button pressed, report issue submitted.  
- **System events:** API latency, error rates, crash logs.

Use tools like Mixpanel/Amplitude for product analytics, Firebase Crashlytics for crashes.

---

## 9. Release Plan & Milestones

### Phase 1: MVP (3 months)
- Core auth, profile, verification.  
- On-demand shared ride with professional drivers only (to validate demand).  
- Scheduled carpool for riders and carpool drivers (manual matching).  
- Payments via UPI.  
- Basic safety (emergency button, trip sharing).  
- Launch in one city (Bangalore).

### Phase 2: Enhanced (3–6 months)
- Add professional driver on-demand pooled rides.  
- Automated matching algorithm improvements.  
- Recurring schedule management.  
- Wallet and driver payouts.  
- Expand to 3 more cities.

### Phase 3: Scale (6–12 months)
- Women-only mode.  
- Corporate tie-ups.  
- Advanced route optimization.  
- Multi-language support.  
- Referral program.

---

## 10. Mentor’s Note: Why This PRD Matters for Design

This PRD is your **single source of truth** before you open Figma. Every screen, component, and interaction you design must trace back to a requirement here. If a screen doesn’t serve a user story or functional requirement, it’s scope creep.  

As a senior designer, you should **always start with a PRD** (even a lightweight one) to align stakeholders and prevent design drift. You don’t need to design every feature at once—use the release plan to sequence your design sprints.  

**Next step:** Take the PRD and start designing the core screens from Phase 1. I recommend beginning with:
1. Onboarding & Role Selection  
2. Home (Rider)  
3. Ride Options List  
4. Booking Confirmation  
5. Driver Offer Seat Flow  

Once you have wireframes or high-fidelity mockups for these, I’ll review them against this PRD and our earlier design system. That’s where the real learning happens.

--- 

**End of PRD**
