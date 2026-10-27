import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geocoding/geocoding.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../../core/widgets/text_field.dart';
import '../../../../core/utils/validators.dart';
import '../../data/driver_repository.dart';
import '../../providers/driver_providers.dart';

class OfferSeatPage extends ConsumerStatefulWidget {
  const OfferSeatPage({super.key});

  @override
  ConsumerState<OfferSeatPage> createState() => _OfferSeatPageState();
}

class _OfferSeatPageState extends ConsumerState<OfferSeatPage> {
  int _currentStep = 0;
  final _homeController = TextEditingController();
  final _officeController = TextEditingController();
  TimeOfDay _departureTime = const TimeOfDay(hour: 8, minute: 30);
  final List<bool> _selectedDays = [true, true, true, true, true, false, false];
  int _seats = 2;
  double _pricePerSeat = 100;
  bool _womenOnly = false;
  bool _isLoading = false;
  String? _selectedVehicleId;

  static const List<String> _dayNames = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  @override
  void dispose() {
    _homeController.dispose();
    _officeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
                    onPressed: () {
                      if (_currentStep > 0) {
                        setState(() => _currentStep--);
                      } else {
                        context.pop();
                      }
                    },
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Offer a Seat',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          'Step ${_currentStep + 1} of 4',
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: LinearProgressIndicator(
                value: (_currentStep + 1) / 4,
                backgroundColor: AppColors.surfaceElevated,
                valueColor: const AlwaysStoppedAnimation<Color>(
                  AppColors.primary,
                ),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: _buildStep(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryButton(
                text: _currentStep == 3 ? 'Publish Ride' : 'Next',
                onPressed: _currentStep == 3 ? _publishRide : _nextStep,
                isLoading: _isLoading,
                icon: _currentStep == 3 ? Icons.check : Icons.arrow_forward,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStep() {
    switch (_currentStep) {
      case 0:
        return _buildLocationStep();
      case 1:
        return _buildScheduleStep();
      case 2:
        return _buildSeatsStep();
      case 3:
        return _buildPriceStep();
      default:
        return const SizedBox();
    }
  }

  Widget _buildLocationStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Where do you commute?',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Set your home and work addresses',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 24),
        AppTextField(
          controller: _homeController,
          labelText: 'Home Address',
          hintText: 'Enter your home address',
          prefixIcon: Icons.home,
          validator: (v) => Validators.required(v, fieldName: 'Home address'),
        ),
        const SizedBox(height: 16),
        AppTextField(
          controller: _officeController,
          labelText: 'Work Address',
          hintText: 'Enter your work address',
          prefixIcon: Icons.work,
          validator: (v) => Validators.required(v, fieldName: 'Work address'),
        ),
      ],
    );
  }

