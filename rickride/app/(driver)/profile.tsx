import { useEffect, useState } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { LoadingView } from '../../components/LoadingView';
import { driverService } from '../../services/driverService';
import { vehicleService } from '../../services/vehicleService';

export default function DriverProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [operatingZone, setOperatingZone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [driverProfile, setDriverProfile] = useState<Awaited<ReturnType<typeof driverService.getMyDriverProfile>> | null>(null);

  useEffect(() => {
    driverService
      .getMyDriverProfile()
      .then((profile) => {
        setDriverProfile(profile);
        setLicenseNumber(profile.licenseNumber || '');
        setOperatingZone(profile.operatingZone || '');
        setRegistrationNumber(profile.vehicle?.registrationNumber || profile.vehicle?.reg_number || '');
        setCapacity(String(profile.vehicle?.capacity || profile.vehicle?.capicity || ''));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!driverProfile) return;
    setSaving(true);
    try {
      const updatedProfile = await driverService.upsertProfile({ licenseNumber, operatingZone, vehicleId: driverProfile.vehicle?._id || null });
      const updatedVehicle = await vehicleService.registerVehicle({ type: driverProfile.vehicle?.type || 'RICKSHAW', registrationNumber, capacity: Number(capacity) });
      setDriverProfile({ ...updatedProfile, vehicle: updatedVehicle });
      Toast.show({ type: 'success', text1: 'Driver profile updated' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView message="Loading driver profile..." />;
  }

  if (!driverProfile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Ionicons name="id-card-outline" size={64} color="#9ca5b3" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 16 }}>Profile Missing</Text>
        <Text style={{ color: '#9ca5b3', textAlign: 'center', marginTop: 8 }}>Complete onboarding before editing your profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase' }}>Driver</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>Your Profile</Text>

        <BlurView intensity={20} tint="light" style={{ overflow: 'hidden', borderRadius: 24, marginTop: 24, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0, 212, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00d4ff' }}>
              <Ionicons name="id-card" size={40} color="#00d4ff" />
            </View>
          </View>

          <Text style={{ color: '#9ca5b3', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>License Number</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16 }}>
            <Ionicons name="card-outline" size={20} color="#9ca5b3" />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 }}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              placeholder="DL-1234-567890"
              placeholderTextColor="#6b7280"
            />
          </View>

          <Text style={{ color: '#9ca5b3', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Operating Zone</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16 }}>
            <Ionicons name="map-outline" size={20} color="#9ca5b3" />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 }}
              value={operatingZone}
              onChangeText={setOperatingZone}
              placeholder="Nagpur Central"
              placeholderTextColor="#6b7280"
            />
          </View>

          <Text style={{ color: '#9ca5b3', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Registration Number</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16 }}>
            <Ionicons name="car-sport-outline" size={20} color="#9ca5b3" />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 }}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              placeholder="MH12AB1234"
              placeholderTextColor="#6b7280"
            />
          </View>

          <Text style={{ color: '#9ca5b3', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Vehicle Capacity</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 24 }}>
            <Ionicons name="people-outline" size={20} color="#9ca5b3" />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 }}
              value={capacity}
              onChangeText={setCapacity}
              placeholder="3"
              placeholderTextColor="#6b7280"
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity 
            onPress={handleSave} 
            disabled={saving}
            style={{ backgroundColor: '#00d4ff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', opacity: saving ? 0.7 : 1 }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>{saving ? 'Saving...' : 'Save Profile'}</Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}
