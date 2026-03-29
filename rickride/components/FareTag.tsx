import React from 'react';
import { View, Text } from 'react-native';

interface FareTagProps {
  amount: number;
}

export function FareTag({ amount }: FareTagProps) {
  return (
    <View className="rounded-full bg-primary px-3 py-1 shadow-sm">
      <Text className="text-lg font-bold text-white">₹{amount}</Text>
    </View>
  );
}
