import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { MapPreview } from '../../components/MapPreview';
import { RideSummaryCard } from '../../components/RideSummaryCard';
import { DriverProfileCard } from '../../components/DriverProfileCard';
import { FareBreakdown } from '../../components/FareBreakdown';
import { PaymentToggle } from '../../components/PaymentToggle';
import { Button } from '../../components/Button';

export default function RideConfirmation() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-backgroundLight relative">
      <MapPreview />

      <ScrollView className="flex-1 pt-2" showsVerticalScrollIndicator={false}>
        <RideSummaryCard />

        <View className="px-4 mt-2 mb-8">
          <Text className="text-xl font-bold text-surfaceDark mb-3">Your Driver</Text>
          <DriverProfileCard />

          <FareBreakdown />

          <Text className="text-xl font-bold text-surfaceDark mb-3 mt-2">Payment Method</Text>
          <PaymentToggle />

          <Button 
            title="Confirm & Pay ₹70.00" 
            onPress={() => router.replace('/(passenger)' as Href)} 
          />
        </View>
      </ScrollView>

      {/* Back Button Overlay */}
      <View className="absolute top-12 left-4 bg-white rounded-full shadow p-2">
        <Text onPress={() => router.back()} className="text-primary font-bold">Back</Text>
      </View>
    </View>
  );
}
