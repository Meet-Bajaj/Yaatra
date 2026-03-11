import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FareTag } from './FareTag';

export function RiderCard() {
  return (
    <View className="bg-surfaceLight p-4 rounded-xl shadow-lg border border-gray-100 mt-auto mx-4 mb-6 z-10">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-gray-200 rounded-full justify-center items-center mr-3">
            <Ionicons name="person" size={24} color="gray" />
          </View>
          <View>
            <Text className="font-bold text-lg text-surfaceDark">John Doe</Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#eab308" />
              <Text className="text-sm font-semibold ml-1">4.5</Text>
            </View>
          </View>
        </View>
        <FareTag amount={85} />
      </View>

      <View className="flex-row justify-between pl-2 mb-4">
        <View>
          <Text className="text-xs text-gray-500 uppercase font-bold mb-1">Distance</Text>
          <Text className="font-semibold text-surfaceDark">2.4 km</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500 uppercase font-bold mb-1">Time</Text>
          <Text className="font-semibold text-surfaceDark">12 min</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500 uppercase font-bold mb-1">Seats</Text>
          <Text className="font-semibold text-surfaceDark">3</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity className="flex-1 bg-gray-200 py-3 rounded-xl items-center mr-2">
          <Text className="font-bold text-surfaceDark">Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-primary py-3 rounded-xl items-center ml-2">
          <Text className="font-bold text-white">Accept Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
