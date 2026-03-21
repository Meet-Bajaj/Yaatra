import React, { useState, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter, Href, useLocalSearchParams } from 'expo-router';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthCard } from '../../components/AuthCard';
import { Button } from '../../components/Button';
import { IllustrationHeader } from '../../components/IllustrationHeader';

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const verifyOTP = async () => {
    try {
      setIsLoading(true);
      const code = otp.join('');
      // Standardize payload for your backend
      const response = await authService.verifyOtp({ phone, otp: code });
      
      // Store token and user data globally directly matching your DB output
      // Assuming response wraps this in { token, user }
      const { token, user } = response;
      await useAuthStore.getState().login(user, token);

      // We explicitly route here or rely on _layout Auth Guard
      if (user.role === 'driver') {
        router.replace('/(driver)' as Href);
      } else if (user.role === 'admin') {
        router.replace('/(admin)' as Href);
      } else {
        router.replace('/(passenger)' as Href);
      }
    } catch (error) {
      console.error('OTP Verification Error', error);
      // You can add an Alert or local error state warning
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-backgroundLight relative">
      <IllustrationHeader />
      
      <AuthCard>
        <Text className="text-3xl font-bold text-surfaceDark mb-2">Verify OTP</Text>
        <Text className="text-gray-500 mb-6 text-base">We have sent a 6-digit code to your phone number.</Text>

        <View className="flex-row justify-between mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold bg-surfaceLight"
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <Button title="Verify & Continue" onPress={verifyOTP} disabled={otp.join('').length < 6} />

        <View className="mt-8">
          {/* Quick debug links to test navigation */}
          <Text className="text-center font-bold mb-4">Debug Nav:</Text>
          <View className="flex-row justify-between">
            <Button className="w-1/3 bg-gray-500 p-2" title="Passenger" onPress={() => router.replace('/(passenger)' as Href)} />
            <Button className="w-1/3 bg-gray-500 p-2" title="Driver" onPress={() => router.replace('/(driver)' as Href)} />
            <Button className="w-1/3 bg-gray-500 p-2" title="Admin" onPress={() => router.replace('/(admin)' as Href)} />
          </View>
        </View>
      </AuthCard>
    </View>
  );
}
