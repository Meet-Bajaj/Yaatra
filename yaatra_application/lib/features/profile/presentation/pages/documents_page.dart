import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/api/dio_client.dart';

final documentsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final dio = ref.read(dioClientProvider).dio;
  final response = await dio.get('/users/me/documents');
  return (response.data as List? ?? []).cast<Map<String, dynamic>>();
});

class DocumentsPage extends ConsumerWidget {
  const DocumentsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final docsAsync = ref.watch(documentsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Documents')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showUploadSheet(context, ref),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.onPrimary,
        icon: const Icon(Icons.upload_file),
        label: const Text('Upload'),
      ),
      body: docsAsync.when(
        data: (docs) {
          if (docs.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.description_outlined, size: 64, color: AppColors.textDisabled),
                  const SizedBox(height: 16),
                  const Text('No documents uploaded', style: TextStyle(fontFamily: 'Poppins', fontSize: 16, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  const Text('Upload your KYC documents for verification', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final doc = docs[index];
              final status = doc['status'] ?? 'PENDING';
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderWhite10),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: _statusColor(status).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(_docIcon(doc['type']), color: _statusColor(status)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _docTypeName(doc['type']),
                            style: const TextStyle(fontFamily: 'Poppins', fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: _statusColor(status).withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              status,
                              style: TextStyle(fontFamily: 'Poppins', fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor(status)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (status == 'PENDING')
                      IconButton(
                        icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 22),
                        onPressed: () async {
                          final dio = ref.read(dioClientProvider).dio;
                          await dio.delete('/users/me/documents/${doc['id']}');
                          ref.invalidate(documentsProvider);
                        },
                      ),
                  ],
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: AppColors.textSecondary))),
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'APPROVED':
        return AppColors.success;
      case 'REJECTED':
        return AppColors.error;
      default:
        return AppColors.warningText;
    }
  }

  IconData _docIcon(String? type) {
    switch (type) {
      case 'AADHAAR':
        return Icons.badge_outlined;
      case 'DRIVING_LICENSE':
        return Icons.drive_eta_outlined;
      case 'PAN':
        return Icons.credit_card_outlined;
      default:
        return Icons.description_outlined;
    }
  }

  String _docTypeName(String? type) {
    switch (type) {
      case 'AADHAAR':
        return 'Aadhaar Card';
      case 'DRIVING_LICENSE':
        return 'Driving License';
      case 'PAN':
        return 'PAN Card';
      default:
        return type ?? 'Document';
    }
  }

  void _showUploadSheet(BuildContext context, WidgetRef ref) {
    String selectedType = 'AADHAAR';
    showModalBottomSheet(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Upload Document', style: TextStyle(fontFamily: 'Poppins', fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              const SizedBox(height: 20),
              ...['AADHAAR', 'DRIVING_LICENSE', 'PAN'].map((type) {
                final isSelected = selectedType == type;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: GestureDetector(
                    onTap: () => setSheetState(() => selectedType = type),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary.withValues(alpha: 0.05) : AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? AppColors.primary : AppColors.borderWhite10),
                      ),
                      child: Row(
                        children: [
                          Icon(_docIcon(type), color: isSelected ? AppColors.primary : AppColors.textSecondary),
                          const SizedBox(width: 12),
                          Text(_docTypeName(type), style: TextStyle(fontFamily: 'Poppins', fontSize: 15, fontWeight: FontWeight.w500, color: isSelected ? AppColors.primary : AppColors.textPrimary)),
                          const Spacer(),
                          if (isSelected) const Icon(Icons.check_circle, color: AppColors.primary),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 16),
              const Text('Note: File picker integration pending. Document upload will be available soon.', style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: AppColors.textMuted)),
            ],
          ),
        ),
      ),
    );
  }
}
