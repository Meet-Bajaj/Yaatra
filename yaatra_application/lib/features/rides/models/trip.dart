class Trip {
  final String id;
  final String riderId;
  final String? driverId;
  final String status;
  final double pickupLat;
  final double pickupLng;
  final double dropLat;
  final double dropLng;
  final String pickupAddress;
  final String dropAddress;
  final String? fareEstimate;
  final String? fareFinal;
  final double? distanceKm;
  final int? durationMin;
  final DateTime? pickupTime;
  final DateTime? startTime;
  final DateTime? endTime;
  final DateTime createdAt;
  final Map<String, dynamic>? rider;
  final Map<String, dynamic>? driver;

  Trip({
    required this.id,
    required this.riderId,
    this.driverId,
    required this.status,
    required this.pickupLat,
    required this.pickupLng,
    required this.dropLat,
    required this.dropLng,
    required this.pickupAddress,
    required this.dropAddress,
    this.fareEstimate,
    this.fareFinal,
    this.distanceKm,
    this.durationMin,
    this.pickupTime,
    this.startTime,
    this.endTime,
    required this.createdAt,
    this.rider,
    this.driver,
  });

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['id'] ?? '',
      riderId: json['riderId'] ?? '',
      driverId: json['driverId'],
      status: json['status'] ?? '',
      pickupLat: (json['pickupLat'] as num?)?.toDouble() ?? 0,
      pickupLng: (json['pickupLng'] as num?)?.toDouble() ?? 0,
      dropLat: (json['dropLat'] as num?)?.toDouble() ?? 0,
      dropLng: (json['dropLng'] as num?)?.toDouble() ?? 0,
      pickupAddress: json['pickupAddress'] ?? '',
      dropAddress: json['dropAddress'] ?? '',
      fareEstimate: json['fareEstimate']?.toString(),
      fareFinal: json['fareFinal']?.toString(),
      distanceKm: (json['distanceKm'] as num?)?.toDouble(),
      durationMin: json['durationMin'],
      pickupTime: json['pickupTime'] != null ? DateTime.tryParse(json['pickupTime']) : null,
      startTime: json['startTime'] != null ? DateTime.tryParse(json['startTime']) : null,
      endTime: json['endTime'] != null ? DateTime.tryParse(json['endTime']) : null,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      rider: json['rider'],
      driver: json['driver'],
    );
  }

  double get fareFinalNum => double.tryParse(fareFinal ?? '0') ?? 0;
  double get fareEstimateNum => double.tryParse(fareEstimate ?? '0') ?? 0;
  String get driverName => driver?['name'] ?? 'Driver';
}

class Booking {
  final String id;
  final String instanceId;
  final String riderId;
  final int seatCount;
  final String fareTotal;
  final String commission;
  final String paymentStatus;
  final String bookingStatus;
  final DateTime createdAt;
  final Map<String, dynamic>? instance;

  Booking({
    required this.id,
    required this.instanceId,
    required this.riderId,
    required this.seatCount,
    required this.fareTotal,
    required this.commission,
    required this.paymentStatus,
    required this.bookingStatus,
    required this.createdAt,
    this.instance,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] ?? '',
      instanceId: json['instanceId'] ?? '',
      riderId: json['riderId'] ?? '',
      seatCount: json['seatCount'] ?? 1,
      fareTotal: json['fareTotal']?.toString() ?? '0',
      commission: json['commission']?.toString() ?? '0',
      paymentStatus: json['paymentStatus'] ?? '',
      bookingStatus: json['bookingStatus'] ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      instance: json['instance'],
    );
  }

  double get fareTotalNum => double.tryParse(fareTotal) ?? 0;
}

class UpcomingRides {
  final List<Trip> trips;
  final List<Booking> bookings;

  UpcomingRides({required this.trips, required this.bookings});

  factory UpcomingRides.fromJson(Map<String, dynamic> json) {
    return UpcomingRides(
      trips: (json['trips'] as List? ?? []).map((e) => Trip.fromJson(e)).toList(),
      bookings: (json['bookings'] as List? ?? []).map((e) => Booking.fromJson(e)).toList(),
    );
  }
}
