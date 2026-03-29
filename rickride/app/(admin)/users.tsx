import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { adminService } from '../../services/adminService';

export default function AdminUsers() {
  const statsState = useAsyncData(() => adminService.getStats(), []);

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Admin</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Users</Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-sm text-gray-500">Registered users</Text>
          <Text className="mt-3 text-4xl font-bold text-surfaceDark">
            {statsState.data?.totalUsers || 0}
          </Text>
        </View>

        <View className="mt-6">
          <EmptyState
            title="Detailed user admin APIs are not exposed yet"
            description="The current backend provides platform stats, so this screen shows the aggregate user count without faking list data."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
