import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { adminService } from '../../services/adminService';

export default function AdminDrivers() {
  const statsState = useAsyncData(() => adminService.getStats(), []);

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Admin</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Drivers</Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-sm text-gray-500">Approved driver profiles</Text>
          <Text className="mt-3 text-4xl font-bold text-surfaceDark">
            {statsState.data?.totalDrivers || 0}
          </Text>
        </View>

        <View className="mt-6">
          <EmptyState
            title="Driver review tools need more backend endpoints"
            description="The frontend is connected to live admin stats, but detailed approve/reject flows require additional backend APIs."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
