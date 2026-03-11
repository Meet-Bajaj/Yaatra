import React from 'react';
import { View, Text, Switch } from 'react-native';
import { theme } from '../constants/theme';

interface DriverStatusIndicatorProps {
  isOnline: boolean;
  onToggle: (value: boolean) => void;
}

export function DriverStatusIndicator({ isOnline, onToggle }: DriverStatusIndicatorProps) {
  return (
    <View className="absolute top-12 left-4 right-4 bg-surfaceLight rounded-full shadow-md p-2 flex-row items-center justify-between border border-gray-100 z-10">
      <View className="flex-row items-center ml-2">
        <View className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        <Text className="font-bold text-surfaceDark text-base">
          {isOnline ? 'You\'re Online' : 'You\'re Offline'}
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
