import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { LoadingView } from '../../components/LoadingView';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

export default function PassengerAccount() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    userService
      .getMyProfile()
      .then((profile) => {
        setName(profile.name || '');
        setEmail(profile.email || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      await userService.updateMyProfile({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  const handleOpenSupport = async () => {
    await WebBrowser.openBrowserAsync('https://razorpay.com/docs/payments/');
  };

  if (loading) {
    return <LoadingView message="Loading account..." />;
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Account</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Profile settings</Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <FormInput label="Name" value={name} onChangeText={setName} placeholder="Your name" />
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title={saving ? 'Saving...' : 'Save changes'}
            onPress={handleSave}
            disabled={saving}
          />

          <Text className="mb-2 mt-6 text-sm font-semibold text-gray-700">Appearance</Text>
          <View className="mb-2 flex-row gap-2">
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setThemeMode(mode).catch(() => undefined)}
                className={`flex-1 rounded-2xl border px-3 py-3 ${
                  themeMode === mode ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'
                }`}>
                <Text className="text-center font-medium capitalize text-surfaceDark">{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleOpenSupport} className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
            <Text className="text-center font-semibold text-surfaceDark">Open payment help in browser</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} className="mt-4">
            <Text className="text-center font-semibold text-gray-500">Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
