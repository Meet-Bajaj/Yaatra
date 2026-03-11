Sure! Below is a mock dataset for all the collections based on the schemas you've provided.

--- 

### 1️⃣ `User`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e3d",
    "phone": "+919876543210",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "$2b$10$KIXiNldk7ms54odZuXl3je7lU8j/NbKjPSbjdPQUwdk2yltjry3o6",
    "role": "rider",
    "walletBalance": 100.50,
    "rating": 4.5,
    "avatarUrl": "http://example.com/images/johndoe.jpg",
    "fcmToken": "dUuYl7sd92jsdLKJk32jVxTw3lzD-9sdfJZ",
    "isActive": true,
    "isDeleted": false,
    "createdAt": "2022-06-01T10:00:00Z",
    "updatedAt": "2022-06-01T10:00:00Z"
  },
  {
    "_id": "605c72ef1c4ae8d18d5b7e3e",
    "phone": "+919865432109",
    "name": "Alice Smith",
    "email": "alicesmith@example.com",
    "password": "$2b$10$NlKs74Gj9aNr7g8pVVHqbsqZUl53K0KY6xlz9gGmiYXw6RTJtS5pG",
    "role": "driver",
    "walletBalance": 200.00,
    "rating": 4.8,
    "avatarUrl": "http://example.com/images/alicesmith.jpg",
    "fcmToken": "d02Ji3DJF9Vixd8s9g3yHszlJKZmn8h2sdF",
    "isActive": true,
    "isDeleted": false,
    "createdAt": "2022-07-01T15:00:00Z",
    "updatedAt": "2022-07-01T15:00:00Z"
  }
]
```

---

### 2️⃣ `Driver`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e3f",
    "user": "605c72ef1c4ae8d18d5b7e3e",
    "vehicle": "605c72ef1c4ae8d18d5b7e4b",
    "status": "online",
    "location": {
      "type": "Point",
      "coordinates": [77.216721, 28.6448]
    },
    "operatingZone": {
      "type": "Polygon",
      "coordinates": [[[77.205, 28.635], [77.225, 28.635], [77.225, 28.655], [77.205, 28.655], [77.205, 28.635]]]
    },
    "kyc": {
      "status": "verified",
      "rejectedReason": null
    },
    "totalRides": 45,
    "earnings": 5600,
    "createdAt": "2022-07-01T15:00:00Z",
    "updatedAt": "2022-07-01T15:00:00Z"
  }
]
```

---

### 3️⃣ `Vehicle`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e4b",
    "driver": "605c72ef1c4ae8d18d5b7e3e",
    "type": "CAR",
    "registrationNumber": "MH12AB1234",
    "capacity": 4,
    "rcDocUrl": "http://example.com/rc/mh12ab1234",
    "insuranceDocUrl": "http://example.com/insurance/mh12ab1234",
    "photoUrl": "http://example.com/images/vehicle1234.jpg",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "createdAt": "2022-07-01T15:00:00Z",
    "updatedAt": "2022-07-01T15:00:00Z"
  }
]
```

---

### 4️⃣ `Trip`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e5a",
    "driver": "605c72ef1c4ae8d18d5b7e3e",
    "origin": {
      "type": "Point",
      "coordinates": [77.216721, 28.6448],
      "address": "Connaught Place, Delhi"
    },
    "destination": {
      "type": "Point",
      "coordinates": [77.236721, 28.6648],
      "address": "Dwarka, Delhi"
    },
    "distanceKm": 15,
    "departureTime": "2022-07-02T10:00:00Z",
    "totalSeats": 3,
    "pricePerSeat": 100,
    "seatsBooked": 1,
    "status": "OPEN",
    "notes": "No pets allowed",
    "createdAt": "2022-07-01T16:00:00Z",
    "updatedAt": "2022-07-01T16:00:00Z"
  }
]
```

---

### 5️⃣ `Booking`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e6a",
    "rider": "605c72ef1c4ae8d18d5b7e3d",
    "trip": "605c72ef1c4ae8d18d5b7e5a",
    "autoDriver": null,
    "seats": 1,
    "fare": 100,
    "paymentMethod": "WALLET",
    "paymentReference": "Razorpay-1234abcd",
    "status": "CONFIRMED",
    "driverAcceptedAt": "2022-07-02T10:10:00Z",
    "completedAt": "2022-07-02T12:00:00Z",
    "cancelledAt": null,
    "createdAt": "2022-07-01T16:10:00Z",
    "updatedAt": "2022-07-01T16:10:00Z"
  }
]
```

---

### 6️⃣ `Payment`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e7a",
    "booking": "605c72ef1c4ae8d18d5b7e6a",
    "amount": 100,
    "gateway": "RAZORPAY",
    "gatewayTransactionId": "razorpay-txn1234",
    "status": "CAPTURED",
    "rawResponse": {
      "transactionId": "razorpay-txn1234",
      "status": "success"
    },
    "createdAt": "2022-07-01T16:20:00Z",
    "updatedAt": "2022-07-01T16:20:00Z"
  }
]
```

---

### 7️⃣ `Rating`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e8a",
    "fromUser": "605c72ef1c4ae8d18d5b7e3d",
    "toUser": "605c72ef1c4ae8d18d5b7e3e",
    "rating": 4,
    "comment": "Good ride, but could have been faster.",
    "trip": "605c72ef1c4ae8d18d5b7e5a",
    "booking": null,
    "createdAt": "2022-07-02T12:10:00Z",
    "updatedAt": "2022-07-02T12:10:00Z"
  }
]
```

---

### 8️⃣ `OTP`

```json
[
  {
    "_id": "605c72ef1c4ae8d18d5b7e9a",
    "phone": "+919876543210",
    "code": "123456",
    "expiresAt": "2022-07-01T16:30:00Z",
    "used": false,
    "createdAt": "2022-07-01T16:00:00Z",
    "updatedAt": "2022-07-01T16:10:00Z"
  }
]
```

---

This mock data covers all the collections you mentioned. Let me know if you'd like to tweak any values or add more entries!
