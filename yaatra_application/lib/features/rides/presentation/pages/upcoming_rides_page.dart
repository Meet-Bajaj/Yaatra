import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/error_state.dart';
import '../../../../core/widgets/skeleton.dart';
import '../../models/trip.dart';
import '../../providers/rides_providers.dart';

class UpcomingRidesPage extends ConsumerStatefulWidget {
  const UpcomingRidesPage({super.key});

  @override
  ConsumerState<UpcomingRidesPage> createState() =>
      _UpcomingRidesPageState();
}

class _UpcomingRidesPageState extends ConsumerState<UpcomingRidesPage> {
  int _selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'My Rides',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _buildTab(index: 0, label: 'Upcoming'),
                      _buildTab(index: 1, label: 'History'),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: _selectedTab == 0
                  ? _buildUpcomingRides()
                  : _buildRideHistory(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTab({required int index, required String label}) {
    final isSelected = _selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? AppColors.primary : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isSelected
                  ? AppColors.primary
                  : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUpcomingRides() {
    final ridesAsync = ref.watch(upcomingRidesProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(upcomingRidesProvider),
      child: ridesAsync.when(
        data: (data) {
          if (data.trips.isEmpty && data.bookings.isEmpty) {
            return ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                const SizedBox(height: 60),
                EmptyState(
                  icon: Icons.event_available_outlined,
                  title: 'No upcoming rides',
                  subtitle: 'Book a ride and it will show up here.',
                  actionText: 'Find a Ride',
                  onAction: () => context.push('/ride-now'),
                ),
              ],
            );
          }
          return ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            itemCount: data.trips.length + data.bookings.length,
            itemBuilder: (context, index) {
              if (index < data.trips.length) {
                final trip = data.trips[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildTripCard(trip, isUpcoming: true),
                );
              }
              final booking = data.bookings[index - data.trips.length];
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _buildBookingCard(booking, isUpcoming: true),
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
              subtitle: 'Pull to refresh and try again.',
              actionText: 'Retry',
              onAction: () => ref.invalidate(upcomingRidesProvider),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRideHistory() {
    final historyAsync = ref.watch(rideHistoryProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(rideHistoryProvider),
      child: historyAsync.when(
        data: (data) {
          if (data.trips.isEmpty && data.bookings.isEmpty) {
            return ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                const SizedBox(height: 60),
                const EmptyState(
                  icon: Icons.history,
                  title: 'No ride history yet',
                  subtitle: 'Your completed and cancelled rides appear here.',
                ),
              ],
            );
          }
          return ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            itemCount: data.trips.length + data.bookings.length,
            itemBuilder: (context, index) {
              if (index < data.trips.length) {
                final trip = data.trips[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildTripCard(trip, isUpcoming: false),
                );
              }
              final booking = data.bookings[index - data.trips.length];
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _buildBookingCard(booking, isUpcoming: false),
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
              title: 'Could not load history',
              subtitle: 'Pull to refresh and try again.',
              actionText: 'Retry',
              onAction: () => ref.invalidate(rideHistoryProvider),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTripCard(Trip trip, {required bool isUpcoming}) {
    final fare = trip.fareFinalNum > 0
        ? trip.fareFinalNum
        : trip.fareEstimateNum;
    final when = trip.pickupTime ?? trip.createdAt;
    final status = trip.status;

    return GestureDetector(
      onTap: () => context.push('/rides/${trip.id}'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderWhite10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.surfaceElevated,
                  backgroundImage: trip.driver?['avatarUrl'] != null
                      ? NetworkImage(trip.driver!['avatarUrl'] as String)
                      : null,
                  child: trip.driver?['avatarUrl'] == null
                      ? const Icon(
                          Icons.person,
                          size: 20,
                          color: AppColors.textMuted,
                        )
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              trip.driverName,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          _buildStatusChip(status),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        isUpcoming
                            ? Formatters.rideDateTime(when)
                            : Formatters.timeAgo(when),
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  Formatters.currency(fare),
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildRouteBox(
              pickup: trip.pickupAddress,
              drop: trip.dropAddress,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingCard(Booking booking, {required bool isUpcoming}) {
    final instance = booking.instance;
    final ride = instance?['ride'] as Map<String, dynamic>?;
    final driverUser = ride?['driver']?['user'] as Map<String, dynamic>?;
    final driverName = (driverUser?['name'] as String?) ?? 'Driver';
    final when = DateTime.tryParse(
          (instance?['departureTime'] as String?) ??
              (instance?['date'] as String?) ??
              '',
        ) ??
        booking.createdAt;
    final pickup = (ride?['pickupAddress'] as String?) ?? '';
    final drop = (ride?['dropAddress'] as String?) ?? '';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                radius: 20,
                backgroundColor: AppColors.surfaceElevated,
                child: Icon(
                  Icons.event_seat,
                  size: 20,
                  color: AppColors.carpoolBadge,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            driverName,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        _buildStatusChip(booking.bookingStatus),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${Formatters.rideDateTime(when)} • ${booking.seatCount} ${booking.seatCount == 1 ? 'seat' : 'seats'}',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                Formatters.currency(booking.fareTotalNum),
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildRouteBox(pickup: pickup, drop: drop),
        ],
      ),
    );
  }

  Widget _buildRouteBox({required String pickup, required String drop}) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          const Icon(Icons.circle, size: 6, color: AppColors.success),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              pickup.isEmpty ? 'Pickup not set' : pickup,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          const Icon(
            Icons.arrow_forward,
            size: 12,
            color: AppColors.textMuted,
          ),
          const SizedBox(width: 8),
          const Icon(Icons.circle, size: 6, color: AppColors.error),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              drop.isEmpty ? 'Drop not set' : drop,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    final color = switch (status) {
      'COMPLETED' || 'CONFIRMED' => AppColors.success,
      'CANCELLED' => AppColors.error,
      'PENDING' || 'SEARCHING' || 'DRIVER_ASSIGNED' || 'ARRIVING' =>
        AppColors.warning,
      'IN_PROGRESS' => AppColors.info,
      _ => AppColors.textSecondary,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        status.replaceAll('_', ' '),
        style: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}
