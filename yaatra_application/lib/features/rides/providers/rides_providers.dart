import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/rides_repository.dart';
import '../models/trip.dart';

final upcomingRidesProvider = FutureProvider<UpcomingRides>((ref) async {
  final repo = ref.read(ridesRepositoryProvider);
  return repo.getUpcomingRides();
});

final rideHistoryProvider = FutureProvider<UpcomingRides>((ref) async {
  final repo = ref.read(ridesRepositoryProvider);
  return repo.getRideHistory();
});

final tripDetailProvider = FutureProvider.family<Trip, String>((ref, id) async {
  final repo = ref.read(ridesRepositoryProvider);
  return repo.getTripById(id);
});
