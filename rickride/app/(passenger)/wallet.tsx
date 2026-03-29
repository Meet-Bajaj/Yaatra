import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { userService } from '../../services/userService';

export default function PassengerWallet() {
  const profileState = useAsyncData(() => userService.getMyProfile(), []);

  if (profileState.loading && !profileState.data) {
    return <LoadingView message="Loading wallet..." />;
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Wallet</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Balance & payouts</Text>

        <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-sm text-gray-500">Available balance</Text>
          <Text className="mt-3 text-4xl font-bold text-primary">
            INR {profileState.data?.walletBalance ?? 0}
          </Text>
          <Text className="mt-3 text-sm text-gray-500">
            This screen is backed by your profile wallet balance from the backend.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
