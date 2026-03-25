import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { LocationSelector } from '../../components/LocationSelector';
import { RideOptionTabs } from '../../components/RideOptionTabs';
import { RecentTripsList } from '../../components/RecentTripsList';
import { PromoCard } from '../../components/PromoCard';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/ui/Skeleton';

export default function PassengerHome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-backgroundLight">
      <ScrollView className="px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-surfaceDark">Where to?</Text>
        </View>

        {isLoading ? (
          <View>
            <Skeleton height={60} borderRadius={12} style={{ marginBottom: 16 }} />
            <Skeleton height={200} borderRadius={16} style={{ marginBottom: 24 }} />
            <Skeleton height={120} borderRadius={12} style={{ marginBottom: 24 }} />
          </View>
        ) : (
          <>
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
          </>
        )}
        
        {/* Spacer for bottom tab padding */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
