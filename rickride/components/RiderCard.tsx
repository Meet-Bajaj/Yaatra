import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FareTag } from './FareTag';

export function RiderCard() {
  return (
    <View className="z-10 mx-4 mb-6 mt-auto rounded-xl border border-gray-100 bg-surfaceLight p-4 shadow-lg">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <Ionicons name="person" size={24} color="gray" />
          </View>
          <View>
            <Text className="text-lg font-bold text-surfaceDark">John Doe</Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#eab308" />
              <Text className="ml-1 text-sm font-semibold">4.5</Text>
            </View>
          </View>
        </View>
        <FareTag amount={85} />
      </View>

      <View className="mb-4 flex-row justify-between pl-2">
        <View>
          <Text className="mb-1 text-xs font-bold uppercase text-gray-500">Distance</Text>
          <Text className="font-semibold text-surfaceDark">2.4 km</Text>
        </View>
        <View>
          <Text className="mb-1 text-xs font-bold uppercase text-gray-500">Time</Text>
          <Text className="font-semibold text-surfaceDark">12 min</Text>
        </View>
        <View>
          <Text className="mb-1 text-xs font-bold uppercase text-gray-500">Seats</Text>
          <Text className="font-semibold text-surfaceDark">3</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity className="mr-2 flex-1 items-center rounded-xl bg-gray-200 py-3">
          <Text className="font-bold text-surfaceDark">Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity className="ml-2 flex-1 items-center rounded-xl bg-primary py-3">
          <Text className="font-bold text-white">Accept Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
