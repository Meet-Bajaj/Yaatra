import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function DriverProfile() {
  const logout = useAuthStore(s => s.logout);
  return (
    <View className="flex-1 bg-white p-6 pt-16 items-center justify-center">
      <Text className="text-3xl mb-8 font-bold text-gray-800">Driver Settings</Text>
      <TouchableOpacity className="bg-red-50 w-full px-6 py-4 rounded-xl border border-red-100 items-center shadow-sm" onPress={logout}>
        <Text className="text-red-600 font-bold text-lg">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
