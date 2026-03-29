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

export function DashboardWidget({
  title,
  value,
  icon,
  trend,
  trendUp,
  index = 0,
}: DashboardWidgetProps) {
  return (
    <Animated.View
      entering={FadeInRight.duration(400).delay(index * 100)}
      style={{ flex: 1, minWidth: 200, margin: 8 }}>
      <Pressable className="flex-1 rounded-xl border border-gray-100 bg-surfaceLight p-4 shadow-md transition-all hover:shadow-lg active:scale-95 active:bg-gray-50">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-semibold text-gray-500">{title}</Text>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
          </View>
        </View>
        <Text className="mb-2 text-3xl font-bold text-surfaceDark">{value}</Text>
        {trend && (
          <View className="flex-row items-center">
            <Ionicons
              name={trendUp ? 'trending-up' : 'trending-down'}
              size={16}
              color={trendUp ? 'green' : 'red'}
            />
            <Text className={`ml-1 font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </Text>
            <Text className="ml-1 text-xs text-gray-400">vs last month</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
