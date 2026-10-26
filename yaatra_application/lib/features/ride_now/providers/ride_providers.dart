import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/ride_repository.dart';
import '../models/ride_option.dart';

final rideSearchResultProvider = FutureProvider.family<RideSearchResult, Map<String, dynamic>>(
  (ref, params) async {
    final repo = ref.read(rideRepositoryProvider);
    return repo.searchRides(
      pickupLat: params['pickupLat'],
      pickupLng: params['pickupLng'],
      dropLat: params['dropLat'],
      dropLng: params['dropLng'],
      pickupAddress: params['pickupAddress'],
      dropAddress: params['dropAddress'],
      filter: params['filter'],
    );
  },
);

final selectedRideOptionProvider = StateProvider<RideOption?>((ref) => null);

final rideSearchParamsProvider = StateProvider<Map<String, dynamic>>((ref) => {});
