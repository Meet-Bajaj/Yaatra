import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { theme } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';

export default function PassengerLayout() {
  const colorScheme = useColorScheme();
  const mode = useThemeStore((state) => state.mode);
  const isDarkMode = mode === 'dark' || (mode === 'system' && colorScheme === 'dark');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#b8c8c8' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#182c2c' : '#ffffff',
          borderTopColor: isDarkMode ? '#1f3a3a' : '#e5e7eb',
        },
        headerStyle: { backgroundColor: isDarkMode ? '#182c2c' : '#ffffff' },
        headerTintColor: isDarkMode ? '#f8fafc' : '#182c2c',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="confirmation"
        options={{
          href: null,
          title: 'Confirmation',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
