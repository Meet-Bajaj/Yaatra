import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/trust_badge.dart';

class UpcomingRidesPage extends ConsumerStatefulWidget {
  const UpcomingRidesPage({super.key});

  @override
  ConsumerState<UpcomingRidesPage> createState() => _UpcomingRidesPageState();
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
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedTab = 0),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              border: Border(
                                bottom: BorderSide(
                                  color: _selectedTab == 0
                                      ? AppColors.primary
                                      : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                            ),
                            child: Text(
                              'Upcoming',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: _selectedTab == 0
                                    ? AppColors.primary
                                    : AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedTab = 1),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              border: Border(
                                bottom: BorderSide(
                                  color: _selectedTab == 1
                                      ? AppColors.primary
                                      : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                            ),
                            child: Text(
                              'History',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: _selectedTab == 1
                                    ? AppColors.primary
                                    : AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: _selectedTab == 0 ? _buildUpcomingRides() : _buildRideHistory(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingRides() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: 2,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: _buildRideCard(
            driverName: 'Raj Kumar',
            pickup: 'Koramangala',
            drop: 'Whitefield',
            time: 'Tomorrow, 9:00 AM',
            fare: 120,
            badgeType: 'carpool',
            isUpcoming: true,
          ),
        );
      },
    );
  }

  Widget _buildRideHistory() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: _buildRideCard(
            driverName: index % 2 == 0 ? 'Vikram Singh' : 'Priya Sharma',
            pickup: 'Koramangala',
            drop: 'Whitefield',
            time: '${index + 1} days ago',
            fare: 120 + index * 20,
            badgeType: index % 2 == 0 ? 'professional' : 'women_only',
            isUpcoming: false,
          ),
        );
      },
    );
  }

  Widget _buildRideCard({
    required String driverName,
    required String pickup,
    required String drop,
    required String time,
    required int fare,
    required String badgeType,
    required bool isUpcoming,
  }) {
    return GestureDetector(
      onTap: () => context.push('/rides/123'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.surfaceVariant,
                  child: Icon(Icons.person, size: 20, color: AppColors.textHint),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            driverName,
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          TrustBadge(
                            label: badgeType == 'professional' ? 'Pro' : badgeType == 'women_only' ? 'Women' : 'Carpool',
                            color: badgeType == 'professional'
                                ? AppColors.proBadge
                                : badgeType == 'women_only'
                                    ? AppColors.womenOnlyBadge
                                    : AppColors.carpoolBadge,
                            icon: badgeType == 'professional'
                                ? Icons.local_taxi
                                : badgeType == 'women_only'
                                    ? Icons.female
                                    : Icons.people,
                          ),
                        ],
                      ),
                      Text(
                        time,
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  '₹$fare',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.circle, size: 6, color: AppColors.success),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      pickup,
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                  Icon(Icons.arrow_forward, size: 12, color: AppColors.textHint),
                  const SizedBox(width: 8),
                  Icon(Icons.circle, size: 6, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      drop,
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
