class WalletData {
  final String walletId;
  final double balance;
  final List<WalletTransaction> recentTransactions;

  WalletData({
    required this.walletId,
    required this.balance,
    required this.recentTransactions,
  });

  factory WalletData.fromJson(Map<String, dynamic> json) {
    return WalletData(
      walletId: json['walletId'] ?? '',
      balance: (json['balance'] as num?)?.toDouble() ?? 0,
      recentTransactions: (json['recentTransactions'] as List? ?? [])
          .map((e) => WalletTransaction.fromJson(e))
          .toList(),
    );
  }
}

class WalletTransaction {
  final String id;
  final String walletId;
  final double amount;
  final String type;
  final String? referenceId;
  final DateTime createdAt;

  WalletTransaction({
    required this.id,
    required this.walletId,
    required this.amount,
    required this.type,
    this.referenceId,
    required this.createdAt,
  });

  factory WalletTransaction.fromJson(Map<String, dynamic> json) {
    return WalletTransaction(
      id: json['id'] ?? '',
      walletId: json['walletId'] ?? '',
      amount: double.tryParse(json['amount']?.toString() ?? '0') ?? 0,
      type: json['type'] ?? '',
      referenceId: json['referenceId'],
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }

  bool get isCredit => type == 'TOPUP' || type == 'REFUND';
}
