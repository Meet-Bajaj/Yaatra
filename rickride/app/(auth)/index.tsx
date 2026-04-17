import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';

import { AuthCard } from '../../components/AuthCard';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { IllustrationHeader } from '../../components/IllustrationHeader';
import { PhoneInput } from '../../components/PhoneInput';
import { roleLabels } from '../../constants/config';
import { authService } from '../../services/authService';
import { UserRole } from '../../services/types';
import { normalizePhone } from '../../utils/phone';
import { ScrollView } from 'react-native-gesture-handler';

const authModes = ['login', 'register'] as const;

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof authModes)[number]>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('rider');
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    const normalizedPhone = normalizePhone(phone);

    setSubmitting(true);

    try {
      if (mode === 'register') {
        await authService.register({
          phone: normalizedPhone,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          role,
        });
      }

      const otpDetails = await authService.login({ phone: normalizedPhone });

      Toast.show({
        type: 'success',
        text1: mode === 'register' ? 'Account created' : 'OTP sent',
        text2: otpDetails.mockCode
          ? `Development OTP: ${otpDetails.mockCode}`
          : 'Check your phone for the verification code.',
      });

      router.push({
        pathname: '/(auth)/otp',
        params: {
          phone: normalizedPhone,
          delivery: otpDetails.delivery,
          mockCode: otpDetails.mockCode || '',
        },
      });
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (mode === 'login' && status === 404) {
        setMode('register');
        Toast.show({
          type: 'info',
          text1: 'Account not found',
          text2: 'Please sign up first, then request OTP again.',
        });
      }

      if (mode === 'register' && status === 409) {
        setMode('login');
        Toast.show({
          type: 'info',
          text1: 'Account already exists',
          text2: 'Please log in with your phone number.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="bg-backgroundLight relative flex-1">
      <IllustrationHeader />

      <AuthCard>
        <View className="mb-6 flex-row rounded-2xl bg-white/70 p-1">
          {authModes.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setMode(item)}
              className={`flex-1 rounded-2xl px-4 py-3 ${mode === item ? 'bg-primary' : 'bg-transparent'}`}>
              <Text
                className={`text-center font-semibold ${mode === item ? 'text-white' : 'text-surfaceDark'}`}>
                {item === 'login' ? 'Login' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
    <ScrollView>

        <Text className="mb-2 text-3xl font-bold text-surfaceDark">Welcome to RickRide</Text>
        <Text className="mb-6 text-base text-gray-500">
          {mode === 'login'
            ? 'Enter your phone number to receive a one-time password.'
            : 'Create your account first, then we will verify your phone number.'}
        </Text>

        {mode === 'register' ? (
          <>
            <FormInput
              label="Full name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
            />
            <FormInput
              label="Email (optional)"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Text className="mb-2 text-sm font-semibold text-gray-700">Account type</Text>
            <View className="mb-4 flex-row gap-2">
              {(['rider', 'driver'] as UserRole[]).map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setRole(item)}
                  className={`flex-1 rounded-2xl border px-3 py-3 ${
                    role === item ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'
                  }`}>
                  <Text className="text-center font-medium text-surfaceDark">
                    {roleLabels[item]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}

        <PhoneInput value={phone} onChangeText={setPhone} />

        <View className="mb-8 mt-6">
          <Text className="text-center text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <Text className="font-semibold text-primary">Terms of Service</Text> and{' '}
            <Text className="font-semibold text-primary">Privacy Policy</Text>.
          </Text>
        </View>

        <Button
          title={
            submitting
              ? 'Please wait...'
              : mode === 'login'
                ? 'Send OTP'
                : 'Create account & send OTP'
          }
          onPress={handleContinue}
          disabled={submitting || phone.replace(/\D/g, '').length < 10}
        />
    </ScrollView>
      </AuthCard>
    </View>
  );
}
