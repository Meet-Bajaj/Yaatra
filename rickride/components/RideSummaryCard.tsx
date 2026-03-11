import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function RideSummaryCard() {
  return (
    <View className="bg-surfaceLight p-4 rounded-xl shadow-sm mb-4 border border-gray-100 mt-2 mx-4">
      {/* Pickup */}
      <View className="flex-row items-center border-b border-gray-100 pb-3 mb-3">
        <View className="w-6 items-center">
          <View className="w-3 h-3 rounded-full bg-primary" />
        </View>
        <Text className="flex-1 ml-2 text-base font-semibold text-surfaceDark">Connaught Place, Delhi</Text>
      </View>
      
      {/* Destination */}
      <View className="flex-row items-center">
        <View className="w-6 items-center">
          <Ionicons name="location" size={16} color="red" />
        </View>
        <Text className="flex-1 ml-2 text-base text-surfaceDark">Dwarka, Delhi</Text>
      </View>
    </View>
  );
}
