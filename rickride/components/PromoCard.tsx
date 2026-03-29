import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function PromoCard() {
  return (
    <TouchableOpacity className="mb-6 flex-row items-center justify-between rounded-xl bg-[#102222] p-4 shadow-md">
      <View className="flex-1">
        <Text className="mb-1 text-lg font-bold text-white">
          50% off on your first 3 Auto rides
        </Text>
        <Text className="text-sm text-gray-300">Use code: NEWRIK</Text>
      </View>
      <View className="rounded-full bg-primary px-3 py-1">
        <Text className="font-bold text-white">Apply</Text>
      </View>
    </TouchableOpacity>
  );
}
