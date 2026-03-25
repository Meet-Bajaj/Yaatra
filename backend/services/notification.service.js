const admin = require("firebase-admin");

const { getFirebaseApp } = require("../config/firebase");
const logger = require("../utils/logger");

const sendPushNotification = async (fcmToken, title, body, dataPayload = {}) => {
  if (!fcmToken) {
    logger.warn("Attempted to send notification without an FCM token.");
    return false;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    logger.info("Using mock push notification delivery", {
      fcmToken,
      title,
      body,
      dataPayload,
    });
    return true;
  }

  try {
    await admin.messaging(firebaseApp).send({
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: Object.entries(dataPayload).reduce((accumulator, [key, value]) => {
        accumulator[key] = String(value);
        return accumulator;
      }, {}),
    });
    return true;
  } catch (error) {
    logger.error("Failed to send push notification", error);
    return false;
  }
};

module.exports = {
  sendPushNotification,
};
