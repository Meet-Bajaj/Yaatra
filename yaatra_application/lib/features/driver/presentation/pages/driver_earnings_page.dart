import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/error_state.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../wallet/providers/wallet_providers.dart';
import '../../models/driver_models.dart';
import '../../providers/driver_providers.dart';

class DriverEarningsPage extends ConsumerWidget {
  const DriverEarningsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final earningsAsync = ref.watch(driverEarningsProvider);

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
                    'Earnings',
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
                onRefresh: () async => ref.invalidate(driverEarningsProvider),
                child: earningsAsync.when(
                  data: (earnings) => SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        _buildTotalEarnings(earnings),
                        const SizedBox(height: 20),
                        _buildQuickStats(earnings),
                        const SizedBox(height: 20),
                        _buildWithdrawSection(context, ref),
                        const SizedBox(height: 20),
                        _buildRecentTransactions(earnings),
                      ],
                    ),
                  ),
                  loading: () => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  error: (error, stackTrace) => ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    children: [
                      const SizedBox(height: 60),
                      ErrorState(
                        title: 'Could not load earnings',
                        subtitle: 'Pull to refresh and try again.',
                        actionText: 'Retry',
                        onAction: () =>
                            ref.invalidate(driverEarningsProvider),
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

  Widget _buildTotalEarnings(DriverEarnings earnings) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primary.withValues(alpha: 0.14),
            AppColors.primary.withValues(alpha: 0.04),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Column(
        children: [
          const Text(
            'Total Earnings',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            Formatters.currency(earnings.totalEarnings),
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 36,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildEarningStat(
                Formatters.currency(earnings.tripEarnings),
                'Trip Rides',
              ),
              Container(width: 1, height: 40, color: AppColors.borderWhite20),
              _buildEarningStat(
                Formatters.currency(earnings.offerEarnings),
                'Carpool',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEarningStat(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
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

  Widget _buildQuickStats(DriverEarnings earnings) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            icon: Icons.directions_car,
            title: 'Trips',
            value: '${earnings.totalTrips}',
            color: AppColors.primary,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            icon: Icons.event_seat,
            title: 'Bookings',
            value: '${earnings.totalBookings}',
            color: AppColors.carpoolBadge,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            icon: Icons.today,
            title: 'Today',
            value: '${earnings.todayTrips}',
            color: AppColors.success,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
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
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
          Text(
            title,
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

  Widget _buildWithdrawSection(BuildContext context, WidgetRef ref) {
    final walletAsync = ref.watch(walletProvider);

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
            'Available in Wallet',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              walletAsync.when(
                data: (wallet) => Text(
                  Formatters.currency(wallet.balance),
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                loading: () => const Text(
                  '…',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                error: (error, stackTrace) => const Text(
                  '—',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              PrimaryButton(
                text: 'Withdraw',
                onPressed: () => context.push('/wallet'),
                width: 120,
                height: 40,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTransactions(DriverEarnings earnings) {
    final entries = _mergeTransactions(earnings);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Recent Transactions',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        if (entries.isEmpty)
          const EmptyState(
            icon: Icons.receipt_long_outlined,
            title: 'No earnings yet',
            subtitle: 'Complete a ride to start earning.',
          )
        else
          ...entries.map(
            (entry) => _buildTransactionItem(
              title: entry.title,
              amount: entry.amount,
              time: Formatters.rideDateTime(entry.date),
              isCredit: true,
            ),
          ),
      ],
    );
  }

  List<_EarningEntry> _mergeTransactions(DriverEarnings earnings) {
    final entries = <_EarningEntry>[];

    for (final trip in earnings.recentTrips) {
      final amount = ((trip['fareFinal'] ?? trip['fareEstimate']) as num?)
              ?.toDouble() ??
          0;
      final date = DateTime.tryParse(
            (trip['endTime'] ?? trip['createdAt']) as String? ?? '',
          ) ??
          DateTime.now();
      entries.add(_EarningEntry(title: 'Trip earning', amount: amount, date: date));
    }

    for (final booking in earnings.recentBookings) {
      final fareTotal =
          ((booking['fareTotal']) as num?)?.toDouble() ?? 0;
      final commission = ((booking['commission']) as num?)?.toDouble() ?? 0;
      final date = DateTime.tryParse(
            (booking['createdAt']) as String? ?? '',
          ) ??
          DateTime.now();
      entries.add(
        _EarningEntry(
          title: 'Carpool booking',
          amount: fareTotal - commission,
          date: date,
        ),
      );
    }

    entries.sort((a, b) => b.date.compareTo(a.date));
    return entries.take(8).toList();
  }

  Widget _buildTransactionItem({
    required String title,
    required double amount,
    required String time,
    required bool isCredit,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.only(bottom: 8),
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
              color: (isCredit ? AppColors.success : AppColors.error)
                  .withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isCredit ? Icons.arrow_downward : Icons.arrow_upward,
              color: isCredit ? AppColors.success : AppColors.error,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  time,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 11,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '+${Formatters.currency(amount)}',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.success,
            ),
          ),
        ],
      ),
    );
  }
}

class _EarningEntry {
  final String title;
  final double amount;
  final DateTime date;

  _EarningEntry({required this.title, required this.amount, required this.date});
}
