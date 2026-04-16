# RickRide API Endpoints

## Base URLs
- API base: /api/v1
- Swagger UI: /api-docs
- Swagger JSON: /api-docs.json

## Common Response Format

### Success envelope
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {}
}
```

Notes:
- data is present when the endpoint returns a payload.
- meta is present for paginated/list responses.

### Error envelope
```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    {
      "field": "phone",
      "message": "Invalid value",
      "value": "abc"
    }
  ]
}
```

Possible status codes used in project:
- 200, 201, 400, 401, 403, 404, 409, 500

## Authentication
- Protected endpoints require header:
  - Authorization: Bearer <jwt_token>

---

## System Endpoints

### GET /
- Auth: No
- Purpose: API status
- Request body: None
- Success response
```json
{
  "success": true,
  "message": "RickRide API is running",
  "data": {
    "docs": "/api-docs",
    "health": "/health"
  }
}
```

### GET /health
- Auth: No
- Purpose: Health check
- Request body: None
- Success response
```json
{
  "success": true,
  "message": "Service healthy",
  "data": {
    "uptime": 123.45,
    "environment": "development"
  }
}
```

### GET /uploads/:filename
- Auth: No
- Purpose: Serve uploaded file from public/uploads
- Request body: None
- Success response: Raw file stream

---

## Auth Endpoints

### POST /api/v1/auth/register
- Auth: No
- Accepted request model
```json
{
  "phone": "string (required)",
  "name": "string (optional)",
  "email": "string email (optional)",
  "password": "string min 8 (optional)",
  "role": "rider|driver (optional)"
}
```
- Sample request
```json
{
  "phone": "+919999999999",
  "name": "Meet B",
  "email": "meet@example.com",
  "password": "StrongPass123",
  "role": "rider"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "phone": "+919999999999",
      "name": "Meet B",
      "email": "meet@example.com",
      "role": "rider"
    },
    "token": "jwt_token"
  }
}
```

### POST /api/v1/auth/login
- Auth: No
- Accepted request model
```json
{
  "phone": "string (required)"
}
```
- Sample request
```json
{
  "phone": "+919999999999"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "+919999999999",
    "delivery": "twilio-verify"
  }
}
```

### POST /api/v1/auth/verify-otp
- Auth: No
- Accepted request model
```json
{
  "phone": "string (required)",
  "code": "string length 4-6 (required)"
}
```
- Sample request
```json
{
  "phone": "+919999999999",
  "code": "123456"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "phone": "+919999999999",
      "role": "rider"
    },
    "token": "jwt_token"
  }
}
```

---

## Admin Endpoints

### GET /api/v1/admin/stats
- Auth: Yes (admin only)
- Request body: None
- Success response (200)
```json
{
  "success": true,
  "message": "Admin stats retrieved successfully",
  "data": {
    "totalUsers": 120,
    "totalDrivers": 60,
    "totalTrips": 500,
    "totalBookings": 420,
    "totalPayments": 390
  }
}
```

---

## User Endpoints

### GET /api/v1/user/profile
- Auth: Yes
- Request body: None
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "_id": "user_id",
    "name": "Meet B",
    "phone": "+919999999999",
    "email": "meet@example.com",
    "role": "rider",
    "fcmToken": "optional_token"
  }
}
```

### PUT /api/v1/user/profile
- Auth: Yes
- Accepted request model
```json
{
  "name": "string 2-100 (optional)",
  "email": "string email (optional)",
  "avatarUrl": "valid URL (optional)",
  "fcmToken": "string non-empty (optional)"
}
```
- Sample request
```json
{
  "name": "Meet B",
  "avatarUrl": "https://cdn.example.com/avatar.jpg",
  "fcmToken": "fcm_registration_token"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "User profile updated",
  "data": {
    "_id": "user_id",
    "name": "Meet B",
    "avatarUrl": "https://cdn.example.com/avatar.jpg",
    "fcmToken": "fcm_registration_token"
  }
}
```

---

## Driver Endpoints

