import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/ride_option.dart';

final rideRepositoryProvider = Provider<RideRepository>((ref) {
  return RideRepository(ref);
});

class RideRepository {
  final Ref _ref;
  RideRepository(this._ref);

  Future<RideSearchResult> searchRides({
    required double pickupLat,
    required double pickupLng,
    required double dropLat,
    required double dropLng,
    String? pickupAddress,
    String? dropAddress,
    String? filter,
    String? date,
    String? time,
  }) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.ridesAvailable, queryParameters: {
      'pickupLat': pickupLat,
      'pickupLng': pickupLng,
      'dropLat': dropLat,
      'dropLng': dropLng,
      'pickupAddress': ?pickupAddress,
      'dropAddress': ?dropAddress,
      'filter': ?filter,
      'date': ?date,
      'time': ?time,
    });
    return RideSearchResult.fromJson(response.data);
  }

  Future<Map<String, dynamic>> bookRide({
    required String type,
    String? tripId,
    String? instanceId,
    double? pickupLat,
    double? pickupLng,
    double? dropLat,
    double? dropLng,
    required int seats,
    required String pickupAddress,
    required String dropAddress,
    String? paymentMethod,
  }) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.ridesBook, data: {
      'type': type,
      'tripId': ?tripId,
      'instanceId': ?instanceId,
      'pickupLat': ?pickupLat,
      'pickupLng': ?pickupLng,
      'dropLat': ?dropLat,
      'dropLng': ?dropLng,
      'seats': seats,
      'pickupAddress': pickupAddress,
      'dropAddress': dropAddress,
      'paymentMethod': ?paymentMethod,
    });
    return response.data;
  }
}
