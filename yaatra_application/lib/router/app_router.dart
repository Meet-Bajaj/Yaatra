import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/otp_page.dart';
import '../../features/auth/presentation/pages/role_selection_page.dart';
import '../../features/auth/presentation/pages/profile_setup_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/ride_now/presentation/pages/search_destination_page.dart';
import '../../features/ride_now/presentation/pages/ride_options_page.dart';
import '../../features/ride_now/presentation/pages/ride_confirmation_page.dart';
import '../../features/ride_now/presentation/pages/active_trip_page.dart';
import '../../features/plan_commute/presentation/pages/plan_commute_page.dart';
import '../../features/plan_commute/presentation/pages/scheduled_matches_page.dart';
import '../../features/driver/presentation/pages/offer_seat_page.dart';
import '../../features/driver/presentation/pages/driver_offers_page.dart';
import '../../features/driver/presentation/pages/go_online_page.dart';
import '../../features/driver/presentation/pages/driver_earnings_page.dart';
import '../../features/driver/presentation/pages/driver_requests_page.dart';
import '../../features/rides/presentation/pages/upcoming_rides_page.dart';
import '../../features/rides/presentation/pages/ride_history_page.dart';
import '../../features/rides/presentation/pages/ride_detail_page.dart';
import '../../features/wallet/presentation/pages/wallet_page.dart';
import '../../features/notifications/presentation/pages/notification_center_page.dart';
import '../../features/safety/presentation/pages/safety_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/profile/presentation/pages/settings_page.dart';
import '../../features/profile/presentation/pages/edit_profile_page.dart';
import '../../features/profile/presentation/pages/my_vehicles_page.dart';
import '../../features/profile/presentation/pages/documents_page.dart';
import '../../features/profile/presentation/pages/ratings_page.dart';
import '../../features/profile/presentation/pages/help_support_page.dart';
import '../../features/profile/presentation/pages/saved_places_page.dart';
import '../../features/admin/presentation/pages/admin_dashboard_page.dart';
import '../../features/auth/providers/auth_providers.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final isLoggedIn = authState == AuthState.authenticated;
      final isAuthRoute = state.matchedLocation == '/login' ||
          state.matchedLocation == '/otp' ||
          state.matchedLocation == '/role' ||
          state.matchedLocation == '/profile-setup';

      if (!isLoggedIn && !isAuthRoute) return '/login';
      if (isLoggedIn && state.matchedLocation == '/login') return '/home';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/otp',
        builder: (context, state) => const OtpPage(),
      ),
      GoRoute(
        path: '/role',
        builder: (context, state) => const RoleSelectionPage(),
      ),
      GoRoute(
        path: '/profile-setup',
        builder: (context, state) => const ProfileSetupPage(),
      ),
      GoRoute(
        path: '/profile/edit',
        builder: (context, state) => const EditProfilePage(),
      ),
      GoRoute(
        path: '/profile/vehicles',
        builder: (context, state) => const MyVehiclesPage(),
      ),
      GoRoute(
        path: '/profile/documents',
        builder: (context, state) => const DocumentsPage(),
      ),
      GoRoute(
        path: '/profile/ratings',
        builder: (context, state) => const RatingsPage(),
      ),
      GoRoute(
        path: '/profile/help',
        builder: (context, state) => const HelpSupportPage(),
      ),
      GoRoute(
        path: '/profile/places',
        builder: (context, state) => const SavedPlacesPage(),
      ),
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          // Rider routes
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomePage(),
          ),
          GoRoute(
            path: '/ride-now',
            builder: (context, state) => const SearchDestinationPage(),
          ),
          GoRoute(
            path: '/ride-now/options',
            builder: (context, state) => const RideOptionsPage(),
          ),
          GoRoute(
            path: '/ride-now/confirm',
            builder: (context, state) => const RideConfirmationPage(),
          ),
          GoRoute(
            path: '/active-trip/:id',
            builder: (context, state) => ActiveTripPage(
              tripId: state.pathParameters['id'] ?? '',
            ),
          ),
          GoRoute(
            path: '/plan-commute',
            builder: (context, state) => const PlanCommutePage(),
          ),
          GoRoute(
            path: '/plan-commute/matches',
            builder: (context, state) => const ScheduledMatchesPage(),
          ),

          // Driver routes
          GoRoute(
            path: '/driver/online',
            builder: (context, state) => const GoOnlinePage(),
          ),
          GoRoute(
            path: '/driver/offer',
            builder: (context, state) => const OfferSeatPage(),
          ),
          GoRoute(
            path: '/driver/offers',
            builder: (context, state) => const DriverOffersPage(),
          ),
          GoRoute(
            path: '/driver/earnings',
            builder: (context, state) => const DriverEarningsPage(),
          ),
          GoRoute(
            path: '/driver/requests',
            builder: (context, state) => const DriverRequestsPage(),
          ),

          // Shared routes
          GoRoute(
            path: '/rides/upcoming',
            builder: (context, state) => const UpcomingRidesPage(),
          ),
          GoRoute(
            path: '/rides/history',
            builder: (context, state) => const RideHistoryPage(),
          ),
          GoRoute(
            path: '/rides/:id',
            builder: (context, state) => RideDetailPage(
              tripId: state.pathParameters['id'] ?? '',
            ),
          ),
          GoRoute(
            path: '/wallet',
            builder: (context, state) => const WalletPage(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationCenterPage(),
          ),
          GoRoute(
            path: '/safety',
            builder: (context, state) => const SafetyPage(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfilePage(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsPage(),
          ),

          // Admin routes
          GoRoute(
            path: '/admin',
            builder: (context, state) => const AdminDashboardPage(),
          ),
        ],
      ),
    ],
  );
});

