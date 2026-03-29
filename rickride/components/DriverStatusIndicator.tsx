import React from 'react';
import { View, Text, Switch } from 'react-native';
import { theme } from '../constants/theme';

interface DriverStatusIndicatorProps {
  isOnline: boolean;
  onToggle: (value: boolean) => void;
}

export function DriverStatusIndicator({ isOnline, onToggle }: DriverStatusIndicatorProps) {
  return (
    <View className="absolute left-4 right-4 top-12 z-10 flex-row items-center justify-between rounded-full border border-gray-100 bg-surfaceLight p-2 shadow-md">
      <View className="ml-2 flex-row items-center">
        <View
          className={`mr-2 h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
        />
        <Text className="text-base font-bold text-surfaceDark">
          {isOnline ? "You're Online" : "You're Offline"}
        </Text>
      </View>
      <Switch
        value={isOnline}
        onValueChange={onToggle}
        trackColor={{ false: '#d1d5db', true: theme.colors.primary }}
        thumbColor={'#ffffff'}
      />
    </View>
  );
}
