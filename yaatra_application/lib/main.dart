import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';
import 'core/storage/cache.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final cacheService = CacheService();
  await cacheService.init();

  runApp(
    ProviderScope(
      overrides: [
        cacheServiceProvider.overrideWithValue(cacheService),
      ],
      child: const YaatraApp(),
    ),
  );
}
