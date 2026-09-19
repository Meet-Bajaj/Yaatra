# Yaatra Flutter Learning Guide

A complete reference for learning Flutter and understanding the Yaatra application from zero to independent developer.

---

## Table of Contents

1. [Dart Fundamentals](#chapter-1-dart-fundamentals)
2. [Flutter Fundamentals](#chapter-2-flutter-fundamentals)
3. [Project Architecture Deep Dive](#chapter-3-project-architecture-deep-dive)
4. [How Each File Works](#chapter-4-how-each-file-works)
5. [State Management with Riverpod](#chapter-5-state-management-with-riverpod)
6. [Navigation with GoRouter](#chapter-6-navigation-with-gorouter)
7. [API & Networking](#chapter-7-api--networking)
8. [Local Storage & Security](#chapter-8-local-storage--security)
9. [UI Development & Widgets](#chapter-9-ui-development--widgets)
10. [Theme & Design System](#chapter-10-theme--design-system)
11. [Feature Walkthroughs](#chapter-11-feature-walkthroughs)
12. [How to Make Common Changes](#chapter-12-how-to-make-common-changes)
13. [Debugging Guide](#chapter-13-debugging-guide)
14. [Testing Guide](#chapter-14-testing-guide)
15. [Building & Deployment](#chapter-15-building--deployment)
16. [Best Practices & Code Quality](#chapter-16-best-practices--code-quality)
17. [Learning Path](#chapter-17-learning-path)

---

## Chapter 1: Dart Fundamentals

Before working on this project, you need to understand Dart basics. This chapter covers everything you need.

### 1.1 What Is Dart?

Dart is the programming language used to build Flutter apps. Think of it as the language that tells the computer what to do, while Flutter is the tool that turns your code into a visual app.

### 1.2 Variables and Data Types

```dart
// Variables — containers for storing data
String name = 'Priya';          // Text
int age = 20;                   // Whole numbers
double price = 150.50;          // Decimal numbers
bool isVerified = true;         // true or false

// 'var' lets Dart figure out the type automatically
var city = 'Bangalore';  // Dart knows this is a String

// 'final' means the value can never change after setting
final pi = 3.14;  // Can't reassign pi = 3.15 — error!

// 'const' is like final but must be known at compile time
const maxSeats = 3;

// Null safety — variables can't be null unless you say so
String? phone;           // phone CAN be null (nullable)
String verifiedPhone;    // verifiedPhone CANNOT be null (non-nullable)
```

**In this project:** You'll see `String?` used often for optional data like `String? refreshToken` in `lib/core/storage/token_storage.dart:15` — the refresh token might not always exist.

### 1.3 Functions

Functions are blocks of code that do a specific job.

```dart
// Basic function
String formatPrice(double amount) {
  return '₹${amount.toStringAsFixed(0)}';
}

// Short function (one expression)
String formatPrice(double amount) => '₹${amount.toStringAsFixed(0)}';

// Function with optional named parameters
void greet({required String name, int age = 25}) {
  print('Hello $name, age $age');
}
// Usage: greet(name: 'Raj') — age defaults to 25
// Usage: greet(name: 'Raj', age: 32)

// Async function — returns a Future (a value that comes later)
Future<String> fetchUser() async {
  final response = await dio.get('/auth/profile');
  return response.data['name'];
}
```

**In this project:** Look at `lib/core/utils/formatters.dart` — every method is a utility function that takes input and returns formatted output.

### 1.4 Classes and Objects

Classes are blueprints for creating things. A class defines what something IS and what it can DO.

```dart
// Defining a class
class Ride {
  // Properties (what it has)
  final String id;
  final String driverName;
  final double fare;
  bool isBooked;

  // Constructor (how to create it)
  Ride({
    required this.id,
    required this.driverName,
    required this.fare,
    this.isBooked = false,
  });

  // Method (what it can do)
  String get displayFare => '₹${fare.toStringAsFixed(0)}';
}

// Creating an object from the class
final ride = Ride(
  id: 'ride_123',
  driverName: 'Vikram',
  fare: 150.0,
);
print(ride.displayFare);  // ₹150
```

**In this project:** The `UserModel` class in `lib/features/auth/models/user_model.dart` defines what a user looks like and how to create one from server data.

### 1.5 Null Safety

Dart prevents null pointer errors (the #1 source of crashes). If a variable can be null, you must explicitly say so with `?`.

```dart
String name = 'Priya';    // Can NEVER be null
String? nickname;          // CAN be null

// Safe access with ?. (call method only if not null)
int? length = nickname?.length;  // length is null if nickname is null

// Default value with ?? (use this if null)
String display = nickname ?? 'No nickname';

// Force unwrap with ! (dangerous — only use if you're SURE it's not null)
int len = nickname!.length;  // CRASHES if nickname is null!
```

**In this project:** In `lib/core/storage/token_storage.dart:21`:
```dart
Future<String?> getToken() async {
  return await _storage.read(key: _accessTokenKey);
}
```
The return type is `String?` because there might not be a stored token yet. The caller must handle the null case.

### 1.6 Collections (Lists and Maps)

```dart
// List — an ordered collection (like an array)
List<String> cities = ['Bangalore', 'Delhi', 'Mumbai'];
cities.add('Pune');
print(cities[0]);  // Bangalore

// Map — key-value pairs (like a dictionary)
Map<String, dynamic> user = {
  'name': 'Raj',
  'age': 32,
  'isDriver': true,
};
print(user['name']);  // Raj

// JSON is just a Map or List
// { "name": "Raj", "roles": ["RIDER", "DRIVER"] }
```

**In this project:** The `CacheService` in `lib/core/storage/cache.dart` uses `Map<String, dynamic>` for JSON data and `List<Map<String, dynamic>>` for lists of items.

### 1.7 Async Programming (Future, async/await)

When you ask for data from the internet, it doesn't arrive instantly. Dart uses `Future` to handle things that happen later.

```dart
// A Future is like a promise: "I'll give you this value LATER"
Future<String> fetchData() async {
  // 'await' pauses this function until the value arrives
  final response = await http.get(Uri.parse('https://api.example.com/data'));
  return response.body;
}

// You MUST be in an 'async' function to use 'await'
void main() async {
  final data = await fetchData();
  print(data);
}
```

**In this project:** Almost every API call and storage operation is async. For example, in `lib/main.dart:9`:
```dart
await cacheService.init();  // Waits for SharedPreferences to be ready
```

### 1.8 Enums

Enums define a fixed set of possible values.

```dart
enum AuthState { initial, loading, authenticated, unauthenticated, otpSent, otpVerified }

AuthState state = AuthState.initial;
// state can ONLY be one of these values — nothing else
```

**In this project:** `lib/features/auth/providers/auth_providers.dart:7` defines `AuthState` with all possible authentication states.

---

## Chapter 2: Flutter Fundamentals

### 2.1 What Is Flutter?

Flutter is Google's framework for building apps that work on Android, iOS, web, and desktop from a single codebase. You write code once, and Flutter renders it natively on each platform.

### 2.2 How Flutter Apps Work

When you run a Flutter app:
1. Dart code is compiled to native machine code
2. Flutter's rendering engine (Skia/Impeller) draws every pixel on screen
3. Everything you see is a **widget** — text, buttons, images, spacing, everything

### 2.3 The Widget Concept

A widget is a building block of the UI. Every visual element is a widget:
- A button is a widget
- A text label is a widget
- A row of items is a widget
- Padding (space around something) is a widget
- The entire screen is made of nested widgets

Think of widgets like LEGO bricks — you snap them together to build the UI.

### 2.4 StatelessWidget vs StatefulWidget

**StatelessWidget** — doesn't change. What you see is what you get.
```dart
class Greeting extends StatelessWidget {
  final String name;
  const Greeting({required this.name});

  @override
  Widget build(BuildContext context) {
    return Text('Hello, $name!');
  }
}
```

**StatefulWidget** — can change over time (user taps, data loads, etc.)
```dart
class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () {
            setState(() { count++; });  // setState tells Flutter to rebuild
          },
          child: Text('Add'),
        ),
      ],
    );
  }
}
```

**In this project:** Most pages are `StatelessWidget` with Riverpod (e.g., `ConsumerWidget`) because Riverpod handles the state instead of `setState`.

### 2.5 The build() Method and Widget Tree

Every widget has a `build()` method that returns a tree of widgets. Flutter calls `build()` to know what to draw on screen.

```dart
@override
Widget build(BuildContext context) {
  return Scaffold(           // Screen scaffold
    appBar: AppBar(          // Top bar
      title: Text('Home'),
    ),
    body: Column(            // Vertical layout
      children: [
        Text('Welcome'),    // A text widget
        ElevatedButton(     // A button widget
          child: Text('Click me'),
          onPressed: () {},
        ),
      ],
    ),
  );
}
```

### 2.6 BuildContext

`BuildContext` is like a handle to the widget's location in the widget tree. You pass it around so Flutter knows where things are.

```dart
// You use context for navigation, theme access, media queries, etc.
context.push('/home');            // Navigate
Theme.of(context).colorScheme;    // Get theme colors
MediaQuery.of(context).size;      // Get screen size
```

### 2.7 Common Layout Widgets

| Widget | Purpose | Example |
|--------|---------|---------|
| `Row` | Horizontal layout | A row of buttons |
| `Column` | Vertical layout | A form with fields |
| `Container` | Box with styling | A colored card |
| `SizedBox` | Fixed-size box | Set specific width/height |
| `Padding` | Space around content | Add margin around a widget |
| `Expanded` | Fill remaining space | Divide space equally |
| `Flexible` | Flexible sizing | Take available space |
| `Stack` | Overlapping layers | Text over an image |
| `ListView` | Scrollable list | Ride history list |
| `GridView` | Grid layout | Quick action buttons |
| `Card` | Rounded box | Ride option card |

### 2.8 Scaffold

`Scaffold` is the basic structure of a screen:

```dart
Scaffold(
  appBar: AppBar(title: Text('My Screen')),
  body: Text('Main content'),
  bottomNavigationBar: BottomNavigationBar(...),
  floatingActionButton: FloatingActionButton(...),
  drawer: Drawer(...),
)
```

### 2.9 Forms and Validation

```dart
final formKey = GlobalKey<FormState>();

Form(
  key: formKey,
  child: Column(
    children: [
      TextFormField(
        validator: (value) {
          if (value == null || value.isEmpty) return 'Required';
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (formKey.currentState!.validate()) {
            // Form is valid, submit it
          }
        },
        child: Text('Submit'),
      ),
    ],
  ),
)
```

**In this project:** The `LoginPage` in `lib/features/auth/presentation/pages/login_page.dart` uses `Form` with `Validators.phone()` for phone number validation.

---

## Chapter 3: Project Architecture Deep Dive

### 3.1 Feature-Based Architecture

This project organizes code by **feature** rather than by type. Each feature is a self-contained module:

```
features/
├── auth/          # Authentication feature
├── home/          # Home screen feature
├── ride_now/      # On-demand ride feature
├── plan_commute/  # Scheduled carpool feature
├── driver/        # Driver features
├── rides/         # Ride management feature
├── wallet/        # Wallet feature
├── notifications/ # Notifications feature
├── safety/        # Safety feature
└── profile/       # Profile feature
```

**Why feature-based?** When you work on the wallet, all wallet code is in one place. You don't need to jump between 5 different folders.

### 3.2 Three-Layer Structure Within Each Feature

Each feature follows this pattern:

```
feature/
├── data/          # How to get/store data (API calls, repositories)
├── models/        # Data structures (what the data looks like)
├── providers/     # State management (how data flows to the UI)
└── presentation/  # What the user sees (pages, widgets)
    └── pages/
```

**Example: The `auth` feature:**

| Layer | File | What It Does |
|-------|------|--------------|
| Models | `user_model.dart` | Defines what a User looks like |
| Data | `auth_repository.dart` | Makes API calls for login, OTP, profile |
| Providers | `auth_providers.dart` | Manages auth state (logged in, logged out, etc.) |
| Presentation | `login_page.dart`, `otp_page.dart`, etc. | The actual screens users see |

### 3.3 The Core Layer

The `core/` folder contains things used across ALL features:

```
core/
├── api/           # HTTP client and endpoint URLs
├── storage/       # Local storage (cache, tokens)
├── theme/         # Colors and theme styling
├── utils/         # Utility functions (formatters, validators)
└── widgets/       # Reusable UI components
```

**Key principle:** If a widget or service is used by more than one feature, it goes in `core/`. If it's only used by one feature, it stays in that feature.

### 3.4 Data Flow Diagram

Here's how data moves through the app when a user taps "Book Ride":

```
User taps "Book Ride"
       ↓
RideConfirmationPage (presentation)
       ↓ reads state
authProvider / rideProvider (providers)
       ↓ calls
RideRepository (data)
       ↓ uses
DioClient (core/api)
       ↓ sends HTTP POST
Backend Server
       ↓ returns JSON
fromJson() (models)
       ↓ creates
UserModel / RideModel
       ↓ updates
StateNotifier → State change
       ↓ triggers
UI rebuilds with new data
```

---

## Chapter 4: How Each File Works

### 4.1 Entry Point: `lib/main.dart`

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();  // Required before async work in main
  final cacheService = CacheService();
  await cacheService.init();                  // Initialize SharedPreferences
  runApp(
    ProviderScope(                            // Riverpod's root — provides all state
      overrides: [
        cacheServiceProvider.overrideWithValue(cacheService),  // Use initialized cache
      ],
      child: const YaatraApp(),              // The actual app widget
    ),
  );
}
```

**What happens:** 
1. Flutter prepares for platform communication
2. Local storage is initialized
3. The app starts with Riverpod wrapping everything

### 4.2 Root Widget: `lib/app.dart`

```dart
class YaatraApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);  // Get the router from Riverpod
    return MaterialApp.router(
      title: 'Yaatra',
      theme: AppTheme.light,       // Light theme
      darkTheme: AppTheme.dark,    // Dark theme
      themeMode: ThemeMode.light,  // Currently using light mode
      routerConfig: router,        // GoRouter handles all navigation
    );
  }
}
```

### 4.3 Router: `lib/router/app_router.dart`

This file defines EVERY screen in the app and how to get to it. It also defines the bottom navigation bar.

**Key concept: ShellRoute**
The `ShellRoute` wraps the main app screens and adds a persistent bottom navigation bar. Screens inside the ShellRoute share the same bottom bar.

```dart
ShellRoute(
  builder: (context, state, child) => MainShell(child: child),
  routes: [
    GoRoute(path: '/home', builder: ...),
    GoRoute(path: '/rides/upcoming', builder: ...),
    // ... more routes
  ],
),
```

The `MainShell` class builds the `BottomNavigationBar` and determines which tab is active based on the current URL.

### 4.4 API Client: `lib/core/api/dio_client.dart`

Dio is an HTTP library. The `DioClient` class wraps it with:

1. **Base configuration**: Timeout (30 seconds), headers (JSON content type)
2. **Auth interceptor**: Automatically adds the JWT token to every request
3. **Error interceptor**: If the server returns 401 (unauthorized), clears stored tokens
4. **Helper methods**: `get()`, `post()`, `patch()`, `delete()`

**Riverpod integration:** `dioClientProvider` creates a single DioClient that all features share.

### 4.5 API Endpoints: `lib/core/api/api_endpoints.dart`

A simple class with static string constants for every API URL. This prevents typos and makes it easy to update URLs.

```dart
class ApiEndpoints {
  static const String baseUrl = 'http://10.0.2.2:5001';
  static const String authOtp = '/auth/otp';
  static const String ridesAvailable = '/rides/available';
  static String rideById(String id) => '/rides/$id';  // Dynamic endpoint
}
```

### 4.6 Token Storage: `lib/core/storage/token_storage.dart`

Uses `FlutterSecureStorage` to safely store JWT tokens. This is encrypted on the device.

```dart
class TokenStorage {
  Future<void> saveTokens({required String accessToken, String? refreshToken}) async { ... }
  Future<String?> getToken() async { ... }
  Future<void> clearTokens() async { ... }
  Future<bool> hasToken() async { ... }
}
```

### 4.7 Cache Service: `lib/core/storage/cache.dart`

A wrapper around `SharedPreferences` for general-purpose local storage. Stores strings, JSON objects, and lists.

```dart
class CacheService {
  Future<void> setString(String key, String value) async { ... }
  String? getString(String key) { ... }
  Future<void> setJson(String key, Map<String, dynamic> value) async { ... }
  Map<String, dynamic>? getJson(String key) { ... }
}
```

### 4.8 Validators: `lib/core/utils/validators.dart`

Static validation functions for form inputs:

| Validator | What It Checks |
|-----------|----------------|
| `phone()` | Valid 10-digit Indian phone number (starts with 6-9) |
| `otp()` | Exactly 6 digits |
| `name()` | At least 2 characters |
| `email()` | Valid email format (optional field) |
| `vehicleNumber()` | Indian vehicle number format (e.g., KA01AB1234) |
| `seats()` | Between 1 and 3 |
| `price()` | Positive number |
| `password()` | At least 8 characters |

### 4.9 Formatters: `lib/core/utils/formatters.dart`

Display formatting utilities:

| Formatter | Example Output |
|-----------|----------------|
| `currency(150.0)` | ₹150.00 |
| `currencyCompact(150000)` | ₹1.5L |
| `distance(5.5)` | 5.5 km |
| `duration(90)` | 1 hr 30 min |
| `timeAgo(DateTime.now().subtract(Duration(minutes: 5)))` | 5m ago |
| `rideTime(someDateTime)` | 08:30 AM |
| `rideDate(someDateTime)` | 14 Sep 2026 |
| `maskedPhone('9876543210')` | 987****210 |
| `indianPhone('9876543210')` | +919876543210 |

### 4.10 Reusable Widgets in `core/widgets/`

| Widget | What It Does | Used Where |
|--------|-------------|------------|
| `PrimaryButton` | Styled button with solid/outlined variants, loading state | All screens with actions |
| `AppTextField` | Styled text input with validation | Forms (login, profile, offer seat) |
| `ChipFilter` | Animated filter chip | Ride options filtering |
| `DriverCard` | Driver info display card | Ride options, ride details |
| `RideOptionCard` | Ride option with driver, fare, badges | Ride options list |
| `TrustBadge` | Colored verification badge | Driver cards, ride cards |
| `SkeletonLoader` | Loading placeholder animation | While data loads |
| `EmptyState` | "No data" display | Empty lists |
| `ErrorState` | Error display with retry | API failures |

---

## Chapter 5: State Management with Riverpod

### 5.1 What Is State?

"State" is any data that can change during the app's lifetime:
- Is the user logged in? (Auth state)
- What rides are available? (Ride list state)
- What's in the wallet? (Wallet balance state)
- Which tab is selected? (Navigation state)

### 5.2 Why State Management?

Without state management, you'd have to pass data down through many widget constructors, which gets messy. State management provides a clean, centralized way to share data.

### 5.3 Riverpod Concepts

**Provider** — A box that holds data or a service. Widgets can read from it.

```dart
// Simple provider — returns a value
final nameProvider = Provider<String>((ref) => 'Yaatra');

// FutureProvider — loads async data
final userProvider = FutureProvider<UserModel?>((ref) async {
  final repo = ref.read(authRepositoryProvider);
  return await repo.getProfile();
});

// StateNotifierProvider — holds mutable state with methods to change it
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
```

**StateNotifier** — A class that manages state and has methods to change it.

```dart
class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;
  
  AuthNotifier(this._ref) : super(AuthState.initial);
  
  Future<void> sendOtp(String phone) async {
    state = AuthState.loading;  // Update state → UI rebuilds
    try {
      await _ref.read(authRepositoryProvider).sendOtp(phone: phone);
      state = AuthState.otpSent;  // UI shows OTP screen
    } catch (e) {
      state = AuthState.unauthenticated;  // UI shows error
    }
  }
}
```

### 5.4 How Widgets Use Providers

```dart
// In a widget, use ConsumerWidget instead of StatelessWidget
class LoginPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ref.watch() — rebuilds this widget when state changes
    final authState = ref.watch(authProvider);
    
    // ref.read() — reads current value without rebuilding
    final router = ref.read(routerProvider);
    
    // Use state to conditionally show UI
    if (authState == AuthState.loading) {
      return CircularProgressIndicator();
    }
    
    return ElevatedButton(
      onPressed: () {
        // Call a method to change state
        ref.read(authProvider.notifier).sendOtp(phone);
      },
      child: Text('Send OTP'),
    );
  }
}
```

### 5.5 The Auth State Machine

In `lib/features/auth/providers/auth_providers.dart`:

```
initial → (sendOtp called) → loading → otpSent → (verifyOtp called) → otpVerified → authenticated
                                      ↘ unauthenticated (on error)
```

### 5.6 How to Add New State

1. **Define the state type** (could be an enum, a class, or a simple type)
2. **Create a StateNotifier** with the state type
3. **Create a StateNotifierProvider** for it
4. **Use ref.watch()** in your widget to rebuild when state changes
5. **Call methods on the notifier** to update state

---

## Chapter 6: Navigation with GoRouter

### 6.1 What Is Navigation?

Navigation is how users move between screens. When you tap "Ride Now" on the home screen, you navigate to the search screen.

### 6.2 GoRouter Basics

GoRouter is a declarative routing package. You define all routes in one place (app_router.dart), and GoRouter handles the rest.

### 6.3 Route Types

**Simple route:**
```dart
GoRoute(
  path: '/login',
  builder: (context, state) => const LoginPage(),
),
```

**Route with parameters:**
```dart
GoRoute(
  path: '/active-trip/:id',    // :id is a parameter
  builder: (context, state) => const ActiveTripPage(),
),
```

**ShellRoute (with bottom navigation):**
```dart
ShellRoute(
  builder: (context, state, child) => MainShell(child: child),
  routes: [ ... ],
),
```

### 6.4 How to Navigate

```dart
// Push — go to a new screen (adds to stack)
context.push('/ride-now/options');

// Go — replace current screen (doesn't add to stack)
context.go('/home');

// Go with parameters
context.go('/active-trip/trip_123');

// Pop — go back
context.pop();

// Pop with a result
context.pop('booking_confirmed');
```

### 6.5 Bottom Navigation

The `MainShell` class in `app_router.dart` manages the bottom navigation bar:

1. **`_getCurrentIndex()`** — looks at the current URL and returns which tab should be active
2. **`_onTap()`** — navigates to the corresponding route when a tab is tapped

The 5 tabs are: Home, Rides, Wallet, Notifications, Profile.

### 6.6 How to Add a New Screen

1. Create the page file in `lib/features/<feature>/presentation/pages/`
2. Add a route in `lib/router/app_router.dart`:

```dart
GoRoute(
  path: '/my-new-screen',
  builder: (context, state) => const MyNewScreen(),
),
```

3. Navigate to it from anywhere:

```dart
context.push('/my-new-screen');
```

---

## Chapter 7: API & Networking

### 7.1 How HTTP Works

When your app needs data from the server:
1. Your app sends an HTTP request (like GET or POST) to a URL
2. The server processes the request
3. The server sends back a response (usually JSON)
4. Your app parses the JSON and displays the data

### 7.2 Dio Setup

The project uses Dio (not the built-in `http` package). Dio is configured in `lib/core/api/dio_client.dart`:

```dart
_dio = Dio(
  BaseOptions(
    baseUrl: ApiEndpoints.baseUrl,        // http://10.0.2.2:5001
    connectTimeout: Duration(seconds: 30), // Max time to connect
    receiveTimeout: Duration(seconds: 30), // Max time to receive response
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  ),
);
```

### 7.3 Interceptors

Interceptors run before every request or after every response:

```dart
_dio.interceptors.add(
  InterceptorsWrapper(
    onRequest: (options, handler) async {
      // Runs BEFORE every request
      final token = await _ref.read(tokenStorageProvider).getToken();
      if (token != null) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);  // Continue with the request
    },
    onError: (error, handler) async {
      // Runs AFTER a response with an error
      if (error.response?.statusCode == 401) {
        await _ref.read(tokenStorageProvider).clearTokens();
      }
      handler.next(error);
    },
  ),
);
```

### 7.4 Making API Calls

```dart
// GET request
final response = await dioClient.get('/rides/available');
List<dynamic> rides = response.data;

// POST request
final response = await dioClient.post('/rides/book', data: {
  'rideId': 'ride_123',
  'seats': 1,
});

// PATCH request
final response = await dioClient.patch('/auth/profile', data: {
  'name': 'New Name',
});

// DELETE request
final response = await dioClient.delete('/rides/ride_123/cancel');
```

### 7.5 JSON Serialization

The app converts between Dart objects and JSON (the format servers use):

```dart
// Model class with fromJson and toJson
class UserModel {
  final String id;
  final String name;

  UserModel({required this.id, required this.name});

  // Create from server JSON
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }

  // Convert to JSON for sending to server
  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
```

### 7.6 Error Handling

```dart
try {
  final response = await dioClient.get('/rides/available');
  // Handle success
} on DioException catch (e) {
  if (e.type == DioExceptionType.connectionTimeout) {
    // Show "Connection timeout" message
  } else if (e.response?.statusCode == 404) {
    // Show "Not found" message
  } else {
    // Show generic error
  }
}
```

### 7.7 The Base URL

The current base URL is `http://10.0.2.2:5001`. This is:
- **Android emulator**: `10.0.2.2` is a special alias that routes to your computer's `localhost`
- **iOS simulator**: Use `http://localhost:5001`
- **Physical device**: Use your computer's local IP (e.g., `http://192.168.1.100:5001`)

---

## Chapter 8: Local Storage & Security

### 8.1 Two Storage Solutions

The project uses two different storage solutions for different purposes:

| Solution | Package | Purpose | Security |
|----------|---------|---------|----------|
| SharedPreferences | `shared_preferences` | General data (preferences, cached data) | Plain text on device |
| FlutterSecureStorage | `flutter_secure_storage` | Sensitive data (JWT tokens) | Encrypted on device |

### 8.2 When to Use Which

- **Use SharedPreferences (CacheService)** for: user preferences, cached ride data, UI state
- **Use FlutterSecureStorage (TokenStorage)** for: JWT tokens, refresh tokens, any authentication secrets

### 8.3 How Storage Works

**Writing data:**
```dart
// Cache
await cacheService.setString('city', 'Bangalore');
await cacheService.setJson('user', {'name': 'Raj', 'role': 'DRIVER'});

// Secure
await tokenStorage.saveTokens(accessToken: 'jwt...', refreshToken: 'refresh...');
```

**Reading data:**
```dart
// Cache
String? city = cacheService.getString('city');
Map<String, dynamic>? user = cacheService.getJson('user');

// Secure
String? token = await tokenStorage.getToken();
bool isLogged = await tokenStorage.hasToken();
```

**Deleting data:**
```dart
await cacheService.remove('city');
await tokenStorage.clearTokens();  // Used on logout
```

---

## Chapter 9: UI Development & Widgets

### 9.1 Widget Composition

Flutter apps are built by composing widgets inside other widgets:

```dart
Scaffold(
  body: Column(
    children: [
      Text('Hello'),
      Row(
        children: [
          Icon(Icons.star),
          Text('5.0'),
        ],
      ),
    ],
  ),
)
```

### 9.2 How the Project Builds UIs

Each page follows this pattern:

1. **Page widget** (StatelessWidget or ConsumerWidget)
2. **build() method** returns a Scaffold
3. Scaffold contains AppBar + Body
4. Body uses layout widgets (Column, ListView, etc.)
5. Business logic uses providers for state

### 9.3 The Scaffold Pattern in This Project

```dart
class SomePage extends ConsumerWidget {
  const SomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Page Title'),
        // Optional: leading, actions, etc.
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Page content here
          ],
        ),
      ),
    );
  }
}
```

### 9.4 Reusable Widgets

The project has 9 reusable widgets in `core/widgets/`:

**PrimaryButton:**
```dart
PrimaryButton(
  text: 'Book Ride',
  onPressed: () { ... },
  isLoading: false,      // Shows spinner when true
  isOutlined: false,     // true = outlined style
  icon: Icons.check,     // Optional leading icon
)
```

**AppTextField:**
```dart
AppTextField(
  controller: nameController,
  labelText: 'Full Name',
  hintText: 'Enter your name',
  prefixIcon: Icons.person,
  validator: Validators.name,
  keyboardType: TextInputType.name,
)
```

**TrustBadge:**
```dart
TrustBadge.carpool()     // Green "Carpool" badge
TrustBadge.professional() // Blue "Professional" badge
TrustBadge.womenOnly()   // Pink "Women Only" badge
TrustBadge.verified()    // Purple "Verified" badge
```

**SkeletonLoader (loading state):**
```dart
SkeletonLoader.line(width: 200)   // Horizontal line placeholder
SkeletonLoader.circle()            // Circle placeholder
SkeletonLoader.card()              // Card placeholder
```

**EmptyState & ErrorState:**
```dart
EmptyState(
  icon: Icons.directions_car,
  title: 'No rides found',
  subtitle: 'Try a different destination',
  actionText: 'Search again',
  onAction: () { ... },
)

ErrorState(
  title: 'Something went wrong',
  subtitle: 'Could not load rides',
  actionText: 'Retry',
  onAction: () { ... },
)
```

### 9.5 How to Create a New Screen

1. Create a new file in the appropriate feature folder:

```dart
// lib/features/my_feature/presentation/pages/my_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MyScreen extends ConsumerWidget {
  const MyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Screen')),
      body: const Center(child: Text('Hello from My Screen')),
    );
  }
}
```

2. Add a route in `app_router.dart`
3. Navigate to it from another screen

---

## Chapter 10: Theme & Design System

### 10.1 Colors

The project defines a consistent color palette in `lib/core/theme/app_colors.dart`. Colors are organized by purpose:

- **Brand colors**: Primary (purple #6C63FF), Secondary (teal #00C9A7)
- **Text colors**: Primary (dark), Secondary (gray), Hint (light gray)
- **Status colors**: Success (green), Error (red), Warning (yellow), Info (blue)
- **Badge colors**: Carpool (green), Professional (blue), Women-Only (pink), Verified (purple)
- **Dark theme colors**: Dedicated dark variants

### 10.2 Theme

The theme in `lib/core/theme/app_theme.dart` defines how ALL widgets look by default:

- **Font**: Poppins (all weights)
- **Buttons**: Rounded corners (12px), purple background
- **Cards**: No elevation, rounded (16px), bordered
- **Input fields**: Filled, rounded (12px), purple focus border
- **Bottom nav**: Fixed type, purple selected, gray unselected
- **Chips**: Rounded (20px), filled background

### 10.3 How to Change the Theme

**Change a color:**
1. Open `lib/core/theme/app_colors.dart`
2. Find the color constant
3. Change the hex value
4. Hot reload

**Change button style:**
1. Open `lib/core/theme/app_theme.dart`
2. Find `elevatedButtonTheme`
3. Modify the style

---

## Chapter 11: Feature Walkthroughs

### 11.1 Authentication Flow

**Files involved:**
- `auth/providers/auth_providers.dart` — State machine
- `auth/data/auth_repository.dart` — API calls
- `auth/models/user_model.dart` — User data structure
- `auth/presentation/pages/login_page.dart` — Phone input
- `auth/presentation/pages/otp_page.dart` — OTP verification
- `auth/presentation/pages/role_selection_page.dart` — Role picker
- `auth/presentation/pages/profile_setup_page.dart` — Profile creation

**Flow:**
1. User enters phone number on `LoginPage`
2. `authProvider.notifier.sendOtp(phone)` calls the API
3. State changes to `otpSent`, UI navigates to `OtpPage`
4. User enters 6-digit OTP
5. `authProvider.notifier.verifyOtp(otp)` calls the API
6. If new user → `RoleSelectionPage` → `ProfileSetupPage` → `HomePage`
7. If existing user → `HomePage`

### 11.2 Ride Now Flow

**Files involved:**
- `ride_now/presentation/pages/search_destination_page.dart` — Enter pickup/drop
- `ride_now/presentation/pages/ride_options_page.dart` — View ride options
- `ride_now/presentation/pages/ride_confirmation_page.dart` — Confirm booking
- `ride_now/presentation/pages/active_trip_page.dart` — Track active trip

**Flow:**
1. User taps "Ride Now" on home screen
2. Enters pickup and drop locations
3. Taps "Search Rides" → navigates to ride options
4. Filters by type (All/Carpool/Professional/Women Only)
5. Selects a ride → navigates to confirmation
6. Reviews fare breakdown, selects payment method
7. Taps "Confirm Booking" → navigates to active trip
8. Sees driver info, ETA, trip status, action buttons

### 11.3 Driver Offer Seat Flow

**File:** `driver/presentation/pages/offer_seat_page.dart`

**A 4-step wizard:**
1. **Location**: Enter home and work addresses
2. **Schedule**: Set departure time and days of week
3. **Seats**: Choose 1-3 seats, optional women-only toggle
4. **Price**: Set price per seat (₹50-300 slider)

---

## Chapter 12: How to Make Common Changes

### 12.1 Change Text

Find the text in the relevant page file and change it:

```dart
// Before
Text('Welcome to Yaatra')

// After
Text('Welcome to Yaatra!')
```

### 12.2 Change Colors

Open `lib/core/theme/app_colors.dart` and modify constants.

### 12.3 Add a New Screen

1. Create `lib/features/<feature>/presentation/pages/<name>.dart`
2. Add route in `lib/router/app_router.dart`
3. Navigate to it with `context.push('/<route>')`

### 12.4 Add a New API Endpoint

1. Add the URL constant in `lib/core/api/api_endpoints.dart`
2. Use it via `dioClient.get(ApiEndpoints.myNewEndpoint)`

### 12.5 Add a New Reusable Widget

1. Create `lib/core/widgets/<name>.dart`
2. Keep it generic (no business logic specific to one feature)
3. Import and use in any feature

### 12.6 Add Form Validation

1. Create a `GlobalKey<FormState>`
2. Wrap inputs in a `Form` widget
3. Add `validator` to each input
4. Call `formKey.currentState!.validate()` on submit

### 12.7 Add a New State Provider

1. Define your state (enum, class, or simple type)
2. Create a `StateNotifier`
3. Create a `StateNotifierProvider`
4. Use `ref.watch()` in your widget

### 12.8 Add an Image Asset

1. Place image in `assets/images/`
2. Add to `pubspec.yaml` under `flutter.assets`
3. Use: `Image.asset('assets/images/my_image.png')`

### 12.9 Add a New Package

1. Search [pub.dev](https://pub.dev/)
2. Add to `pubspec.yaml` under `dependencies`
3. Run `flutter pub get`
4. Import and use

---

## Chapter 13: Debugging Guide

### 13.1 Flutter Debug Console

The most important debugging tool. In VS Code, go to Run and Debug panel. In Android Studio, check the Run tab.

### 13.2 print() and debugPrint()

```dart
print('User data: $user');           // Simple logging
debugPrint('Response: ${response.data}');  // Throttled logging
```

### 13.3 Common Errors

| Error | Meaning | How to Fix |
|-------|---------|------------|
| `Null check operator used on a null value` | You used `!` on a null value | Add null check or use `?.` |
| `setState() called after dispose()` | Updated state after widget was removed | Check `mounted` before setState |
| `A RenderFlex overflowed` | Content is too big for its container | Use `SingleChildScrollView` or `Expanded` |
| `Unable to start the daemon process` | Gradle issue | Delete `.gradle` folder, rebuild |
| `Exception: DioException [connection timeout]` | Can't reach server | Check base URL, check server is running |
| `Height argument must be finite` | Height is infinity | Wrap in `Expanded` or set fixed height |

### 13.4 Debugging Checklist

1. Is the backend server running?
2. Is the base URL correct for your device/emulator?
3. Is the API returning the expected JSON format?
4. Are you handling null values?
5. Is the widget tree correct (check Flutter Inspector)?
6. Did you run `flutter clean && flutter pub get`?

---

## Chapter 14: Testing Guide

### 14.1 Types of Tests

| Test Type | What It Tests | Speed | Reliability |
|-----------|--------------|-------|-------------|
| **Unit test** | Individual functions/classes | Very fast | High |
| **Widget test** | Widget rendering and interaction | Fast | Medium |
| **Integration test** | Full app flow | Slow | High |

### 14.2 Run Tests

```bash
flutter test                    # All tests
flutter test --coverage        # With code coverage report
flutter test test/widget_test.dart  # Single file
```

### 14.3 Write a Unit Test

```dart
// test/formatters_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:yaatra_application/core/utils/formatters.dart';

void main() {
  group('Formatters.currency', () {
    test('formats amount with rupee symbol', () {
      expect(Formatters.currency(150.0), '₹150.00');
    });
    
    test('formats zero correctly', () {
      expect(Formatters.currency(0), '₹0.00');
    });
  });

  group('Formatters.distance', () {
    test('converts small distances to meters', () {
      expect(Formatters.distance(0.5), '500 m');
    });
    
    test('shows kilometers for larger distances', () {
      expect(Formatters.distance(5.5), '5.5 km');
    });
  });
}
```

### 14.4 Write a Widget Test

```dart
// test/login_page_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yaatra_application/features/auth/presentation/pages/login_page.dart';

void main() {
  testWidgets('Login page shows phone input', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: LoginPage()),
    );
    expect(find.text('Enter your phone number'), findsOneWidget);
  });
}
```

---

## Chapter 15: Building & Deployment

### 15.1 Build Types Explained

| Type | Command | What It Does |
|------|---------|--------------|
| Debug | `flutter run` or `flutter build apk --debug` | Development build with debugging tools, JIT compilation |
| Profile | `flutter build apk --profile` | Performance testing, no debugging tools |
| Release | `flutter build apk --release` | Production build, fully optimized |

### 15.2 Android Build

```bash
# Debug APK (for testing on devices)
flutter build apk --debug

# Release APK (for direct install)
flutter build apk --release

# Release AAB (for Play Store upload)
flutter build appbundle --release
```

### 15.3 iOS Build

```bash
flutter build ios --release
# Then open ios/Runner.xcworkspace in Xcode and Archive
```

### 15.4 Version Management

Update version in `pubspec.yaml`:
```yaml
version: 0.1.0+1   # format: major.minor.patch+buildNumber
```

- **major**: Breaking changes
- **minor**: New features
- **patch**: Bug fixes
- **buildNumber**: Increment for each release (used by Play Store/App Store)

---

## Chapter 16: Best Practices & Code Quality

### 16.1 What the Project Does Well

- **Feature-based organization**: Code is organized by feature, making it easy to find
- **Separation of concerns**: UI, business logic, and data access are in separate layers
- **Reusable widgets**: Common UI components are shared across features
- **Consistent theming**: All colors and styles come from a central theme
- **Null safety**: The project uses Dart's null safety features
- **Clean naming**: File and class names are descriptive

### 16.2 Recommended Improvements (Not Yet Implemented)

These are improvements that would make the project even better:

- **Add actual API repository implementations**: Currently, the auth repository makes API calls but other features don't have repository classes yet
- **Add unit and widget tests**: The test directory is mostly empty
- **Add error handling to all screens**: Some screens don't handle API errors gracefully
- **Add loading states to all data-fetching screens**: Not all screens show skeleton loaders
- **Add actual i18n integration**: The translation file exists but isn't integrated with a localization package
- **Add image assets**: The `assets/images/` directory is empty
- **Add actual Socket.IO connection**: The dependency is declared but the real-time connection isn't implemented in the codebase
- **Add proper logging**: Replace print statements with a logging package
- **Add environment configuration**: Currently the base URL is hardcoded
- **Add proper form state management**: Some forms could benefit from better state handling

### 16.3 Dart/Flutter Code Style

```dart
// Good: Descriptive names
final userFullName = 'Raj Kumar';
bool isRideCompleted = true;

// Bad: Unclear names
final x = 'Raj Kumar';
bool flag = true;

// Good: Use const when possible (performance)
const Text('Hello')

// Bad: Not using const
Text('Hello')

// Good: Handle nulls explicitly
final name = user?.name ?? 'Unknown';

// Bad: Force unwrap
final name = user!.name;  // Crashes if user is null
```

---

## Chapter 17: Learning Path

Follow this path to go from zero to confidently working on this project:

### Level 1: Dart Basics (1-2 weeks)

- [ ] Learn variables, data types, and null safety
- [ ] Learn functions and classes
- [ ] Learn async programming (Future, async/await)
- [ ] Learn collections (List, Map)
- [ ] Practice: Write small Dart programs

### Level 2: Flutter Basics (2-3 weeks)

- [ ] Understand widgets (Stateless, Stateful)
- [ ] Learn the widget tree and build() method
- [ ] Practice layouts (Row, Column, Container, ListView)
- [ ] Learn forms and validation
- [ ] Learn navigation basics
- [ ] Practice: Build simple Flutter apps

### Level 3: Project Architecture (1 week)

- [ ] Understand the folder structure
- [ ] Read through each core file
- [ ] Understand how features are organized
- [ ] Trace the auth flow from start to finish
- [ ] Trace the ride booking flow
- [ ] Map out all screens and their routes

### Level 4: State Management (1-2 weeks)

- [ ] Learn Riverpod basics (Provider, StateNotifier)
- [ ] Understand the auth state machine
- [ ] Practice: Add a new state and provider
- [ ] Learn how widgets watch and read providers

### Level 5: API & Networking (1 week)

- [ ] Understand how DioClient works
- [ ] Learn about interceptors and auth tokens
- [ ] Practice: Make API calls and handle responses
- [ ] Learn JSON serialization

### Level 6: Development (ongoing)

- [ ] Modify existing screens
- [ ] Add new features
- [ ] Add new screens and routes
- [ ] Write unit tests
- [ ] Debug issues
- [ ] Build release APKs

### Level 7: Advanced (after comfortable)

- [ ] Performance optimization
- [ ] Advanced state management patterns
- [ ] CI/CD setup
- [ ] App store deployment
- [ ] Contributing to open source

---

## Quick Reference: Important Commands

| Command | Purpose |
|---------|---------|
| `flutter doctor` | Check environment health |
| `flutter pub get` | Install dependencies |
| `flutter run` | Run in debug mode |
| `flutter run -d android` | Run on Android |
| `flutter run -d ios` | Run on iOS |
| `flutter clean` | Clean build artifacts |
| `flutter analyze` | Check for code issues |
| `flutter test` | Run tests |
| `flutter build apk --release` | Build release APK |
| `flutter build appbundle --release` | Build Play Store bundle |
| `flutter pub outdated` | Check outdated packages |
| `flutter pub upgrade` | Update all packages |
| `dart format .` | Format all code |
| `flutter devices` | List available devices |
| `flutter logs` | View device logs |

---

## Quick Reference: Key Files

| File | Purpose |
|------|---------|
| `lib/main.dart` | App entry point |
| `lib/app.dart` | Root widget |
| `lib/router/app_router.dart` | All routes + bottom nav |
| `lib/core/api/api_endpoints.dart` | API URLs |
| `lib/core/api/dio_client.dart` | HTTP client |
| `lib/core/storage/cache.dart` | Local storage |
| `lib/core/storage/token_storage.dart` | Token storage |
| `lib/core/theme/app_colors.dart` | Colors |
| `lib/core/theme/app_theme.dart` | Theme |
| `lib/core/utils/formatters.dart` | Display formatting |
| `lib/core/utils/validators.dart` | Form validation |
| `lib/features/auth/providers/auth_providers.dart` | Auth state |
| `lib/features/auth/data/auth_repository.dart` | Auth API |
| `lib/features/auth/models/user_model.dart` | User model |

---

*This guide is based on the actual Yaatra Flutter codebase. All examples reference real files and code from the project.*
