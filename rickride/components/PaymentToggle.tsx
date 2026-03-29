import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export function PaymentToggle() {
  return (
    <TouchableOpacity className="mb-6 flex-row items-center justify-between rounded-2xl border border-gray-50 bg-surfaceLight p-5 shadow-md">
      <View className="flex-row items-center">
        <Ionicons name="wallet-outline" size={24} color={theme.colors.primary} />
        <Text className="ml-3 text-lg font-bold text-surfaceDark">RikRide Wallet</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="mr-2 text-gray-500">₹150.00</Text>
        <Ionicons name="chevron-forward" size={18} color="gray" />
      </View>
    </TouchableOpacity>
  );
}
