import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-semibold text-gray-700">{label}</Text>
      <TextInput
        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-[16px] font-medium text-surfaceDark"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}
