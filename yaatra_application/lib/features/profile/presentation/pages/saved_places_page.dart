import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/api/dio_client.dart';

final savedPlacesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final dio = ref.read(dioClientProvider).dio;
  final response = await dio.get('/users/me/places');
  return (response.data as List? ?? []).cast<Map<String, dynamic>>();
});

class SavedPlacesPage extends ConsumerWidget {
  const SavedPlacesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final placesAsync = ref.watch(savedPlacesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Saved Places')),
      body: placesAsync.when(
        data: (places) {
          if (places.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.location_off_outlined, size: 64, color: AppColors.textDisabled),
                  const SizedBox(height: 16),
                  const Text('No saved places', style: TextStyle(fontFamily: 'Poppins', fontSize: 16, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  const Text('Save your home and work for quick booking', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: places.length,
            itemBuilder: (context, index) {
              final place = places[index];
              final label = place['label'] ?? 'custom';
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
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        label == 'home' ? Icons.home_outlined : label == 'work' ? Icons.work_outlined : Icons.location_on_outlined,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(place['name'] ?? '', style: const TextStyle(fontFamily: 'Poppins', fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                          const SizedBox(height: 2),
                          Text(place['address'] ?? '', style: const TextStyle(fontFamily: 'Poppins', fontSize: 12, color: AppColors.textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 20),
                      onPressed: () async {
                        final dio = ref.read(dioClientProvider).dio;
                        await dio.delete('/users/me/places/${place['id']}');
                        ref.invalidate(savedPlacesProvider);
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
}
