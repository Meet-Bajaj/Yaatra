import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from '../../components/MapView';
import { useAuthStore } from '../../src/store/useAuthStore';
import * as Location from 'expo-location';
import { socketService } from '../../src/services/socket';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const toggleOnline = (val: boolean) => {
    setIsOnline(val);
    if (val) {
      socketService.connect();
      if (location) {
        socketService.socket?.emit('driver:updateLocation', {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
      }
    } else {
      socketService.disconnect();
    }
  };

  return (
    <View className="flex-1 relative">
      <View className="bg-white pt-14 pb-4 px-6 flex-row justify-between items-center shadow-sm z-10">
        <Text className="text-2xl font-bold">Driver Mode</Text>
        <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-full border border-gray-100">
          <Text className="mr-2 font-semibold text-gray-700">{isOnline ? 'Online' : 'Offline'}</Text>
          <Switch value={isOnline} onValueChange={toggleOnline} trackColor={{ true: '#F59E0B' }} />
        </View>
      </View>

      <MapView 
        style={{ flex: 1 }} 
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        initialRegion={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } : {
          latitude: 28.6139,
          longitude: 77.2090,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      />

      {isOnline && (
        <View className="absolute bottom-6 left-6 right-6">
          <View className="bg-white p-6 rounded-2xl shadow-xl">
             <Text className="text-gray-600 text-center mb-4 text-lg font-medium animate-pulse">Looking for ride requests...</Text>
             <ActivityIndicator color="#F59E0B" size="large" />
          </View>
        </View>
      )}
    </View>
  );
}
