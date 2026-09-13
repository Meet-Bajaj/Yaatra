class UserModel {
  final String id;
  final String phone;
  final String? name;
  final String? email;
  final String? gender;
  final String? profilePhoto;
  final String? city;
  final List<String> roles;
  final bool isVerified;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.phone,
    this.name,
    this.email,
    this.gender,
    this.profilePhoto,
    this.city,
    this.roles = const [],
    this.isVerified = false,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      phone: json['phone'] ?? '',
      name: json['name'],
      email: json['email'],
      gender: json['gender'],
      profilePhoto: json['profilePhoto'],
      city: json['city'],
      roles: List<String>.from(json['roles'] ?? []),
      isVerified: json['isVerified'] ?? false,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phone': phone,
      'name': name,
      'email': email,
      'gender': gender,
      'profilePhoto': profilePhoto,
      'city': city,
      'roles': roles,
      'isVerified': isVerified,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  bool get hasRole => roles.isNotEmpty;
  bool get isRider => roles.contains('RIDER');
  bool get isDriver => roles.contains('DRIVER');
  bool get isProfessional => roles.contains('PROFESSIONAL');
  bool get isAdmin => roles.contains('ADMIN');
}
