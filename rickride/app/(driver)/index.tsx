import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import { driverService } from '../../services/driverService';
import { socketService } from '../../services/socketService';

export default function DriverDashboard() {
  const router = useRouter();
  const locationState = useDeviceLocation({ autoRequest: true });
  const profileState = useAsyncData(async () => {
    try {
      return await driverService.getMyDriverProfile();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => () => socketService.disconnect(), []);

  const handleToggleStatus = async () => {
    if (!profileState.data) {
      return;
    }

    try {
      const nextStatus = profileState.data.status === 'online' ? 'offline' : 'online';
      const updated = await driverService.updateDriverStatus({ status: nextStatus });
      profileState.setData(updated);

      if (nextStatus === 'online') {
        await socketService.connect();
        socketService.registerDriver(updated._id);
      } else {
        socketService.disconnect();
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Status update failed',
        text2: 'Please try again.',
      });
    }
  };

  const handleSendLocationUpdate = async () => {
    if (!profileState.data) {
      return;
    }

    const location = await locationState.refreshLocation();
    if (!location) {
      Toast.show({
        type: 'error',
        text1: 'Location unavailable',
        text2: 'Please enable location permission and try again.',
      });
      return;
    }

    try {
      const updated = await driverService.updateDriverLocation({
        longitude: location.longitude,
        latitude: location.latitude,
        status: 'online',
      });

      await socketService.connect();
      socketService.registerDriver(updated._id);
      socketService.updateLocation(
        updated._id,
        updated.location?.coordinates?.[0] || location.longitude,
        updated.location?.coordinates?.[1] || location.latitude
      );

      profileState.setData(updated);
      Toast.show({
        type: 'success',
        text1: 'Location update sent',
        text2: locationState.addressLabel || undefined,
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Location update failed',
        text2: 'Please try again.',
      });
    }
  };

  if (profileState.loading && profileState.data === null) {
    return <LoadingView message="Loading driver dashboard..." />;
  }

  if (!profileState.data) {
    return (
      <SafeAreaView className="bg-backgroundLight flex-1 px-4 pt-6">
        <EmptyState
          title="Driver profile missing"
          description="Complete onboarding before you go online and accept trips."
          actionLabel="Start onboarding"
          onAction={() => router.push('/(auth)/onboarding')}
          icon={<Ionicons name="car-sport" size={36} color="#099f9f" />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Driver</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Live dashboard</Text>
        <Text className="mt-2 text-sm text-gray-500">
          {locationState.addressLabel || 'Using current device location for driver tracking.'}
        </Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-surfaceDark">
                {profileState.data.userId?.name || 'Driver'}
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                {profileState.data.operatingZone || 'No zone set'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleStatus}
              className={`rounded-full px-4 py-2 ${
                profileState.data.status === 'online' ? 'bg-success/10' : 'bg-gray-100'
              }`}>
              <Text
                className={`font-semibold ${profileState.data.status === 'online' ? 'text-success' : 'text-gray-600'}`}>
                {profileState.data.status}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 gap-3">
            <View className="bg-backgroundLight rounded-2xl px-4 py-4">
              <Text className="text-sm text-gray-500">Vehicle</Text>
              <Text className="mt-1 text-base font-semibold text-surfaceDark">
                {profileState.data.vehicle?.type || 'No vehicle linked'}
              </Text>
            </View>
            <View className="bg-backgroundLight rounded-2xl px-4 py-4">
              <Text className="text-sm text-gray-500">Earnings</Text>
              <Text className="mt-1 text-base font-semibold text-surfaceDark">
                INR {profileState.data.earnings || 0}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <Button
            title={locationState.loading ? 'Fetching location...' : 'Send live location update'}
            onPress={handleSendLocationUpdate}
            disabled={locationState.loading}
          />
          {locationState.error ? (
            <Text className="mt-3 text-sm text-amber-700">{locationState.error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
