# RickRide

RickRide is a unified Expo Router app for passengers, drivers, and admins in a ride-sharing platform. The frontend is built with Expo, React Native 0.81, NativeWind, Zustand, Axios, and Socket.IO, and it communicates with the Node.js backend documented in `endpoint.md`.

## Features

- OTP-based authentication with role-based routing.
- Passenger ride discovery, booking, and trip confirmation.
- Driver onboarding, status updates, and live location streaming.
- Admin dashboard and platform analytics.
- Backend-backed booking, payment, and profile flows.

## Tech Stack

- Expo / React Native
- Expo Router
- Zustand
- Axios
- Socket.IO Client
- NativeWind
- Expo Secure Store
- React Native Toast Message

## Project Structure

- `app/` - Expo Router screens and layouts.
- `components/` - Shared UI building blocks.
- `constants/` - Runtime configuration and theme tokens.
- `hooks/` - Shared data hooks.
- `services/` - API, payment, socket, and domain service wrappers.
- `store/` - Zustand session and ride state.
- `utils/` - Storage, formatting, and error helpers.

## Environment Variables

Create a `.env` file with:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
- `EXPO_PUBLIC_RAZORPAY_KEY_ID`
- `EXPO_PUBLIC_APP_ENV`

Optional:

- `EXPO_PUBLIC_SOCKET_URL`
- `EXPO_PUBLIC_API_BASE_URL`

## Setup

1. Install dependencies.
2. Configure `.env`.
3. Start Expo with `npm start`.

## Run Targets

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Backend API Overview

The frontend expects the backend to expose the REST and Socket.IO endpoints documented in `endpoint.md`, including:

- Auth: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/verify-otp`
- User and driver profile management
- Trip, booking, payment, vehicle, rating, and admin endpoints
- Driver-location Socket.IO namespace for live tracking

All protected REST requests use `Authorization: Bearer <jwt_token>`.

## Notes

- Public signup is limited to Rider and Driver.
- Map, GPS, and Razorpay finalization are still in progress and should be completed before a production release.
