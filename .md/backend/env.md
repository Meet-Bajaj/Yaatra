# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://mongo:27017/rikride
MONGO_DB_NAME=rikride

# JWT
JWT_SECRET=yourSuperSecretKey
JWT_EXPIRES_IN=7d

# OTP (Twilio example)
TWILIO_ACCOUNT_SID=xxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_SERVICE_SID=xxxx   # Verify Service SID

# Razorpay (payments)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# AWS S3 (for KYC docs)
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
S3_BUCKET=rikride-kyc

# Firebase Cloud Messaging (push)
FCM_SERVER_KEY=AAA...

# Redis (optional – for socket.io adapter & OTP cache)
REDIS_URL=redis://redis:6379

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000   # 1 minute
RATE_LIMIT_MAX=100           # max requests per window per IP
