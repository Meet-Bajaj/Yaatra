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
        className="border border-gray-300 rounded-xl p-3 bg-surfaceLight text-base text-surfaceDark"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}
