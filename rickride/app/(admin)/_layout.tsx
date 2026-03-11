import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const ROUTES = [
  { name: 'Dashboard', path: '/(admin)', icon: 'pie-chart' },
  { name: 'Users', path: '/(admin)/users', icon: 'people' },
  { name: 'Drivers', path: '/(admin)/drivers', icon: 'car' },
  { name: 'Rides', path: '/(admin)/rides', icon: 'map' },
  { name: 'Analytics', path: '/(admin)/analytics', icon: 'bar-chart' },
];

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-1 flex-row bg-backgroundLight">
      {/* Sidebar - Visible on large screens mostly, but forced left for now */}
      <View className="w-64 bg-surfaceDark h-full py-6 flex-col shadow-lg hidden md:flex">
        <View className="px-6 mb-10 items-center justify-center">
          <Text className="text-white text-2xl font-bold">RikRide Admin</Text>
        </View>

        <ScrollView className="flex-1 px-4">
          {ROUTES.map((route) => {
            const isActive = pathname === route.path || pathname === `${route.path}/`;
            return (
              <TouchableOpacity
                key={route.name}
                onPress={() => router.push(route.path as any)}
                className={`flex-row items-center p-3 mb-2 rounded-xl transition-all ${
                  isActive ? 'bg-primary' : 'bg-transparent'
                }`}
              >
                <Ionicons name={route.icon as any} size={20} color="white" />
                <Text className="text-white font-semibold ml-3">{route.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="px-4 mt-auto">
          <TouchableOpacity 
            className="flex-row items-center p-3 border border-gray-600 rounded-xl"
            onPress={() => router.replace('/(auth)')}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-3">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 bg-backgroundLight">
        {/* Simple Top Header */}
        <View className="h-16 bg-surfaceLight border-b border-gray-200 flex-row px-6 justify-between items-center shadow-sm">
          <Text className="text-xl font-bold text-surfaceDark capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </Text>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center">
              <Ionicons name="person" size={20} color="gray" />
            </View>
          </View>
        </View>

        {/* Dynamic Route Content */}
        <View className="flex-1 p-6">
          <Slot />
        </View>
      </View>
    </View>
  );
}