  Widget _buildScheduleStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'When do you commute?',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Set your departure time and days',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 24),
        GestureDetector(
          onTap: _selectTime,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderWhite10),
            ),
            child: Row(
              children: [
                const Icon(Icons.access_time, color: AppColors.primary),
                const SizedBox(width: 12),
                Text(
                  'Departure: ${_departureTime.hour.toString().padLeft(2, '0')}:${_departureTime.minute.toString().padLeft(2, '0')}',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 16,
                    color: AppColors.textPrimary,
                  ),
                ),
                const Spacer(),
                const Icon(Icons.edit, color: AppColors.textMuted),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        const Text(
          'Repeat On',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(7, (index) {
            const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
            final isSelected = _selectedDays[index];
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedDays[index] = !_selectedDays[index];
                });
              },
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primary
                      : AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.borderWhite10,
                  ),
                ),
                child: Center(
                  child: Text(
                    days[index],
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isSelected
                          ? AppColors.onPrimary
                          : AppColors.textSecondary,
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildSeatsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'How many seats?',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'You can offer up to 3 seats',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 32),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildSeatButton(
              icon: Icons.remove,
              onTap: () {
                if (_seats > 1) setState(() => _seats--);
              },
            ),
            const SizedBox(width: 32),
            Text(
              '$_seats',
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 48,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 32),
            _buildSeatButton(
              icon: Icons.add,
              onTap: () {
                if (_seats < 3) setState(() => _seats++);
              },
            ),
          ],
        ),
        const SizedBox(height: 32),
        SwitchListTile(
          title: const Text(
            'Women-only ride',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              color: AppColors.textPrimary,
            ),
          ),
          subtitle: const Text(
            'Only accept female passengers',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          value: _womenOnly,
          onChanged: (value) => setState(() => _womenOnly = value),
          activeThumbColor: AppColors.womenOnlyBadge,
        ),
      ],
    );
  }

  Widget _buildPriceStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Set price per seat',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Recommended: ₹80–150 based on distance',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 32),
        Center(
          child: Text(
            '₹${_pricePerSeat.round()}',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 48,
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Slider(
          value: _pricePerSeat,
          min: 50,
          max: 300,
          divisions: 25,
          activeColor: AppColors.primary,
          onChanged: (value) => setState(() => _pricePerSeat = value),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.info_outline,
                color: AppColors.primary,
                size: 20,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Total earnings: ₹${(_pricePerSeat * _seats).round()} ($_seats seats × ₹${_pricePerSeat.round()})',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 14,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        _buildVehicleSection(),
      ],
    );
  }

  Widget _buildVehicleSection() {
    final profileAsync = ref.watch(driverProfileProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Vehicle',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        profileAsync.when(
          data: (profile) {
            if (profile.vehicles.isEmpty) {
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderWhite10),
                ),
                child: const Text(
                  'No vehicles on your profile. Add a vehicle before publishing a ride.',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
              );
            }
            final selectedId = _selectedVehicleId ??
                (profile.vehicles.isNotEmpty
                    ? profile.vehicles.first.id
                    : null);
            return Column(
              children: profile.vehicles.map((vehicle) {
                final isSelected = selectedId == vehicle.id;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: GestureDetector(
                    onTap: () =>
                        setState(() => _selectedVehicleId = vehicle.id),
                    child: Container(
                      padding: const EdgeInsets.all(14),
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
                                  vehicle.licensePlate,
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
              }).toList(),
            );
          },
          loading: () => const Center(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: CircularProgressIndicator(),
            ),
          ),
          error: (error, stackTrace) => Text(
            'Could not load your vehicles: $error',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              color: AppColors.error,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSeatButton({required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: AppColors.onPrimary),
      ),
    );
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _departureTime,
    );
    if (picked != null) {
      setState(() => _departureTime = picked);
    }
  }

  void _nextStep() {
    if (_currentStep == 0 &&
        (_homeController.text.trim().isEmpty ||
            _officeController.text.trim().isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter both home and work addresses'),
        ),
      );
      return;
    }
    if (_currentStep == 1 && !_selectedDays.contains(true)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Select at least one day')),
      );
      return;
    }
    if (_currentStep < 3) {
      setState(() => _currentStep++);
    }
  }

  Future<void> _publishRide() async {
    final home = _homeController.text.trim();
    final office = _officeController.text.trim();
    if (home.isEmpty || office.isEmpty) {
      setState(() => _currentStep = 0);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter your home and work addresses')),
      );
      return;
    }
    if (!_selectedDays.contains(true)) {
      setState(() => _currentStep = 1);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Select at least one day')),
      );
      return;
    }

    final profile = ref.read(driverProfileProvider).valueOrNull;
    final vehicleId = _selectedVehicleId ??
        (profile != null && profile.vehicles.isNotEmpty
            ? profile.vehicles.first.id
            : null);
    if (vehicleId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Select a vehicle to publish this ride')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final pickupLocations = await locationFromAddress(home);
      final dropLocations = await locationFromAddress(office);
      if (pickupLocations.isEmpty || dropLocations.isEmpty) {
        throw Exception('Address not found');
      }

      final departureTime =
          '${_departureTime.hour.toString().padLeft(2, '0')}:${_departureTime.minute.toString().padLeft(2, '0')}';
      final schedule = [
        for (var i = 0; i < 7; i++)
          if (_selectedDays[i])
            {'day': _dayNames[i], 'departureTime': departureTime},
      ];

      await ref.read(driverRepositoryProvider).createOffer(
            pickup: {
              'lat': pickupLocations.first.latitude,
              'lng': pickupLocations.first.longitude,
              'address': home,
            },
            drop: {
              'lat': dropLocations.first.latitude,
              'lng': dropLocations.first.longitude,
              'address': office,
            },
            schedule: schedule,
            seats: _seats,
            pricePerSeat: _pricePerSeat.roundToDouble(),
            womenOnly: _womenOnly,
            vehicleId: vehicleId,
          );

      ref.invalidate(driverOffersProvider);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ride published successfully!')),
      );
      context.go('/driver/offers');
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Could not publish the ride. Check the addresses and try again.',
          ),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
}
