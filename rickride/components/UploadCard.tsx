import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../constants/theme';

interface UploadCardProps {
  label: string;
  onPress: () => void;
  uploaded?: boolean;
}

export function UploadCard({ label, onPress, uploaded = false }: UploadCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 items-center justify-center rounded-xl border-2 border-dashed p-4 ${
        uploaded ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-surfaceLight'
      }`}>
      <Ionicons
        name={uploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
        size={32}
        color={uploaded ? 'green' : theme.colors.primary}
      />
      <Text className={`mt-2 font-semibold ${uploaded ? 'text-green-700' : 'text-surfaceDark'}`}>
        {uploaded ? 'Uploaded' : label}
      </Text>
    </TouchableOpacity>
  );
}
