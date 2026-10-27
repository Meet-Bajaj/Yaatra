import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/driver_models.dart';

final driverRepositoryProvider = Provider<DriverRepository>((ref) {
  return DriverRepository(ref);
});

class DriverRepository {
  final Ref _ref;
  DriverRepository(this._ref);

  Future<DriverProfile> getProfile() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.driverProfile);
    return DriverProfile.fromJson(response.data);
  }

  Future<List<DriverOffer>> getOffers() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.driverOffers);
    return (response.data as List? ?? []).map((e) => DriverOffer.fromJson(e)).toList();
  }

  Future<DriverOffer> createOffer({
    required Map<String, dynamic> pickup,
    required Map<String, dynamic> drop,
    required List<Map<String, dynamic>> schedule,
    required int seats,
    required double pricePerSeat,
    bool womenOnly = false,
    required String vehicleId,
    String? notes,
  }) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.driverOffer, data: {
      'pickup': pickup,
      'drop': drop,
      'schedule': schedule,
      'seats': seats,
      'pricePerSeat': pricePerSeat,
      'womenOnly': womenOnly,
      'vehicleId': vehicleId,
      'notes': ?notes,
    });
    return DriverOffer.fromJson(response.data);
  }

  Future<void> goOnline({double? lat, double? lng, String? zone, String? vehicleId}) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.driverGoOnline, data: {
      'lat': ?lat,
      'lng': ?lng,
      'zone': ?zone,
      'vehicleId': ?vehicleId,
    });
  }

  Future<void> goOffline() async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.driverGoOffline);
  }

  Future<DriverEarnings> getEarnings() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.driverEarnings);
    return DriverEarnings.fromJson(response.data);
  }

  Future<List<Map<String, dynamic>>> getRequests() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.driverRequests);
    return (response.data as List? ?? []).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> acceptTrip(String tripId) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.driverAccept, data: {'tripId': tripId});
    return response.data;
  }

  Future<void> rejectTrip(String tripId) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.driverReject, data: {'tripId': tripId});
  }

  Future<Map<String, dynamic>> arriveAtPickup(String tripId) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.driverArriveAtPickup(tripId));
    return response.data;
  }

  Future<Map<String, dynamic>> completeTrip(String tripId) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.driverCompleteTrip(tripId));
    return response.data;
  }
}
