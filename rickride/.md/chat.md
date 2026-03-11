

You are working on a **React Native Expo application and Web Admin Dashboard** for a **Carpooling + Auto Rickshaw Booking Platform**.

The system has **three separate interfaces**:

1️⃣ **Passenger Mobile App (User)**
2️⃣ **Driver Mobile App (Rickshaw Driver)**
3️⃣ **Web Admin Dashboard**

Your task is to analyze the provided prototype screens and the current project directory, then **extend and modify the existing Expo template** to match the full product requirements.

Follow the instructions carefully.

---

# STEP 1 — READ THE CURRENT PROJECT

1. Scan and analyze the entire project directory.

2. Identify:

* Existing folder structure
* Prebuilt UI components
* Existing layouts and screens
* Navigation structure
* Reusable utilities
* Theme configuration

3. Reuse existing components wherever possible.

4. Avoid rewriting components if they can be reused or extended.

5. Maintain the current coding style and architecture.

---

# STEP 2 — ANALYZE PROTOTYPE UI SCREENS (VERY IMPORTANT)

Carefully analyze the provided prototype images and extract **detailed UI architecture**.

The prototypes include **five major flows**:

### 1️⃣ USER LOGIN / AUTHENTICATION

Screen: **Welcome to RikRide**

UI Elements:

* Illustration avatar
* Phone number input
* Country code selector
* OTP authentication
* Terms & privacy text
* "Send OTP" button

React Native Components:

* TextInput
* Button
* CountryCodeSelector
* AuthCard
* IllustrationHeader

Flow:

```
Launch App
→ Enter Phone Number
→ Send OTP
→ Verify OTP
→ Go to Home Screen
```

---

### 2️⃣ USER HOME / RIDE SEARCH SCREEN

Screen: **Where to?**

Main Features:

* Current location display
* Pickup location input
* Destination input
* Ride options

Ride Options Tabs:

* Auto
* Pool
* Rentals
* Later

UI Components:

* LocationSelector
* RideOptionTabs
* DestinationInput
* FindRideButton
* RecentTripsList
* PromoCard

Sections:

```
Header
Location Selector
Ride Type Tabs
Pickup Input
Destination Input
Find Rickshaw Button
Recent Trips
Promo Offers
Bottom Navigation
```

Navigation Tabs:

```
Home
Activity
Wallet
Account
```

---

### 3️⃣ DRIVER ONBOARDING SCREEN

Screen: **Vehicle Details**

Driver onboarding requires multiple steps.

Step Progress Indicator:

```
Personal → Vehicle → Payment
```

Vehicle Form Fields:

* Vehicle Type (Auto Rickshaw / Car)
* Vehicle Model
* License Plate Number
* Vehicle Color

Document Upload:

* RC Front
* RC Back

Vehicle Photo Upload:

* Front photo
* Back photo

Components:

* StepProgressBar
* FormInput
* DropdownSelect
* ColorSelector
* UploadCard
* ImageUploader

CTA Button:

```
Continue
```

---

### 4️⃣ DRIVER NEARBY RIDE MAP SCREEN

Screen shows:

* Live map
* Nearby riders
* Ride request
* Fare estimate
* Rider profile card

UI Components:

* MapView
* DriverStatusIndicator
* RiderCard
* FareTag
* BookRideButton

Information Displayed:

```
Driver profile
Rating
Vehicle type
Distance
ETA
Available seats
Price
```

Example Card:

```
Driver: Ramesh Kumar
Vehicle: Bajaj RE Compact
Distance: 2.4 km
Time: 12 min
Seats: 3
Fare: ₹45
```

---

### 5️⃣ RIDE CONFIRMATION SCREEN

Screen: **Confirm Your Ride**

Elements:

* Route map
* Pickup location
* Drop location
* Driver information
* Driver rating
* Vehicle number
* Payment method
* Fare breakdown

Fare Calculation:

```
Base Fare
Distance Fare
Taxes
Total Amount
```

CTA Button:

```
Confirm & Pay Now
```

Components:

* MapPreview
* RideSummaryCard
* DriverProfileCard
* PaymentToggle
* FareBreakdown
* ConfirmRideButton

