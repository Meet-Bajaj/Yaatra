import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ProfileScreen() {
  const logout = useAuthStore(s => s.logout);
  const user = useAuthStore(s => s.user);
  
  const userObj = typeof user === 'string' ? JSON.parse(user) : user;

  return (
    <View className="flex-1 bg-white p-6 pt-16">
      <Text className="text-3xl font-bold mb-8 text-gray-800">Profile</Text>
      
      <View className="bg-gray-50 p-6 rounded-2xl mb-8 items-center border border-gray-100">
        <View className="w-20 h-20 bg-primary/20 rounded-full mb-4 items-center justify-center">
          <Text className="text-3xl">👤</Text>
        </View>
        <Text className="text-xl font-bold text-gray-800">{userObj?.name || 'Rider'}</Text>
        <Text className="text-gray-500">+91 {userObj?.phone}</Text>
      </View>
      
      <TouchableOpacity 
        className="bg-red-50 py-4 rounded-xl items-center border border-red-100"
        onPress={logout}
      >
        <Text className="text-red-600 font-semibold text-lg">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
