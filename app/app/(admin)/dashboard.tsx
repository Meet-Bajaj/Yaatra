import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboard() {
  const logout = useAuthStore(s => s.logout);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6 pt-16">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-gray-900">Admin Panel</Text>
        <TouchableOpacity onPress={logout}>
          <MaterialIcons name="logout" size={26} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] bg-indigo-500 p-6 rounded-2xl mb-4 shadow-md">
          <Text className="text-indigo-100 mb-2 font-medium text-lg">Active</Text>
          <Text className="text-4xl text-white font-bold">12 Rides</Text>
        </View>
        <View className="w-[48%] bg-white border border-gray-100 p-6 rounded-2xl mb-4 shadow-sm">
          <Text className="text-gray-500 mb-2 font-medium text-lg">Drivers</Text>
          <Text className="text-4xl text-gray-800 font-bold">45</Text>
        </View>
        <View className="w-[48%] bg-white border border-gray-100 p-6 rounded-2xl mb-4 shadow-sm">
          <Text className="text-gray-500 mb-2 font-medium text-lg">Total Users</Text>
          <Text className="text-4xl text-gray-800 font-bold">1.2k</Text>
        </View>
        <View className="w-[48%] bg-emerald-500 p-6 rounded-2xl mb-4 shadow-md">
          <Text className="text-emerald-50 mb-2 font-medium text-lg">Revenue</Text>
          <Text className="text-3xl text-white font-bold">₹40k</Text>
        </View>
      </View>

      <Text className="text-2xl font-bold mt-6 mb-4 text-gray-800">Pending Approvals</Text>
      {[1, 2].map(i => (
        <View key={i} className="bg-white p-5 rounded-2xl mb-3 flex-row justify-between items-center border border-gray-100 shadow-sm">
           <View>
             <Text className="font-semibold text-lg text-gray-800">Mohammad {i}</Text>
             <Text className="text-gray-500 mt-1">DL1Rxxxx</Text>
           </View>
           <TouchableOpacity className="bg-indigo-50 px-5 py-3 rounded-xl border border-indigo-100">
             <Text className="text-indigo-700 font-bold">Review</Text>
           </TouchableOpacity>
        </View>
      ))}

    </ScrollView>
  );
}