---

# STEP 3 — SYSTEM ARCHITECTURE

The platform includes **3 systems**.

---

# 1️⃣ PASSENGER MOBILE APP

Features:

* OTP Login
* Book Rickshaw
* Book Carpool
* Schedule rides
* View nearby drivers
* Trip history
* Wallet
* Payment methods
* Safety tips

Main Screens:

```
Login
Home
Ride Search
Ride Confirmation
Activity
Wallet
Tips
Profile
```

---

# 2️⃣ DRIVER MOBILE APP

Driver features:

* Driver onboarding
* Vehicle registration
* Document upload
* Online / Offline status
* Accept / Reject ride
* Live navigation
* Earnings dashboard
* Ride history

Driver Screens:

```
Driver Login
Onboarding
Driver Dashboard
Ride Requests
Active Ride
Ride Completion
Earnings
Driver Profile
```

---

# 3️⃣ ADMIN WEB DASHBOARD

Admin dashboard should be built using **React + Next.js**.

Admin Features:

* View all users
* View all drivers
* Approve driver documents
* Manage rides
* Monitor live rides
* Revenue analytics
* Payment records
* Support tickets

Admin Pages:

```
Admin Login
Dashboard
Users
Drivers
Ride Management
Payments
Analytics
Support
Settings
```

Dashboard Widgets:

```
Total Users
Active Drivers
Completed Rides
Revenue
Live Rides Map
```

---

# STEP 4 — MOCK DATA

A `.md` file will provide mock data.

Use it to simulate:

* rides
* drivers
* users
* locations
* payments
* trip history

Create mock service files:

```
services/rideService.js
services/userService.js
services/paymentService.js
services/driverService.js
```

These should simulate API behavior.

---

# STEP 5 — NAVIGATION STRUCTURE

Use **React Navigation**.

Passenger App Navigation:

Bottom Tabs:

```
Home
Activity
Wallet
Tips
Profile
```

Driver App Navigation:

```
Dashboard
Ride Requests
Earnings
Profile
```

Auth Stack:

```
Login
OTP
Onboarding
```

---

# STEP 6 — COMPONENT STRUCTURE

Use reusable UI components.

Example:

```
components/

RideCard
DriverCard
ActivityCard
PaymentCard
PromoCard
TipCard
LocationSelector
UploadCard
FareBreakdown
StatusBadge
```

Components must be:

* reusable
* modular
* responsive
* consistent with the prototype UI

---

# STEP 7 — STYLING

Implement a **global theme system**.

Example:

```
constants/theme.js
```

Theme includes:

```
primary color
secondary color
background colors
card colors
text colors
border radius
spacing
```

Follow the **dark modern ride-hailing UI style** seen in the prototypes.

---

# STEP 8 — PROJECT STRUCTURE

Maintain a scalable architecture.

```
/app

/screens
/auth
/home
/ride
/activity
/wallet
/profile
/driver
/admin

/components

/navigation

/constants

/services

/hooks

/utils

/assets
```

---

# STEP 9 — DOCUMENTATION

Create a **complete README.md** including:

1. Project Overview
2. Product Architecture
3. Passenger App Features
4. Driver App Features
5. Admin Dashboard Features
6. Folder Structure
7. Navigation Flow
8. Mock Data System
9. How to Run the Project
10. Component Architecture

Also document:

* new components created
* changes to navigation
* layout modifications
* design system implementation

---

# STEP 10 — CODE QUALITY

Ensure:

* clean React Native code
* functional components
* proper hooks
* reusable components
* modular services
* readable file structure
* comments for complex logic

---

# FINAL OBJECTIVE

After analyzing:

* project directory
* prototype screens
* mock data

Build a **complete production-ready platform including**:

✔ Passenger mobile app
✔ Driver mobile app
✔ Admin web dashboard

Deliverables:

* working mobile screens
* driver onboarding flow
* ride booking system
* reusable components
* navigation system
* mock backend services
* admin dashboard
* complete documentation

Do not produce partial implementation.

Build a **clean, scalable production-ready architecture.**
