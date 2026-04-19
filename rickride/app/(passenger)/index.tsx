import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import { driverService } from '../../services/driverService';
import { tripService } from '../../services/tripService';
import { Trip } from '../../services/types';
import { useRideStore } from '../../store/useRideStore';

export default function PassengerHome() {
  const router = useRouter();
  const setSelectedTrip = useRideStore((state) => state.setSelectedTrip);
  const locationState = useDeviceLocation({ autoRequest: true });

  const tripsState = useAsyncData(async () => {
    const response = await tripService.getTrips({ status: 'open', limit: 20 });
    return response.data;
  }, []);

  const nearbyDriversState = useAsyncData(
    async () => {
      if (!locationState.location) {
        return [];
      }

      return driverService.getNearbyDrivers(
        locationState.location.longitude,
        locationState.location.latitude,
        5,
        6
      );
    },
    [locationState.location?.latitude, locationState.location?.longitude]
  );

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    router.push({
      pathname: '/(passenger)/confirmation',
      params: { tripId: trip._id },
    });
  };

  if (tripsState.loading && !tripsState.data) {
    return <LoadingView message="Finding available rides..." />;
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView
        className="px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={tripsState.loading || nearbyDriversState.loading}
            onRefresh={() => {
              locationState.refreshLocation().catch(() => undefined);
              tripsState.reload().catch(() => undefined);
              nearbyDriversState.reload().catch(() => undefined);
            }}
          />
        }>
        <View className="mb-6">
          <Text className="text-sm uppercase tracking-[2px] text-primary">Passenger</Text>
          <Text className="mt-2 text-3xl font-bold text-surfaceDark">Available rides near you</Text>
          <Text className="mt-2 text-base text-gray-500">
            {locationState.location
              ? `Pickup area: ${locationState.addressLabel || 'Current device location'}`
              : 'Enable location to discover nearby drivers in your area.'}
          </Text>
        </View>

        <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-surfaceDark">Nearby drivers</Text>
            <Text className="text-sm text-gray-500">
              {nearbyDriversState.data?.length || 0} online
            </Text>
          </View>
          <View className="mt-4 gap-3">
            {locationState.error ? (
              <Text className="text-sm text-amber-700">{locationState.error}</Text>
            ) : null}
            {(nearbyDriversState.data || []).slice(0, 3).map((driver) => (
              <View
                key={driver._id}
                className="bg-backgroundLight flex-row items-center justify-between rounded-2xl px-4 py-3">
                <View>
                  <Text className="font-semibold text-surfaceDark">
                    {driver.userId?.name || 'Driver'}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {driver.operatingZone || 'Local zone'}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-primary">{driver.status}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-surfaceDark">Open trips</Text>
          <Button
            title="Refresh"
            className="w-auto px-4 py-3"
            onPress={() => {
              locationState.refreshLocation().catch(() => undefined);
              tripsState.reload().catch(() => undefined);
              nearbyDriversState.reload().catch(() => undefined);
            }}
          />
        </View>

        {!tripsState.data?.length ? (
          <EmptyState
            title="No trips available"
            description="Ask a driver to publish a trip first, then pull to refresh."
            icon={<Ionicons name="map-outline" size={36} color="#099f9f" />}
          />
        ) : (
          <View className="gap-4">
            {tripsState.data.map((trip) => (
              <TouchableOpacity
                key={trip._id}
                onPress={() => handleSelectTrip(trip)}
                className="rounded-3xl bg-white p-5 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-surfaceDark">
                    {trip.driver?.userId?.name || 'Driver'}
                  </Text>
                  <Text className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {trip.availableSeats}/{trip.totalSeats} seats
                  </Text>
                </View>
                <Text className="mt-2 text-sm text-gray-500">
                  {trip.driver?.vehicle?.type || 'Vehicle'} | {trip.distance} km
                </Text>
                <Text className="mt-3 text-base text-surfaceDark">
                  INR {trip.pricePerSeat} per seat
                </Text>
                <Text className="mt-1 text-sm text-gray-500">
                  Departure: {trip.departureTime || trip.dipartureTime || 'Not scheduled'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
