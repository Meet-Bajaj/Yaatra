import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { StepProgressBar } from '../../components/StepProgressBar';
import { roleRoutes } from '../../constants/config';
import { driverService } from '../../services/driverService';
import { vehicleService } from '../../services/vehicleService';
import { useAuthStore } from '../../store/useAuthStore';

const steps = ['Driver', 'Vehicle'];

export default function DriverOnboarding() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [licenseNumber, setLicenseNumber] = useState('');
  const [operatingZone, setOperatingZone] = useState('');
  const [vehicleType, setVehicleType] = useState<'CAR' | 'RICKSHAW'>('RICKSHAW');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [capacity, setCapacity] = useState('3');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    setSubmitting(true);

    try {
      await driverService.upsertProfile({
        userId: user?._id,
        licenseNumber,
        operatingZone,
      });

      await vehicleService.registerVehicle({
        driverId: user?._id,
        type: vehicleType,
        registrationNumber,
        capacity: Number(capacity),
        make: make || undefined,
        model: model || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Driver profile ready',
        text2: 'You can now start accepting rides.',
      });

      router.replace(user ? roleRoutes[user.role] : '/(driver)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-backgroundLight flex-1 px-4 pt-6">
      <Text className="mb-6 text-3xl font-bold text-surfaceDark">Driver onboarding</Text>

      <StepProgressBar steps={steps} currentStep={currentStep} />

      <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
        {currentStep === 0 ? (
          <View className="rounded-3xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-xl font-bold text-surfaceDark">Driver profile</Text>
            <FormInput
              label="License number"
              placeholder="DL-1234-567890"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />
            <FormInput
              label="Operating zone"
              placeholder="Nagpur Central"
              value={operatingZone}
              onChangeText={setOperatingZone}
            />
            <Text className="mt-3 text-sm text-gray-500">
              Document uploads are available on the backend, but this Expo app does not yet include
              a native file-picker dependency.
            </Text>
          </View>
        ) : (
          <View className="rounded-3xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-xl font-bold text-surfaceDark">Vehicle details</Text>
            <Text className="mb-2 text-sm font-semibold text-gray-700">Vehicle type</Text>
            <View className="mb-4 flex-row gap-2">
              {(['RICKSHAW', 'CAR'] as const).map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setVehicleType(item)}
                  className={`flex-1 rounded-2xl border px-3 py-3 ${
                    vehicleType === item
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 bg-white'
                  }`}>
                  <Text className="text-center font-medium text-surfaceDark">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FormInput
              label="Registration number"
              placeholder="MH12AB1234"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
            />
            <FormInput
              label="Capacity"
              placeholder="3"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="number-pad"
            />
            <FormInput label="Make" placeholder="Bajaj" value={make} onChangeText={setMake} />
            <FormInput
              label="Model"
              placeholder="RE Compact"
              value={model}
              onChangeText={setModel}
            />
          </View>
        )}

        <View className="mb-10 mt-6">
          <Button
            title={submitting ? 'Saving...' : currentStep === 0 ? 'Continue' : 'Finish setup'}
            onPress={handleNext}
            disabled={
              submitting ||
              !licenseNumber ||
              (currentStep === 1 && (!registrationNumber || !capacity))
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
