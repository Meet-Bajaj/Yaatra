import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { bookingService } from '../../services/bookingService';
import { socketService } from '../../services/socketService';
import { useRideStore } from '../../store/useRideStore';

export default function PassengerActivity() {
  const activeBooking = useRideStore((state) => state.activeBooking);
  const trackedDriver = useRideStore((state) => state.trackedDriver);
  const latestDriverLocation = useRideStore((state) => state.latestDriverLocation);
  const setLatestDriverLocation = useRideStore((state) => state.setLatestDriverLocation);

  const [booking, setBooking] = useState(activeBooking);
  const [loading, setLoading] = useState(Boolean(activeBooking));

  useEffect(() => {
    if (!activeBooking?._id) {
      return;
    }

    setLoading(true);

    bookingService
      .getBooking(activeBooking._id)
      .then((result) => {
        setBooking(result);
      })
      .finally(() => setLoading(false));
  }, [activeBooking?._id]);

  useEffect(() => {
    const driverId = booking?.trip?.driver?._id || booking?.autoDriver?._id || trackedDriver?._id;
    if (!driverId) {
      return;
    }

    const callback = (payload: {
      driverId: string;
      longitude: number;
      latitude: number;
      timestamp: number;
    }) => {
      setLatestDriverLocation(payload);
    };

    socketService.connect().then(() => {
      socketService.trackDriver(driverId);
      socketService.onLocationUpdated(callback);
    });

    return () => {
      socketService.offLocationUpdated(callback);
      socketService.disconnect();
    };
  }, [
    booking?.autoDriver?._id,
    booking?.trip?.driver?._id,
    setLatestDriverLocation,
    trackedDriver?._id,
  ]);

  const driverName = useMemo(
    () =>
      booking?.trip?.driver?.userId?.name ||
      booking?.autoDriver?.userId?.name ||
      trackedDriver?.userId?.name,
    [booking, trackedDriver]
  );

  if (!activeBooking) {
    return (
      <SafeAreaView className="bg-backgroundLight flex-1 px-4 pt-6">
        <EmptyState
          title="No active booking"
          description="Create a booking first and it will appear here."
        />
      </SafeAreaView>
    );
  }

  if (loading && !booking) {
    return <LoadingView message="Loading your booking..." />;
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm uppercase tracking-[2px] text-primary">Activity</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Your current ride</Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-lg font-bold text-surfaceDark">
            {driverName || 'Driver assigned'}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            Booking status: {booking?.status || activeBooking.status}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            Payment: {booking?.paymentMethod || activeBooking.paymentMethod}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            Fare: INR {booking?.fare || activeBooking.fare}
          </Text>
        </View>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-lg font-bold text-surfaceDark">Live driver tracking</Text>
          {latestDriverLocation ? (
            <>
              <Text className="mt-3 text-base text-surfaceDark">
                Longitude: {latestDriverLocation.longitude.toFixed(4)}
              </Text>
              <Text className="mt-2 text-base text-surfaceDark">
                Latitude: {latestDriverLocation.latitude.toFixed(4)}
              </Text>
              <Text className="mt-2 text-sm text-gray-500">
                Last update: {new Date(latestDriverLocation.timestamp).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text className="mt-3 text-sm text-gray-500">
              Waiting for live location updates from Socket.IO.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
