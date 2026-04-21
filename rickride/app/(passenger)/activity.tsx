import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { LoadingView } from '../../components/LoadingView';
import { bookingService } from '../../services/bookingService';
import { socketService } from '../../services/socketService';
import { useRideStore } from '../../store/useRideStore';

export default function PassengerActivity() {
  const router = useRouter();
  const activeBooking = useRideStore((state) => state.activeBooking);
  const trackedDriver = useRideStore((state) => state.trackedDriver);
  const latestDriverLocation = useRideStore((state) => state.latestDriverLocation);
  const setLatestDriverLocation = useRideStore((state) => state.setLatestDriverLocation);
  const setActiveBooking = useRideStore((state) => state.setActiveBooking);

  const [booking, setBooking] = useState(activeBooking);
  const [loading, setLoading] = useState(Boolean(activeBooking));
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!activeBooking?._id) return;
    setLoading(true);
    bookingService
      .getBooking(activeBooking._id)
      .then((result) => setBooking(result))
      .catch(() => {
        Toast.show({ type: 'error', text1: 'Unable to load booking', text2: 'Showing last known booking details.' });
      })
      .finally(() => setLoading(false));
  }, [activeBooking?._id]);

  useEffect(() => {
    const driverId = booking?.trip?.driver?._id || booking?.autoDriver?._id || trackedDriver?._id;
    if (!driverId) return;

    const callback = (payload: { driverId: string; longitude: number; latitude: number; timestamp: number; }) => {
      setLatestDriverLocation(payload);
    };

    socketService
      .connect()
      .then(() => {
        socketService.trackDriver(driverId);
        socketService.onLocationUpdated(callback);
      })
      .catch(() => {
        Toast.show({ type: 'error', text1: 'Live tracking unavailable', text2: 'Please check your connection and try again.' });
      });

    return () => {
      socketService.offLocationUpdated(callback);
      socketService.disconnect();
    };
  }, [booking?.autoDriver?._id, booking?.trip?.driver?._id, setLatestDriverLocation, trackedDriver?._id]);

  const driverName = useMemo(() => booking?.trip?.driver?.userId?.name || booking?.autoDriver?.userId?.name || trackedDriver?.userId?.name, [booking, trackedDriver]);

  const handleCancelBooking = async () => {
    const bookingId = activeBooking?._id;
    if (!bookingId) return;
    setCancelling(true);
    try {
      const cancelled = await bookingService.cancelBooking(bookingId);
      setBooking(cancelled);
      setActiveBooking(cancelled);
      Toast.show({ type: 'success', text1: 'Booking cancelled' });
      router.replace('/(passenger)');
    } catch {
      Toast.show({ type: 'error', text1: 'Unable to cancel booking', text2: 'Please try again.' });
    } finally {
      setCancelling(false);
    }
  };

  if (!activeBooking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Ionicons name="car-sport-outline" size={64} color="#9ca5b3" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 16 }}>No Active Booking</Text>
        <Text style={{ color: '#9ca5b3', textAlign: 'center', marginTop: 8 }}>Create a booking first and it will appear here.</Text>
        <TouchableOpacity onPress={() => router.replace('/(passenger)')} style={{ marginTop: 32, backgroundColor: '#00d4ff', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>Find a Ride</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading && !booking) {
    return <LoadingView message="Loading your booking..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase' }}>Activity</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>Your Current Ride</Text>

        <BlurView intensity={20} tint="light" style={{ overflow: 'hidden', borderRadius: 24, marginTop: 24, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0, 212, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00d4ff' }}>
              <Ionicons name="person" size={28} color="#00d4ff" />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{driverName || 'Assigning Driver...'}</Text>
              <Text style={{ color: '#00d4ff', fontSize: 14, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' }}>{booking?.status || activeBooking.status}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 16, marginBottom: 16 }}>
            <View>
              <Text style={{ color: '#9ca5b3', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>Payment Method</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' }}>{booking?.paymentMethod || activeBooking.paymentMethod}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: '#9ca5b3', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>Fare</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>₹{booking?.fare || activeBooking.fare}</Text>
            </View>
          </View>
        </BlurView>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 32, marginBottom: 16 }}>Live Driver Tracking</Text>
        <BlurView intensity={20} tint="light" style={{ overflow: 'hidden', borderRadius: 24, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          {latestDriverLocation ? (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="location" size={24} color="#00d4ff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 12 }}>Tracking Active</Text>
              </View>
              <Text style={{ color: '#9ca5b3', fontSize: 14, marginBottom: 8 }}>Longitude: <Text style={{ color: '#fff', fontWeight: 'bold' }}>{latestDriverLocation.longitude.toFixed(4)}</Text></Text>
              <Text style={{ color: '#9ca5b3', fontSize: 14, marginBottom: 16 }}>Latitude: <Text style={{ color: '#fff', fontWeight: 'bold' }}>{latestDriverLocation.latitude.toFixed(4)}</Text></Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>Last update: {new Date(latestDriverLocation.timestamp).toLocaleTimeString()}</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Ionicons name="cellular-outline" size={32} color="#9ca5b3" />
              <Text style={{ color: '#9ca5b3', fontSize: 14, marginTop: 12, textAlign: 'center' }}>Connecting to live location network...</Text>
            </View>
          )}
        </BlurView>

        {(booking?.status || activeBooking.status) !== 'cancelled' && (
          <TouchableOpacity 
            onPress={handleCancelBooking} 
            disabled={cancelling}
            style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', borderWidth: 1, borderColor: 'rgba(248, 113, 113, 0.3)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 32, opacity: cancelling ? 0.7 : 1 }}
          >
            <Text style={{ color: '#f87171', fontWeight: 'bold', fontSize: 16 }}>{cancelling ? 'Cancelling...' : 'Cancel Booking'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
