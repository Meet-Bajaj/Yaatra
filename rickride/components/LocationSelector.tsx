import React from 'react';
import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function LocationSelector() {
  return (
    <View className="mb-5 rounded-2xl border border-gray-50 bg-surfaceLight p-5 shadow-md">
      <View className="mb-4 flex-row items-center border-b border-gray-100 pb-4">
        <View className="w-6 items-center">
          <View className="h-3 w-3 rounded-full bg-primary" />
        </View>
        <TextInput
          placeholder="Current Location"
          className="ml-2 flex-1 text-base font-semibold text-surfaceDark"
          value="Connaught Place, Delhi"
          editable={false}
        />
      </View>

      <View className="flex-row items-center">
        <View className="w-6 items-center">
          <Ionicons name="location" size={16} color="red" />
        </View>
        <TextInput placeholder="Where to?" className="ml-2 flex-1 text-base text-surfaceDark" />
      </View>
    </View>
  );
}
