import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/safety_repository.dart';
import '../models/emergency_contact.dart';
import '../models/rating_model.dart';

final emergencyContactsProvider = FutureProvider<List<EmergencyContact>>((
  ref,
) async {
  return ref.watch(safetyRepositoryProvider).getEmergencyContacts();
});

final ratingSummaryProvider =
    FutureProvider.family<RatingSummary, String>((ref, userId) async {
  return ref.watch(safetyRepositoryProvider).getUserRatings(userId);
});
