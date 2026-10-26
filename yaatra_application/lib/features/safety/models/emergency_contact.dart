class EmergencyContact {
  final String phone;
  final String label;

  EmergencyContact({required this.phone, required this.label});

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      phone: json['phone'] ?? '',
      label: json['label'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'phone': phone,
      'label': label,
    };
  }
}
