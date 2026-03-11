rikride-backend/
│
├─ .env                     # environment variables (never commit!)
├─ .gitignore
├─ package.json
├─ README.md
│
├─ src/
│   ├─ index.js            # entry point (server start)
│   ├─ app.js              # express app configuration
│   │
│   ├─ config/
│   │   ├─ db.js           # mongoose connection
│   │   └─ index.js        # central config (dotenv)
│   │
│   ├─ routes/
│   │   ├─ apiVersion.js  # e.g. /api/v1
│   │   ├─ auth.routes.js
│   │   ├─ user.routes.js
│   │   ├─ driver.routes.js
│   │   ├─ vehicle.routes.js
│   │   ├─ trip.routes.js
│   │   ├─ booking.routes.js
│   │   ├─ payment.routes.js
│   │   ├─ rating.routes.js
│   │   └─ admin.routes.js
│   │
│   ├─ controllers/
│   │   ├─ auth.controller.js
│   │   ├─ user.controller.js
│   │   ├─ driver.controller.js
│   │   ├─ vehicle.controller.js
│   │   ├─ trip.controller.js
│   │   ├─ booking.controller.js
│   │   ├─ payment.controller.js
│   │   ├─ rating.controller.js
│   │   └─ admin.controller.js
│   │
│   ├─ services/
│   │   ├─ auth.service.js
│   │   ├─ matching.service.js
│   │   ├─ payment.service.js
│   │   ├─ notification.service.js
│   │   └─ geo.service.js
│   │
│   ├─ models/
│   │   ├─ User.js
│   │   ├─ Driver.js
│   │   ├─ Vehicle.js
│   │   ├─ Trip.js
│   │   ├─ Booking.js
│   │   ├─ Payment.js
│   │   ├─ Rating.js
│   │   └─ OTP.js
│   │
│   ├─ middlewares/
│   │   ├─ asyncHandler.js         # wrapper to catch async errors
│   │   ├─ errorHandler.js        # centralized error middleware
│   │   ├─ authMiddleware.js      # verify JWT
│   │   ├─ roleMiddleware.js      # restrict by role (rider/driver/admin)
│   │   ├─ validate.js            # express‑validator wrapper
│   │   └─ rateLimiter.js
│   │
│   ├─ utils/
│   │   ├─ logger.js              # winston logger
│   │   ├─ jwt.js                 # sign/verify token
│   │   ├─ otp.js                 # generate + send OTP (Twilio/MSG91)
│   │   ├─ upload.js              # multer‑S3 / Cloudinary
│   │   └─ constants.js
│   │
│   ├─ sockets/
│   │   └─ location.socket.js     # driver‑rider real‑time location
│   │
│   ├─ docs/
│   │   └─ swagger.json           # OpenAPI definition (auto‑generated)
│   │
│   └─ tests/
│       ├─ integration/
│       └─ unit/
│
└─ docker-compose.yml
