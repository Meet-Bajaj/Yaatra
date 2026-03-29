import React from 'react';
import { Text, View } from 'react-native';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number;
}

export function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
  return (
    <View className="mb-6">
      <View className="mb-2 flex-row justify-between">
        {steps.map((step, index) => (
          <Text
            key={step}
            className={`text-xs font-bold ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
            {step}
          </Text>
        ))}
      </View>
      <View className="h-2 flex-row items-center justify-between overflow-hidden rounded-full bg-gray-200">
        <View
          className="absolute bottom-0 left-0 top-0 rounded-full bg-primary transition-all"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </View>
    </View>
  );
}
