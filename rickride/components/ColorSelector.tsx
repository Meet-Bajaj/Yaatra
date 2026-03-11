import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const COLORS = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#808080'];

interface ColorSelectorProps {
  label: string;
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorSelector({ label, selectedColor, onSelect }: ColorSelectorProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row">
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => onSelect(color)}
            className={`w-10 h-10 rounded-full mr-3 border-2 ${
              selectedColor === color ? 'border-primary' : 'border-gray-200'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </View>
    </View>
  );
}
