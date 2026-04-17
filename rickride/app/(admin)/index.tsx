import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { adminService } from '../../services/adminService';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminDashboard() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const statsState = useAsyncData(async () => {
    if (!token || user?.role !== 'admin') {
      return null;
    }

    return adminService.getStats();
  }, [token, user?.role]);
  const logout = useAuthStore((state) => state.logout);

  if (statsState.loading && !statsState.data) {
    return <LoadingView message="Loading admin overview..." />;
  }

  const cards = [
    { label: 'Total users', value: statsState.data?.totalUsers || 0 },
    { label: 'Total drivers', value: statsState.data?.totalDrivers || 0 },
    { label: 'Trips', value: statsState.data?.totalTrips || 0 },
    { label: 'Bookings', value: statsState.data?.totalBookings || 0 },
    { label: 'Payments', value: statsState.data?.totalPayments || 0 },
  ];

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-sm uppercase tracking-[2px] text-primary">Admin</Text>
            <Text className="mt-2 text-3xl font-bold text-surfaceDark">Platform overview</Text>
          </View>
          <TouchableOpacity
            onPress={() => logout().catch(() => undefined)}
            className="rounded-full bg-white px-4 py-2 shadow-sm">
            <Text className="font-semibold text-surfaceDark">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row flex-wrap gap-4">
          {cards.map((card) => (
            <View
              key={card.label}
              className="min-w-[160px] flex-1 rounded-3xl bg-white p-5 shadow-sm">
              <Text className="text-sm text-gray-500">{card.label}</Text>
              <Text className="mt-3 text-3xl font-bold text-surfaceDark">{card.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
