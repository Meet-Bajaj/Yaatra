import React from 'react';
import { View, Text, FlatList } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-white p-6 pt-16">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Your Rides</Text>
      <FlatList 
        data={[1, 2, 3]}
        renderItem={({item}) => (
          <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold text-lg">Auto Rickshaw</Text>
              <Text className="text-gray-500">12 Apr 2024, 10:30 AM</Text>
            </View>
            <Text className="font-bold text-gray-800 text-lg">₹{item * 50}</Text>
          </View>
        )}
        keyExtractor={i => i.toString()}
      />
    </View>
  );
}
