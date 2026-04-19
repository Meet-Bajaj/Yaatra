import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { theme } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';

export default function DriverLayout() {
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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="speedometer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-trip"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color }) => <Ionicons name="cash" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
