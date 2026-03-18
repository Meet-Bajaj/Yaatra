import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  index?: number;
}

export function DashboardWidget({ title, value, icon, trend, trendUp, index = 0 }: DashboardWidgetProps) {
  return (
    <Animated.View 
      entering={FadeInRight.duration(400).delay(index * 100)} 
      style={{ flex: 1, minWidth: 200, margin: 8 }}
    >
      <Pressable className="bg-surfaceLight p-4 rounded-xl shadow-md border border-gray-100 flex-1 transition-all hover:shadow-lg active:scale-95 active:bg-gray-50">
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
      </Pressable>
    </Animated.View>
  );
}
