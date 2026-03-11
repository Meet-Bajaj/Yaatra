## User

id (PK, UUID)
email (unique)
full_name
phone_number (optional)
profile_picture_url
role (enum: student, admin)
created_at
updated_at
last_login_at
consent_location (bool)

## Vehicle

id (PK, UUID)
user_id (FK → User.id) // owner/driver
make
model
year
license_plate
color
photo_url
created_at

## Ride

id (PK, UUID)
driver_id (FK → User.id)
vehicle_id (FK → Vehicle.id, nullable) // driver may not have entered vehicle yet
origin_campus (string, e.g., "College Campus")
destination_name (string, e.g., "Delhi")
destination_place_id (string) // Google Place ID
destination_lat (float)
destination_lng (float)
departure_datetime (timestamp with tz)
available_seats (int)
price_per_seat (decimal, optional)
notes (text)
status (enum: open, full, cancelled, completed)
created_at
updated_at

## RideRequest

id (PK, UUID)
ride_id (FK → Ride.id)
rider_id (FK → User.id)
requested_at (timestamp)
status (enum: pending, accepted, rejected, cancelled)
seat_count (int)
message (text) // optional note from rider

## RideMessage (chat)

id (PK, UUID)
ride_id (FK → Ride.id)
sender_id (FK → User.id)
content (text)
sent_at (timestamp)
is_system (bool) // e.g., “Driver accepted your request”

## Rating

id (PK, UUID)
ride_id (FK → Ride.id)
rater_id (FK → User.id) // who gave the rating
ratee_id (FK → User.id) // who got rated (driver or rider)
score (int, 1‑5)
comment (text, optional)
created_at

## Notification

id (PK, UUID)
user_id (FK → User.id)
type (enum: request_accepted, request_rejected, ride_reminder, admin_message, …)
payload (jsonb)
read_at (timestamp, nullable)
created_at
---

# NEW
## 📋  Summary Tables for **All Mongoose Schemas**  

Below you’ll find a **markdown table for each model** used in the RikRide back‑end.  
Each table lists:

| **Field** | **Type** | **Required?** | **Default / Validation** | **Description / Notes** |
|-----------|----------|---------------|--------------------------|--------------------------|

The tables are ordered in the same way the files appear in `src/models/`.  
After the tables you’ll also see a **quick “Indexes” reference** for every collection.

---

### 1️⃣ `User` (src/models/User.js)

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – | Primary key (Mongo) |
| `phone` | String | ✅ | `unique`, `trim` | Mobile number used for OTP login (E.164 format) |
| `name` | String | ✅ | – | Full name of the user |
| `email` | String | ❌ | `lowercase`, `trim` | Optional e‑mail address |
| `password` | String | ❌ | `select:false` | Hashed password (if you also support password‑login) |
| `role` | String | ✅ | enum: `['rider','driver','admin']`, default **`rider`** | Determines access rights |
| `walletBalance` | Number | ❌ | default **0** | Cash‑less wallet (₹) |
| `rating` | Number | ❌ | default **0**, min 0, max 5 | Average star rating (computed from `Rating`) |
| `avatarUrl` | String | ❌ | – | URL to profile picture |
| `fcmToken` | String | ❌ | – | Firebase Cloud Messaging token for push notifications |
| `isActive` | Boolean | ❌ | default **true** | Soft‑delete flag (used by admin) |
| `isDeleted` | Boolean | ❌ | default **false** | Soft‑delete flag |
| `createdAt` | Date | ✅ (auto) | – | Timestamp (Mongo) |
| `updatedAt` | Date | ✅ (auto) | – | Timestamp (Mongo) |
| **Virtual** `driverProfile` | – | – | – | Populated from `Driver` (`ref:'Driver'`) – handy to fetch driver data when the user is also a driver |

**Indexes** – `phone` (unique), `role` (sparse), timestamps (default).

---

