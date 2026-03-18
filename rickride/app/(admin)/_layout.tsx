import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const ROUTES = [
  { name: 'Dashboard', path: '/(admin)', icon: 'pie-chart' },
  { name: 'Users', path: '/(admin)/users', icon: 'people' },
  { name: 'Drivers', path: '/(admin)/drivers', icon: 'car' },
  { name: 'Rides', path: '/(admin)/rides', icon: 'map' },
  { name: 'Analytics', path: '/(admin)/analytics', icon: 'bar-chart' },
];

// ✅ Helper to get clean page title from pathname
function getPageTitle(pathname: string): string {
  if (pathname === '/(admin)' || pathname === '/(admin)/') return 'Dashboard';
  const parts = pathname.split('/');
  const last = parts[parts.length - 1];
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarWidth = useSharedValue(256);

  useEffect(() => {
    sidebarWidth.value = withTiming(isCollapsed ? 72 : 256, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isCollapsed]);

  const animatedSidebarStyle = useAnimatedStyle(() => ({
    width: sidebarWidth.value,
  }));

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f1f5f9' }}>

      {/* ✅ Sidebar - use inline styles instead of md:flex (unreliable in RN Web) */}
      <Animated.View
        style={[
          animatedSidebarStyle,
          {
            backgroundColor: theme.colors.backgroundDark,
            height: '100%',
            paddingVertical: 24,
            flexDirection: 'column',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            borderRightWidth: 1,
            borderRightColor: '#374151',
            overflow: 'hidden',
          },
        ]}
      >
        {/* Logo */}
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 32,
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
          }}
        >
          {!isCollapsed ? (
            <Text
              style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
              numberOfLines={1}
            >
              RikRide Admin
            </Text>
          ) : (
            <Ionicons name="car-sport" size={28} color="white" />
          )}
        </View>

        {/* Nav Items */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
          {ROUTES.map((route) => {
            // ✅ Fixed active matching
            const isActive =
              route.path === '/(admin)'
                ? pathname === '/(admin)' || pathname === '/(admin)/'
                : pathname.startsWith(route.path);

            return (
              <Pressable
                key={route.name}
                onPress={() => router.push(route.path as any)}
                style={({ pressed, hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  marginBottom: 6,
                  borderRadius: 12,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  backgroundColor: isActive
                    ? '#6366f1' // primary color
                    : pressed
                      ? 'rgba(255,255,255,0.1)'
                      : hovered
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                })}
              >
                <Ionicons
                  name={route.icon as any}
                  size={22}
                  color={isActive ? 'white' : '#cbd5e1'}
                />
                {!isCollapsed && (
                  <Text
                    style={{
                      color: isActive ? 'white' : '#cbd5e1',
                      fontWeight: '600',
                      marginLeft: 12,
                      fontSize: 15,
                    }}
                  >
                    {route.name}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Logout */}
        <View style={{ paddingHorizontal: 12, marginTop: 'auto' }}>
          <Pressable
            style={({ pressed, hovered }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderRadius: 12,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderWidth: isCollapsed ? 0 : 1,
              borderColor: '#4b5563',
              backgroundColor: pressed 
                ? 'rgba(255,255,255,0.1)' 
                : hovered
                  ? 'rgba(255,255,255,0.05)'
                  : 'transparent',
            })}
            onPress={() => router.replace('/(auth)' as any)}
          >
            <Ionicons name="log-out-outline" size={22} color="#cbd5e1" />
            {!isCollapsed && (
              <Text style={{ color: '#cbd5e1', fontWeight: '600', marginLeft: 12 }}>
                Logout
              </Text>
            )}
          </Pressable>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>

        {/* ✅ Top Navbar */}
        <View
          style={{
            height: 64,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            flexDirection: 'row',
            paddingHorizontal: 24,
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* ✅ Collapse toggle always visible */}
            <TouchableOpacity
              style={{
                marginRight: 16,
                padding: 8,
                borderRadius: 999,
              }}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              <Ionicons name="menu-outline" size={28} color="#333" />
            </TouchableOpacity>

            {/* ✅ Fixed title - no more leading slash */}
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b' }}>
              {getPageTitle(pathname)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#f9fafb',
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#f3f4f6',
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#d1d5db',
              }}
            >
              <Ionicons name="person" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Page Content */}
        <View style={{ flex: 1, padding: 24 }}>
          <Slot />
        </View>
      </View>
    </View>
  );
}
