import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4338CA', headerShown: false }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ title: 'Overview', tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="users" 
        options={{ title: 'Users', tabBarIcon: ({ color }) => <MaterialIcons name="people" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}
