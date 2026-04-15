import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  const { user, token, initAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    // Wait until auth is initialized
    if (user === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!token) {
      if (!inAuthGroup) {
        // router.replace('/(auth)/login');
      }
    } else if (token && user) {
      if (inAuthGroup || segments.length === 0 || segments[0] === 'index') {
        const userObj = typeof user === 'string' ? JSON.parse(user) : user;
        // Redirect based on role
        if (userObj.role === 'admin') router.replace('/(admin)/dashboard');
        else if (userObj.role === 'driver') router.replace('/(driver)/dashboard');
        else router.replace('/(rider)/map');
      }
    }
  }, [user, token, segments]);

  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
}
