import { useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';

import { AuthCard } from '../../components/AuthCard';
import { Button } from '../../components/Button';
import { IllustrationHeader } from '../../components/IllustrationHeader';
import { roleRoutes } from '../../constants/config';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';

export default function OTPScreen() {
  const router = useRouter();
  const { phone, delivery, mockCode } = useLocalSearchParams<{
    phone: string;
    delivery?: string;
    mockCode?: string;
  }>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const otpValue = useMemo(() => otp.join(''), [otp]);

  const handleChange = (text: string, index: number) => {
    const sanitized = text.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = sanitized;
    setOtp(nextOtp);

    if (sanitized && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    if (!phone) {
      return;
    }

    setSubmitting(true);

    try {
      const session = await authService.verifyOtp({
        phone,
        code: otpValue,
      });

      await useAuthStore.getState().setSession(session.token, session.user);

      Toast.show({
        type: 'success',
        text1: 'Signed in',
        text2: `Welcome ${session.user.name || session.user.phone}`,
      });

      router.replace(roleRoutes[session.user.role]);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: 'Please check the code and try again.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!phone) {
      return;
    }

    try {
      const otpDetails = await authService.login({ phone });
      Toast.show({
        type: 'success',
        text1: 'OTP sent again',
        text2: otpDetails.mockCode
          ? `Development OTP: ${otpDetails.mockCode}`
          : 'Check your phone for the new code.',
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        Toast.show({
          type: 'error',
          text1: 'Phone not registered',
          text2: 'Please create an account first.',
        });
      }
    }
  };

  return (
    <View className="bg-backgroundLight relative flex-1">
      <IllustrationHeader />

      <AuthCard>
        <Text className="mb-2 text-3xl font-bold text-surfaceDark">Verify OTP</Text>
        <Text className="mb-2 text-base text-gray-500">
          Enter the 6-digit code sent to {phone || 'your phone'}.
        </Text>
        {delivery ? <Text className="mb-6 text-sm text-gray-400">Delivery: {delivery}</Text> : null}
        {mockCode ? (
          <Text className="mb-4 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            Development OTP: {mockCode}
          </Text>
        ) : null}

        <View className="mb-8 flex-row justify-between">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              className="h-14 w-12 rounded-xl border border-gray-300 bg-surfaceLight text-center text-xl font-bold"
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <Button
          title={submitting ? 'Verifying...' : 'Verify & Continue'}
          onPress={verifyOtp}
          disabled={submitting || otpValue.length < 6}
        />

        <TouchableOpacity onPress={resendOtp} className="mt-6">
          <Text className="text-center font-semibold text-primary">Resend OTP</Text>
        </TouchableOpacity>
      </AuthCard>
    </View>
  );
}
