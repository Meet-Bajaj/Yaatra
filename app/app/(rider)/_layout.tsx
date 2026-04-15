import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function RiderLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F59E0B', headerShown: false }}>
      <Tabs.Screen 
        name="map" 
        options={{ title: 'Home', tabBarIcon: ({ color }) => <MaterialIcons name="map" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="book" 
        options={{ title: 'Bookings', href: null }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{ title: 'Rides', tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Account', tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}
