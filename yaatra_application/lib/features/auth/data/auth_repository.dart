import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/api/api_endpoints.dart';
import '../models/saved_place.dart';
import '../models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref);
});

class AuthRepository {
  final Ref _ref;

  AuthRepository(this._ref);

  Future<void> sendOtp(String phone) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.authOtp, data: {'phone': phone});
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.post(ApiEndpoints.authVerify, data: {
      'phone': phone,
      'code': otp,
    });
    return response.data;
  }

  Future<void> resendOtp(String phone) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post(ApiEndpoints.authResendOtp, data: {'phone': phone});
  }

  Future<UserModel> getProfile() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.authProfile);
    return UserModel.fromJson(response.data);
  }

  Future<UserModel> updateProfile({String? name, String? email}) async {
    final dio = _ref.read(dioClientProvider).dio;
    final data = <String, dynamic>{};
    if (name != null) data['name'] = name;
    if (email != null) data['email'] = email;
    final response = await dio.patch(ApiEndpoints.authProfile, data: data);
    return UserModel.fromJson(response.data);
  }

  Future<void> setRoles(List<String> roles) async {
    final dio = _ref.read(dioClientProvider).dio;
    await dio.post('/auth/roles', data: {'roles': roles});
  }

  Future<List<SavedPlace>> getSavedPlaces() async {
    final dio = _ref.read(dioClientProvider).dio;
    final response = await dio.get(ApiEndpoints.usersPlaces);
    final data = response.data;
    if (data is List) {
      return data
          .whereType<Map<String, dynamic>>()
          .map(SavedPlace.fromJson)
          .toList();
    }
    return [];
  }
}
