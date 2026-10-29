import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/api/dio_client.dart';

final vehiclesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final dio = ref.read(dioClientProvider).dio;
  final response = await dio.get('/users/me/vehicles');
  return (response.data as List? ?? []).cast<Map<String, dynamic>>();
});

class MyVehiclesPage extends ConsumerWidget {
  const MyVehiclesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final vehiclesAsync = ref.watch(vehiclesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My Vehicles')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddVehicleSheet(context, ref),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.onPrimary,
        icon: const Icon(Icons.add),
        label: const Text('Add Vehicle'),
      ),
      body: vehiclesAsync.when(
        data: (vehicles) {
          if (vehicles.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.directions_car_outlined, size: 64, color: AppColors.textDisabled),
                  const SizedBox(height: 16),
                  const Text('No vehicles added', style: TextStyle(fontFamily: 'Poppins', fontSize: 16, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  const Text('Add your first vehicle to start driving', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: vehicles.length,
            itemBuilder: (context, index) {
              final vehicle = vehicles[index];
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
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.directions_car, color: AppColors.textPrimary),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${vehicle['make']} ${vehicle['model']}',
                            style: const TextStyle(fontFamily: 'Poppins', fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${vehicle['licensePlate']} • ${vehicle['capacity']} seats',
                            style: const TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 22),
                      onPressed: () => _deleteVehicle(context, ref, vehicle['id']),
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

  void _deleteVehicle(BuildContext context, WidgetRef ref, String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text('Delete Vehicle?', style: TextStyle(fontFamily: 'Poppins', color: AppColors.textPrimary)),
        content: const Text('This action cannot be undone.', style: TextStyle(fontFamily: 'Poppins', color: AppColors.textSecondary)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete', style: TextStyle(color: AppColors.error))),
        ],
      ),
    );
    if (confirmed == true) {
      final dio = ref.read(dioClientProvider).dio;
      await dio.delete('/users/me/vehicles/$id');
      ref.invalidate(vehiclesProvider);
    }
  }

  void _showAddVehicleSheet(BuildContext context, WidgetRef ref) {
    final makeController = TextEditingController();
    final modelController = TextEditingController();
    final plateController = TextEditingController();
    final colorController = TextEditingController();
    int capacity = 4;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(left: 24, right: 24, top: 24, bottom: MediaQuery.of(ctx).viewInsets.bottom + 24),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Add Vehicle', style: TextStyle(fontFamily: 'Poppins', fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                const SizedBox(height: 20),
                TextField(controller: makeController, decoration: const InputDecoration(labelText: 'Make', hintText: 'e.g. Maruti')),
                const SizedBox(height: 16),
                TextField(controller: modelController, decoration: const InputDecoration(labelText: 'Model', hintText: 'e.g. Swift Dzire')),
                const SizedBox(height: 16),
                TextField(controller: plateController, decoration: const InputDecoration(labelText: 'License Plate', hintText: 'KA01AB1234')),
                const SizedBox(height: 16),
                TextField(controller: colorController, decoration: const InputDecoration(labelText: 'Color', hintText: 'e.g. White')),
                const SizedBox(height: 16),
                const Text('Capacity', style: TextStyle(fontFamily: 'Poppins', fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
                const SizedBox(height: 8),
                Row(
                  children: [2, 4, 6].map((c) {
                    final isSelected = capacity == c;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => setSheetState(() => capacity = c),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary : AppColors.inputFill,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: isSelected ? AppColors.primary : AppColors.inputBorder),
                          ),
                          child: Text('$c', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.w600, color: isSelected ? AppColors.onPrimary : AppColors.textPrimary)),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (makeController.text.isEmpty || modelController.text.isEmpty || plateController.text.isEmpty) return;
                      final dio = ref.read(dioClientProvider).dio;
                      await dio.post('/users/me/vehicles', data: {
                        'make': makeController.text.trim(),
                        'model': modelController.text.trim(),
                        'licensePlate': plateController.text.trim().toUpperCase(),
                        'color': colorController.text.trim(),
                        'capacity': capacity,
                      });
                      ref.invalidate(vehiclesProvider);
                      if (ctx.mounted) Navigator.pop(ctx);
                    },
                    child: const Text('Add Vehicle'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
