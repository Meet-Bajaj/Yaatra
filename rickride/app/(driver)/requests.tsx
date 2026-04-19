import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { driverService } from '../../services/driverService';
import { tripService } from '../../services/tripService';

export default function DriverRequests() {
  const router = useRouter();

  const dataState = useAsyncData(async () => {
    const driver = await driverService.getMyDriverProfile();
    const trips = await tripService.getTrips({ driverId: driver._id, limit: 20 });
    return {
      driver,
      trips: trips.data,
    };
  }, []);

  const handleStatusChange = async (tripId: string, status: 'open' | 'ongoing' | 'completed') => {
    try {
      const updated = await tripService.updateTripStatus(tripId, status);
      dataState.setData((current) =>
        current
          ? {
              ...current,
              trips: current.trips.map((trip) => (trip._id === tripId ? updated : trip)),
            }
          : current
      );
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Unable to update trip status',
        text2: 'Please try again.',
      });
    }
  };

  if (dataState.loading && !dataState.data) {
    return <LoadingView message="Loading driver trips..." />;
  }

  if (!dataState.data?.trips.length) {
    return (
      <SafeAreaView className="bg-backgroundLight flex-1 px-4 pt-6">
        <EmptyState
          title="No trips yet"
          description="Create a trip from this app and manage status updates here."
          actionLabel="Create trip"
          onAction={() => router.push('/(driver)/create-trip')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Driver</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Trip management</Text>

        <View className="mt-6 gap-4">
          {dataState.data.trips.map((trip) => (
            <View key={trip._id} className="rounded-3xl bg-white p-5 shadow-sm">
              <Text className="text-lg font-bold text-surfaceDark">Trip {trip._id.slice(-6)}</Text>
              <Text className="mt-2 text-sm text-gray-500">Status: {trip.status}</Text>
              <Text className="mt-2 text-sm text-gray-500">
                Seats: {trip.availableSeats}/{trip.totalSeats}
              </Text>
              <View className="mt-4 flex-row gap-2">
                {(['open', 'ongoing', 'completed'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleStatusChange(trip._id, status)}
                    className={`flex-1 rounded-2xl px-3 py-3 ${
                      trip.status === status ? 'bg-primary/10' : 'bg-backgroundLight'
                    }`}>
                    <Text className="text-center font-semibold text-surfaceDark">{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