class MainShell extends ConsumerWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);
    final user = userAsync.valueOrNull;
    final isDriver = user?.isDriver ?? false;
    final isAdmin = user?.isAdmin ?? false;

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _getCurrentIndex(context),
        onTap: (index) => _onTap(context, index, isDriver: isDriver, isAdmin: isAdmin),
        items: _getNavItems(isDriver: isDriver, isAdmin: isAdmin),
      ),
    );
  }

  List<BottomNavigationBarItem> _getNavItems({
    required bool isDriver,
    required bool isAdmin,
  }) {
    if (isAdmin) {
      return const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_outlined),
          activeIcon: Icon(Icons.dashboard),
          label: 'Dashboard',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.people_outlined),
          activeIcon: Icon(Icons.people),
          label: 'Users',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications_outlined),
          activeIcon: Icon(Icons.notifications),
          label: 'Alerts',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outlined),
          activeIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ];
    }

    if (isDriver) {
      return const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.drive_eta_outlined),
          activeIcon: Icon(Icons.drive_eta),
          label: 'Drive',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_balance_wallet_outlined),
          activeIcon: Icon(Icons.account_balance_wallet),
          label: 'Earnings',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications_outlined),
          activeIcon: Icon(Icons.notifications),
          label: 'Alerts',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outlined),
          activeIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ];
    }

    // Rider tabs
    return const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home_outlined),
        activeIcon: Icon(Icons.home),
        label: 'Home',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.directions_car_outlined),
        activeIcon: Icon(Icons.directions_car),
        label: 'Rides',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.account_balance_wallet_outlined),
        activeIcon: Icon(Icons.account_balance_wallet),
        label: 'Wallet',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.notifications_outlined),
        activeIcon: Icon(Icons.notifications),
        label: 'Alerts',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.person_outlined),
        activeIcon: Icon(Icons.person),
        label: 'Profile',
      ),
    ];
  }

  int _getCurrentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/home') || location.startsWith('/admin')) return 0;
    if (location.startsWith('/driver/online') ||
        location.startsWith('/driver/offer') ||
        location.startsWith('/driver/offers') ||
        location.startsWith('/driver/requests')) {
      return 1;
    }
    if (location.startsWith('/rides') ||
        location.startsWith('/ride-now') ||
        location.startsWith('/plan-commute') ||
        location.startsWith('/active-trip')) {
      return 1;
    }
    if (location.startsWith('/wallet') || location.startsWith('/driver/earnings')) return 2;
    if (location.startsWith('/notifications')) return 3;
    if (location.startsWith('/profile') || location.startsWith('/settings') || location.startsWith('/safety')) return 4;
    return 0;
  }

  void _onTap(BuildContext context, int index, {required bool isDriver, required bool isAdmin}) {
    if (isAdmin) {
      switch (index) {
        case 0:
          context.go('/admin');
          break;
        case 1:
          context.go('/admin');
          break;
        case 2:
          context.go('/notifications');
          break;
        case 3:
          context.go('/profile');
          break;
      }
      return;
    }

    if (isDriver) {
      switch (index) {
        case 0:
          context.go('/home');
          break;
        case 1:
          context.go('/driver/online');
          break;
        case 2:
          context.go('/driver/earnings');
          break;
        case 3:
          context.go('/notifications');
          break;
        case 4:
          context.go('/profile');
          break;
      }
      return;
    }

    // Rider
    switch (index) {
      case 0:
        context.go('/home');
        break;
      case 1:
        context.go('/rides/upcoming');
        break;
      case 2:
        context.go('/wallet');
        break;
      case 3:
        context.go('/notifications');
        break;
      case 4:
        context.go('/profile');
        break;
    }
  }
}
