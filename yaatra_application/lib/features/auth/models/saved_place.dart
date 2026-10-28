class SavedPlace {
  final String id;
  final String label;
  final String name;
  final String address;
  final double lat;
  final double lng;

  SavedPlace({
    required this.id,
    required this.label,
    required this.name,
    required this.address,
    required this.lat,
    required this.lng,
  });

  factory SavedPlace.fromJson(Map<String, dynamic> json) {
    return SavedPlace(
      id: json['id'] ?? '',
      label: json['label'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      lat: (json['lat'] as num?)?.toDouble() ?? 0,
      lng: (json['lng'] as num?)?.toDouble() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'label': label,
      'name': name,
      'address': address,
      'lat': lat,
      'lng': lng,
    };
  }
}
