import '../global.css';

import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import Toast from 'react-native-toast-message';

import { roleRoutes } from '../constants/config';
import { LoadingView } from '../components/LoadingView';
import { useAuthStore } from '../store/useAuthStore';

const roleGroupMap = {
  rider: '(passenger)',
  driver: '(driver)',
  admin: '(admin)',
} as const;

export const unstable_settings = {
  initialRouteName: '(auth)',
};

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { hydrate, hydrated, token, user } = useAuthStore();

  useEffect(() => {
    hydrate().catch(() => undefined);
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const currentGroup = segments[0];
    const isAuthGroup = currentGroup === '(auth)';

    if (!token || !user) {
      if (!isAuthGroup) {
        router.replace('/(auth)');
      }
      return;
    }

    const expectedGroup = roleGroupMap[user.role];
    const expectedRoute = roleRoutes[user.role];

    if (isAuthGroup || currentGroup !== expectedGroup) {
      router.replace(expectedRoute);
    }
  }, [hydrated, router, segments, token, user]);

  if (!hydrated) {
    return <LoadingView message="Restoring your session..." />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(passenger)" />
          <Stack.Screen name="(driver)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
