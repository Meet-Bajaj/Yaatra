import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function RideSummaryCard() {
  return (
    <View className="mx-4 mb-4 mt-2 rounded-xl border border-gray-100 bg-surfaceLight p-4 shadow-sm">
      {/* Pickup */}
      <View className="mb-3 flex-row items-center border-b border-gray-100 pb-3">
        <View className="w-6 items-center">
          <View className="h-3 w-3 rounded-full bg-primary" />
        </View>
        <Text className="ml-2 flex-1 text-base font-semibold text-surfaceDark">
          Connaught Place, Delhi
        </Text>
      </View>

      {/* Destination */}
      <View className="flex-row items-center">
        <View className="w-6 items-center">
          <Ionicons name="location" size={16} color="red" />
        </View>
        <Text className="ml-2 flex-1 text-base text-surfaceDark">Dwarka, Delhi</Text>
      </View>
    </View>
  );
}
