import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../constants/theme';

export function MapPreview() {
  return (
    <View className="relative mb-2 h-48 w-full items-center justify-center overflow-hidden rounded-b-3xl bg-gray-300">
      <Ionicons name="map-outline" size={64} color="gray" opacity={0.5} />
      <Text className="mt-2 font-bold text-gray-500">Map Route Preview</Text>

      <View className="absolute bottom-4 right-4 rounded-full bg-white p-2 shadow-md">
        <Ionicons name="locate" size={24} color={theme.colors.primary} />
      </View>
    </View>
  );
}
