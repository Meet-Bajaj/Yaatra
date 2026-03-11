import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownSelectProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}

export function DropdownSelect({ label, value, placeholder, onPress }: DropdownSelectProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-1">{label}</Text>
      <TouchableOpacity 
        className="border border-gray-300 rounded-xl p-3 bg-surfaceLight flex-row justify-between items-center"
        onPress={onPress}
      >
        <Text className={`text-base ${value ? 'text-surfaceDark' : 'text-gray-400'}`}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
