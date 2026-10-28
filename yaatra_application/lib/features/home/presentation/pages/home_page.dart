import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/skeleton.dart';
import '../../../auth/providers/auth_providers.dart';
import '../../../rides/models/trip.dart';
import '../../../rides/providers/rides_providers.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);
    final ridesAsync = ref.watch(upcomingRidesProvider);
    final user = userAsync.valueOrNull;
    final isDriver = user?.isDriver ?? false;
    final name = user?.name;
    final greeting = (name == null || name.isEmpty)
        ? 'Hello! 👋'
        : 'Hello, $name! 👋';

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(upcomingRidesProvider);
            ref.invalidate(currentUserProvider);
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            greeting,
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 14,
                              color: AppColors.textSecondary.withValues(
                                alpha: 0.7,
                              ),
                            ),
                          ),
                          Text(
                            isDriver ? 'Ready to earn?' : 'Where are you going?',
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (user?.city != null && user!.city!.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.borderWhite10),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 14,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              user.city!,
                              style: const TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 24),
                if (!isDriver) ...[
                  _buildSearchBar(context),
                  const SizedBox(height: 24),
                ],
                _buildQuickActions(context, isDriver: isDriver),
                const SizedBox(height: 24),
                _buildUpcomingRide(context, ref, ridesAsync),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSearchBar(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/ride-now'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderWhite10),
          boxShadow: [
            BoxShadow(
              color: AppColors.textPrimary.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Row(
          children: [
            Icon(Icons.search, color: AppColors.textMuted, size: 24),
            SizedBox(width: 12),
            Text(
              'Search destination',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 15,
                color: AppColors.textMuted,
              ),
            ),
            Spacer(),
            Icon(Icons.mic, color: AppColors.primary, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context, {required bool isDriver}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                context,
                title: isDriver ? 'Go Online' : 'Ride Now',
                subtitle: isDriver ? 'Start trip requests' : 'Find instant rides',
                icon: isDriver ? Icons.power_settings_new : Icons.flash_on,
                color: AppColors.primary,
                onTap: () => context.push(
                  isDriver ? '/driver/online' : '/ride-now',
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildActionCard(
                context,
                title: isDriver ? 'Offer Seat' : 'Plan Commute',
                subtitle: isDriver ? 'Publish your route' : 'Schedule daily rides',
                icon: isDriver
                    ? Icons.directions_car
                    : Icons.calendar_today,
                color: AppColors.carpoolBadge,
                onTap: () => context.push(
                  isDriver ? '/driver/offer' : '/plan-commute',
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildSmallActionCard(
                context,
                title: isDriver ? 'My Offers' : 'My Rides',
                icon: isDriver ? Icons.list_alt : Icons.directions_car_filled,
                color: AppColors.proBadge,
                onTap: () => context.push(
                  isDriver ? '/driver/offers' : '/rides/upcoming',
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildSmallActionCard(
                context,
                title: isDriver ? 'Earnings' : 'Wallet',
                icon: isDriver
                    ? Icons.payments_outlined
                    : Icons.account_balance_wallet,
                color: AppColors.warning,
                onTap: () => context.push(
                  isDriver ? '/driver/earnings' : '/wallet',
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildSmallActionCard(
                context,
                title: 'Safety',
                icon: Icons.shield,
                color: AppColors.error,
                onTap: () => context.push('/safety'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    final isLight = color == AppColors.primary;
    final foreground = isLight ? AppColors.onPrimary : Colors.white;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: foreground, size: 32),
            const SizedBox(height: 16),
            Text(
              title,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: foreground,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: foreground.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSmallActionCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderWhite10),
        ),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingRide(
    BuildContext context,
    WidgetRef ref,
    AsyncValue<UpcomingRides> ridesAsync,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Upcoming Ride',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        ridesAsync.when(
          data: (data) {
            if (data.trips.isNotEmpty) {
              return _buildTripCard(context, data.trips.first);
            }
            if (data.bookings.isNotEmpty) {
              return _buildBookingCard(context, data.bookings.first);
            }
            return _buildEmptyRideCard(context);
          },
          loading: () => SkeletonLoader.card(),
          error: (error, stackTrace) => Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderWhite10),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.error_outline,
                  color: AppColors.error,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Could not load your rides',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 13,
                      color: AppColors.textSecondary.withValues(alpha: 0.8),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () => ref.invalidate(upcomingRidesProvider),
                  child: const Text(
                    'Retry',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyRideCard(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/ride-now'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderWhite10),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.directions_car,
                color: AppColors.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'No upcoming rides',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Book a ride to get started',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: AppColors.textSecondary.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: AppColors.textMuted,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTripCard(BuildContext context, Trip trip) {
    final fare = trip.fareFinalNum > 0
        ? trip.fareFinalNum
        : trip.fareEstimateNum;
    final when = trip.pickupTime ?? trip.createdAt;

    return GestureDetector(
      onTap: () => context.push('/rides/${trip.id}'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderWhite10),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.directions_car,
                color: AppColors.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    trip.driverName,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    trip.dropAddress.isEmpty
                        ? trip.pickupAddress
                        : trip.dropAddress,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    Formatters.rideDateTime(when),
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              Formatters.currency(fare),
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingCard(BuildContext context, Booking booking) {
    final instance = booking.instance;
    final ride = instance?['ride'] as Map<String, dynamic>?;
    final when = DateTime.tryParse(
          (instance?['departureTime'] as String?) ??
              (instance?['date'] as String?) ??
              '',
        ) ??
        booking.createdAt;

    return GestureDetector(
      onTap: () => context.push('/rides/upcoming'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderWhite10),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.carpoolBadge.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.event_seat,
                color: AppColors.carpoolBadge,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Carpool booking',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    (ride?['dropAddress'] as String?) ?? 'Scheduled ride',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${Formatters.rideDateTime(when)} • ${booking.seatCount} ${booking.seatCount == 1 ? 'seat' : 'seats'}',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              Formatters.currency(booking.fareTotalNum),
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
