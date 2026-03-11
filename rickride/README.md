# RikRide Platform

## 1. Project Overview
RikRide is a comprehensive **Carpooling + Auto Rickshaw Booking Platform** designed to connect passengers wanting to ride in Autos, shared pools, or rentals with local drivers seamlessly. The project encompasses a passenger mobile app, a driver mobile app, and a web admin dashboard—all built inside a unified Expo & React Native project using `expo-router` and styled with NativeWind.

## 2. Product Architecture
The system consists of three distinct interfaces served within a single repository via Expo Router:
- **Passenger Interface (`/app/(passenger)`)**: Mobile app layout optimized for passengers.
- **Driver Interface (`/app/(driver)`)**: Mobile app layout optimized for the driver experience and ride management.
- **Admin Dashboard (`/app/(admin)`)**: Responsive web dashboard layout to manage platform operations.
- **Authentication (`/app/(auth)`)**: Shared auth flows leading to the appropriate interface based on user roles.

## 3. Passenger App Features
- **Phone Number Authentication**: OTP-based login with a clean UI.
- **Home Dashboard**: Location picking, Ride Option selection (Auto, Pool, Rentals, Later).
- **Ride Previews**: View a map, select ride options, see promo tags, and browse recent destinations.
- **Ride Confirmation**: Detailed driver profiles (rating, model, vehicle plate) and an advanced fare breakdown.
- **Payment Toggles**: Easy switching between wallet and other payment methods.

## 4. Driver App Features
- **Multi-step Onboarding**: Streamlined collection of Personal details, Vehicle documentation (RC), Vehicle photos, and Payment info.
- **Online/Offline Toggles**: Easy status switching with clear UI indicators.
- **Live Nearby Map**: Display of active map views indicating current area and available rides.
- **Rider Requests View**: Actionable overlay cards offering acceptance or rejection of rides, showcasing distance, fare, and rider rating.

## 5. Admin Dashboard Features
- **Custom Desktop Layout**: Utilizing an always-visible sidebar menu, optimized for web or tablet displays.
- **High-level Widgets**: Track overall metrics like Total Users, Revenue, Active Drivers, and complete rides at a glance.
- **Tabular Data Views**: Data tables for ride histories, user management, and driver approvals.

## 6. Folder Structure
```
/app
  /(admin)       # Web dashboard pages
  /(auth)        # Auth & Onboarding flow
  /(driver)      # Driver app interfaces
  /(passenger)   # Passenger app interfaces
/components      # Reusable UI Blocks (AuthCard, PhoneInput, Button)
/constants       # Global setup (Theme colors)
/services        # Mock APIs simulating backend (users, drivers, rides, payments)
```

## 7. Navigation Flow
Utilizing `expo-router`:
- **Boot**: The app boots into `/(auth)` layout.
- **Routing**: Upon OTP verification, depending on user type, navigation routes to either:
  - Passenger => `/(passenger)` (Tabs)
  - Driver => `/(driver)` (Tabs)
  - Admin => `/(admin)` (Sidebar + Slot Content)

## 8. Mock Data System
The project includes a robust stub data system available at `services/mockData.ts`. It provides simulated responses for Users, Drivers, Vehicles, Trips, Bookings, Payments, and Ratings, accessed via modular service functions (e.g. `userService.getUserById`).

## 9. How to Run the Project
1. **Install Dependencies**: `npm install`
2. **Start Expo Server**: `npm start`
3. **Run Platforms**:
   - `npm run ios` for iOS Simulator
   - `npm run android` for Android Emulator
   - `npm run web` for Browser (Admin strongly recommended on Web)

## 10. Component Architecture
Components are modularized and globally styled using `tailwind.config.js` with NativeWind. New components introduced:
- **Form/Input**: `PhoneInput`, `FormInput`, `DropdownSelect`, `ColorSelector`, `UploadCard`
- **Dashboards**: `DashboardWidget`, `DataTable`
- **Cards**: `RiderCard`, `RideSummaryCard`, `PromoCard`, `DriverProfileCard`
- **UI Builders**: `LocationSelector`, `RideOptionTabs`, `StepProgressBar`
