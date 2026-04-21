import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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
      Toast.show({ type: 'success', text1: 'Profile updated' });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase' }}>Account</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>Profile Settings</Text>

        <BlurView intensity={20} tint="light" style={{ overflow: 'hidden', borderRadius: 24, marginTop: 24, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0, 212, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00d4ff' }}>
              <Ionicons name="person" size={40} color="#00d4ff" />
            </View>
          </View>

          <Text style={{ color: '#9ca5b3', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Full Name</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16 }}>
            <Ionicons name="person-outline" size={20} color="#9ca5b3" />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 }}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#6b7280"
            />
          </View>

          <Text style={{ color: '#9ca5b3', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Email Address</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 24 }}>
            <Ionicons name="mail-outline" size={20} color="#9ca5b3" />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            onPress={handleSave} 
            disabled={saving}
            style={{ backgroundColor: '#00d4ff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', opacity: saving ? 0.7 : 1 }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>

          {/* Theme Selector */}
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 32, marginBottom: 16 }}>App Theme</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setThemeMode(mode).catch(() => undefined)}
                style={{
                  flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
                  backgroundColor: themeMode === mode ? 'rgba(0, 212, 255, 0.1)' : 'rgba(0,0,0,0.3)',
                  borderWidth: 1, borderColor: themeMode === mode ? '#00d4ff' : 'transparent'
                }}
              >
                <Text style={{ color: themeMode === mode ? '#00d4ff' : '#9ca5b3', fontWeight: '600', textTransform: 'capitalize' }}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Support */}
          <TouchableOpacity onPress={handleOpenSupport} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            <Ionicons name="help-circle-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>Help & Support</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingVertical: 16, borderWidth: 1, borderColor: 'rgba(248, 113, 113, 0.3)', borderRadius: 12 }}>
            <Ionicons name="log-out-outline" size={20} color="#f87171" />
            <Text style={{ color: '#f87171', fontWeight: '600', marginLeft: 8 }}>Log Out</Text>
          </TouchableOpacity>

        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}
