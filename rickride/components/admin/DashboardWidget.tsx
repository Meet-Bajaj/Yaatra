import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export function DashboardWidget({ title, value, icon, trend, trendUp }: DashboardWidgetProps) {
  return (
    <View className="bg-surfaceLight p-4 rounded-xl shadow-sm border border-gray-100 flex-1 min-w-[200px] m-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-500 font-semibold">{title}</Text>
        <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center">
          <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
        </View>
      </View>
      <Text className="text-3xl font-bold text-surfaceDark mb-2">{value}</Text>
      {trend && (
        <View className="flex-row items-center">
          <Ionicons 
            name={trendUp ? "trending-up" : "trending-down"} 
            size={16} 
            color={trendUp ? "green" : "red"} 
          />
          <Text className={`ml-1 font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </Text>
          <Text className="text-gray-400 text-xs ml-1">vs last month</Text>
        </View>
      )}
    </View>
  );
}
