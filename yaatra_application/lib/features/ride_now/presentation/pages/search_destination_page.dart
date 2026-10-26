import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geocoding/geocoding.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../../core/widgets/text_field.dart';
import '../../../auth/models/saved_place.dart';
import '../../../auth/providers/auth_providers.dart';
import '../../providers/ride_providers.dart';

class SearchDestinationPage extends ConsumerStatefulWidget {
  const SearchDestinationPage({super.key});

  @override
  ConsumerState<SearchDestinationPage> createState() =>
      _SearchDestinationPageState();
}

class _SearchDestinationPageState extends ConsumerState<SearchDestinationPage> {
  final _pickupController = TextEditingController();
  final _dropController = TextEditingController();
  final _pickupFocusNode = FocusNode();
  final _dropFocusNode = FocusNode();
  bool _isLoading = false;

  @override
  void dispose() {
    _pickupController.dispose();
    _dropController.dispose();
    _pickupFocusNode.dispose();
    _dropFocusNode.dispose();
    super.dispose();
  }

  Future<void> _searchRides() async {
    final pickup = _pickupController.text.trim();
    final drop = _dropController.text.trim();
    if (pickup.isEmpty || drop.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter both pickup and drop locations'),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final pickupLocations = await locationFromAddress(pickup);
      final dropLocations = await locationFromAddress(drop);
      if (pickupLocations.isEmpty || dropLocations.isEmpty) {
        throw Exception('Location not found');
      }

      final pickupPoint = pickupLocations.first;
      final dropPoint = dropLocations.first;

      ref.read(rideSearchParamsProvider.notifier).state = {
        'pickupLat': pickupPoint.latitude,
        'pickupLng': pickupPoint.longitude,
        'pickupAddress': pickup,
        'dropLat': dropPoint.latitude,
        'dropLng': dropPoint.longitude,
        'dropAddress': drop,
        'filter': 'ALL',
      };

      if (!mounted) return;
      context.push('/ride-now/options');
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Could not find that location. Try a more specific address.',
          ),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back_ios),
                          onPressed: () => context.pop(),
                        ),
                        const Text(
                          'Find a Ride',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.borderWhite10),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Column(
                            children: [
                              Container(
                                width: 12,
                                height: 12,
                                decoration: const BoxDecoration(
                                  color: AppColors.success,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              Container(
                                width: 2,
                                height: 40,
                                decoration: const BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      AppColors.success,
                                      AppColors.error,
                                    ],
                                  ),
                                ),
                              ),
                              Container(
                                width: 12,
                                height: 12,
                                decoration: const BoxDecoration(
                                  color: AppColors.error,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              children: [
                                AppTextField(
                                  controller: _pickupController,
                                  focusNode: _pickupFocusNode,
                                  hintText: 'Pickup location',
                                  prefixIcon: Icons.my_location,
                                ),
                                const SizedBox(height: 12),
                                AppTextField(
                                  controller: _dropController,
                                  focusNode: _dropFocusNode,
                                  hintText: 'Drop location',
                                  prefixIcon: Icons.location_on,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Saved Places',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildSavedPlaces(),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryButton(
                text: 'Search Rides',
                onPressed: _searchRides,
                isLoading: _isLoading,
                icon: Icons.search,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSavedPlaces() {
    final placesAsync = ref.watch(savedPlacesProvider);

    return placesAsync.when(
      data: (places) {
        final home = _findPlace(places, 'HOME');
        final work = _findPlace(places, 'WORK');
        return Column(
          children: [
            _buildSavedPlace(
              icon: Icons.home,
              name: 'Home',
              address: home?.address ?? 'Add home address',
              onTap: () {
                if (home != null) {
                  _pickupController.text = home.address;
                } else {
                  _pickupFocusNode.requestFocus();
                }
              },
            ),
            const SizedBox(height: 8),
            _buildSavedPlace(
              icon: Icons.work,
              name: 'Work',
              address: work?.address ?? 'Add work address',
              onTap: () {
                if (work != null) {
                  _dropController.text = work.address;
                } else {
                  _dropFocusNode.requestFocus();
                }
              },
            ),
          ],
        );
      },
      loading: () => Column(
        children: [
          _buildSavedPlace(
            icon: Icons.home,
            name: 'Home',
            address: 'Loading...',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _buildSavedPlace(
            icon: Icons.work,
            name: 'Work',
            address: 'Loading...',
            onTap: () {},
          ),
        ],
      ),
      error: (error, stackTrace) => Column(
        children: [
          _buildSavedPlace(
            icon: Icons.home,
            name: 'Home',
            address: 'Could not load saved places',
            onTap: () => ref.invalidate(savedPlacesProvider),
          ),
        ],
      ),
    );
  }

  SavedPlace? _findPlace(List<SavedPlace> places, String label) {
    for (final place in places) {
      if (place.label.toUpperCase() == label) return place;
    }
    return null;
  }

  Widget _buildSavedPlace({
    required IconData icon,
    required String name,
    required String address,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
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
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.primary, size: 20),
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
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    address,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: AppColors.textMuted,
            ),
          ],
        ),
      ),
    );
  }
}
