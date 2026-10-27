import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/chip_filter.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/error_state.dart';
import '../../../../core/widgets/ride_option_card.dart';
import '../../../../core/widgets/skeleton.dart';
import '../../models/ride_option.dart';
import '../../providers/ride_providers.dart';

class RideOptionsPage extends ConsumerStatefulWidget {
  const RideOptionsPage({super.key, this.searchParams});

  final Map<String, dynamic>? searchParams;

  @override
  ConsumerState<RideOptionsPage> createState() => _RideOptionsPageState();
}

class _RideOptionsPageState extends ConsumerState<RideOptionsPage> {
  @override
  void initState() {
    super.initState();
    final params = widget.searchParams;
    if (params != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(rideSearchParamsProvider.notifier).state = params;
      });
    }
  }

  String get _selectedFilter {
    final filter = ref.watch(rideSearchParamsProvider)['filter'] as String?;
    switch (filter) {
      case 'CARPOOL':
        return 'carpool';
      case 'PROFESSIONAL':
        return 'professional';
      case 'WOMEN_ONLY':
        return 'women_only';
      default:
        return 'all';
    }
  }

  void _setFilter(String value) {
    final current = ref.read(rideSearchParamsProvider);
    ref.read(rideSearchParamsProvider.notifier).state = {
      ...current,
      'filter': switch (value) {
        'carpool' => 'CARPOOL',
        'professional' => 'PROFESSIONAL',
        'women_only' => 'WOMEN_ONLY',
        _ => 'ALL',
      },
    };
  }

  bool _hasCoordinates(Map<String, dynamic> params) =>
      params['pickupLat'] != null &&
      params['pickupLng'] != null &&
      params['dropLat'] != null &&
      params['dropLng'] != null;

  @override
  Widget build(BuildContext context) {
    final params = ref.watch(rideSearchParamsProvider);
    final filter = _selectedFilter;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios),
                        onPressed: () => context.pop(),
                      ),
                      const Text(
                        'Available Rides',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        ChipFilter(
                          label: 'All',
                          isSelected: filter == 'all',
                          onTap: () => _setFilter('all'),
                        ),
                        const SizedBox(width: 8),
                        ChipFilter(
                          label: 'Carpool',
                          isSelected: filter == 'carpool',
                          onTap: () => _setFilter('carpool'),
                          selectedColor: AppColors.carpoolBadge,
                          icon: Icons.people,
                        ),
                        const SizedBox(width: 8),
                        ChipFilter(
                          label: 'Professional',
                          isSelected: filter == 'professional',
                          onTap: () => _setFilter('professional'),
                          selectedColor: AppColors.proBadge,
                          icon: Icons.local_taxi,
                        ),
                        const SizedBox(width: 8),
                        ChipFilter(
                          label: 'Women Only',
                          isSelected: filter == 'women_only',
                          onTap: () => _setFilter('women_only'),
                          selectedColor: AppColors.womenOnlyBadge,
                          icon: Icons.female,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: !_hasCoordinates(params)
                  ? _buildMissingSearchState(context)
                  : _buildResults(context, params),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMissingSearchState(BuildContext context) {
    return EmptyState(
      icon: Icons.search,
      title: 'Search for a ride',
      subtitle: 'Enter your pickup and drop locations to see available rides.',
      actionText: 'Search Rides',
      onAction: () => context.go('/ride-now'),
    );
  }

  Widget _buildResults(BuildContext context, Map<String, dynamic> params) {
    final resultAsync = ref.watch(rideSearchResultProvider(params));

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(rideSearchResultProvider(params)),
      child: resultAsync.when(
        data: (result) {
          if (result.results.isEmpty) {
            return ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                const SizedBox(height: 80),
                EmptyState(
                  icon: Icons.directions_car_outlined,
                  title: 'No rides available',
                  subtitle:
                      'We could not find rides for this route right now. Pull to refresh or try another filter.',
                ),
              ],
            );
          }
          return ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            itemCount: result.results.length,
            itemBuilder: (context, index) {
              final option = result.results[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: RideOptionCard(
                  driverName:
                      (option.driver?.name.isNotEmpty ?? false)
                          ? option.driver!.name
                          : 'Driver',
                  driverPhoto: option.driver?.avatarUrl,
                  rating: option.driver?.rating ?? 0,
                  badgeType: _badgeType(option),
                  pickupAddress: (params['pickupAddress'] as String?) ?? '',
                  dropAddress: (params['dropAddress'] as String?) ?? '',
                  departureTime: option.schedule?.departureTime,
                  fare: option.estimatedFare ?? option.pricePerSeat ?? 0,
                  seatsAvailable: option.availableSeats ?? 1,
                  vehicleInfo: _vehicleInfo(option.vehicle),
                  isRecommended: index == 0,
                  onTap: () {
                    ref.read(selectedRideOptionProvider.notifier).state =
                        option;
                    context.push('/ride-now/confirm');
                  },
                ),
              );
            },
          );
        },
        loading: () => ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20),
          itemCount: 4,
          itemBuilder: (context, index) => Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: SkeletonLoader.card(),
          ),
        ),
        error: (error, stackTrace) => ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            const SizedBox(height: 60),
            ErrorState(
              title: 'Could not load rides',
              subtitle: 'Check your connection and try again.',
              actionText: 'Retry',
              onAction: () => ref.invalidate(rideSearchResultProvider(params)),
            ),
          ],
        ),
      ),
    );
  }

  String _badgeType(RideOption option) {
    if (option.womenOnly) return 'women_only';
    if (option.type == 'SCHEDULED') return 'carpool';
    return 'professional';
  }

  String? _vehicleInfo(VehicleInfo? vehicle) {
    if (vehicle == null) return null;
    final parts = [
      vehicle.displayName,
      vehicle.licensePlate ?? '',
    ].where((part) => part.trim().isNotEmpty);
    final info = parts.join(' • ');
    return info.isEmpty ? null : info;
  }
}