### 2️⃣ `Driver` (src/models/Driver.js)

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `user` | ObjectId (ref `User`) | ✅ | unique – each user can have at most one driver profile |
| `vehicle` | ObjectId (ref `Vehicle`) | ❌ | – |
| `status` | String | ✅ | enum: `['offline','online','onTrip']`, default **`offline`** |
| `location` | GeoJSON Point | ✅ | `{ type:'Point', coordinates:[0,0] }` – live GPS (lng,lat) |
| `operatingZone` | GeoJSON Polygon | ❌ | Optional – polygon that limits where an auto‑rickshaw can operate |
| `kyc.status` | String | ✅ | enum: `['pending','verified','rejected']`, default **`pending`** |
| `kyc.rejectedReason` | String | ❌ | – |
| `totalRides` | Number | ❌ | default **0** |
| `earnings` | Number | ❌ | default **0** (₹) |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**Indexes** – `location` (`2dsphere`), `operatingZone` (`2dsphere`), `status`.

---

### 3️⃣ `Vehicle` (src/models/Vehicle.js)

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `driver` | ObjectId (ref `Driver`) | ✅ | unique – each driver owns exactly one vehicle record |
| `type` | String | ✅ | enum: `['CAR','RICKSHAW']` |
| `registrationNumber` | String | ✅ | `unique`, `trim` – e.g., “MH12AB1234” |
| `capacity` | Number | ✅ | Min 1 – number of seats including driver |
| `rcDocUrl` | String | ❌ | URL to uploaded RC (registration certificate) |
| `insuranceDocUrl` | String | ❌ | URL to uploaded insurance document |
| `photoUrl` | String | ❌ | Vehicle photo |
| `make` | String | ❌ | Car make (e.g., “Toyota”) |
| `model` | String | ❌ | Car model (e.g., “Corolla”) |
| `year` | Number | ❌ | Manufacture year (≥ 1900) |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**Indexes** – `registrationNumber` (unique).

---

### 4️⃣ `Trip` (src/models/Trip.js) – *Car‑pool offering created by a driver*

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `driver` | ObjectId (ref `Driver`) | ✅ | – |
| `origin` | **Embedded** <br>• `type` = `"Point"` <br>• `coordinates` = `[lng, lat]` <br>• `address` (String) | ✅ | – | Starting point of the pool |
| `destination` | **Embedded** (same shape as `origin`) | ✅ | – | End point |
| `distanceKm` | Number | ✅ | – | Approx. road distance (km) – calculated when the trip is created |
| `departureTime` | Date | ✅ | – | When the driver intends to leave |
| `totalSeats` | Number | ✅ | Min 1 | Seats **excluding** driver (i.e., passenger capacity) |
| `pricePerSeat` | Number | ✅ | Min 0 | Flat fare each passenger pays |
| `seatsBooked` | Number | ❌ | default **0** | Seats already taken (incremented on booking) |
| `status` | String | ✅ | enum: `['OPEN','FULL','ONGOING','COMPLETED','CANCELLED']`, default **`OPEN`** |
| `notes` | String | ❌ | – | Optional free‑text (e.g., “no pets”) |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**Indexes** – `origin` (`2dsphere`), `departureTime`, `status`.

---

