import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { EmptyState } from '../../components/EmptyState';
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
  const [driverProfile, setDriverProfile] = useState<Awaited<
    ReturnType<typeof driverService.getMyDriverProfile>
  > | null>(null);

  useEffect(() => {
    driverService
      .getMyDriverProfile()
      .then((profile) => {
        setDriverProfile(profile);
        setLicenseNumber(profile.licenseNumber || '');
        setOperatingZone(profile.operatingZone || '');
        setRegistrationNumber(
          profile.vehicle?.registrationNumber || profile.vehicle?.reg_number || ''
        );
        setCapacity(String(profile.vehicle?.capacity || profile.vehicle?.capicity || ''));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!driverProfile) {
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await driverService.upsertProfile({
        licenseNumber,
        operatingZone,
        vehicleId: driverProfile.vehicle?._id || null,
      });

      const updatedVehicle = await vehicleService.registerVehicle({
        type: driverProfile.vehicle?.type || 'RICKSHAW',
        registrationNumber,
        capacity: Number(capacity),
      });

      setDriverProfile({
        ...updatedProfile,
        vehicle: updatedVehicle,
      });

      Toast.show({
        type: 'success',
        text1: 'Driver profile updated',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView message="Loading driver profile..." />;
  }

  if (!driverProfile) {
    return (
      <SafeAreaView className="bg-backgroundLight flex-1 px-4 pt-6">
        <EmptyState
          title="Driver profile missing"
          description="Complete onboarding before editing your profile."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6">
        <Text className="text-sm uppercase tracking-[2px] text-primary">Driver</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Profile</Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <FormInput
            label="License number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="DL-1234-567890"
          />
          <FormInput
            label="Operating zone"
            value={operatingZone}
            onChangeText={setOperatingZone}
            placeholder="Nagpur Central"
          />
          <FormInput
            label="Registration number"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            placeholder="MH12AB1234"
          />
          <FormInput
            label="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="number-pad"
            placeholder="3"
          />
          <Button
            title={saving ? 'Saving...' : 'Save profile'}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
