import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/storage/token_storage.dart';
import '../data/auth_repository.dart';
import '../models/saved_place.dart';
import '../models/user_model.dart';

enum AuthState { initial, loading, authenticated, unauthenticated, otpSent, otpVerified }

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;
  String? _phone;
  bool _isNewUser = false;

  AuthNotifier(this._ref) : super(AuthState.initial);

  String? get phone => _phone;
  bool get isNewUser => _isNewUser;

  Future<void> checkAuth() async {
    state = AuthState.loading;
    final hasToken = await _ref.read(tokenStorageProvider).hasToken();
    if (hasToken) {
      try {
        await _ref.read(authRepositoryProvider).getProfile();
        state = AuthState.authenticated;
      } catch (e) {
        await _ref.read(tokenStorageProvider).clearTokens();
        state = AuthState.unauthenticated;
      }
    } else {
      state = AuthState.unauthenticated;
    }
  }

  Future<void> sendOtp(String phone) async {
    _phone = phone;
    await _ref.read(authRepositoryProvider).sendOtp(phone);
    state = AuthState.otpSent;
  }

  Future<void> verifyOtp(String otp) async {
    if (_phone == null) throw Exception('Phone number not set');
    final result = await _ref.read(authRepositoryProvider).verifyOtp(_phone!, otp);
    final accessToken = result['access_token'] as String?;
    final refreshToken = result['refresh_token'] as String?;
    _isNewUser = result['isNewUser'] as bool? ?? false;
    if (accessToken != null) {
      await _ref.read(tokenStorageProvider).saveTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    }
    state = AuthState.authenticated;
  }

  Future<void> updateProfile({String? name, String? email}) async {
    await _ref.read(authRepositoryProvider).updateProfile(name: name, email: email);
  }

  Future<void> setRoles(List<String> roles) async {
    await _ref.read(authRepositoryProvider).setRoles(roles);
  }

  Future<void> logout() async {
    await _ref.read(tokenStorageProvider).clearTokens();
    state = AuthState.unauthenticated;
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

final currentUserProvider = FutureProvider<UserModel?>((ref) async {
  final authState = ref.watch(authProvider);
  if (authState == AuthState.authenticated) {
    try {
      return await ref.read(authRepositoryProvider).getProfile();
    } catch (e) {
      return null;
    }
  }
  return null;
});

final savedPlacesProvider = FutureProvider<List<SavedPlace>>((ref) async {
  if (ref.watch(authProvider) != AuthState.authenticated) {
    return const [];
  }
  try {
    return await ref.read(authRepositoryProvider).getSavedPlaces();
  } catch (e) {
    return [];
  }
});
