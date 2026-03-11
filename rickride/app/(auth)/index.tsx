import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { AuthCard } from '../../components/AuthCard';
import { PhoneInput } from '../../components/PhoneInput';
import { Button } from '../../components/Button';
import { IllustrationHeader } from '../../components/IllustrationHeader';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      router.push('/(auth)/otp' as Href);
    }
  };

  return (
    <View className="flex-1 bg-backgroundLight relative">
      <IllustrationHeader />
      
      <AuthCard>
        <Text className="text-3xl font-bold text-surfaceDark mb-2">Welcome to RikRide</Text>
        <Text className="text-gray-500 mb-6 text-base">Enter your phone number to get started</Text>

        <PhoneInput value={phone} onChangeText={setPhone} />

        <View className="mt-6 mb-8">
          <Text className="text-center text-gray-500 text-sm">
            By continuing, you agree to our{' '}
            <Text className="font-semibold text-primary">Terms of Service</Text> and{' '}
            <Text className="font-semibold text-primary">Privacy Policy</Text>.
          </Text>
        </View>

        <Button title="Send OTP" onPress={handleSendOTP} disabled={phone.length < 10} />
      </AuthCard>
    </View>
  );
}
