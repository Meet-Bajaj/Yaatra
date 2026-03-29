import React from 'react';
import { View } from 'react-native';

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <View className="elevation-xl absolute bottom-0 h-2/3 w-full rounded-t-[36px] bg-surfaceLight px-8 pb-12 pt-10 shadow-2xl">
      {children}
    </View>
  );
}
