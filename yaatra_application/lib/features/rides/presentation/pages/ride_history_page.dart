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

class RideHistoryPage extends ConsumerWidget {
  const RideHistoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(rideHistoryProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios),
                    onPressed: () => context.pop(),
                  ),
                  const Text(
                    'Ride History',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: RefreshIndicator(
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
                            title: 'No rides yet',
                            subtitle:
                                'Your completed and cancelled rides will appear here.',
                          ),
                        ],
                      );
                    }
                    return ListView.builder(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 8,
                      ),
                      itemCount: data.trips.length + data.bookings.length,
                      itemBuilder: (context, index) {
                        if (index < data.trips.length) {
                          final trip = data.trips[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: _buildTripItem(context, trip),
                          );
                        }
                        final booking =
                            data.bookings[index - data.trips.length];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _buildBookingItem(booking),
                        );
                      },
                    );
                  },
                  loading: () => ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: 6,
                    itemBuilder: (context, index) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
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
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTripItem(BuildContext context, Trip trip) {
    final isCancelled = trip.status == 'CANCELLED';
    final fare = trip.fareFinalNum > 0
        ? trip.fareFinalNum
        : trip.fareEstimateNum;

    return GestureDetector(
      onTap: () => context.push('/rides/${trip.id}'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.borderWhite10),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: (isCancelled ? AppColors.error : AppColors.success)
                    .withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                isCancelled ? Icons.close : Icons.check,
                color: isCancelled ? AppColors.error : AppColors.success,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${trip.pickupAddress.isEmpty ? 'Pickup' : trip.pickupAddress} → ${trip.dropAddress.isEmpty ? 'Drop' : trip.dropAddress}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    '${Formatters.rideDateTime(trip.endTime ?? trip.createdAt)} • ${trip.status.replaceAll('_', ' ')}',
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
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isCancelled
                    ? AppColors.error
                    : AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingItem(Booking booking) {
    final instance = booking.instance;
    final ride = instance?['ride'] as Map<String, dynamic>?;
    final when = DateTime.tryParse(
          (instance?['departureTime'] as String?) ??
              (instance?['date'] as String?) ??
              '',
        ) ??
        booking.createdAt;
    final isCancelled = booking.bookingStatus == 'CANCELLED';
    final pickup = (ride?['pickupAddress'] as String?) ?? 'Pickup';
    final drop = (ride?['dropAddress'] as String?) ?? 'Drop';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: (isCancelled ? AppColors.error : AppColors.success)
                  .withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isCancelled ? Icons.close : Icons.event_seat,
              color: isCancelled ? AppColors.error : AppColors.success,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$pickup → $drop',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  '${Formatters.rideDateTime(when)} • ${booking.bookingStatus}',
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
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isCancelled ? AppColors.error : AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
