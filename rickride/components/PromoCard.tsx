import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function PromoCard() {
  return (
    <TouchableOpacity className="bg-[#102222] rounded-xl p-4 flex-row items-center justify-between mb-6 shadow-md">
      <View className="flex-1">
        <Text className="text-white text-lg font-bold mb-1">50% off on your first 3 Auto rides</Text>
        <Text className="text-gray-300 text-sm">Use code: NEWRIK</Text>
      </View>
      <View className="bg-primary px-3 py-1 rounded-full">
        <Text className="text-white font-bold">Apply</Text>
      </View>
    </TouchableOpacity>
  );
}
