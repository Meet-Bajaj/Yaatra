const admin = require("firebase-admin");
const logger = require("../utils/logger");

// Initialize Firebase Admin SDK (lazy load based on env vars)
let isFirebaseInitialized = false;

if (process.env.FCM_SERVER_KEY && process.env.FCM_SERVER_KEY !== "REPLACE_WITH_FCM_SERVER_KEY") {
  try {
    // If you have a serviceAccountKey.json, configure it here:
    // const serviceAccount = require("../config/serviceAccountKey.json");
    // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    isFirebaseInitialized = true;
  } catch (err) {
    logger.error("Failed to initialize Firebase Admin SDK", err);
  }
}

const sendPushNotification = async (fcmToken, title, body, dataPayload = {}) => {
  if (!fcmToken) {
    logger.warn("Attempted to send notification but FCM token was missing.");
    return false;
  }

  if (!isFirebaseInitialized) {
    logger.warn(`[Dev Mock FCM] title: ${title}, body: ${body}, to: ${fcmToken}`);
    return true;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: dataPayload,
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    logger.info(`Successfully sent FCM message: ${response}`);
    return true;
  } catch (error) {
    logger.error("Error sending FCM message:", error);
    return false;
  }
};

module.exports = {
  sendPushNotification,
};
