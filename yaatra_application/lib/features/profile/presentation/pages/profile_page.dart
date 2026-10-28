import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/providers/auth_providers.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: userAsync.when(
        data: (user) {
          if (user == null) {
            return const Center(child: Text('User not found', style: TextStyle(color: AppColors.textSecondary)));
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Profile header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderWhite10),
                  ),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: AppColors.primary,
                        child: Text(
                          (user.name ?? user.phone)[0].toUpperCase(),
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 32,
                            fontWeight: FontWeight.w700,
                            color: AppColors.onPrimary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        user.name ?? 'User',
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 22,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user.phone,
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 14,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      if (user.roles.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.inputFill,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            user.roles.join(' • '),
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Menu items
                _buildMenuItem(context, Icons.person_outline, 'Edit Profile', () {}),
                if (user.isDriver) ...[
                  _buildMenuItem(context, Icons.directions_car_outlined, 'My Vehicles', () {}),
                  _buildMenuItem(context, Icons.verified_user_outlined, 'Documents', () {}),
                  _buildMenuItem(context, Icons.star_outline, 'Ratings', () {}),
                ],
                _buildMenuItem(context, Icons.location_on_outlined, 'Saved Places', () {}),
                _buildMenuItem(context, Icons.help_outline, 'Help & Support', () {}),
                _buildMenuItem(context, Icons.shield_outlined, 'Safety', () => context.push('/safety')),
                _buildMenuItem(context, Icons.settings_outlined, 'Settings', () => context.push('/settings')),
                const SizedBox(height: 16),

                // Logout
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      await ref.read(authProvider.notifier).logout();
                      if (context.mounted) context.go('/login');
                    },
                    icon: const Icon(Icons.logout, size: 20),
                    label: const Text('Log Out'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.errorBorder),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Text('Error: $e', style: const TextStyle(color: AppColors.textSecondary)),
        ),
      ),
    );
  }

  Widget _buildMenuItem(BuildContext context, IconData icon, String title, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderWhite10),
            ),
            child: Row(
              children: [
                Icon(icon, color: AppColors.textSecondary, size: 22),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 15,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                Icon(Icons.chevron_right, color: AppColors.textMuted, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
