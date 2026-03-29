import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RECENT_TRIPS = [
  { id: '1', destination: 'Dwarka, Delhi', address: 'Plot 4, Sector 12', icon: 'location-outline' },
  { id: '2', destination: 'IGI Airport', address: 'Terminal 3', icon: 'airplane-outline' },
];

export function RecentTripsList() {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-bold text-surfaceDark">Recent Trips</Text>
      {RECENT_TRIPS.map((trip) => (
        <TouchableOpacity
          key={trip.id}
          className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-surfaceLight p-4 shadow-sm">
          <View className="mr-4 rounded-full bg-gray-100 p-3">
            <Ionicons name={trip.icon as any} size={22} color="#4b5563" />
          </View>
          <View>
            <Text className="mb-0.5 text-[17px] font-bold text-surfaceDark">
              {trip.destination}
            </Text>
            <Text className="text-[14px] font-medium text-gray-500">{trip.address}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
