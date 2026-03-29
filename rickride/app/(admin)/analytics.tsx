import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { adminService } from '../../services/adminService';

export default function AdminAnalytics() {
  const statsState = useAsyncData(() => adminService.getStats(), []);

  if (statsState.loading && !statsState.data) {
    return <LoadingView message="Loading analytics..." />;
  }

  const tripPerDriver = statsState.data?.totalDrivers
    ? ((statsState.data.totalTrips || 0) / statsState.data.totalDrivers).toFixed(2)
    : '0.00';

  const bookingPerTrip = statsState.data?.totalTrips
    ? ((statsState.data.totalBookings || 0) / statsState.data.totalTrips).toFixed(2)
    : '0.00';

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Admin</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Analytics</Text>

        <View className="mt-6 gap-4">
          <View className="rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-sm text-gray-500">Trips per driver</Text>
            <Text className="mt-3 text-3xl font-bold text-surfaceDark">{tripPerDriver}</Text>
          </View>
          <View className="rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-sm text-gray-500">Bookings per trip</Text>
            <Text className="mt-3 text-3xl font-bold text-surfaceDark">{bookingPerTrip}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
