import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function DriverLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F59E0B', headerShown: false }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ title: 'Requests', tabBarIcon: ({ color }) => <MaterialIcons name="local-taxi" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}
