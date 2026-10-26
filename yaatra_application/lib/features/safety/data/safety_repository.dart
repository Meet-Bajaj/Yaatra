import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/emergency_contact.dart';
import '../models/rating_model.dart';

final safetyRepositoryProvider = Provider<SafetyRepository>((ref) {
  return SafetyRepository(ref);
});

class SafetyRepository {
  final Ref _ref;
  SafetyRepository(this._ref);

  Future<void> triggerEmergency({double? lat, double? lng}) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.safetyEmergency, data: {
      'lat': ?lat,
      'lng': ?lng,
    });
  }

  Future<List<EmergencyContact>> getEmergencyContacts() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.usersMe);
    final raw = response.data['emergencyContacts'];
    if (raw is List) {
      return raw
          .whereType<Map<String, dynamic>>()
          .map(EmergencyContact.fromJson)
          .toList();
    }
    return [];
  }

  Future<void> updateEmergencyContacts(List<EmergencyContact> contacts) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.put(ApiEndpoints.usersEmergencyContacts, data: {
      'contacts': contacts.map((contact) => contact.toJson()).toList(),
    });
  }

  Future<void> reportIssue({required String description, String? tripId}) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.safetyReport, data: {
      'description': description,
      'tripId': ?tripId,
    });
  }

  Future<void> shareTrip(String tripId) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post('/safety/trip-share/$tripId');
  }

  Future<RatingSummary> getUserRatings(String userId) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get('/ratings/user/$userId');
    return RatingSummary.fromJson(response.data);
  }

  Future<void> submitRating({
    required String revieweeId,
    required int score,
    String? tripId,
    String? comment,
    List<String>? tags,
  }) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.rating, data: {
      'revieweeId': revieweeId,
      'score': score,
      'tripId': ?tripId,
      'comment': ?comment,
      'tags': ?tags,
    });
  }
}
