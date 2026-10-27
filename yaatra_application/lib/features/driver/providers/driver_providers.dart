import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/driver_repository.dart';
import '../models/driver_models.dart';

final driverProfileProvider = FutureProvider<DriverProfile>((ref) async {
  final repo = ref.read(driverRepositoryProvider);
  return repo.getProfile();
});

final driverOffersProvider = FutureProvider<List<DriverOffer>>((ref) async {
  final repo = ref.read(driverRepositoryProvider);
  return repo.getOffers();
});

final driverEarningsProvider = FutureProvider<DriverEarnings>((ref) async {
  final repo = ref.read(driverRepositoryProvider);
  return repo.getEarnings();
});

final driverRequestsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final repo = ref.read(driverRepositoryProvider);
  return repo.getRequests();
});
