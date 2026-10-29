import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class HelpSupportPage extends StatelessWidget {
  const HelpSupportPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Help & Support')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection('Frequently Asked Questions', [
              _buildFaqItem('How do I book a ride?', 'Tap "Ride Now" on the home screen, enter your pickup and destination, then choose from available ride options.'),
              _buildFaqItem('How does payment work?', 'Payments are deducted from your Yaatra wallet. Add money via UPI, Card, or Bank transfer.'),
              _buildFaqItem('How do I become a driver?', 'Go to Profile → select your role as Driver. Complete KYC verification and add your vehicle to start.'),
              _buildFaqItem('How do I cancel a ride?', 'Open the active trip and tap Cancel. Cancellation fees may apply based on the timing.'),
              _buildFaqItem('How do I report an issue?', 'Use the Safety page to report issues, or contact support directly below.'),
            ]),
            const SizedBox(height: 24),
            _buildSection('Contact Us', [
              _buildContactItem(Icons.email_outlined, 'Email', 'support@yaatra.app'),
              _buildContactItem(Icons.phone_outlined, 'Phone', '+91 1800-123-4567'),
              _buildContactItem(Icons.chat_outlined, 'Live Chat', 'Available 24/7 in-app'),
            ]),
            const SizedBox(height: 24),
            _buildSection('Other', [
              _buildLinkItem(Icons.description_outlined, 'Terms of Service', () {}),
              _buildLinkItem(Icons.privacy_tip_outlined, 'Privacy Policy', () {}),
              _buildLinkItem(Icons.info_outline, 'About Yaatra', () {}),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        ...children,
      ],
    );
  }

  Widget _buildFaqItem(String question, String answer) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Theme(
        data: ThemeData().copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(
            question,
            style: const TextStyle(fontFamily: 'Poppins', fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
          ),
          iconColor: AppColors.textSecondary,
          collapsedIconColor: AppColors.textSecondary,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Text(
                answer,
                style: const TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.textSecondary, height: 1.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactItem(IconData icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderWhite10),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.textSecondary, size: 22),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontFamily: 'Poppins', fontSize: 12, color: AppColors.textMuted)),
              Text(value, style: const TextStyle(fontFamily: 'Poppins', fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLinkItem(IconData icon, String label, VoidCallback onTap) {
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
                  child: Text(label, style: const TextStyle(fontFamily: 'Poppins', fontSize: 15, color: AppColors.textPrimary)),
                ),
                const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
