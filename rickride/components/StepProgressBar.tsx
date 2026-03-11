import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../constants/theme';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-2">
        {steps.map((step, index) => (
          <Text 
            key={index} 
            className={`text-xs font-bold ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}
          >
            {step}
          </Text>
        ))}
      </View>
      <View className="flex-row justify-between items-center h-2 bg-gray-200 rounded-full overflow-hidden">
        <View 
          className="absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </View>
    </View>
  );
}
