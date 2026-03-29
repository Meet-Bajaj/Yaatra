import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { tripService } from '../../services/tripService';
import { Trip } from '../../services/types';
import { useRideStore } from '../../store/useRideStore';

export default function RideConfirmation() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const selectedTrip = useRideStore((state) => state.selectedTrip);
  const setActiveBooking = useRideStore((state) => state.setActiveBooking);
  const setTrackedDriver = useRideStore((state) => state.setTrackedDriver);

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'RAZORPAY'>('CASH');
  const [submitting, setSubmitting] = useState(false);

  const tripState = useAsyncData(async () => {
    if (selectedTrip && selectedTrip._id === tripId) {
      return selectedTrip;
    }

    if (!tripId) {
      throw new Error('Trip not found');
    }

    return tripService.getTripById(tripId);
  }, [tripId, selectedTrip]);

  useEffect(() => {
    if (tripState.data?.driver) {
      setTrackedDriver(tripState.data.driver);
    }
  }, [setTrackedDriver, tripState.data]);

  const totalFare = useMemo(() => tripState.data?.pricePerSeat || 0, [tripState.data]);

  const handleConfirm = async () => {
    if (!tripState.data) {
      return;
    }

    setSubmitting(true);

    try {
      const booking = await bookingService.createBooking({
        tripId: tripState.data._id,
        seats: 1,
        fare: tripState.data.pricePerSeat,
        paymentMethod,
      });

      setActiveBooking(booking);

      if (paymentMethod === 'RAZORPAY') {
        const payment = await paymentService.createPayment({
          bookingId: booking._id,
          gateway: 'RAZORPAY',
        });

        const orderId = String(payment.gateway?.order?.id || payment.payment.gatewayOrderId || '');
        const keyId = payment.gateway?.keyId || '';

        if (keyId === 'mock_key_id' || orderId.startsWith('order_mock_')) {
          await paymentService.verifyPayment({
            paymentId: payment.payment._id,
            razorpayOrderId: orderId,
            razorpayPaymentId: `pay_mock_${payment.payment._id}`,
            razorpaySignature: 'mock_signature',
          });

          Toast.show({
            type: 'success',
            text1: 'Mock payment completed',
            text2: 'Booking confirmed for development mode.',
          });
        } else {
          Toast.show({
            type: 'success',
            text1: 'Razorpay order created',
            text2: 'Native checkout SDK can be plugged in next.',
          });
        }
      } else {
        Toast.show({
          type: 'success',
          text1: 'Booking created',
          text2: 'You chose cash payment.',
        });
      }

      router.replace('/(passenger)/activity');
    } finally {
      setSubmitting(false);
    }
  };

  if (tripState.loading && !tripState.data) {
    return <LoadingView message="Preparing your ride..." />;
  }

  if (!tripState.data) {
    return (
      <SafeAreaView className="bg-backgroundLight flex-1 px-4 pt-6">
        <EmptyState
          title="Trip unavailable"
          description="Go back and select another trip."
          actionLabel="Back to rides"
          onAction={() => router.replace('/(passenger)')}
        />
      </SafeAreaView>
    );
  }

  const trip: Trip = tripState.data;

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm uppercase tracking-[2px] text-primary">Confirmation</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Review your booking</Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-lg font-bold text-surfaceDark">
            {trip.driver?.userId?.name || 'Driver'}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            Vehicle: {trip.driver?.vehicle?.type || 'Unknown'} | {trip.distance} km
          </Text>
          <Text className="mt-2 text-base text-surfaceDark">
            Departure: {trip.departureTime || trip.dipartureTime || 'Flexible'}
          </Text>
          <Text className="mt-2 text-base text-surfaceDark">
            Seats available: {trip.availableSeats}
          </Text>
        </View>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-lg font-bold text-surfaceDark">Payment</Text>
          <View className="mt-4 gap-3">
            {(['CASH', 'RAZORPAY'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setPaymentMethod(item)}
                className={`rounded-2xl border px-4 py-4 ${
                  paymentMethod === item
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-white'
                }`}>
                <Text className="font-semibold text-surfaceDark">{item}</Text>
                <Text className="mt-1 text-sm text-gray-500">
                  {item === 'CASH'
                    ? 'Create the booking and pay directly to the driver.'
                    : 'Create a Razorpay payment order and verify mock payments in dev mode.'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="text-lg font-bold text-surfaceDark">Fare summary</Text>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-base text-gray-500">1 seat</Text>
            <Text className="text-base text-surfaceDark">INR {totalFare}</Text>
          </View>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-surfaceDark">Total</Text>
            <Text className="text-lg font-bold text-primary">INR {totalFare}</Text>
          </View>
        </View>

        <View className="mb-10 mt-6">
          <Button
            title={
              submitting
                ? 'Processing...'
                : `Confirm booking${totalFare ? ` | INR ${totalFare}` : ''}`
            }
            onPress={handleConfirm}
            disabled={submitting}
          />
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-center font-semibold text-gray-500">Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
