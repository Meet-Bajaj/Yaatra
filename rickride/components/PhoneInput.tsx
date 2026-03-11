import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PhoneInput({ value, onChangeText }: PhoneInputProps) {
  return (
    <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-surfaceLight w-full">
      <View className="flex-row items-center pr-3 border-r border-gray-300">
        <Text className="text-lg mr-1 ml-1 font-semibold">🇮🇳 +91</Text>
        <Ionicons name="chevron-down" size={16} color="gray" />
      </View>
      <TextInput
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        className="flex-1 ml-3 text-lg"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}
