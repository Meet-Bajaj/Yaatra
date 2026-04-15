import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import api from '../../src/services/api';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert('Error', 'Enter complete OTP');
      return;
    }
    setLoading(true);
    try {
      // FOR DEMO: Let's mock a rider user based on OTP
      const mockUser = {
        id: 'user_123',
        phone: phone || '9999999999',
        role: otp === '0000' ? 'admin' : (otp === '1111' ? 'driver' : 'rider') as any,
        name: 'John Doe'
      };
      
      await setAuth(mockUser, 'mock-jwt-token-abcd-1234');
      // The Root Layout _layout.tsx will automatically redirect upon state change
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-10">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</Text>
        <Text className="text-gray-500 text-lg">Sent to +91 {phone}</Text>
        <View className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-sm text-blue-800">Demo Roles:</Text>
          <Text className="text-sm text-blue-800">0000 = Admin Dashboard</Text>
          <Text className="text-sm text-blue-800">1111 = Driver Dashboard</Text>
          <Text className="text-sm text-blue-800">Any = Rider Map</Text>
        </View>
      </View>
      
      <View className="mb-8">
        <TextInput 
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-center text-4xl tracking-[1em]"
          placeholder="----"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          autoFocus
          onChangeText={setOtp}
        />
      </View>
      
      <TouchableOpacity 
        className="bg-primary py-4 rounded-xl items-center shadow-sm disabled:opacity-70"
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-lg">Verify & Proceed</Text>}
      </TouchableOpacity>
    </View>
  );
}
