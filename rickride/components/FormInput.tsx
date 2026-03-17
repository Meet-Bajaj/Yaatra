import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-1">{label}</Text>
      <TextInput 
        className="border border-gray-200 rounded-2xl px-4 py-4 bg-gray-50 text-[16px] text-surfaceDark font-medium"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}
