import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/notification_model.dart';

final notificationsRepositoryProvider = Provider<NotificationsRepository>((ref) {
  return NotificationsRepository(ref);
});

class NotificationsRepository {
  final Ref _ref;
  NotificationsRepository(this._ref);

  Future<List<AppNotification>> getNotifications() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.notifications);
    return (response.data as List? ?? [])
        .map((e) => AppNotification.fromJson(e))
        .toList();
  }

  Future<void> markAsRead(String id) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.patch(ApiEndpoints.notificationRead(id));
  }

  Future<void> markAllAsRead() async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.notificationsReadAll);
  }
}
