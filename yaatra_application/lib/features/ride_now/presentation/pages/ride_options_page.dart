import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/chip_filter.dart';
import '../../../../core/widgets/ride_option_card.dart';
import '../../../../core/widgets/skeleton.dart';

class RideOptionsPage extends ConsumerStatefulWidget {
  const RideOptionsPage({super.key});

  @override
  ConsumerState<RideOptionsPage> createState() => _RideOptionsPageState();
}

class _RideOptionsPageState extends ConsumerState<RideOptionsPage> {
  String _selectedFilter = 'all';
  bool _isLoading = true;
  List<Map<String, dynamic>> _options = [];

  @override
  void initState() {
    super.initState();
    _loadRideOptions();
  }

  Future<void> _loadRideOptions() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() {
      _isLoading = false;
      _options = [
        {
          'driverName': 'Raj Kumar',
          'rating': 4.8,
          'badgeType': 'carpool',
          'pickupAddress': 'Koramangala, Block 4',
          'dropAddress': 'Whitefield Main Road',
          'departureTime': DateTime.now().add(const Duration(minutes: 15)),
          'fare': 120.0,
          'seatsAvailable': 2,
          'vehicleInfo': 'Maruti Swift Dzire • KA 01 AB 1234',
        },
        {
          'driverName': 'Vikram Singh',
          'rating': 4.6,
          'badgeType': 'professional',
          'pickupAddress': 'Koramangala, Block 4',
          'dropAddress': 'Whitefield Main Road',
          'departureTime': null,
          'fare': 180.0,
          'seatsAvailable': 3,
          'vehicleInfo': 'Hyundai Verna • KA 02 CD 5678',
        },
        {
          'driverName': 'Priya Sharma',
          'rating': 4.9,
          'badgeType': 'women_only',
          'pickupAddress': 'Koramangala, Block 4',
          'dropAddress': 'Whitefield Main Road',
          'departureTime': DateTime.now().add(const Duration(minutes: 30)),
          'fare': 110.0,
          'seatsAvailable': 1,
          'vehicleInfo': 'Honda City • KA 03 EF 9012',
        },
      ];
    });
  }

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
                          isSelected: _selectedFilter == 'all',
                          onTap: () => setState(() => _selectedFilter = 'all'),
                        ),
                        const SizedBox(width: 8),
                        ChipFilter(
                          label: 'Carpool',
                          isSelected: _selectedFilter == 'carpool',
                          onTap: () => setState(() => _selectedFilter = 'carpool'),
                          selectedColor: AppColors.carpoolBadge,
                          icon: Icons.people,
                        ),
                        const SizedBox(width: 8),
                        ChipFilter(
                          label: 'Professional',
                          isSelected: _selectedFilter == 'professional',
                          onTap: () => setState(() => _selectedFilter = 'professional'),
                          selectedColor: AppColors.proBadge,
                          icon: Icons.local_taxi,
                        ),
                        const SizedBox(width: 8),
                        ChipFilter(
                          label: 'Women Only',
                          isSelected: _selectedFilter == 'women_only',
                          onTap: () => setState(() => _selectedFilter = 'women_only'),
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
              child: _isLoading
                  ? ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: 3,
                      itemBuilder: (context, index) => SkeletonLoader.card(),
                    )
                  : _options.isEmpty
                      ? const Center(
                          child: Text(
                            'No rides available',
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 16,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          itemCount: _options.length,
                          itemBuilder: (context, index) {
                            final option = _options[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: RideOptionCard(
                                driverName: option['driverName'],
                                rating: option['rating'],
                                badgeType: option['badgeType'],
                                pickupAddress: option['pickupAddress'],
                                dropAddress: option['dropAddress'],
                                departureTime: option['departureTime'],
                                fare: option['fare'],
                                seatsAvailable: option['seatsAvailable'],
                                vehicleInfo: option['vehicleInfo'],
                                isRecommended: index == 0,
                                onTap: () => context.push('/ride-now/confirm'),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
