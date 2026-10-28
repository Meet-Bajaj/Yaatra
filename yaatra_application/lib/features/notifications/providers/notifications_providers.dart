import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/notifications_repository.dart';
import '../models/notification_model.dart';

final notificationsProvider = FutureProvider<List<AppNotification>>((ref) async {
  final repo = ref.read(notificationsRepositoryProvider);
  return repo.getNotifications();
});
