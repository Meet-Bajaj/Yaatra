import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../rides/providers/rides_providers.dart';
import '../../../wallet/models/wallet_model.dart';
import '../../../wallet/providers/wallet_providers.dart';
import '../../data/ride_repository.dart';
import '../../models/ride_option.dart';
import '../../providers/ride_providers.dart';

class RideConfirmationPage extends ConsumerStatefulWidget {
  const RideConfirmationPage({super.key, this.option});

  final RideOption? option;

  @override
  ConsumerState<RideConfirmationPage> createState() =>
      _RideConfirmationPageState();
}

class _RideConfirmationPageState extends ConsumerState<RideConfirmationPage> {
  String _selectedPayment = 'wallet';
  int _seats = 1;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final option = widget.option ?? ref.watch(selectedRideOptionProvider);

    if (option == null) {
      return Scaffold(
        body: SafeArea(
          child: Column(
            children: [
              _buildHeader(context, 'Confirm Ride'),
              Expanded(
                child: EmptyState(
                  icon: Icons.directions_car_outlined,
                  title: 'No ride selected',
                  subtitle: 'Pick a ride option to continue with booking.',
                  actionText: 'Find a Ride',
                  onAction: () => context.go('/ride-now'),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final params = ref.watch(rideSearchParamsProvider);
    final pickupAddress = (params['pickupAddress'] as String?) ?? '';
    final dropAddress = (params['dropAddress'] as String?) ?? '';
    final pickupLat = (params['pickupLat'] as num?)?.toDouble();
    final pickupLng = (params['pickupLng'] as num?)?.toDouble();
    final dropLat = (params['dropLat'] as num?)?.toDouble();
    final dropLng = (params['dropLng'] as num?)?.toDouble();
    final isScheduled = option.type == 'SCHEDULED';
    final maxSeats = option.availableSeats ?? 1;
    final seats = isScheduled ? _seats.clamp(1, maxSeats) : 1;
    final farePerSeat = option.estimatedFare ?? option.pricePerSeat ?? 0;
    final total = isScheduled ? farePerSeat * seats : farePerSeat;
    final walletAsync = ref.watch(walletProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(context, 'Confirm Ride'),
                    const SizedBox(height: 24),
                    _buildRouteCard(
                      pickupAddress: pickupAddress,
                      dropAddress: dropAddress,
                      departureTime: option.schedule?.departureTime,
                      distanceKm: option.distanceKm,
                    ),
                    const SizedBox(height: 20),
                    if (option.driver != null) ...[
                      _buildDriverInfo(option),
                      const SizedBox(height: 20),
                    ],
                    _buildFareBreakdown(
                      option: option,
                      isScheduled: isScheduled,
                      seats: seats,
                      farePerSeat: farePerSeat,
                      total: total,
                      onChangedSeats: isScheduled && maxSeats > 1
                          ? (value) => setState(() => _seats = value)
                          : null,
                      maxSeats: maxSeats,
                    ),
                    const SizedBox(height: 20),
                    _buildPaymentMethod(walletAsync),
                    const SizedBox(height: 20),
                    _buildCancellationPolicy(),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryButton(
                text: 'Confirm Booking - ${Formatters.currency(total)}',
                onPressed: () => _confirmBooking(
                  option: option,
                  seats: seats,
                  pickupLat: pickupLat,
                  pickupLng: pickupLng,
                  dropLat: dropLat,
                  dropLng: dropLng,
                  pickupAddress: pickupAddress,
                  dropAddress: dropAddress,
                ),
                isLoading: _isLoading,
                icon: Icons.check_circle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, String title) {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () => context.pop(),
        ),
        Text(
          title,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildRouteCard({
    required String pickupAddress,
    required String dropAddress,
    required DateTime? departureTime,
    required double? distanceKm,
  }) {
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
            iconColor: AppColors.success,
            label: 'Pickup',
            address: pickupAddress.isEmpty ? 'Pickup location' : pickupAddress,
            time: departureTime != null
                ? Formatters.rideTime(departureTime)
                : 'ASAP',
          ),
          const SizedBox(height: 12),
          _buildRouteLine(distanceKm: distanceKm),
          const SizedBox(height: 12),
          _buildRoutePoint(
            iconColor: AppColors.error,
            label: 'Drop',
            address: dropAddress.isEmpty ? 'Drop location' : dropAddress,
            time: distanceKm != null ? Formatters.distance(distanceKm) : '',
          ),
        ],
      ),
    );
  }

  Widget _buildRoutePoint({
    required Color iconColor,
    required String label,
    required String address,
    required String time,
  }) {
    return Row(
      children: [
        Icon(Icons.circle, size: 12, color: iconColor),
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
                address,
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

  Widget _buildRouteLine({required double? distanceKm}) {
    return Row(
      children: [
        const SizedBox(width: 5),
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
        const SizedBox(width: 19),
        Expanded(
          child: Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.success.withValues(alpha: 0.5),
                  AppColors.error.withValues(alpha: 0.5),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          distanceKm != null ? Formatters.distance(distanceKm) : 'Route',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 11,
            color: AppColors.textSecondary.withValues(alpha: 0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildDriverInfo(RideOption option) {
    final driver = option.driver!;
    final vehicle = option.vehicle;
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
            backgroundImage: driver.avatarUrl != null
                ? NetworkImage(driver.avatarUrl!)
                : null,
            child: driver.avatarUrl == null
                ? const Icon(Icons.person, size: 28, color: AppColors.textMuted)
                : null,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  driver.name.isEmpty ? 'Driver' : driver.name,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star, size: 14, color: AppColors.warning),
                    const SizedBox(width: 4),
                    Text(
                      driver.rating.toStringAsFixed(1),
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.carpoolBadge.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        option.womenOnly
                            ? 'Women Only'
                            : option.type == 'SCHEDULED'
                                ? 'Carpool'
                                : 'Professional',
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: AppColors.carpoolBadge,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          if (vehicle?.licensePlate != null &&
              vehicle!.licensePlate!.isNotEmpty)
            Text(
              vehicle.licensePlate!,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFareBreakdown({
    required RideOption option,
    required bool isScheduled,
    required int seats,
    required double farePerSeat,
    required double total,
    required ValueChanged<int>? onChangedSeats,
    required int maxSeats,
  }) {
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
            'Fare Breakdown',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          _buildFareRow(
            isScheduled ? 'Price per seat' : 'Estimated fare',
            Formatters.currency(farePerSeat),
          ),
          if (option.distanceKm != null)
            _buildFareRow('Distance', Formatters.distance(option.distanceKm!)),
          if (onChangedSeats != null)
            _buildSeatRow(seats: seats, maxSeats: maxSeats, onChanged: onChangedSeats)
          else if (isScheduled)
            _buildFareRow('Seats', '$seats'),
          const Divider(height: 24),
          _buildFareRow('Total', Formatters.currency(total), isTotal: true),
        ],
      ),
    );
  }

  Widget _buildSeatRow({
    required int seats,
    required int maxSeats,
    required ValueChanged<int> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'Seats',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          Row(
            children: [
              _buildSeatButton(
                icon: Icons.remove,
                onTap: seats > 1 ? () => onChanged(seats - 1) : null,
              ),
              const SizedBox(width: 12),
              Text(
                '$seats',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(width: 12),
              _buildSeatButton(
                icon: Icons.add,
                onTap: seats < maxSeats ? () => onChanged(seats + 1) : null,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSeatButton({required IconData icon, VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: onTap != null
              ? AppColors.primary
              : AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          size: 16,
          color: onTap != null ? AppColors.onPrimary : AppColors.textDisabled,
        ),
      ),
    );
  }

  Widget _buildFareRow(String label, String amount, {bool isTotal = false}) {
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
            amount,
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

  Widget _buildPaymentMethod(AsyncValue<WalletData> walletAsync) {
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
            'Payment Method',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          _buildPaymentOption(
            id: 'wallet',
            icon: Icons.account_balance_wallet,
            title: 'Yaatra Wallet',
            subtitle: walletAsync.when(
              data: (wallet) =>
                  'Balance: ${Formatters.currency(wallet.balance)}',
              loading: () => 'Balance: loading…',
              error: (error, stackTrace) => 'Balance unavailable',
            ),
          ),
          const SizedBox(height: 8),
          _buildPaymentOption(
            id: 'upi',
            icon: Icons.phone_android,
            title: 'UPI',
            subtitle: 'GPay, PhonePe, BHIM',
          ),
          const SizedBox(height: 8),
          _buildPaymentOption(
            id: 'card',
            icon: Icons.credit_card,
            title: 'Credit/Debit Card',
            subtitle: 'Visa, Mastercard',
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOption({
    required String id,
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    final isSelected = _selectedPayment == id;
    return GestureDetector(
      onTap: () => setState(() => _selectedPayment = id),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withValues(alpha: 0.05)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.borderWhite10,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
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
                    subtitle,
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
                size: 20,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCancellationPolicy() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.warning.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: AppColors.warning, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Free cancellation up to 30 minutes before pickup. A fee may apply after that.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: AppColors.textSecondary.withValues(alpha: 0.8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmBooking({
    required RideOption option,
    required int seats,
    required double? pickupLat,
    required double? pickupLng,
    required double? dropLat,
    required double? dropLng,
    required String pickupAddress,
    required String dropAddress,
  }) async {
    if (pickupAddress.isEmpty || dropAddress.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pickup and drop locations are missing. Search again.'),
        ),
      );
      return;
    }
    if (option.type == 'ON_DEMAND' &&
        (pickupLat == null ||
            pickupLng == null ||
            dropLat == null ||
            dropLng == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Location details missing. Search for a ride again.'),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final data = await ref.read(rideRepositoryProvider).bookRide(
            type: option.type,
            instanceId: option.type == 'SCHEDULED' ? option.instanceId : null,
            pickupLat: pickupLat,
            pickupLng: pickupLng,
            dropLat: dropLat,
            dropLng: dropLng,
            seats: seats,
            pickupAddress: pickupAddress,
            dropAddress: dropAddress,
            paymentMethod: _selectedPayment,
          );
      ref.invalidate(upcomingRidesProvider);
      if (!mounted) return;
      final tripId = data['id']?.toString();
      if (option.type == 'SCHEDULED') {
        context.go('/rides/upcoming');
      } else if (tripId != null && tripId.isNotEmpty) {
        context.go('/active-trip/$tripId');
      } else {
        context.go('/rides/upcoming');
      }
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Booking failed. Please try again.'),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
}
