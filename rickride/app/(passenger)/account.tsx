import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { LoadingView } from '../../components/LoadingView';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';

export default function PassengerAccount() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

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
          <TouchableOpacity onPress={handleLogout} className="mt-4">
            <Text className="text-center font-semibold text-gray-500">Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
