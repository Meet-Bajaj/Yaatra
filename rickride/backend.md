# RickRide Backend Documentation

## Project Description & Purpose
RickRide is a specialized carpooling and auto-rickshaw booking platform. The backend is designed using Node.js and Express to be the robust, highly-scalable API powering the mobile/web applications. It handles user authentication, real-time driver tracking, ride matching via geospatial queries, trip lifecycle management, and secure payment processing. 

The architecture is built heavily around RESTful patterns and leverages WebSockets for live location streaming. MongoDB is utilized as the primary database, enforcing schema validations and optimizing location-based searches via GeoJSON `2dsphere` indexes.

---

## Directory & File Structure
```
backend/
├── config/              # Configuration logic 
│   └── db.js            # MongoDB connection logic
├── controllers/         # Core business logic processing incoming HTTP requests
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── booking.controller.js
│   ├── driver.controller.js
│   ├── payment.controller.js
│   ├── rating.controller.js
│   ├── trip.controller.js
│   ├── user.controller.js
│   └── vehicle.controller.js
├── middlewares/         # Express interceptors for security and formatting
│   ├── asyncHandler.js  # Promise wrapper catching unhandled route exceptions
│   ├── authMiddleware.js# Verifies JWT signatures
│   ├── errorHandler.js  # Normalizes arbitrary errors and Mongoose exceptions
│   ├── rateLimiter.js   # Prevents DDoS and brute-force attacks via express-rate-limit
│   ├── roleMiddleware.js# RBAC allowing subset access (e.g. ['admin', 'driver'])
│   └── validate.js      # Wrapper for express-validator schemas
├── models/              # Mongoose Object Data Modeling architectures
│   ├── booking.js
│   ├── driver.js
│   ├── otp.js
│   ├── payment.js
│   ├── rating.js
│   ├── trip.js
│   ├── users.js
│   └── vehicle.js
├── routes/              # Express Router mappings binding URLs to Controllers
│   ├── index.js         # Base router aggregator
│   └── *.routes.js      # Domain specific endpoints definitions (with JSDoc schemas)
├── service/             # Abstraction layer for external SDKs and complex algorithms
│   ├── auth.service.js      # Twilio integration and OTP mapping
│   ├── geo.service.js       # Mathematical distance calculators (Haversine) and Fare estimation
│   ├── matching.service.js  # Mongoose $near driver isolation wrapper
│   ├── notification.service.js # Firebase Cloud Messaging (FCM) wrappers
│   └── payment.service.js   # Razorpay Gateway abstractions and Hash validators
├── sockets/             # Real-time WebSocket namespaces
│   └── location.socket.js   # Driver tracking emit/broadcast multiplexer
├── utils/               # Generic Helper Functions
│   ├── constants.js     # Exact DB schema Enum mappings
│   ├── jwt.js           # Crypto token generation methods
│   ├── logger.js        # Winston console and file rotation configuration
│   ├── otp.js           # Random digit generation logic
│   └── upload.js        # AWS S3 Multer abstraction layer
├── swagger.js           # OpenAPI documentation bootstrap
├── server.js            # Node HTTP/Socket/Express initialization entrypoint
└── package.json         # NPM manifest and script runner
```

---

## Explanation of Major Components

1. **Routing Layer (`/routes`)**: Maps public URL endpoints correctly to their target controllers. Highly integrated with Swagger JSDoc injecting real-time OpenAPI interfaces describing exact `requestBody` JSON payloads.
2. **Controller Layer (`/controllers`)**: Holds the specific REST logic (e.g., `createBooking`, `verifyPayment`, `updateLocation`). They interface directly with MongoDB schemas.
3. **Database Schemas (`/models`)**: Defines structure, relationships (via `ref`), and enums. Uses standard Data hooks and `timestamps`.
4. **Service Abstractions (`/service`)**: Used to decouple heavy 3rd party SDKs from standard DB controller logic. Controllers call services like `notification.service.js` which inherently decide if FCM is valid, or fallback to dev console logs safely.
5. **WebSocket Layer (`/sockets`)**: Allows an ephemeral map-tracking connection. `location.socket.js` allows a driver to safely push their active state, and natively broadcasts only to passengers mapped dynamically inside tracking `rooms`.
6. **Middleware Shields (`/middlewares`)**: Centralizes the validation sequence of any secure routes. They ensure only verified `req.user` identities proceed by enforcing JWT header decryption immediately upon pinging the server.

---

## Setup & Usage Instructions

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Database (Local instance or Atlas URI)
- Redis (Local instance or Atlas URI)
- Git

### 2. Installation
Clone the repository and jump into the directory:
```bash
npm install
```

### 3. Environment Mapping
Create a `.env` file at the root of `backend/` utilizing the `env.md` guide. Ensure `MONGO_URI` is mapped correctly.

### 4. Running the Server

**For Development (Live reloading enabled):**
```bash
npm run dev
```

**For Production (Background context):**
```bash
npm start
```

### 5. Accessing Developer Interfaces
- **API Swagger Documentation**: Auto-hosts interface at `http://localhost:5000/api-docs`
- **Application Port**: `5000` default.

---

## Dependencies & Core Technologies
- `express`: Core routing web framework.
- `mongoose`: Native Mongo Object Data structure handler.
- `jsonwebtoken`: Standard authorization parameter encryption.
- `socket.io`: Bidirectional real-time architecture (for driver locations).
- `multer` & `@aws-sdk/client-s3`: S3 streaming bucket management.
- `firebase-admin`: Cross-platform push notifications wrapper.
- `razorpay`: Core active payment gateway pipeline.
- `winston` & `winston-daily-rotate-file`: Stream logging outputs away from core terminal.
- `swagger-jsdoc` & `swagger-ui-express`: API documentation generators natively inside code.
- `express-rate-limit` & `helmet`: Base security DDoS fallback interceptors.
- `Redis` : For caching and rate limiting
