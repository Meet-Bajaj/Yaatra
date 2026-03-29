import React from 'react';
import { Text, View } from 'react-native';

export function IllustrationHeader() {
  return (
    <View className="bg-backgroundLight flex-[0.5] items-center justify-center pt-10">
      <View className="absolute mb-4 h-48 w-48 rounded-full bg-primary opacity-20" />
      <View className="h-32 w-32 items-center justify-center rounded-full bg-primary">
        <Text className="text-lg font-bold text-white">RickRide</Text>
      </View>
    </View>
  );
}
