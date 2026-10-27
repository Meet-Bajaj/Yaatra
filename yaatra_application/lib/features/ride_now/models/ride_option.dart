class RideOption {
  final String type; // ON_DEMAND or SCHEDULED
  final DriverInfo? driver;
  final VehicleInfo? vehicle;
  final String? offerId;
  final String? instanceId;
  final double? estimatedFare;
  final double? pricePerSeat;
  final double? distanceKm;
  final int? availableSeats;
  final bool womenOnly;
  final ScheduleInfo? schedule;

  RideOption({
    required this.type,
    this.driver,
    this.vehicle,
    this.offerId,
    this.instanceId,
    this.estimatedFare,
    this.pricePerSeat,
    this.distanceKm,
    this.availableSeats,
    this.womenOnly = false,
    this.schedule,
  });

  factory RideOption.fromJson(Map<String, dynamic> json) {
    return RideOption(
      type: json['type'] ?? 'ON_DEMAND',
      driver: json['driver'] != null ? DriverInfo.fromJson(json['driver']) : null,
      vehicle: json['vehicle'] != null ? VehicleInfo.fromJson(json['vehicle']) : null,
      offerId: json['offerId'],
      instanceId: json['instanceId'],
      estimatedFare: json['estimatedFare']?.toDouble(),
      pricePerSeat: json['pricePerSeat']?.toDouble(),
      distanceKm: json['distanceKm']?.toDouble(),
      availableSeats: json['availableSeats'],
      womenOnly: json['womenOnly'] ?? false,
      schedule: json['schedule'] != null ? ScheduleInfo.fromJson(json['schedule']) : null,
    );
  }

  String get displayName {
    if (type == 'SCHEDULED') return 'Scheduled Ride';
    if (vehicle != null) return '${vehicle!.make} ${vehicle!.model}';
    return 'Ride';
  }
}

class DriverInfo {
  final String id;
  final String name;
  final String? gender;
  final String? avatarUrl;
  final double rating;
  final int? ratingCount;

  DriverInfo({
    required this.id,
    required this.name,
    this.gender,
    this.avatarUrl,
    this.rating = 0,
    this.ratingCount,
  });

  factory DriverInfo.fromJson(Map<String, dynamic> json) {
    return DriverInfo(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      gender: json['gender'],
      avatarUrl: json['avatarUrl'],
      rating: double.tryParse(json['rating']?.toString() ?? '0') ?? 0,
      ratingCount: json['ratingCount'],
    );
  }
}

class VehicleInfo {
  final String? make;
  final String? model;
  final String? color;
  final String? licensePlate;
  final int? capacity;

  VehicleInfo({this.make, this.model, this.color, this.licensePlate, this.capacity});

  factory VehicleInfo.fromJson(Map<String, dynamic> json) {
    return VehicleInfo(
      make: json['make'],
      model: json['model'],
      color: json['color'],
      licensePlate: json['licensePlate'],
      capacity: json['capacity'],
    );
  }

  String get displayName => [make, model].where((e) => e != null).join(' ');
}

class ScheduleInfo {
  final DateTime? date;
  final DateTime? departureTime;

  ScheduleInfo({this.date, this.departureTime});

  factory ScheduleInfo.fromJson(Map<String, dynamic> json) {
    return ScheduleInfo(
      date: json['date'] != null ? DateTime.tryParse(json['date']) : null,
      departureTime: json['departureTime'] != null ? DateTime.tryParse(json['departureTime']) : null,
    );
  }
}

class RideSearchResult {
  final List<RideOption> results;
  final int count;

  RideSearchResult({required this.results, required this.count});

  factory RideSearchResult.fromJson(Map<String, dynamic> json) {
    return RideSearchResult(
      results: (json['results'] as List? ?? [])
          .map((e) => RideOption.fromJson(e))
          .toList(),
      count: json['count'] ?? 0,
    );
  }
}
