import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { tripService } from '../../services/tripService';

export default function AdminRides() {
  const tripsState = useAsyncData(async () => {
    const response = await tripService.getTrips({ limit: 20 });
    return response.data;
  }, []);

  if (tripsState.loading && !tripsState.data) {
    return <LoadingView message="Loading trips..." />;
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Admin</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Trips</Text>

        {!tripsState.data?.length ? (
          <View className="mt-6">
            <EmptyState
              title="No trips found"
              description="Trips created by drivers will appear here."
            />
          </View>
        ) : (
          <View className="mt-6 gap-4">
            {tripsState.data.map((trip) => (
              <View key={trip._id} className="rounded-3xl bg-white p-5 shadow-sm">
                <Text className="text-lg font-bold text-surfaceDark">
                  {trip.driver?.userId?.name || 'Driver'}
                </Text>
                <Text className="mt-2 text-sm text-gray-500">Status: {trip.status}</Text>
                <Text className="mt-2 text-sm text-gray-500">
                  Seats: {trip.availableSeats}/{trip.totalSeats}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
