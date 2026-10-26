import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/wallet_model.dart';

final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  return WalletRepository(ref);
});

class WalletRepository {
  final Ref _ref;
  WalletRepository(this._ref);

  Future<WalletData> getWallet() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.wallet);
    return WalletData.fromJson(response.data);
  }

  Future<double> topUp(double amount) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.walletTopup, data: {'amount': amount});
    return (response.data['balance'] as num?)?.toDouble() ?? 0;
  }

  Future<List<WalletTransaction>> getTransactions() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.walletTransactions);
    return (response.data['transactions'] as List? ?? [])
        .map((e) => WalletTransaction.fromJson(e))
        .toList();
  }

  Future<double> withdraw(double amount) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.walletWithdraw, data: {'amount': amount});
    return (response.data['balance'] as num?)?.toDouble() ?? 0;
  }
}