### 5️⃣ `Booking` (src/models/Booking.js) – *Either a seat in a car‑pool or an instant auto‑rickshaw ride*

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `rider` | ObjectId (ref `User`) | ✅ | – |
| `trip` | ObjectId (ref `Trip`) | ❌ | One of `trip` **or** `autoDriver` must be present |
| `autoDriver` | ObjectId (ref `Driver`) | ❌ | – |
| `seats` | Number | ❌ | default **1**, Min 1 (only for car‑pool) |
| `fare` | Number | ✅ | Min 0 – total amount the rider pays |
| `paymentMethod` | String | ✅ | enum: `['RAZORPAY','CASH','WALLET'] |
| `paymentReference` | String | ❌ | e.g., Razorpay order ID or cash receipt number |
| `status` | String | ✅ | enum: `['PENDING','CONFIRMED','CANCELLED','COMPLETED','REFUNDED']`, default **`PENDING`** |
| `driverAcceptedAt` | Date | ❌ | Timestamp when driver accepted (auto‑booking) |
| `completedAt` | Date | ❌ | When ride finished |
| `cancelledAt` | Date | ❌ | When booking was cancelled |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**Indexes** – `rider`, `status`, `trip`, `autoDriver`.

---

### 6️⃣ `Payment` (src/models/Payment.js)

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `booking` | ObjectId (ref `Booking`) | ✅ | unique – one payment per booking |
| `amount` | Number | ✅ | Min 0 – amount in INR |
| `gateway` | String | ✅ | enum: `['RAZORPAY','PAYTM','STRIPE']` |
| `gatewayTransactionId` | String | ✅ | Unique ID returned by the payment provider |
| `status` | String | ✅ | enum: `['CREATED','CAPTURED','FAILED','REFUNDED']`, default **`CREATED`** |
| `rawResponse` | Mixed (Object) | ❌ | Stores the raw gateway callback for audit |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**Indexes** – `gatewayTransactionId` (unique).

---

### 7️⃣ `Rating` (src/models/Rating.js)

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `fromUser` | ObjectId (ref `User`) | ✅ | – (who gave the rating) |
| `toUser` | ObjectId (ref `User`) | ✅ | – (who received it) |
| `rating` | Number | ✅ | integer 1‑5 |
| `comment` | String | ❌ | Optional free‑text feedback |
| `trip` | ObjectId (ref `Trip`) | ❌ | Optional – the trip the rating is about |
| `booking` | ObjectId (ref `Booking`) | ❌ | Optional – the booking the rating is about |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**Indexes** – Compound unique index on `(fromUser, toUser, trip, booking)` to prevent duplicate ratings for the same ride.

---

### 8️⃣ `OTP` (src/models/OTP.js)

| Field | Type | Required? | Default / Validation | Description |
|-------|------|-----------|----------------------|-------------|
| `_id` | ObjectId | ✅ (auto) | – |
| `phone` | String | ✅ | Index for quick lookup |
| `code` | String | ✅ | 6‑digit numeric OTP (stored as a string) |
| `expiresAt` | Date | ✅ | TTL – after expiration document is auto‑deleted |
| `used` | Boolean | ❌ | default **false** – set to true after successful verification |
| `createdAt` | Date | ✅ (auto) | – |
| `updatedAt` | Date | ✅ (auto) | – |

**TTL Index** – `{ expiresAt: 1 }` with `expireAfterSeconds: 0` (Mongo automatically removes the document once `expiresAt` passes).

---

## 📌  Index Summary (per collection)

| Collection | Indexed Fields | Index Type | Notes |
|------------|----------------|------------|-------|
| **users** | `phone` (unique) <br> `role` (sparse) | Single field | Used for login & role filtering |
| **drivers** | `location` (2dsphere) <br> `operatingZone` (2dsphere) <br> `status` | Geospatial + normal | Enables nearest‑driver queries |
| **vehicles** | `registrationNumber` (unique) | Single field | Prevent duplicate vehicle entries |
| **trips** | `origin` (2dsphere) <br> `departureTime` <br> `status` | Geospatial + normal | Fast “find trips near me & within time window” |
| **bookings** | `rider` <br> `status` <br> `trip` <br> `autoDriver` | Single field | Quick look‑ups for a rider’s history |
| **payments** | `gatewayTransactionId` (unique) | Single field | Idempotent handling of gateway callbacks |
| **ratings** | Compound `{ fromUser, toUser, trip, booking }` (unique) | Compound unique | Guarantees one rating per ride |
| **otps** | `expiresAt` (TTL) <br> `phone` (index) | TTL + normal | Auto‑expire OTPs after 5 min |

---
