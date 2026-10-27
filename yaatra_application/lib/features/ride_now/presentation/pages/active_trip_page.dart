import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/error_state.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../rides/data/rides_repository.dart';
import '../../../rides/models/trip.dart';
import '../../../rides/providers/rides_providers.dart';
import '../../../safety/data/safety_repository.dart';

class ActiveTripPage extends ConsumerWidget {
  const ActiveTripPage({super.key, required this.tripId});

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
            title: 'Could not load this trip',
            subtitle: 'The trip details are unavailable right now.',
            actionText: 'Retry',
            onAction: () => ref.invalidate(tripDetailProvider(tripId)),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, Trip trip) {
    final status = _statusInfo(trip.status);

    return Column(
      children: [
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async => ref.invalidate(tripDetailProvider(tripId)),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios),
                        onPressed: () => context.pop(),
                      ),
                      _buildStatusChip(status),
                      IconButton(
                        icon: const Icon(Icons.share),
                        onPressed: () => _shareTrip(context, ref),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildMapPlaceholder(trip),
                  const SizedBox(height: 20),
                  _buildTripStatus(trip, status),
                  const SizedBox(height: 20),
                  _buildRouteCard(trip),
                  if (trip.driver != null) ...[
                    const SizedBox(height: 20),
                    _buildDriverCard(trip),
                  ],
                  const SizedBox(height: 20),
                  _buildTripActions(context, ref, trip),
                ],
              ),
            ),
          ),
        ),
        if (trip.status == 'COMPLETED' || trip.status == 'CANCELLED')
          Padding(
            padding: const EdgeInsets.all(20),
            child: PrimaryButton(
              text: 'Back to Home',
              onPressed: () => context.go('/home'),
            ),
          ),
      ],
    );
  }

  Widget _buildStatusChip(({Color color, String label, double progress}) status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: status.color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: status.color.withValues(alpha: 0.3)),
      ),
      child: Text(
        status.label,
        style: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: status.color,
        ),
      ),
    );
  }

  Widget _buildMapPlaceholder(Trip trip) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.map, size: 48, color: AppColors.textMuted),
            const SizedBox(height: 8),
            Text(
              '${Formatters.distance(_tripDistanceKm(trip))} • ${trip.pickupAddress}',
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTripStatus(
    Trip trip,
    ({Color color, String label, double progress}) status,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(
                Icons.access_time,
                color: AppColors.primary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                status.label,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              Text(
                _tripSummary(trip),
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  color: AppColors.textSecondary.withValues(alpha: 0.7),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: status.progress,
            backgroundColor: AppColors.surfaceElevated,
            valueColor: const AlwaysStoppedAnimation<Color>(
              AppColors.primary,
            ),
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildRouteCard(Trip trip) {
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
            height: 24,
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

  Widget _buildDriverCard(Trip trip) {
    final driver = trip.driver!;
    final name = (driver['name'] as String?) ?? 'Driver';
    final phone = (driver['phone'] as String?) ?? '';
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
            radius: 28,
            backgroundColor: AppColors.surfaceElevated,
            backgroundImage:
                avatarUrl != null ? NetworkImage(avatarUrl) : null,
            child: avatarUrl == null
                ? const Icon(Icons.person, size: 28, color: AppColors.textMuted)
                : null,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  phone.isEmpty ? 'Driver assigned' : Formatters.maskedPhone(phone),
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: AppColors.success,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.phone,
              color: Colors.white,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTripActions(BuildContext context, WidgetRef ref, Trip trip) {
    final canCancel = trip.status != 'COMPLETED' && trip.status != 'CANCELLED';
    return Row(
      children: [
        Expanded(
          child: _buildActionButton(
            icon: Icons.warning_amber,
            label: 'SOS',
            color: AppColors.sosRed,
            onTap: () => _showSOS(context, ref),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            icon: Icons.share_location,
            label: 'Share',
            color: AppColors.primary,
            onTap: () => _shareTrip(context, ref),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            icon: Icons.cancel,
            label: 'Cancel',
            color: AppColors.error,
            onTap: canCancel ? () => _cancelTrip(context, ref) : null,
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback? onTap,
  }) {
    final enabled = onTap != null;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: enabled ? 0.1 : 0.04),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: color.withValues(alpha: enabled ? 0.3 : 0.1),
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: enabled ? color : AppColors.textDisabled, size: 24),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: enabled ? color : AppColors.textDisabled,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _shareTrip(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(safetyRepositoryProvider).shareTrip(tripId);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Trip link shared with your contacts')),
      );
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not share this trip')),
      );
    }
  }

  void _showSOS(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.warning_amber, color: AppColors.sosRed, size: 48),
            const SizedBox(height: 16),
            const Text(
              'Emergency SOS',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.sosRed,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'This will alert your emergency contacts and share your live location.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              text: 'Send SOS Alert',
              backgroundColor: AppColors.sosRed,
              onPressed: () async {
                Navigator.pop(context);
                await _triggerSOS(context, ref);
              },
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'Cancel',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _triggerSOS(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(safetyRepositoryProvider).triggerEmergency();
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('SOS alert sent to your contacts')),
      );
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not send the SOS alert')),
      );
    }
  }

  void _cancelTrip(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      builder: (sheetContext) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Cancel Ride?',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'A cancellation fee may apply if the driver is already on the way.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              text: 'Yes, Cancel',
              backgroundColor: AppColors.error,
              onPressed: () async {
                Navigator.pop(sheetContext);
                try {
                  await ref
                      .read(ridesRepositoryProvider)
                      .cancelRide(tripId);
                  ref.invalidate(tripDetailProvider(tripId));
                  ref.invalidate(upcomingRidesProvider);
                  ref.invalidate(rideHistoryProvider);
                  if (!context.mounted) return;
                  context.go('/home');
                } catch (error) {
                  if (!context.mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Could not cancel this ride'),
                    ),
                  );
                }
              },
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(sheetContext),
              child: const Text(
                'Keep Ride',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  double _tripDistanceKm(Trip trip) => trip.distanceKm ?? 0;

  String _tripSummary(Trip trip) {
    final parts = <String>[
      if (trip.distanceKm != null) Formatters.distance(trip.distanceKm!),
      if (trip.durationMin != null) Formatters.duration(trip.durationMin!),
      if (trip.fareEstimateNum > 0) Formatters.currency(trip.fareEstimateNum),
    ];
    return parts.join(' • ');
  }

  ({Color color, String label, double progress}) _statusInfo(String status) {
    switch (status) {
      case 'SEARCHING':
        return (
          color: AppColors.info,
          label: 'Finding a driver',
          progress: 0.15,
        );
      case 'DRIVER_ASSIGNED':
        return (
          color: AppColors.warning,
          label: 'Driver assigned',
          progress: 0.3,
        );
      case 'ARRIVING':
        return (
          color: AppColors.warning,
          label: 'Driver is arriving',
          progress: 0.5,
        );
      case 'IN_PROGRESS':
        return (
          color: AppColors.primary,
          label: 'Trip in progress',
          progress: 0.75,
        );
      case 'COMPLETED':
        return (color: AppColors.success, label: 'Completed', progress: 1);
      case 'CANCELLED':
        return (color: AppColors.error, label: 'Cancelled', progress: 0);
      default:
        return (
          color: AppColors.textSecondary,
          label: status.isEmpty ? 'Unknown' : status,
          progress: 0,
        );
    }
  }
}
