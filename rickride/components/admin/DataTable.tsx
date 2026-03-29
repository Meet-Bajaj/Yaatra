import React from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInLeft } from 'react-native-reanimated';

interface Column {
  key: string;
  title: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <View className="w-full overflow-hidden rounded-xl border border-gray-100 bg-surfaceLight shadow-sm">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View className="flex-row border-b border-gray-200 bg-gray-50 p-4">
            {columns.map((col) => (
              <View key={col.key} className="mr-4 w-40">
                <Text className="font-bold text-gray-500">{col.title}</Text>
              </View>
            ))}
            <View className="w-20">
              <Text className="font-bold text-gray-500">Actions</Text>
            </View>
          </View>

          {/* Body */}
          {data.map((row, idx) => (
            <Animated.View key={idx} entering={FadeInLeft.duration(300).delay(idx * 100)}>
              <Pressable className="flex-row items-center border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
                {columns.map((col) => (
                  <View key={col.key} className="mr-4 w-40 flex-row items-center">
                    <Text className="text-surfaceDark" numberOfLines={1}>
                      {String(row[col.key])}
                    </Text>
                  </View>
                ))}
                <View className="w-20 flex-row">
                  <TouchableOpacity activeOpacity={0.7} style={{ marginRight: 10 }}>
                    <Ionicons name="create-outline" size={20} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
