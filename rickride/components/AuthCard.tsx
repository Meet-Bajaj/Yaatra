import React from 'react';
import { View } from 'react-native';

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <View className="bg-surfaceLight rounded-t-3xl p-6 w-full shadow-lg absolute bottom-0 h-2/3">
      {children}
    </View>
  );
}
