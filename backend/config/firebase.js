const admin = require("firebase-admin");

const env = require("./env");
const logger = require("../utils/logger");

let firebaseApp;
let firebaseChecked = false;

const buildCredential = () => {
  if (env.firebase.serviceAccountJson) {
    try {
      return admin.credential.cert(JSON.parse(env.firebase.serviceAccountJson));
    } catch (error) {
      logger.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON", error);
      return null;
    }
  }

  if (
    env.firebase.projectId &&
    env.firebase.clientEmail &&
    env.firebase.privateKey
  ) {
    return admin.credential.cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    });
  }

  return null;
};

const getFirebaseApp = () => {
  if (firebaseChecked) {
    return firebaseApp;
  }

  firebaseChecked = true;

  const credential = buildCredential();
  if (!credential) {
    logger.warn("Firebase Admin is not configured; push notifications will be mocked.");
    firebaseApp = null;
    return firebaseApp;
  }

  try {
    firebaseApp = admin.apps.length
      ? admin.app()
      : admin.initializeApp({
          credential,
          databaseURL: env.firebase.databaseUrl || undefined,
          storageBucket: env.firebase.storageBucket || undefined,
        });
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin", error);
    firebaseApp = null;
  }

  return firebaseApp;
};

const isFirebaseConfigured = () => Boolean(getFirebaseApp());

module.exports = {
  getFirebaseApp,
  isFirebaseConfigured,
};