### POST /api/v1/driver/profile
- Auth: Yes (driver/admin)
- Accepted request model
```json
{
  "userId": "mongoId (optional, admin use)",
  "licenseNumber": "string (required)",
  "operatingZone": "string (optional)",
  "vehicleId": "mongoId|null (optional)"
}
```
- Sample request
```json
{
  "licenseNumber": "DL-123456789",
  "operatingZone": "Ahmedabad-West",
  "vehicleId": "vehicle_id"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "Driver profile saved successfully",
  "data": {
    "_id": "driver_id",
    "userId": {
      "_id": "user_id",
      "name": "Driver Name"
    },
    "licenseNumber": "DL-123456789",
    "operatingZone": "Ahmedabad-West",
    "vehicle": {
      "_id": "vehicle_id"
    }
  }
}
```

### GET /api/v1/driver/profile
- Auth: Yes (driver/admin)
- Query model
```json
{
  "userId": "mongoId (optional, admin use)"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "_id": "driver_id",
    "status": "online",
    "location": {
      "type": "Point",
      "coordinates": [72.57, 23.02]
    }
  }
}
```

### PUT /api/v1/driver/location
- Auth: Yes (driver/admin)
- Accepted request model
```json
{
  "driverId": "mongoId (optional)",
  "longitude": "number between -180 and 180 (required)",
  "latitude": "number between -90 and 90 (required)",
  "status": "offline|online|onTrip (optional)"
}
```
- Sample request
```json
{
  "longitude": 72.5714,
  "latitude": 23.0225,
  "status": "online"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Driver location updated",
  "data": {
    "_id": "driver_id",
    "status": "online",
    "location": {
      "type": "Point",
      "coordinates": [72.5714, 23.0225]
    }
  }
}
```

### PUT /api/v1/driver/status
- Auth: Yes (driver/admin)
- Accepted request model
```json
{
  "driverId": "mongoId (optional)",
  "status": "offline|online|onTrip (required)"
}
```
- Sample request
```json
{
  "status": "onTrip"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Driver status updated",
  "data": {
    "_id": "driver_id",
    "status": "onTrip"
  }
}
```

