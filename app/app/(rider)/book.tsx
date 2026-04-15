import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function BookScreen() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-white p-6 pt-16">
      <Text className="text-2xl font-bold mb-6">Confirm Booking</Text>
      <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
        <Text className="text-gray-500 mb-1">Pickup</Text>
        <Text className="text-lg font-semibold text-gray-800">Current Location</Text>
        <View className="h-[1px] bg-gray-200 my-3" />
        <Text className="text-gray-500 mb-1">Dropoff</Text>
        <Text className="text-lg font-semibold text-gray-800">Selected Destination</Text>
      </View>
      
      <View className="flex-row justify-between items-center mb-6 px-2">
        <Text className="text-lg text-gray-600">Estimated Fare</Text>
        <Text className="text-2xl font-bold text-primary">₹150</Text>
      </View>

      <TouchableOpacity 
        className="bg-black py-4 rounded-xl items-center shadow-md mb-4"
        onPress={() => {
          // Razorpay/Payment integration goes here
          router.replace('/(rider)/map');
        }}
      >
        <Text className="text-white font-semibold text-lg">Pay & Book Now</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} className="py-4 items-center">
        <Text className="text-gray-500 font-medium text-lg">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
