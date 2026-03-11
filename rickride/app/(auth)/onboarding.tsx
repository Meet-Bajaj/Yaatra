import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { StepProgressBar } from '../../components/StepProgressBar';
import { FormInput } from '../../components/FormInput';
import { DropdownSelect } from '../../components/DropdownSelect';
import { ColorSelector } from '../../components/ColorSelector';
import { UploadCard } from '../../components/UploadCard';
import { Button } from '../../components/Button';

const STEPS = ['Personal', 'Vehicle', 'Payment'];

export default function DriverOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // Starting at 1 (Vehicle) for prototype focus
  const [vehicleColor, setVehicleColor] = useState('#FFFFFF');
  const [rcFrontUploaded, setRcFrontUploaded] = useState(false);
  const [rcBackUploaded, setRcBackUploaded] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(driver)' as Href); // Go to Driver Dashboard
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-backgroundLight relative px-4 pt-6">
      <Text className="text-3xl font-bold text-surfaceDark mb-6">Onboarding</Text>
      
      <StepProgressBar steps={STEPS} currentStep={currentStep} />
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {currentStep === 1 && (
          <View className="mb-8">
            <Text className="text-xl font-bold text-surfaceDark mb-4">Vehicle Details</Text>
            
            <DropdownSelect 
              label="Vehicle Type" 
              value="Auto Rickshaw" 
              placeholder="Select Type" 
              onPress={() => {}} 
            />
            
            <FormInput label="Vehicle Model" placeholder="e.g. Bajaj RE Compact" />
            <FormInput label="License Plate Number" placeholder="e.g. MH12AB1234" />
            
            <ColorSelector 
              label="Vehicle Color" 
              selectedColor={vehicleColor} 
              onSelect={setVehicleColor} 
            />

            <Text className="text-sm font-semibold text-gray-700 mt-2 mb-2">Registration Certificate (RC)</Text>
            <View className="flex-row justify-between w-full">
              <View className="flex-1 mr-2">
                <UploadCard 
                  label="RC Front" 
                  uploaded={rcFrontUploaded} 
                  onPress={() => setRcFrontUploaded(true)} 
                />
              </View>
              <View className="flex-1 ml-2">
                <UploadCard 
                  label="RC Back" 
                  uploaded={rcBackUploaded} 
                  onPress={() => setRcBackUploaded(true)} 
                />
              </View>
            </View>
            
            <Text className="text-sm font-semibold text-gray-700 mt-2 mb-2">Vehicle Photos</Text>
            <View className="flex-row justify-between w-full">
              <View className="flex-1 mr-2">
                <UploadCard label="Front Photo" onPress={() => {}} />
              </View>
              <View className="flex-1 ml-2">
                <UploadCard label="Back Photo" onPress={() => {}} />
              </View>
            </View>
          </View>
        )}
        
        {currentStep !== 1 && (
          <View className="mb-8 h-64 justify-center items-center bg-surfaceLight rounded-xl mt-4">
             <Text className="text-gray-500 font-bold">{STEPS[currentStep]} Details form</Text>
          </View>
        )}
        
        <View className="mb-10">
          <Button title="Continue" onPress={handleNext} />
        </View>
      </ScrollView>

      {/* Back Button Overlay */}
      <View className="absolute top-6 right-4 bg-gray-200 rounded-full shadow px-4 py-2">
        <Text onPress={() => router.replace('/(auth)')} className="text-gray-600 font-bold">Exit</Text>
      </View>
    </SafeAreaView>
  );
}
