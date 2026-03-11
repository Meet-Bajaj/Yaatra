import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { LocationSelector } from '../../components/LocationSelector';
import { RideOptionTabs } from '../../components/RideOptionTabs';
import { RecentTripsList } from '../../components/RecentTripsList';
import { PromoCard } from '../../components/PromoCard';
import { Button } from '../../components/Button';

export default function PassengerHome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-backgroundLight">
      <ScrollView className="px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-surfaceDark">Where to?</Text>
        </View>

        {/* Ride Options Tabs */}
        <RideOptionTabs />

        {/* Location Selector */}
        <LocationSelector />

        {/* Find Ride Button */}
        <View className="mt-2 mb-8">
          <Button 
            title="Find Rickshaw" 
            onPress={() => router.push('/(passenger)/confirmation' as Href)} 
          />
        </View>

        {/* Recent Trips */}
        <RecentTripsList />

        {/* Promo Offers */}
        <PromoCard />
        
        {/* Spacer for bottom tab padding */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
