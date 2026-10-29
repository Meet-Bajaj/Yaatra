import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../safety/data/safety_repository.dart';
import '../../../auth/providers/auth_providers.dart';

final userRatingsProvider = FutureProvider.autoDispose((ref) async {
  final user = await ref.watch(currentUserProvider.future);
  if (user == null) return null;
  return ref.read(safetyRepositoryProvider).getUserRatings(user.id);
});

class RatingsPage extends ConsumerWidget {
  const RatingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ratingsAsync = ref.watch(userRatingsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My Ratings')),
      body: ratingsAsync.when(
        data: (ratings) {
          if (ratings == null) {
            return const Center(child: Text('User not found', style: TextStyle(color: AppColors.textSecondary)));
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Rating summary
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderWhite10),
                  ),
                  child: Column(
                    children: [
                      Text(
                        ratings.averageScore.toStringAsFixed(1),
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 48,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(5, (i) {
                          return Icon(
                            i < ratings.averageScore.round() ? Icons.star : Icons.star_border,
                            color: AppColors.warningText,
                            size: 28,
                          );
                        }),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${ratings.totalRatings} rating${ratings.totalRatings == 1 ? '' : 's'}',
                        style: const TextStyle(fontFamily: 'Poppins', fontSize: 14, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                if (ratings.ratings.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderWhite10),
                    ),
                    child: Center(
                      child: Column(
                        children: [
                          Icon(Icons.star_outline, size: 48, color: AppColors.textDisabled),
                          const SizedBox(height: 12),
                          const Text('No ratings yet', style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  )
                else
                  ...ratings.ratings.map((rating) {
                    final reviewer = rating['reviewer'] as Map<String, dynamic>?;
                    final score = rating['score'] ?? 0;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.borderWhite10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: AppColors.inputFill,
                                child: Text(
                                  (reviewer?['name'] ?? 'U')[0].toUpperCase(),
                                  style: const TextStyle(fontFamily: 'Poppins', color: AppColors.textPrimary),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  reviewer?['name'] ?? 'Anonymous',
                                  style: const TextStyle(fontFamily: 'Poppins', fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                                ),
                              ),
                              Row(
                                children: List.generate(5, (i) => Icon(
                                  i < score ? Icons.star : Icons.star_border,
                                  color: AppColors.warningText,
                                  size: 16,
                                )),
                              ),
                            ],
                          ),
                          if (rating['comment'] != null && rating['comment'].toString().isNotEmpty) ...[
                            const SizedBox(height: 10),
                            Text(rating['comment'], style: const TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.textSecondary)),
                          ],
                        ],
                      ),
                    );
                  }),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: AppColors.textSecondary))),
      ),
    );
  }
}
