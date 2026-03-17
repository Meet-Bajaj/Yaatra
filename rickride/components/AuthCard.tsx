import React from 'react';
import { View } from 'react-native';

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <View className="bg-surfaceLight rounded-t-[36px] px-8 pt-10 pb-12 w-full shadow-2xl elevation-xl absolute bottom-0 h-2/3">
      {children}
    </View>
  );
}
