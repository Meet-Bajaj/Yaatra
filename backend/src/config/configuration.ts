export default () => ({
  port: parseInt(process.env.PORT || '5001', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret:
      process.env.JWT_SECRET || 'yaatra-jwt-secret-2024-change-in-production',
    expiresIn: '7d',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  },
  otp: {
    provider: process.env.OTP_PROVIDER || 'twilio',
    apiKey: process.env.OTP_API_KEY,
    masterOtp: process.env.MASTER_OTP === 'TRUE',
    masterOtpValue: process.env.MASTER_OTP_VALUE || '123456',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  firebase: {
    serverKey: process.env.FCM_SERVER_KEY,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucket: process.env.MINIO_BUCKET || 'yaatra-documents',
    useSSL: process.env.MINIO_USE_SSL === 'true',
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
});
