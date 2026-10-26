class RatingSummary {
  final String userId;
  final double averageScore;
  final int totalRatings;
  final List<Map<String, dynamic>> ratings;

  RatingSummary({
    required this.userId,
    required this.averageScore,
    required this.totalRatings,
    required this.ratings,
  });

  factory RatingSummary.fromJson(Map<String, dynamic> json) {
    return RatingSummary(
      userId: json['userId'] ?? '',
      averageScore: (json['averageScore'] as num?)?.toDouble() ?? 0,
      totalRatings: json['totalRatings'] ?? 0,
      ratings: (json['ratings'] as List? ?? []).cast<Map<String, dynamic>>(),
    );
  }
}
