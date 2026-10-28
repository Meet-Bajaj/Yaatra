import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';

final planCommuteRepositoryProvider = Provider<PlanCommuteRepository>((ref) {
  return PlanCommuteRepository(ref);
});

class PlanCommuteRepository {
  final Ref _ref;
  PlanCommuteRepository(this._ref);

  Future<List<Map<String, dynamic>>> findMatches({
    required double pickupLat,
    required double pickupLng,
    required double dropLat,
    required double dropLng,
    String? date,
    String? time,
  }) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get('/rides/schedules/matches', queryParameters: {
      'pickupLat': pickupLat,
      'pickupLng': pickupLng,
      'dropLat': dropLat,
      'dropLng': dropLng,
      'date': ?date,
      'time': ?time,
    });
    return (response.data as List? ?? []).cast<Map<String, dynamic>>();
  }
}
