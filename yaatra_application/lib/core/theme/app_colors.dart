import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary - white on black (matching client monochrome theme)
  static const Color primary = Color(0xFFFFFFFF);
  static const Color onPrimary = Color(0xFF000000);
  static const Color primaryDim = Color(0x1AFFFFFF); // white/10

  // Backgrounds
  static const Color background = Color(0xFF000000);
  static const Color surface = Color(0xFF0A0A0A);
  static const Color surfaceElevated = Color(0xFF141414);
  static const Color surfaceHover = Color(0xFF1A1A1A);
  static const Color chrome = Color(0xFF050505); // sidebar/topbar/bottom-nav

  // Borders
  static const Color border = Color(0xFF262626);
  static const Color borderSubtle = Color(0xFF1A1A1A);
  static const Color borderWhite10 = Color(0x1AFFFFFF); // rgba(255,255,255,0.10)
  static const Color borderWhite20 = Color(0x33FFFFFF); // rgba(255,255,255,0.20)

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0x99FFFFFF); // white/60
  static const Color textTertiary = Color(0x80FFFFFF); // white/50
  static const Color textMuted = Color(0x66FFFFFF); // white/40
  static const Color textDisabled = Color(0x4DFFFFFF); // white/30
  static const Color textOnPrimary = Color(0xFF000000);

  // Input
  static const Color inputFill = Color(0x0DFFFFFF); // white/5
  static const Color inputBorder = Color(0x1AFFFFFF); // white/10
  static const Color inputBorderFocus = Color(0x4DFFFFFF); // white/30

  // Semantic
  static const Color success = Color(0xFF22C55E);
  static const Color successText = Color(0xFF05DF72); // green-400
  static const Color error = Color(0xFFEF4444);
  static const Color errorText = Color(0xFFFF6568); // red-400
  static const Color errorBorder = Color(0x33EF4444); // red-500/20
  static const Color warning = Color(0xFFEAB308);
  static const Color warningText = Color(0xFFFAC800); // yellow-400
  static const Color info = Color(0xFF3080FF); // blue-500
  static const Color infoText = Color(0xFF54A2FF); // blue-400

  // Badge colors
  static const Color carpoolBadge = Color(0xFF00D294); // emerald-400
  static const Color carpoolBadgeBg = Color(0x2600D294); // emerald-500/15
  static const Color proBadge = Color(0xFF54A2FF); // blue-400
  static const Color proBadgeBg = Color(0x263080FF); // blue-500/15
  static const Color womenOnlyBadge = Color(0xFFFB64B6); // pink-400
  static const Color womenOnlyBadgeBg = Color(0x26F6339A); // pink-500/15
  static const Color verifiedBadge = Color(0xFF22C55E);

  // Map
  static const Color mapPickup = Color(0xFF22C55E);
  static const Color mapDropoff = Color(0xFFEF4444);
  static const Color mapVehicle = Color(0xFF3B82F6);
  static const Color mapRoute = Color(0xB3FFFFFF); // white/70

  // SOS
  static const Color sosRed = Color(0xFFE40014); // red-600

  // Shimmer
  static const Color shimmerStart = Color(0xFF141414);
  static const Color shimmerEnd = Color(0xFF1A1A1A);

  // Legacy aliases (deprecated - use new names)
  @Deprecated('Use primary instead')
  static const Color primaryDark = Color(0xFFFFFFFF);
  @Deprecated('Use primary instead')
  static const Color primaryLight = Color(0xFFFFFFFF);
  @Deprecated('Use success instead')
  static const Color secondary = Color(0xFF22C55E);
  @Deprecated('Use success instead')
  static const Color secondaryDark = Color(0xFF22C55E);
  @Deprecated('Use error instead')
  static const Color accent = Color(0xFFEF4444);
  @Deprecated('Use surfaceElevated instead')
  static const Color surfaceVariant = Color(0xFF141414);
  @Deprecated('Use textMuted instead')
  static const Color textHint = Color(0x66FFFFFF);
  @Deprecated('Use border instead')
  static const Color divider = Color(0xFF1A1A1A);
  @Deprecated('Use success instead')
  static const Color successTextLegacy = Color(0xFF22C55E);
}
