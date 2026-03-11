import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function DriverProfileCard() {
  return (
    <View className="bg-surfaceLight p-4 rounded-xl shadow-sm mb-4 flex-row items-center border border-gray-100">
      <View className="w-14 h-14 bg-gray-200 rounded-full mr-4 justify-center items-center">
        <Ionicons name="person" size={28} color="gray" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-surfaceDark">Ramesh Kumar</Text>
          <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-full">
            <Ionicons name="star" size={14} color="#eab308" />
            <Text className="ml-1 font-bold text-sm">4.8</Text>
          </View>
        </View>
        <Text className="text-gray-500 mt-1">Bajaj RE Compact • MH12AB1234</Text>
      </View>
    </View>
  );
}
