import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

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
              className={`mr-3 py-2.5 px-5 rounded-full flex-row items-center ${
                isSelected ? 'bg-primary shadow-md' : 'bg-surfaceLight border border-gray-200'
              }`}
              onPress={() => setSelected(opt.id)}
            >
              <Ionicons 
                name={opt.icon as any} 
                size={18} 
                color={isSelected ? 'white' : 'black'} 
              />
              <Text 
                className={`ml-2 font-bold text-[15px] ${
                  isSelected ? 'text-white' : 'text-surfaceDark'
                }`}
              >
                {opt.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
