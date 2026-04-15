import React from 'react';
import { View, Text } from 'react-native';

export default function UsersList() {
  return (
    <View className="flex-1 bg-white p-6 pt-16">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Manage Users</Text>
      <View className="bg-gray-50 flex-1 rounded-2xl justify-center items-center p-6 border border-gray-100">
        <Text className="text-gray-400 text-lg text-center">User management table will be integrated here</Text>
      </View>
    </View>
  );
}
