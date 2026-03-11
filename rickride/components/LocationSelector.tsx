import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export function LocationSelector() {
  return (
    <View className="bg-surfaceLight rounded-xl p-4 shadow-sm mb-4">
      {/* Pickup Input */}
      <View className="flex-row items-center border-b border-gray-100 pb-3 mb-3">
        <View className="w-6 items-center">
          <View className="w-3 h-3 rounded-full bg-primary" />
        </View>
        <TextInput 
          placeholder="Current Location" 
          className="flex-1 ml-2 text-base font-semibold text-surfaceDark"
          value="Connaught Place, Delhi"
          editable={false}
        />
      </View>
      
      {/* Destination Input */}
      <View className="flex-row items-center">
        <View className="w-6 items-center">
          <Ionicons name="location" size={16} color="red" />
        </View>
        <TextInput 
          placeholder="Where to?" 
          className="flex-1 ml-2 text-base text-surfaceDark"
        />
      </View>
    </View>
  );
}
