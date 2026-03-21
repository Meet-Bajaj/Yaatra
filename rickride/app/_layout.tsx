import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore, getAuthToken } from '../store/useAuthStore';
import { userService } from '../services/userService';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function useAuthGuard() {
  const { isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          // If a token exists, fetch profile to ensure credibility
          const { user } = await userService.getMe();
          if (user) await login(user, token);
          else await logout();
        } else {
          await logout();
        }
      } catch (e) {
        await logout();
      } finally {
        setLoading(false);
      }
    };
    if (isLoading) restoreSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)' as any);
    } else if (isAuthenticated && inAuthGroup) {
      const role = useAuthStore.getState().user?.role;
      if (role === 'driver') router.replace('/(driver)' as any);
      else if (role === 'admin') router.replace('/(admin)' as any);
      else router.replace('/(passenger)' as any);
    }
  }, [isAuthenticated, segments, isLoading]);
}

export default function RootLayout() {
  useAuthGuard();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(passenger)" options={{ headerShown: false }} />
          <Stack.Screen name="(driver)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
