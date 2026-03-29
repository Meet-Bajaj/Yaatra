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
      <Text className="mb-1 text-sm font-semibold text-gray-700">{label}</Text>
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4"
        onPress={onPress}>
        <Text className={`text-[16px] font-medium ${value ? 'text-surfaceDark' : 'text-gray-400'}`}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
