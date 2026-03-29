import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PhoneInput({ value, onChangeText }: PhoneInputProps) {
  return (
    <View className="w-full flex-row items-center rounded-xl border border-gray-300 bg-surfaceLight p-3">
      <View className="flex-row items-center border-r border-gray-300 pr-3">
        <Text className="ml-1 mr-1 text-lg font-semibold">+91</Text>
        <Ionicons name="chevron-down" size={16} color="gray" />
      </View>
      <TextInput
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        className="ml-3 flex-1 text-lg"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}
