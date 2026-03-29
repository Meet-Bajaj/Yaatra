import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { driverService } from '../../services/driverService';

export default function DriverEarnings() {
  const profileState = useAsyncData(() => driverService.getMyDriverProfile(), []);

  if (profileState.loading && !profileState.data) {
    return <LoadingView message="Loading earnings..." />;
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Driver</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Earnings</Text>

        <View className="mt-6 gap-4">
          <View className="rounded-3xl bg-white p-6 shadow-sm">
            <Text className="text-sm text-gray-500">Total earnings</Text>
            <Text className="mt-3 text-4xl font-bold text-primary">
              INR {profileState.data?.earnings || 0}
            </Text>
          </View>
          <View className="rounded-3xl bg-white p-6 shadow-sm">
            <Text className="text-sm text-gray-500">Completed rides</Text>
            <Text className="mt-3 text-4xl font-bold text-surfaceDark">
              {profileState.data?.totalRides || 0}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
