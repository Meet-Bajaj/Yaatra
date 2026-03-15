# -------------------------------------------------
#  🎯  RikRide – Backend (Node/Express) Settings
# -------------------------------------------------

# ----------------------------------------------------------------
#  Server
# ----------------------------------------------------------------
PORT=5000                     # Port the Express server will listen on
NODE_ENV=development          # development | production | test
CLIENT_URL=http://localhost:19006   # URL of the Expo app (used for CORS)

# ----------------------------------------------------------------
#  MongoDB
# ----------------------------------------------------------------
MONGO_URI=mongodb://mongo:27017/rikride        # Full connection string (docker compose uses the service name "mongo")
MONGO_DB_NAME=rikride                          # Database name (optional – used in db.js)

# ----------------------------------------------------------------
#  JWT – your own token that the front‑end will store
# ----------------------------------------------------------------
JWT_SECRET=YOUR_SUPER_SECRET_KEY                # 256‑bit secret (min 32 chars recommended)
JWT_EXPIRES_IN=7d                               # 7 days is a common default

# ----------------------------------------------------------------
#  Rate limiting (prevent brute‑force / DoS)
# ----------------------------------------------------------------
RATE_LIMIT_WINDOW_MS=60000      # 1 minute window
RATE_LIMIT_MAX=120             # max requests per IP per window

# ----------------------------------------------------------------
#  Twilio – OTP/SMS (used by the `/auth` routes)
# ----------------------------------------------------------------
TWILIO_ACCOUNT_SID=REPLACE_WITH_TWILIO_SID
TWILIO_AUTH_TOKEN=REPLACE_WITH_TWILIO_TOKEN
TWILIO_VERIFY_SERVICE_SID=REPLACE_WITH_VERIFY_SERVICE_SID   # “Verify Service” SID

# ----------------------------------------------------------------
#  Razorpay – Payments
# ----------------------------------------------------------------
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX            # Publishable key (client side can also read this)
RAZORPAY_KEY_SECRET=REPLACE_WITH_RAZORPAY_SECRET

# ----------------------------------------------------------------
#  Firebase Cloud Messaging – push notifications
# ----------------------------------------------------------------
FCM_SERVER_KEY=REPLACE_WITH_FCM_SERVER_KEY

# ----------------------------------------------------------------
#  AWS S3 – storage for KYC documents, vehicle photos, etc.
# ----------------------------------------------------------------
AWS_ACCESS_KEY_ID=REPLACE_WITH_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=REPLACE_WITH_AWS_SECRET_KEY
AWS_S3_BUCKET=rikride-kyc               # Bucket you created for the project
AWS_S3_REGION=ap-south-1                # Example: Mumbai (change to your region)

# ----------------------------------------------------------------
#  Redis – optional (used for Socket.io adapter / OTP cache)
# ----------------------------------------------------------------
REDIS_URL=redis://redis:6379               # If you run a Redis container, otherwise leave empty

# ----------------------------------------------------------------
#  Email (optional – e.g., for support / receipts via nodemailer)
# ----------------------------------------------------------------
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=YOUR_SMTP_PASSWORD

# ----------------------------------------------------------------
#  Logging / monitoring (optional)
# ----------------------------------------------------------------
SENTRY_DSN=REPLACE_WITH_SENTRY_DSN   # If you integrate Sentry, otherwise comment out
