import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    router.push({ pathname: '/(auth)/verify', params: { phone } });
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-10">
        <Text className="text-5xl font-bold text-primary mb-2">Rick Ride</Text>
        <Text className="text-gray-500 text-center text-lg">Your daily commute, simplified.</Text>
      </View>
      
      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium text-base">Phone Number</Text>
        <TextInput 
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-lg"
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>
      
      <TouchableOpacity 
        className="bg-primary py-4 rounded-xl items-center shadow-sm"
        onPress={handleLogin}
      >
        <Text className="text-white font-semibold text-xl">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