### GET /api/v1/driver/nearby
- Auth: Yes
- Query model
```json
{
  "longitude": "number required",
  "latitude": "number required",
  "radiusKm": "number optional (0.1-100)",
  "limit": "int optional (1-50)"
}
```
- Example query
- /api/v1/driver/nearby?longitude=72.57&latitude=23.02&radiusKm=5&limit=10
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "_id": "driver_id",
      "status": "online",
      "distanceKm": 1.2
    }
  ],
  "meta": {
    "count": 1,
    "radiusKm": 5,
    "limit": 10
  }
}
```

---

## Vehicle Endpoints

### POST /api/v1/vehicle/register
- Auth: Yes (driver/admin)
- Accepted request model
```json
{
  "driverId": "mongoId (optional)",
  "type": "CAR|RICKSHAW (required)",
  "registrationNumber": "string (optional if reg_number provided)",
  "reg_number": "string (optional alias)",
  "capacity": "int >=1 (optional if capicity provided)",
  "capicity": "int >=1 (optional alias)",
  "rcDocUrl": "valid URL (optional)",
  "insuranceDocUrl": "valid URL (optional)",
  "photoUrl": "valid URL (optional)",
  "make": "string (optional)",
  "model": "string (optional)",
  "year": "int 1980-2100 (optional)"
}
```
- Sample request
```json
{
  "type": "RICKSHAW",
  "registrationNumber": "GJ01AB1234",
  "capacity": 3,
  "make": "Bajaj",
  "model": "RE Compact"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "Vehicle registered successfully",
  "data": {
    "_id": "vehicle_id",
    "driver": "driver_id",
    "type": "RICKSHAW",
    "registrationNumber": "GJ01AB1234",
    "capacity": 3
  }
}
```

### GET /api/v1/vehicle/:id
- Auth: No
- Path params
```json
{
  "id": "mongoId"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "_id": "vehicle_id",
    "type": "RICKSHAW",
    "registrationNumber": "GJ01AB1234",
    "capacity": 3,
    "driver": {
      "_id": "driver_id",
      "userId": {
        "name": "Driver Name",
        "phone": "+919999999999"
      }
    }
  }
}
```

---

## Trip Endpoints

### POST /api/v1/trip
- Auth: Yes (driver/admin)
- Accepted request model
```json
{
  "driverId": "mongoId (optional)",
  "origin": ["longitude", "latitude"],
  "destination": ["longitude", "latitude"],
  "distance": "number >0 and <=5000",
  "departureTime": "ISO date-time (optional if dipartureTime present)",
  "dipartureTime": "ISO date-time legacy alias (optional)",
  "totalSeats": "int between 1 and 8",
  "pricePerSeat": "number >=0",
  "notes": "string (optional)"
}
```
- Sample request
```json
{
  "origin": [72.5714, 23.0225],
  "destination": [72.6369, 23.2156],
  "distance": 12.5,
  "departureTime": "2026-04-16T18:30:00.000Z",
  "totalSeats": 3,
  "pricePerSeat": 80,
  "notes": "Pickup near metro gate"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "_id": "trip_id",
    "driver": "driver_id",
    "origin": { "type": "Point", "coordinates": [72.5714, 23.0225] },
    "destination": { "type": "Point", "coordinates": [72.6369, 23.2156] },
    "distance": 12.5,
    "totalSeats": 3,
    "availableSeats": 3,
    "pricePerSeat": 80,
    "status": "open"
  }
}
```

### GET /api/v1/trip
- Auth: No
- Query model
```json
{
  "status": "open|full|ongoing|completed|cancelled (optional)",
  "driverId": "mongoId (optional)",
  "page": "int >=1 (optional)",
  "limit": "int 1-100 (optional)"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "_id": "trip_id",
      "status": "open",
      "departureTime": "2026-04-16T18:30:00.000Z"
    }
  ],
  "meta": {
    "count": 1,
    "total": 20,
    "page": 1,
    "totalPages": 20
  }
}
```

### GET /api/v1/trip/:id
- Auth: No
- Path params
```json
{
  "id": "mongoId"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "_id": "trip_id",
    "driver": {
      "_id": "driver_id"
    },
    "status": "open"
  }
}
```

### PUT /api/v1/trip/:id/status
- Auth: Yes (driver/admin)
- Accepted request model
```json
{
  "status": "open|full|ongoing|completed|cancelled"
}
```
- Sample request
```json
{
  "status": "ongoing"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Trip status updated",
  "data": {
    "_id": "trip_id",
    "status": "ongoing"
  }
}
```

---

## Booking Endpoints

### POST /api/v1/booking
- Auth: Yes
- Accepted request model
```json
{
  "riderId": "mongoId (optional, admin only)",
  "tripId": "mongoId (optional if autoDriverId provided)",
  "autoDriverId": "mongoId (optional if tripId provided)",
  "seats": "int >=1 (optional, default 1)",
  "fare": "number >=0 (optional for trip booking, required for direct driver booking)",
  "paymentMethod": "RAZORPAY|CASH|WALLET (required)"
}
```
- Sample request
```json
{
  "tripId": "trip_id",
  "seats": 2,
  "paymentMethod": "RAZORPAY"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "booking_id",
    "rider": "user_id",
    "trip": "trip_id",
    "seats": 2,
    "fare": 160,
    "paymentMethod": "RAZORPAY",
    "status": "pending"
  }
}
```

### GET /api/v1/booking/:id
- Auth: Yes
- Path params
```json
{
  "id": "mongoId"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "_id": "booking_id",
    "rider": {
      "_id": "user_id",
      "name": "Rider Name"
    },
    "trip": {
      "_id": "trip_id"
    },
    "status": "pending"
  }
}
```

### POST /api/v1/booking/:id/cancel
- Auth: Yes
- Path params
```json
{
  "id": "mongoId"
}
```
- Request body: None
- Success response (200)
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "booking_id",
    "status": "cancelled",
    "cancelledAt": "2026-04-16T10:00:00.000Z"
  }
}
```

---

## Payment Endpoints

### POST /api/v1/payment/create
- Auth: Yes
- Accepted request model
```json
{
  "bookingId": "mongoId (required)",
  "amount": "number >=0 (optional, defaults booking fare)",
  "gateway": "RAZORPAY|CASH|WALLET (optional)"
}
```
- Sample request
```json
{
  "bookingId": "booking_id",
  "gateway": "RAZORPAY"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment": {
      "_id": "payment_id",
      "booking": "booking_id",
      "amount": 160,
      "gateway": "RAZORPAY",
      "status": "pending"
    },
    "gateway": {
      "provider": "razorpay",
      "keyId": "rzp_test_xxx",
      "order": {
        "id": "order_xxx",
        "amount": 16000,
        "currency": "INR"
      }
    }
  }
}
```

