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
        <TouchableOpacity key={trip.id} className="flex-row items-center bg-surfaceLight p-3 rounded-xl mb-2 shadow-sm">
          <View className="bg-gray-100 p-2 rounded-full mr-3">
            <Ionicons name={trip.icon as any} size={20} color="gray" />
          </View>
          <View>
            <Text className="text-base font-semibold text-surfaceDark">{trip.destination}</Text>
            <Text className="text-sm text-gray-500">{trip.address}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
