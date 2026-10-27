class DriverProfile {
  final String driverId;
  final String driverType;
  final bool isOnline;
  final String verificationStatus;
  final double totalRating;
  final int ratingCount;
  final Map<String, dynamic>? user;
  final List<Vehicle> vehicles;

  DriverProfile({
    required this.driverId,
    required this.driverType,
    required this.isOnline,
    required this.verificationStatus,
    required this.totalRating,
    required this.ratingCount,
    this.user,
    this.vehicles = const [],
  });

  factory DriverProfile.fromJson(Map<String, dynamic> json) {
    return DriverProfile(
      driverId: json['driverId'] ?? '',
      driverType: json['driverType'] ?? 'CARPOOL',
      isOnline: json['isOnline'] ?? false,
      verificationStatus: json['verificationStatus'] ?? 'PENDING',
      totalRating: double.tryParse(json['totalRating']?.toString() ?? '0') ?? 0,
      ratingCount: json['ratingCount'] ?? 0,
      user: json['user'],
      vehicles: (json['vehicles'] as List? ?? []).map((e) => Vehicle.fromJson(e)).toList(),
    );
  }

  String get userName => user?['name'] ?? 'Driver';
}

class Vehicle {
  final String id;
  final String make;
  final String model;
  final String? color;
  final String licensePlate;
  final int capacity;

  Vehicle({
    required this.id,
    required this.make,
    required this.model,
    this.color,
    required this.licensePlate,
    required this.capacity,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'] ?? '',
      make: json['make'] ?? '',
      model: json['model'] ?? '',
      color: json['color'],
      licensePlate: json['licensePlate'] ?? '',
      capacity: json['capacity'] ?? 4,
    );
  }

  String get displayName => '$make $model';
}

class DriverOffer {
  final String id;
  final String driverId;
  final String vehicleId;
  final Map<String, dynamic>? schedule;
  final double pricePerSeat;
  final int maxPassengers;
  final bool womenOnly;
  final String status;
  final DateTime createdAt;
  final Vehicle? vehicle;
  final List<Map<String, dynamic>> instances;

  DriverOffer({
    required this.id,
    required this.driverId,
    required this.vehicleId,
    this.schedule,
    required this.pricePerSeat,
    required this.maxPassengers,
    required this.womenOnly,
    required this.status,
    required this.createdAt,
    this.vehicle,
    this.instances = const [],
  });

  factory DriverOffer.fromJson(Map<String, dynamic> json) {
    return DriverOffer(
      id: json['id'] ?? '',
      driverId: json['driverId'] ?? '',
      vehicleId: json['vehicleId'] ?? '',
      schedule: json['schedule'],
      pricePerSeat: double.tryParse(json['pricePerSeat']?.toString() ?? '0') ?? 0,
      maxPassengers: json['maxPassengers'] ?? 2,
      womenOnly: json['womenOnly'] ?? false,
      status: json['status'] ?? 'ACTIVE',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      vehicle: json['vehicle'] != null ? Vehicle.fromJson(json['vehicle']) : null,
      instances: (json['instances'] as List? ?? []).cast<Map<String, dynamic>>(),
    );
  }

  String get pickupAddress => schedule?['pickup']?['address'] ?? '';
  String get dropAddress => schedule?['drop']?['address'] ?? '';
  List<Map<String, dynamic>> get slots =>
      (schedule?['slots'] as List? ?? []).cast<Map<String, dynamic>>();
}

class DriverEarnings {
  final double totalEarnings;
  final double tripEarnings;
  final double offerEarnings;
  final int totalTrips;
  final int totalBookings;
  final int todayTrips;
  final double todayEarnings;
  final List<Map<String, dynamic>> recentTrips;
  final List<Map<String, dynamic>> recentBookings;

  DriverEarnings({
    required this.totalEarnings,
    required this.tripEarnings,
    required this.offerEarnings,
    required this.totalTrips,
    required this.totalBookings,
    required this.todayTrips,
    required this.todayEarnings,
    required this.recentTrips,
    required this.recentBookings,
  });

  factory DriverEarnings.fromJson(Map<String, dynamic> json) {
    return DriverEarnings(
      totalEarnings: (json['totalEarnings'] as num?)?.toDouble() ?? 0,
      tripEarnings: (json['tripEarnings'] as num?)?.toDouble() ?? 0,
      offerEarnings: (json['offerEarnings'] as num?)?.toDouble() ?? 0,
      totalTrips: json['totalTrips'] ?? 0,
      totalBookings: json['totalBookings'] ?? 0,
      todayTrips: json['todayTrips'] ?? 0,
      todayEarnings: (json['todayEarnings'] as num?)?.toDouble() ?? 0,
      recentTrips: (json['recentTrips'] as List? ?? []).cast<Map<String, dynamic>>(),
      recentBookings: (json['recentBookings'] as List? ?? []).cast<Map<String, dynamic>>(),
    );
  }
}
