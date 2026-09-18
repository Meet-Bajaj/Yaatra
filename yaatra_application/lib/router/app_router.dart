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
import '../../features/rides/presentation/pages/upcoming_rides_page.dart';
import '../../features/rides/presentation/pages/ride_history_page.dart';
import '../../features/rides/presentation/pages/ride_detail_page.dart';
import '../../features/wallet/presentation/pages/wallet_page.dart';
import '../../features/notifications/presentation/pages/notification_center_page.dart';
import '../../features/safety/presentation/pages/safety_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/profile/presentation/pages/settings_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
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
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
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
            builder: (context, state) => const ActiveTripPage(),
          ),
          GoRoute(
            path: '/plan-commute',
            builder: (context, state) => const PlanCommutePage(),
          ),
          GoRoute(
            path: '/plan-commute/matches',
            builder: (context, state) => const ScheduledMatchesPage(),
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
            path: '/driver/online',
            builder: (context, state) => const GoOnlinePage(),
          ),
          GoRoute(
            path: '/driver/earnings',
            builder: (context, state) => const DriverEarningsPage(),
          ),
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
            builder: (context, state) => const RideDetailPage(),
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
        ],
      ),
    ],
  );
});

class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _getCurrentIndex(context),
        onTap: (index) => _onTap(context, index),
        items: const [
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
            label: 'Notifications',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outlined),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  int _getCurrentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/rides') || location.startsWith('/ride-now') ||
        location.startsWith('/plan-commute') || location.startsWith('/active-trip')) {
      return 1;
    }
    if (location.startsWith('/wallet')) return 2;
    if (location.startsWith('/notifications')) return 3;
    if (location.startsWith('/profile') || location.startsWith('/settings')) return 4;
    return 0;
  }

  void _onTap(BuildContext context, int index) {
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
