import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/trip.dart';

final ridesRepositoryProvider = Provider<RidesRepository>((ref) {
  return RidesRepository(ref);
});

class RidesRepository {
  final Ref _ref;
  RidesRepository(this._ref);

  Future<UpcomingRides> getUpcomingRides() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.ridesUpcoming);
    return UpcomingRides.fromJson(response.data);
  }

  Future<UpcomingRides> getRideHistory() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.ridesHistory);
    return UpcomingRides.fromJson(response.data);
  }

  Future<Trip> getTripById(String id) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.rideById(id));
    return Trip.fromJson(response.data);
  }

  Future<Trip> cancelRide(String id, {String? reason}) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.rideCancel(id), data: {
      'reason': ?reason,
    });
    return Trip.fromJson(response.data);
  }

  Future<Trip> rebookRide(String id) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.rideRebook(id));
    return Trip.fromJson(response.data);
  }
}
