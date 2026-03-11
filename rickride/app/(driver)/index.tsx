import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DriverStatusIndicator } from '../../components/DriverStatusIndicator';
import { RiderCard } from '../../components/RiderCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <View className="flex-1 bg-gray-300 relative">
      {/* Absolute fullscreen map placeholder */}
      <View className="absolute inset-0 justify-center items-center">
        <Ionicons name="map-outline" size={100} color="gray" opacity={0.3} />
        <Text className="text-gray-500 font-bold mt-2">Live Map View</Text>
      </View>

      <SafeAreaView className="flex-1">
        <DriverStatusIndicator isOnline={isOnline} onToggle={setIsOnline} />
        
        {isOnline ? (
          <RiderCard />
        ) : (
          <View className="bg-surfaceLight p-6 rounded-t-3xl shadow-lg mt-auto items-center">
            <Ionicons name="moon-outline" size={48} color="gray" className="mb-4" />
            <Text className="text-xl font-bold text-surfaceDark mb-2">You are offline</Text>
            <Text className="text-gray-500 text-center">Go online to receive new ride requests and start earning.</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
