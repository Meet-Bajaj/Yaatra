import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/error_state.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../safety/data/safety_repository.dart';
import '../../data/rides_repository.dart';
import '../../models/trip.dart';
import '../../providers/rides_providers.dart';

class RideDetailPage extends ConsumerWidget {
  const RideDetailPage({super.key, required this.tripId});

  final String tripId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripAsync = ref.watch(tripDetailProvider(tripId));

    return Scaffold(
      body: SafeArea(
        child: tripAsync.when(
          data: (trip) => _buildContent(context, ref, trip),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stackTrace) => ErrorState(
            title: 'Could not load this ride',
            subtitle: 'The ride details are unavailable right now.',
            actionText: 'Retry',
            onAction: () => ref.invalidate(tripDetailProvider(tripId)),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, Trip trip) {
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(tripDetailProvider(tripId)),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
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
                  'Ride Details',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const Spacer(),
                _buildStatusChip(trip.status),
              ],
            ),
            const SizedBox(height: 24),
            _buildRouteInfo(trip),
            const SizedBox(height: 20),
            _buildRiderInfo(trip),
            if (trip.driver != null) ...[
              const SizedBox(height: 20),
              _buildDriverInfo(trip),
            ],
            const SizedBox(height: 20),
            _buildFareInfo(trip),
            const SizedBox(height: 20),
            _buildActions(context, ref, trip),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    final color = switch (status) {
      'COMPLETED' => AppColors.success,
      'CANCELLED' => AppColors.error,
      'IN_PROGRESS' => AppColors.info,
      'SEARCHING' || 'DRIVER_ASSIGNED' || 'ARRIVING' => AppColors.warning,
      _ => AppColors.textSecondary,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        status.replaceAll('_', ' '),
        style: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Widget _buildRouteInfo(Trip trip) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Column(
        children: [
          _buildRoutePoint(
            color: AppColors.success,
            label: 'Pickup',
            address: trip.pickupAddress,
            time: trip.pickupTime != null
                ? Formatters.rideTime(trip.pickupTime!)
                : '',
          ),
          const SizedBox(height: 12),
          Container(
            width: 2,
            height: 30,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [AppColors.success, AppColors.error],
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildRoutePoint(
            color: AppColors.error,
            label: 'Drop',
            address: trip.dropAddress,
            time: trip.endTime != null
                ? Formatters.rideTime(trip.endTime!)
                : trip.startTime != null
                    ? Formatters.rideTime(trip.startTime!)
                    : '',
          ),
        ],
      ),
    );
  }

  Widget _buildRoutePoint({
    required Color color,
    required String label,
    required String address,
    required String time,
  }) {
    return Row(
      children: [
        Icon(Icons.circle, size: 12, color: color),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                address.isEmpty ? 'Location not set' : address,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
        if (time.isNotEmpty)
          Text(
            time,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
      ],
    );
  }

  Widget _buildRiderInfo(Trip trip) {
    final rider = trip.rider;
    final name = (rider?['name'] as String?) ?? 'You';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.surfaceElevated,
            child: Text(
              name.isEmpty ? 'Y' : name[0].toUpperCase(),
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Rider',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                Text(
                  name,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDriverInfo(Trip trip) {
    final driver = trip.driver!;
    final name = (driver['name'] as String?) ?? 'Driver';
    final avatarUrl = driver['avatarUrl'] as String?;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.surfaceElevated,
            backgroundImage:
                avatarUrl != null ? NetworkImage(avatarUrl) : null,
            child: avatarUrl == null
                ? const Icon(Icons.person, size: 24, color: AppColors.textMuted)
                : null,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Driver',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                Text(
                  name,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFareInfo(Trip trip) {
    final fare = trip.fareFinalNum > 0
        ? trip.fareFinalNum
        : trip.fareEstimateNum;

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
          const Text(
            'Fare Details',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          if (trip.distanceKm != null)
            _buildFareRow('Distance', Formatters.distance(trip.distanceKm!)),
          if (trip.durationMin != null)
            _buildFareRow('Duration', Formatters.duration(trip.durationMin!)),
          _buildFareRow(
            trip.fareFinalNum > 0 ? 'Final fare' : 'Estimated fare',
            Formatters.currency(fare),
          ),
          const Divider(height: 24),
          _buildFareRow('Total', Formatters.currency(fare), isTotal: true),
          const SizedBox(height: 4),
          _buildFareRow('Status', trip.status.replaceAll('_', ' ')),
          _buildFareRow('Booked on', Formatters.rideDate(trip.createdAt)),
        ],
      ),
    );
  }

  Widget _buildFareRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: isTotal ? 16 : 14,
              fontWeight: isTotal ? FontWeight.w600 : FontWeight.w400,
              color: isTotal
                  ? AppColors.textPrimary
                  : AppColors.textSecondary,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: isTotal ? 16 : 14,
              fontWeight: isTotal ? FontWeight.w700 : FontWeight.w500,
              color: isTotal ? AppColors.primary : AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActions(BuildContext context, WidgetRef ref, Trip trip) {
    final canRebook = trip.status == 'COMPLETED' || trip.status == 'CANCELLED';
    final canRate =
        trip.status == 'COMPLETED' && (trip.driver?['id'] != null);

    return Row(
      children: [
        Expanded(
          child: _buildActionButton(
            icon: Icons.refresh,
            label: 'Rebook',
            onTap: canRebook ? () => _rebook(context, ref) : null,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            icon: Icons.flag,
            label: 'Report',
            onTap: () => _report(context, ref),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            icon: Icons.star,
            label: 'Rate',
            onTap: canRate ? () => _rate(context, ref, trip) : null,
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback? onTap,
  }) {
    final enabled = onTap != null;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: enabled
                ? AppColors.borderWhite10
                : AppColors.borderWhite10.withValues(alpha: 0.4),
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: enabled ? AppColors.primary : AppColors.textDisabled,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: enabled ? AppColors.textPrimary : AppColors.textDisabled,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _rebook(BuildContext context, WidgetRef ref) async {
    try {
      final trip = await ref.read(ridesRepositoryProvider).rebookRide(tripId);
      ref.invalidate(upcomingRidesProvider);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ride booked again. Looking for a driver.')),
      );
      context.go('/active-trip/${trip.id}');
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not rebook this ride')),
      );
    }
  }

  void _report(BuildContext context, WidgetRef ref) {
    final controller = TextEditingController();

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text(
          'Report an issue',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        content: TextField(
          controller: controller,
          maxLines: 4,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14,
            color: AppColors.textPrimary,
          ),
          decoration: const InputDecoration(
            hintText: 'Tell us what happened',
            hintStyle: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              color: AppColors.textMuted,
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text(
              'Cancel',
              style: TextStyle(
                fontFamily: 'Poppins',
                color: AppColors.textSecondary,
              ),
            ),
          ),
          TextButton(
            onPressed: () async {
              final description = controller.text.trim();
              if (description.isEmpty) return;
              Navigator.pop(dialogContext);
              try {
                await ref.read(safetyRepositoryProvider).reportIssue(
                      description: description,
                      tripId: tripId,
                    );
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Report submitted. Our team will review it.'),
                  ),
                );
              } catch (error) {
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Could not submit the report')),
                );
              }
            },
            child: const Text(
              'Submit',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _rate(BuildContext context, WidgetRef ref, Trip trip) {
    var score = 5;

    showModalBottomSheet(
      context: context,
      builder: (sheetContext) => StatefulBuilder(
        builder: (sheetContext, setSheetState) => Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Rate your ride',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                trip.driverName,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  final filled = index < score;
                  return IconButton(
                    onPressed: () => setSheetState(() => score = index + 1),
                    icon: Icon(
                      filled ? Icons.star : Icons.star_border,
                      color: filled
                          ? AppColors.warning
                          : AppColors.textDisabled,
                      size: 36,
                    ),
                  );
                }),
              ),
              const SizedBox(height: 20),
              PrimaryButton(
                text: 'Submit Rating',
                onPressed: () async {
                  final driverId = trip.driver?['id'] as String?;
                  Navigator.pop(sheetContext);
                  if (driverId == null) return;
                  try {
                    await ref.read(safetyRepositoryProvider).submitRating(
                          revieweeId: driverId,
                          score: score,
                          tripId: tripId,
                        );
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Thanks for your rating!')),
                    );
                  } catch (error) {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Could not submit rating')),
                    );
                  }
                },
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => Navigator.pop(sheetContext),
                child: const Text(
                  'Later',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
