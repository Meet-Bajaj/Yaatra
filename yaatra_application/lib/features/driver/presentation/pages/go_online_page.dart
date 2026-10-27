import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/error_state.dart';
import '../../data/driver_repository.dart';
import '../../models/driver_models.dart';
import '../../providers/driver_providers.dart';

class GoOnlinePage extends ConsumerStatefulWidget {
  const GoOnlinePage({super.key});

  @override
  ConsumerState<GoOnlinePage> createState() => _GoOnlinePageState();
}

class _GoOnlinePageState extends ConsumerState<GoOnlinePage> {
  bool? _isOnlineOverride;
  String? _selectedVehicleId;
  bool _isToggling = false;

  Future<void> _toggleOnline(DriverProfile profile) async {
    final isOnline = _isOnlineOverride ?? profile.isOnline;
    final vehicleId =
        _selectedVehicleId ?? (profile.vehicles.isNotEmpty ? profile.vehicles.first.id : null);

    setState(() => _isToggling = true);
    try {
      final repo = ref.read(driverRepositoryProvider);
      if (isOnline) {
        await repo.goOffline();
      } else {
        if (vehicleId == null) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Add a vehicle before going online')),
            );
          }
          return;
        }
        if (profile.driverType == 'CARPOOL') {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Carpool drivers publish seats instead of going online',
                ),
              ),
            );
          }
          return;
        }
        final position = await Geolocator.getCurrentPosition();
        await repo.goOnline(
          lat: position.latitude,
          lng: position.longitude,
          vehicleId: vehicleId,
        );
      }
      _isOnlineOverride = !isOnline;
      ref.invalidate(driverProfileProvider);
      ref.invalidate(driverEarningsProvider);
      ref.invalidate(driverOffersProvider);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isOnline
                  ? 'Could not go offline. Try again.'
                  : 'Could not go online. Check location permission and try again.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isToggling = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileAsync = ref.watch(driverProfileProvider);

    return Scaffold(
      body: SafeArea(
        child: profileAsync.when(
          data: (profile) => _buildBody(context, profile),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stackTrace) => ErrorState(
            title: 'Could not load driver profile',
            subtitle: 'Make sure your driver profile is set up.',
            actionText: 'Retry',
            onAction: () => ref.invalidate(driverProfileProvider),
          ),
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, DriverProfile profile) {
    final isOnline = _isOnlineOverride ?? profile.isOnline;
    final isCarpoolOnly = profile.driverType == 'CARPOOL';

    return Column(
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
                'Go Online',
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
            onRefresh: () async => ref.invalidate(driverProfileProvider),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  if (isCarpoolOnly) ...[
                    _buildCarpoolNotice(),
                    const SizedBox(height: 16),
                  ],
                  _buildOnlineToggle(profile, isOnline: isOnline, disabled: isCarpoolOnly),
                  const SizedBox(height: 24),
                  _buildVehicleSelector(profile),
                  const SizedBox(height: 24),
                  _buildTodayStats(profile),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCarpoolNotice() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.carpoolBadge.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.carpoolBadge.withValues(alpha: 0.3)),
      ),
      child: const Row(
        children: [
          Icon(Icons.info_outline, color: AppColors.carpoolBadge, size: 20),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              'You are a carpool driver. Publish seats with Offer a Seat instead of going online.',
              style: TextStyle(
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

  Widget _buildOnlineToggle(
    DriverProfile profile, {
    required bool isOnline,
    required bool disabled,
  }) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isOnline
            ? AppColors.success.withValues(alpha: 0.1)
            : AppColors.surfaceElevated.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isOnline ? AppColors.success : AppColors.borderWhite10,
        ),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: _isToggling || disabled ? null : () => _toggleOnline(profile),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: isOnline ? AppColors.success : AppColors.textDisabled,
                shape: BoxShape.circle,
                boxShadow: [
                  if (isOnline)
                    BoxShadow(
                      color: AppColors.success.withValues(alpha: 0.3),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                ],
              ),
              child: _isToggling
                  ? const Padding(
                      padding: EdgeInsets.all(24),
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                        color: Colors.white,
                      ),
                    )
                  : Icon(
                      isOnline ? Icons.check : Icons.power_settings_new,
                      color: Colors.white,
                      size: 36,
                    ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            isOnline ? "You're Online" : "You're Offline",
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: isOnline ? AppColors.success : AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isOnline
                ? "You're now visible to nearby riders"
                : 'Tap the button to start receiving ride requests',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildVehicleSelector(DriverProfile profile) {
    final selectedId =
        _selectedVehicleId ?? (profile.vehicles.isNotEmpty ? profile.vehicles.first.id : null);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select Vehicle',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        if (profile.vehicles.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderWhite10),
            ),
            child: const Column(
              children: [
                Icon(Icons.directions_car_outlined,
                    size: 32, color: AppColors.textMuted),
                SizedBox(height: 8),
                Text(
                  'No vehicles added yet',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Add a vehicle from your profile to go online.',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.textMuted,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          )
        else
          ...profile.vehicles.map((vehicle) {
            final isSelected = selectedId == vehicle.id;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: () => setState(() => _selectedVehicleId = vehicle.id),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary.withValues(alpha: 0.05)
                        : AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.borderWhite10,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.directions_car,
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.textSecondary,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              vehicle.displayName.trim(),
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: isSelected
                                    ? AppColors.primary
                                    : AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              '${vehicle.licensePlate} • ${vehicle.capacity} seats',
                              style: const TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isSelected)
                        const Icon(
                          Icons.check_circle,
                          color: AppColors.primary,
                        ),
                    ],
                  ),
                ),
              ),
            );
          }),
      ],
    );
  }

  Widget _buildTodayStats(DriverProfile profile) {
    final earningsAsync = ref.watch(driverEarningsProvider);

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
            "Today's Overview",
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          earningsAsync.when(
            data: (earnings) => Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem(
                  Formatters.currency(earnings.todayEarnings),
                  'Earned',
                ),
                _buildStatItem('${earnings.todayTrips}', 'Trips'),
                _buildStatItem(
                  profile.totalRating.toStringAsFixed(1),
                  'Rating',
                ),
              ],
            ),
            loading: () => const Center(
              child: Padding(
                padding: EdgeInsets.all(12),
                child: CircularProgressIndicator(),
              ),
            ),
            error: (error, stackTrace) => Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('—', 'Earned'),
                _buildStatItem('—', 'Trips'),
                _buildStatItem(
                  profile.totalRating.toStringAsFixed(1),
                  'Rating',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: AppColors.primary,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
