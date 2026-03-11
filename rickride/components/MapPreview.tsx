import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export function MapPreview() {
  return (
    <View className="h-48 bg-gray-300 w-full justify-center items-center relative rounded-b-3xl overflow-hidden mb-2">
      {/* Placeholder for actual MapView */}
      <Ionicons name="map-outline" size={64} color="gray" opacity={0.5} />
      <Text className="text-gray-500 font-bold mt-2">Map Route Preview</Text>
      
      {/* Overlay for aesthetic */}
      <View className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
        <Ionicons name="locate" size={24} color={theme.colors.primary} />
      </View>
    </View>
  );
}