### POST /api/v1/payment/verify
- Auth: Yes
- Accepted request model
```json
{
  "paymentId": "mongoId (required)",
  "gatewayTransactionId": "string (optional)",
  "status": "pending|completed|failed (optional)",
  "razorpayOrderId": "string (optional)",
  "razorpayPaymentId": "string (optional)",
  "razorpaySignature": "string (optional)"
}
```
- Sample request (Razorpay)
```json
{
  "paymentId": "payment_id",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "_id": "payment_id",
    "status": "completed",
    "gatewayTransactionId": "pay_xxx"
  }
}
```

### POST /api/v1/payment/webhook
- Auth: No (secured by Razorpay signature header)
- Headers
```json
{
  "x-razorpay-signature": "required"
}
```
- Body: Raw Razorpay webhook payload (application/json)
- Success response (200)
```json
{
  "success": true,
  "message": "Webhook received successfully"
}
```

---

## Rating Endpoints

### POST /api/v1/rating
- Auth: Yes
- Accepted request model
```json
{
  "driverId": "mongoId (required)",
  "rating": "int between 1 and 5 (required)",
  "comment": "string max 500 (optional)",
  "tripId": "mongoId (optional)",
  "bookingId": "mongoId (optional)"
}
```
- Sample request
```json
{
  "driverId": "driver_id",
  "rating": 5,
  "comment": "Very good ride",
  "tripId": "trip_id"
}
```
- Success response (201)
```json
{
  "success": true,
  "message": "Rating created successfully",
  "data": {
    "_id": "rating_id",
    "user": "user_id",
    "driver": "driver_id",
    "rating": 5,
    "comment": "Very good ride"
  }
}
```

### GET /api/v1/rating/:id
- Auth: No
- Path params
```json
{
  "id": "driver mongoId"
}
```
- Query model
```json
{
  "page": "int >=1 (optional)",
  "limit": "int 1-100 (optional)"
}
```
- Success response (200)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "_id": "rating_id",
      "rating": 5,
      "comment": "Very good",
      "user": {
        "_id": "user_id",
        "name": "Rider Name"
      }
    }
  ],
  "meta": {
    "count": 1,
    "total": 25,
    "page": 1,
    "totalPages": 25
  }
}
```

---

## Upload Endpoint

### POST /api/v1/upload
- Auth: Yes
- Content type: multipart/form-data
- Accepted form-data fields
```json
{
  "file": "binary (required)"
}
```
- Allowed types: image/jpeg, image/png, image/webp, application/pdf
- Success response (201)
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "abcdef123456.png",
    "mimeType": "image/png",
    "size": 12345,
    "path": "/uploads/abcdef123456.png",
    "url": "http://localhost:5000/uploads/abcdef123456.png"
  }
}
```

---

## Quick Endpoint Matrix

| Method | Endpoint | Auth |
|---|---|---|
| GET | / | No |
| GET | /health | No |
| GET | /api-docs | No |
| GET | /api-docs.json | No |
| GET | /uploads/:filename | No |
| GET | /api/v1/admin/stats | Yes (admin) |
| POST | /api/v1/auth/register | No |
| POST | /api/v1/auth/login | No |
| POST | /api/v1/auth/verify-otp | No |
| POST | /api/v1/booking | Yes |
| GET | /api/v1/booking/:id | Yes |
| POST | /api/v1/booking/:id/cancel | Yes |
| POST | /api/v1/driver/profile | Yes (driver/admin) |
| GET | /api/v1/driver/profile | Yes (driver/admin) |
| PUT | /api/v1/driver/location | Yes (driver/admin) |
| PUT | /api/v1/driver/status | Yes (driver/admin) |
| GET | /api/v1/driver/nearby | Yes |
| POST | /api/v1/payment/create | Yes |
| POST | /api/v1/payment/verify | Yes |
| POST | /api/v1/payment/webhook | No (signature protected) |
| POST | /api/v1/rating | Yes |
| GET | /api/v1/rating/:id | No |
| POST | /api/v1/trip | Yes (driver/admin) |
| GET | /api/v1/trip | No |
| GET | /api/v1/trip/:id | No |
| PUT | /api/v1/trip/:id/status | Yes (driver/admin) |
| POST | /api/v1/upload | Yes |
| GET | /api/v1/user/profile | Yes |
| PUT | /api/v1/user/profile | Yes |
| POST | /api/v1/vehicle/register | Yes (driver/admin) |
| GET | /api/v1/vehicle/:id | No |
