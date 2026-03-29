import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function DriverProfileCard() {
  return (
    <View className="mb-4 flex-row items-center rounded-2xl border border-gray-50 bg-surfaceLight p-5 shadow-md">
      <View className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Ionicons name="person" size={28} color="gray" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-surfaceDark">Ramesh Kumar</Text>
          <View className="flex-row items-center rounded-full bg-gray-100 px-2 py-1">
            <Ionicons name="star" size={14} color="#eab308" />
            <Text className="ml-1 text-sm font-bold">4.8</Text>
          </View>
        </View>
        <Text className="mt-1 text-gray-500">Bajaj RE Compact • MH12AB1234</Text>
      </View>
    </View>
  );
}
