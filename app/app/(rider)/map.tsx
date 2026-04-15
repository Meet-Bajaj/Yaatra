import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from '../../components/MapView';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { socketService } from '../../src/services/socket';

export default function RiderMapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  return (
    <View className="flex-1 relative">
      <MapView 
        style={{ flex: 1 }} 
        provider={PROVIDER_DEFAULT}
        initialRegion={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        } : {
          latitude: 28.6139,
          longitude: 77.2090,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation
      />
      
      {/* Search Header */}
      <View className="absolute top-16 left-6 right-6 z-10">
         <View className="bg-white p-4 rounded-full shadow-lg flex-row items-center border border-gray-100">
           <Text className="mr-3 text-xl">📍</Text>
           <TextInput 
             className="flex-1 text-lg placeholder-gray-500"
             placeholder="Where to?"
             onFocus={() => router.push('/(rider)/book')}
           />
         </View>
      </View>

      {/* Bottom Sheet Overlay */}
      <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] p-6 pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center absolute top-3" />
        <Text className="text-2xl font-bold mb-6 text-gray-800">Choose a ride</Text>
        
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity 
            className="items-center bg-yellow-50 p-5 rounded-3xl w-[48%] border border-yellow-200 shadow-sm"
            onPress={() => router.push('/(rider)/book')}
          >
            <Text className="text-5xl mb-3">🛺</Text>
            <Text className="font-bold text-gray-800">Rickshaw</Text>
            <Text className="text-gray-500 text-xs mt-1">Local commute</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="items-center bg-blue-50 p-5 rounded-3xl w-[48%] border border-blue-200 shadow-sm"
            onPress={() => router.push('/(rider)/book')}
          >
            <Text className="text-5xl mb-3">🚗</Text>
            <Text className="font-bold text-gray-800">Carpool</Text>
            <Text className="text-gray-500 text-xs mt-1">Share & save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
