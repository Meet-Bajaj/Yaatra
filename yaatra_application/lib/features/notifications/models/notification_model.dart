class AppNotification {
  final String id;
  final String userId;
  final String type;
  final Map<String, dynamic> payload;
  final DateTime? readAt;
  final DateTime createdAt;

  AppNotification({
    required this.id,
    required this.userId,
    required this.type,
    required this.payload,
    this.readAt,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      type: json['type'] ?? '',
      payload: json['payload'] ?? {},
      readAt: json['readAt'] != null ? DateTime.tryParse(json['readAt']) : null,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }

  bool get isUnread => readAt == null;

  String get title => payload['title'] ?? type;
  String get body => payload['body'] ?? payload['message'] ?? '';
}
