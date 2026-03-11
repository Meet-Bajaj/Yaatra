{
  "name": "rikride-backend",
  "version": "1.0.0",
  "description": "Car‑pool + Auto‑rickshaw marketplace API (Node/Express/MongoDB)",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "lint": "eslint . --ext .js",
    "test": "jest --detectOpenHandles",
    "swagger": "swagger-cli bundle -o src/docs/swagger.json src/docs/swagger.yaml"
  },
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.3.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "http-status-codes": "^2.3.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.6.1",
    "mongoose-lean-virtuals": "^0.6.2",
    "mongoose-paginate-v2": "^1.8.0",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "multer-s3": "^3.0.1",
    "nodemailer": "^6.9.13",
    "socket.io": "^4.7.5",
    "swagger-ui-express": "^5.1.0",
    "uuid": "^10.0.0",
    "winston": "^3.13.0",
    "xss-clean": "^0.1.4",
    "express-mongo-sanitize": "^2.2.0",
    "axios": "^1.7.7",
    "razorpay": "^2.9.0"
  },
  "devDependencies": {
    "eslint": "^9.9.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.30.0",
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "supertest": "^7.0.0",
    "swagger-cli": "^4.0.4"
  }
}
