import { Ionicons } from '@expo/vector-icons';
import { Slot, usePathname, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const MENU_ITEMS = [
  { name: 'Overview', path: '/(admin)', icon: 'pie-chart-outline' },
  { name: 'Users', path: '/(admin)/users', icon: 'people-outline' },
  { name: 'Drivers', path: '/(admin)/drivers', icon: 'car-outline' },
  { name: 'Trips', path: '/(admin)/rides', icon: 'map-outline' },
  { name: 'Analytics', path: '/(admin)/analytics', icon: 'bar-chart-outline' },
];

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const isDesktop = width >= 768;

  const Sidebar = () => (
    <View style={{ width: isDesktop ? 260 : '100%', backgroundColor: '#111827', height: '100%', paddingVertical: 24, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 40, paddingHorizontal: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
          <Ionicons name="flash" size={24} color="#fff" />
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', letterSpacing: -0.5 }}>RickRide<Text style={{ color: theme.colors.primary }}>Admin</Text></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, paddingHorizontal: 8 }}>Menu</Text>
        <View style={{ gap: 8 }}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/(admin)' && pathname.startsWith(item.path));
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => router.push(item.path as any)}
                style={{
                  flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16,
                  borderRadius: 12, backgroundColor: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                }}
              >
                <Ionicons name={item.icon as any} size={22} color={isActive ? theme.colors.primary : '#9ca5b3'} />
                <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: isActive ? '600' : '500', color: isActive ? '#fff' : '#9ca5b3' }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#1f2937', paddingTop: 24 }}>
        <TouchableOpacity
          onPress={() => logout().catch(() => undefined)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
        >
          <Ionicons name="log-out-outline" size={22} color="#f87171" />
          <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '500', color: '#f87171' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isDesktop) {
    // On mobile, keep a simple layout with a top header menu placeholder
    // Ideally this would be a Drawer on mobile, but we simplify for web-focus
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#111827' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>RickRide Admin</Text>
          <TouchableOpacity onPress={() => logout().catch(() => undefined)}>
            <Ionicons name="log-out-outline" size={24} color="#f87171" />
          </TouchableOpacity>
        </View>
        <Slot />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f9fafb' }}>
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <View style={{ flex: 1, height: '100%' }}>
        {/* Top Navbar */}
        <View style={{ height: 70, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 16, color: '#6b7280', fontWeight: '500' }}>Admin Dashboard / <Text style={{ color: '#111827', fontWeight: '600' }}>{MENU_ITEMS.find(i => i.path === pathname)?.name || 'Dashboard'}</Text></Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Ionicons name="notifications-outline" size={24} color="#6b7280" />
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="person" size={20} color="#9ca5b3" />
            </View>
          </View>
        </View>
        
        {/* Slot for the page content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <Slot />
        </ScrollView>
      </View>
    </View>
  );
}
