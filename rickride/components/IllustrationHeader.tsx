import React from 'react';
import { View, Image, Text } from 'react-native';
import { theme } from '../constants/theme';

export function IllustrationHeader() {
  return (
    <View className="flex-[0.5] justify-center items-center bg-backgroundLight pt-10">
      <View className="w-48 h-48 bg-primary rounded-full items-center justify-center mb-4 opacity-20 absolute" />
      <View className="w-32 h-32 bg-primary rounded-full items-center justify-center">
        {/* Placeholder for an actual Rickshaw illustration */}
        <Text className="text-white font-bold text-lg">🛺 RikRide</Text>
      </View>
    </View>
  );
}
