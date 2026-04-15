import { View, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Simple redirect to auth for now, layout guarding will handle actual role routing
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 100);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#F59E0B" />
    </View>
  );
}
