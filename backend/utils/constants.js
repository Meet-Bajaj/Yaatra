module.exports = {
  ROLES: {
    ADMIN: "admin",
    RIDER: "rider",
    DRIVER: "driver",
  },
  TRIP_STATUS: {
    OPEN: "open",
    FULL: "full",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  },
  BOOKING_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
  },
  DRIVER_STATUS: {
    OFFLINE: "offline",
    ONLINE: "online",
    ON_TRIP: "onTrip",
  },
  PAYMENT_GATEWAY: {
    RAZORPAY: "RAZORPAY",
    CASH: "CASH",
    WALLET: "WALLET",
  },
  PAYMENT_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
  },
};
