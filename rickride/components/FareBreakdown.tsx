import React from 'react';
import { View, Text } from 'react-native';

export function FareBreakdown() {
  return (
    <View className="bg-surfaceLight p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
      <Text className="text-lg font-bold text-surfaceDark mb-3">Fare Breakdown</Text>
      
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-500">Base Fare</Text>
        <Text className="text-surfaceDark">₹30.00</Text>
      </View>
      
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-500">Distance (3.5 km)</Text>
        <Text className="text-surfaceDark">₹35.00</Text>
      </View>
      
      <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
        <Text className="text-gray-500">Taxes & Fees</Text>
        <Text className="text-surfaceDark">₹5.00</Text>
      </View>
      
      <View className="flex-row justify-between">
        <Text className="text-lg font-bold text-surfaceDark">Total Amount</Text>
        <Text className="text-lg font-bold text-primary">₹70.00</Text>
      </View>
    </View>
  );
}
