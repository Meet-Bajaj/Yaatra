import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OPTIONS = [
  { id: 'auto', title: 'Auto', icon: 'car-sport' },
  { id: 'pool', title: 'Pool', icon: 'people' },
  { id: 'rentals', title: 'Rentals', icon: 'time' },
  { id: 'later', title: 'Later', icon: 'calendar' },
];

export function RideOptionTabs() {
  const [selected, setSelected] = useState('auto');

  return (
    <View className="mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;

          return (
            <TouchableOpacity
              key={opt.id}
              className={`mr-3 flex-row items-center rounded-full px-5 py-2.5 ${
                isSelected ? 'bg-primary shadow-md' : 'border border-gray-200 bg-surfaceLight'
              }`}
              onPress={() => setSelected(opt.id)}>
              <Ionicons name={opt.icon as any} size={18} color={isSelected ? 'white' : 'black'} />
              <Text
                className={`ml-2 text-[15px] font-bold ${
                  isSelected ? 'text-white' : 'text-surfaceDark'
                }`}>
                {opt.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
