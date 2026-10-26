import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/wallet_repository.dart';
import '../models/wallet_model.dart';

final walletProvider = FutureProvider<WalletData>((ref) async {
  final repo = ref.read(walletRepositoryProvider);
  return repo.getWallet();
});

final walletTransactionsProvider = FutureProvider<List<WalletTransaction>>((ref) async {
  final repo = ref.read(walletRepositoryProvider);
  return repo.getTransactions();
});
