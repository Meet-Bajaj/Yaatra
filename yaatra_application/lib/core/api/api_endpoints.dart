class ApiEndpoints {
  ApiEndpoints._();

  static const String baseUrl = 'http://10.0.2.2:5001';

  static const String authOtp = '/auth/otp';
  static const String authVerify = '/auth/verify';
  static const String authResendOtp = '/auth/resend-otp';
  static const String authRegister = '/auth/register';
  static const String authLogin = '/auth/login';
  static const String authProfile = '/auth/profile';

  static const String usersMe = '/users/me';
  static const String usersEmergencyContacts = '/users/me/emergency-contacts';
  static const String usersPlaces = '/users/me/places';

  static const String ridesAvailable = '/rides/available';
  static const String ridesBook = '/rides/book';
  static const String ridesUpcoming = '/rides/upcoming';
  static const String ridesHistory = '/rides/history';
  static String rideById(String id) => '/rides/$id';
  static String rideCancel(String id) => '/rides/$id/cancel';
  static String rideRebook(String id) => '/rides/$id/rebook';

  static const String driverProfile = '/driver/profile';
  static const String driverOffer = '/driver/offer';
  static const String driverOffers = '/driver/offers';
  static String driverOfferById(String id) => '/driver/offers/$id';
  static String driverOfferRequests(String id) => '/driver/offers/$id/requests';
  static String driverAcceptRequest(String id) => '/driver/requests/$id/accept';
  static String driverRejectRequest(String id) => '/driver/requests/$id/reject';
  static const String driverGoOnline = '/driver/go-online';
  static const String driverGoOffline = '/driver/go-offline';
  static const String driverRequests = '/driver/requests';
  static const String driverAccept = '/driver/accept';
  static const String driverReject = '/driver/reject';
  static String driverArriveAtPickup(String id) => '/driver/trips/$id/arrive';
  static String driverCompleteTrip(String id) => '/driver/trips/$id/complete';
  static const String driverEarnings = '/driver/earnings';

  static const String wallet = '/wallet';
  static const String walletTopup = '/wallet/topup';
  static const String walletTransactions = '/wallet/transactions';
  static const String walletWithdraw = '/wallet/withdraw';

  static const String notifications = '/notifications';
  static String notificationRead(String id) => '/notifications/$id/read';
  static const String notificationsReadAll = '/notifications/read-all';

  static const String safetyEmergency = '/safety/emergency';
  static const String safetyReport = '/safety/report';
  static String safetyTrust(String id) => '/safety/trust/$id';

  static const String rating = '/ratings';
}
