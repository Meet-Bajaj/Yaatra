import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from '../../components/GooglePlacesAutocompleteMock';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';

const MapViewDirections = Platform.OS === 'web' ? () => null : require('react-native-maps-directions').default;

import MapView, { Marker } from '../../components/MapMock';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import { useAsyncData } from '../../hooks/useAsyncData';
import { driverService } from '../../services/driverService';
import { theme } from '../../constants/theme';
import { Button } from '../../components/Button';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const mapCustomStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

export default function PassengerHome() {
  const router = useRouter();
  const locationState = useDeviceLocation({ autoRequest: true });
  const mapRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [pickupLocation, setPickupLocation] = useState<{ latitude: number, longitude: number, title?: string } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number, longitude: number, title?: string } | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number, duration: number } | null>(null);

  const activeOrigin = pickupLocation || locationState.location;

  const nearbyDriversState = useAsyncData(
    async () => {
      if (!activeOrigin) return [];
      return driverService.getNearbyDrivers(
        activeOrigin.longitude,
        activeOrigin.latitude,
        15,
        10
      );
    },
    [activeOrigin?.latitude, activeOrigin?.longitude]
  );

  useEffect(() => {
    if (activeOrigin && mapRef.current && !destination) {
      mapRef.current.animateToRegion({
        latitude: activeOrigin.latitude,
        longitude: activeOrigin.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [activeOrigin]);

  const centerMap = () => {
    if (activeOrigin && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: activeOrigin.latitude,
        longitude: activeOrigin.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleMapPress = (e: any) => {
    const coord = e.nativeEvent.coordinate;
    setDestination({
      latitude: coord.latitude,
      longitude: coord.longitude,
      title: 'Selected Destination'
    });
    setSelectedDriver(null);
  };

  const handleDriverSelect = (driver: any) => {
    setSelectedDriver(driver);
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={mapCustomStyle}
        initialRegion={activeOrigin ? {
          latitude: activeOrigin.latitude,
          longitude: activeOrigin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        } : undefined}
        onPress={handleMapPress}
        showsUserLocation={false} 
      >
        {/* Current / Pickup Location */}
        {activeOrigin && (
          <Marker coordinate={activeOrigin} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.currentLocationDot}>
              <View style={styles.currentLocationDotInner} />
            </View>
          </Marker>
        )}
        
        {/* Destination Location */}
        {destination && (
          <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }}>
            <Ionicons name="location" size={36} color={theme.colors.primary} />
          </Marker>
        )}

        {/* Nearby Drivers */}
        {nearbyDriversState.data?.map(driver => (
          <Marker 
            key={driver._id} 
            coordinate={{
              latitude: driver.location?.coordinates?.[1] || 23.02,
              longitude: driver.location?.coordinates?.[0] || 72.57
            }}
            onPress={() => handleDriverSelect(driver)}
          >
            <View style={styles.driverMarker}>
              <Ionicons name="car" size={16} color="#fff" />
            </View>
          </Marker>
        ))}

        {activeOrigin && destination && GOOGLE_MAPS_API_KEY && (
          <MapViewDirections
            origin={activeOrigin}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor={theme.colors.primary}
            onError={(errorMessage) => {
              console.log('MapViewDirections Error: ', errorMessage);
            }}
            onReady={result => {
              setRouteInfo({
                distance: result.distance,
                duration: result.duration
              });
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true
              });
            }}
          />
        )}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.searchOverlay}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchStack}>
            <View style={styles.searchInputWrapper}>
              <View style={[styles.pickupDot, { backgroundColor: '#10b981' }]} />
              <GooglePlacesAutocomplete
                placeholder="Current Location (Pickup)"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (details?.geometry?.location) {
                    const loc = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      title: data.structured_formatting.main_text
                    };
                    setPickupLocation(loc);
                    mapRef.current?.animateToRegion({
                      ...loc,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    });
                  }
                }}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                  components: 'country:in',
                }}
                styles={{
                  container: { flex: 1 },
                  textInputContainer: { backgroundColor: 'transparent', height: 40, paddingBottom: 0 },
                  textInput: {
                    backgroundColor: 'transparent',
                    color: '#fff',
                    fontSize: 16,
                    height: 40,
                    margin: 0,
                    padding: 0,
                  },
                  listView: { position: 'absolute', top: 50, zIndex: 10, backgroundColor: '#242f3e' },
                  row: { backgroundColor: '#242f3e' },
                  description: { color: '#fff' }
                }}
                textInputProps={{ placeholderTextColor: '#9ca5b3' }}
              />
            </View>

            <View style={[styles.searchInputWrapper, { marginTop: 8 }]}>
              <View style={[styles.pickupDot, { backgroundColor: theme.colors.primary }]} />
              <GooglePlacesAutocomplete
                placeholder="Where to?"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (details?.geometry?.location) {
                    const loc = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      title: data.structured_formatting.main_text
                    };
                    setDestination(loc);
                    mapRef.current?.animateToRegion({
                      ...loc,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    });
                  }
                }}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                  components: 'country:in',
                }}
                styles={{
                  container: { flex: 1 },
                  textInputContainer: { backgroundColor: 'transparent', height: 40, paddingBottom: 0 },
                  textInput: {
                    backgroundColor: 'transparent',
                    color: '#fff',
                    fontSize: 16,
                    height: 40,
                    margin: 0,
                    padding: 0,
                  },
                  listView: { position: 'absolute', top: 50, zIndex: 10, backgroundColor: '#242f3e' },
                  row: { backgroundColor: '#242f3e' },
                  description: { color: '#fff' }
                }}
                textInputProps={{ placeholderTextColor: '#9ca5b3' }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <TouchableOpacity style={styles.fabLocation} onPress={centerMap}>
        <Ionicons name="locate" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Driver Bottom Sheet */}
      {selectedDriver && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={['35%']}
          enablePanDownToClose
          onClose={() => setSelectedDriver(null)}
          backgroundStyle={styles.bottomSheetBg}
          handleIndicatorStyle={{ backgroundColor: '#4a5568' }}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <View style={styles.driverHeader}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{selectedDriver.userId?.name || 'Ramesh Kumar'}</Text>
                <Text style={styles.driverVehicle}>Bajaj RE Compact • 3 min away</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>4.8</Text>
                <Ionicons name="star" size={12} color="#fbbf24" />
              </View>
            </View>

            <View style={styles.tripStatsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>DISTANCE</Text>
                <Text style={styles.statValue}>{routeInfo?.distance ? `${routeInfo.distance.toFixed(1)} km` : '...'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>TIME</Text>
                <Text style={styles.statValue}>{routeInfo?.duration ? `${Math.ceil(routeInfo.duration)} min` : '...'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SEATS</Text>
                <Text style={styles.statValue}>3</Text>
              </View>
            </View>

            <View style={styles.bookRow}>
              <View>
                <Text style={styles.oldPrice}>₹{(Math.ceil(routeInfo?.distance || 5) * 15) + 15}.00</Text>
                <Text style={styles.newPrice}>₹{Math.ceil(routeInfo?.distance || 5) * 15}.00</Text>
              </View>
              <Button
                title="Book Auto →"
                className="w-auto px-8"
                onPress={() => {
                   router.push('/(passenger)/confirmation');
                }}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}

      {/* Default Action Sheet - Nearby Rides */}
      {!selectedDriver && (
        <BottomSheet
          snapPoints={['25%', '45%']}
          backgroundStyle={styles.bottomSheetBg}
          handleIndicatorStyle={{ backgroundColor: '#4a5568' }}
        >
          <BottomSheetView style={{ padding: 24, flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>Available Rides Nearby</Text>
            
            {nearbyDriversState.data && nearbyDriversState.data.length > 0 ? (
              <View style={{ gap: 16 }}>
                {nearbyDriversState.data.slice(0, 2).map((driver) => (
                  <TouchableOpacity 
                    key={driver._id} 
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', padding: 16, borderRadius: 16 }}
                    onPress={() => handleDriverSelect(driver)}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(0, 212, 255, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="car-sport" size={24} color="#00d4ff" />
                    </View>
                    <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Auto Rickshaw</Text>
                      <Text style={{ color: '#9ca5b3', fontSize: 13, marginTop: 2 }}>{driver.userId?.name || 'Local Driver'} • 3 mins away</Text>
                    </View>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>₹{Math.ceil(routeInfo?.distance || 5) * 15}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ backgroundColor: '#374151', padding: 20, borderRadius: 16, alignItems: 'center' }}>
                <Ionicons name="search" size={32} color="#9ca5b3" />
                <Text style={{ color: '#fff', fontWeight: '600', marginTop: 12 }}>Looking for rides...</Text>
                <Text style={{ color: '#9ca5b3', fontSize: 13, marginTop: 4 }}>Auto-refreshing your location</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={{ marginTop: 24, backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}
              onPress={() => router.push('/(passenger)/activity')}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>View All My Bookings</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  currentLocationDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 212, 255, 0.3)',
    justifyContent: 'center', alignItems: 'center'
  },
  currentLocationDotInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#00D4FF'
  },
  driverMarker: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#00d4ff',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#1f2937'
  },
  searchOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16 },
  searchBarContainer: {
    flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 12
  },
  searchStack: { flex: 1 },
  searchInputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1f2937', borderRadius: 22, paddingHorizontal: 16,
    height: 44
  },
  pickupDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  fabLocation: {
    position: 'absolute', right: 16, top: 130,
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#1f2937',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3
  },
  bottomSheetBg: { backgroundColor: '#1f2937', borderRadius: 24 },
  bottomSheetContent: { padding: 24 },
  driverHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  driverAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#374151',
    justifyContent: 'center', alignItems: 'center', marginRight: 16
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  driverVehicle: { fontSize: 14, color: '#9ca5b3', marginTop: 4 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4
  },
  ratingText: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  tripStatsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#374151', paddingVertical: 16, marginBottom: 20
  },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 12, color: '#6b7280', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  statDivider: { width: 1, height: 24, backgroundColor: '#374151' },
  bookRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  oldPrice: { fontSize: 12, color: '#6b7280', textDecorationLine: 'line-through' },
  newPrice: { fontSize: 24, fontWeight: 'bold', color: '#fff' }
});
