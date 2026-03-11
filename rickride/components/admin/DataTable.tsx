import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View className="bg-surfaceLight rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View className="flex-row bg-gray-50 p-4 border-b border-gray-200">
            {columns.map(col => (
              <View key={col.key} className="w-40 mr-4">
                <Text className="font-bold text-gray-500">{col.title}</Text>
              </View>
            ))}
            <View className="w-20"><Text className="font-bold text-gray-500">Actions</Text></View>
          </View>

          {/* Body */}
          {data.map((row, idx) => (
            <View key={idx} className="flex-row p-4 border-b border-gray-100 items-center">
              {columns.map(col => (
                <View key={col.key} className="w-40 mr-4 flex-row items-center">
                  <Text className="text-surfaceDark" numberOfLines={1}>{String(row[col.key])}</Text>
                </View>
              ))}
              <View className="w-20 flex-row">
                <Ionicons name="create-outline" size={20} color="blue" style={{ marginRight: 10 }} />
                <Ionicons name="trash-outline" size={20} color="red" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
