import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RECENT_TRIPS = [
  { id: '1', destination: 'Dwarka, Delhi', address: 'Plot 4, Sector 12', icon: 'location-outline' },
  { id: '2', destination: 'IGI Airport', address: 'Terminal 3', icon: 'airplane-outline' },
];

export function RecentTripsList() {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-surfaceDark mb-3">Recent Trips</Text>
      {RECENT_TRIPS.map((trip) => (
        <TouchableOpacity key={trip.id} className="flex-row items-center bg-surfaceLight p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
          <View className="bg-gray-100 p-3 rounded-full mr-4">
            <Ionicons name={trip.icon as any} size={22} color="#4b5563" />
          </View>
          <View>
            <Text className="text-[17px] font-bold text-surfaceDark mb-0.5">{trip.destination}</Text>
            <Text className="text-[14px] text-gray-500 font-medium">{trip.address}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
