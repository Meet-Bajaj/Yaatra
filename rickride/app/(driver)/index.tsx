import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

import MapView, { Marker, Polyline } from '../../components/MapMock';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import { useAsyncData } from '../../hooks/useAsyncData';
import { driverService } from '../../services/driverService';
import { socketService } from '../../services/socketService';
import { theme } from '../../constants/theme';
import { Button } from '../../components/Button';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';

const mapCustomStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

export default function DriverDashboard() {
  const router = useRouter();
  const locationState = useDeviceLocation({ autoRequest: true });
  const mapRef = useRef<any>(null);

  const profileState = useAsyncData(async () => {
    try {
      return await driverService.getMyDriverProfile();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => () => socketService.disconnect(), []);

  useEffect(() => {
    if (locationState.location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: locationState.location.latitude,
        longitude: locationState.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [locationState.location]);

  const handleToggleStatus = async () => {
    if (!profileState.data) return;
    try {
      const nextStatus = profileState.data.status === 'online' ? 'offline' : 'online';
      const updated = await driverService.updateDriverStatus({ status: nextStatus });
      profileState.setData(updated);

      if (nextStatus === 'online') {
        await socketService.connect();
        socketService.registerDriver(updated._id);
      } else {
        socketService.disconnect();
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Status update failed' });
    }
  };

  const centerMap = () => {
    if (locationState.location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: locationState.location.latitude,
        longitude: locationState.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  if (profileState.loading && profileState.data === null) {
    return <LoadingView message="Loading driver dashboard..." />;
  }

  if (!profileState.data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212', padding: 16 }}>
        <EmptyState
          title="Driver profile missing"
          description="Complete onboarding before you go online."
          actionLabel="Start onboarding"
          onAction={() => router.push('/(auth)/onboarding')}
          icon={<Ionicons name="car-sport" size={36} color="#00D4FF" />}
        />
      </SafeAreaView>
    );
  }

  const isOnline = profileState.data.status === 'online';

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={mapCustomStyle}
        initialRegion={locationState.location ? {
          latitude: locationState.location.latitude,
          longitude: locationState.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        } : undefined}
        showsUserLocation={false} 
      >
        {locationState.location && (
          <Marker coordinate={locationState.location} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={isOnline ? styles.onlineDot : styles.offlineDot}>
              <View style={isOnline ? styles.onlineDotInner : styles.offlineDotInner} />
            </View>
          </Marker>
        )}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.headerOverlay}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleStatus} style={[styles.statusPill, isOnline ? styles.statusPillOnline : styles.statusPillOffline]}>
            <View style={[styles.statusIndicator, isOnline ? styles.statusIndicatorOnline : styles.statusIndicatorOffline]} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </TouchableOpacity>
          <View style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      <TouchableOpacity style={styles.fabLocation} onPress={centerMap}>
        <Ionicons name="locate" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <BottomSheet
        snapPoints={['30%']}
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={{ backgroundColor: '#4a5568' }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.driverInfoRow}>
            <View>
              <Text style={styles.greetingText}>Hello, {profileState.data.userId?.name || 'Driver'}</Text>
              <Text style={styles.zoneText}>{profileState.data.operatingZone || 'No zone set'}</Text>
            </View>
            <View style={styles.earningsBadge}>
              <Text style={styles.earningsLabel}>TODAY</Text>
              <Text style={styles.earningsValue}>₹{profileState.data.earnings || '0'}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="car" size={20} color="#9ca5b3" />
              <Text style={styles.statBoxValue}>{profileState.data.vehicle?.type || 'Auto'}</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="star" size={20} color="#fbbf24" />
              <Text style={styles.statBoxValue}>4.9</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time" size={20} color="#9ca5b3" />
              <Text style={styles.statBoxValue}>4h 20m</Text>
            </View>
          </View>
          
          <Button
            title={isOnline ? "Looking for riders..." : "GO ONLINE"}
            className={isOnline ? "bg-primary" : "bg-gray-600"}
            onPress={handleToggleStatus}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, gap: 8 },
  statusPillOnline: { backgroundColor: 'rgba(0, 212, 255, 0.15)', borderWidth: 1, borderColor: '#00D4FF' },
  statusPillOffline: { backgroundColor: '#1f2937', borderWidth: 1, borderColor: '#374151' },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  statusIndicatorOnline: { backgroundColor: '#00D4FF' },
  statusIndicatorOffline: { backgroundColor: '#6b7280' },
  statusText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  fabLocation: { position: 'absolute', right: 16, bottom: '35%', width: 50, height: 50, borderRadius: 25, backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  onlineDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 212, 255, 0.3)', justifyContent: 'center', alignItems: 'center' },
  onlineDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00D4FF' },
  offlineDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(107, 114, 128, 0.3)', justifyContent: 'center', alignItems: 'center' },
  offlineDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#9ca5b3' },
  bottomSheetBg: { backgroundColor: '#1f2937', borderRadius: 24 },
  bottomSheetContent: { padding: 24 },
  driverInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greetingText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  zoneText: { fontSize: 14, color: '#9ca5b3', marginTop: 4 },
  earningsBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  earningsLabel: { color: '#10b981', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  earningsValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#374151', borderRadius: 16, padding: 12, alignItems: 'center', gap: 8 },
  statBoxValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
