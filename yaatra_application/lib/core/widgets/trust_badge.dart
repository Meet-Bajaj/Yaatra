import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class TrustBadge extends StatelessWidget {
  final String label;
  final Color color;
  final IconData icon;

  const TrustBadge({
    super.key,
    required this.label,
    required this.color,
    required this.icon,
  });

  const TrustBadge.carpool({super.key})
      : label = 'Carpool',
        color = AppColors.carpoolBadge,
        icon = Icons.people;

  const TrustBadge.professional({super.key})
      : label = 'Pro',
        color = AppColors.proBadge,
        icon = Icons.local_taxi;

  const TrustBadge.womenOnly({super.key})
      : label = 'Women Only',
        color = AppColors.womenOnlyBadge,
        icon = Icons.female;

  const TrustBadge.verified({super.key})
      : label = 'Verified',
        color = AppColors.verifiedBadge,
        icon = Icons.verified;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
