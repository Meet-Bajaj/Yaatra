import React from 'react';
import { View, Text } from 'react-native';

interface FareTagProps {
  amount: number;
}

export function FareTag({ amount }: FareTagProps) {
  return (
    <View className="bg-primary px-3 py-1 rounded-full shadow-sm">
      <Text className="text-white font-bold text-lg">₹{amount}</Text>
    </View>
  );
}
