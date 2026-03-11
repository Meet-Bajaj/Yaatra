import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/Button';

const MOCK_USERS = [
  { id: 'U-001', name: 'John Doe', phone: '+919876543210', role: 'Passenger', status: 'Active' },
  { id: 'U-002', name: 'Alice Smith', phone: '+919865432109', role: 'Driver', status: 'Active' },
  { id: 'U-003', name: 'Bob Johnson', phone: '+919812345670', role: 'Passenger', status: 'Suspended' },
  { id: 'U-004', name: 'Emma Davis', phone: '+919876501234', role: 'Passenger', status: 'Active' },
];

const COLUMNS = [
  { key: 'id', title: 'User ID' },
  { key: 'name', title: 'Full Name' },
  { key: 'phone', title: 'Phone' },
  { key: 'role', title: 'Role' },
  { key: 'status', title: 'Account Status' },
];

export default function AdminUsers() {
  return (
    <View className="flex-1 bg-surfaceLight rounded-xl p-6 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg text-gray-500">Manage all registered users on the platform</Text>
        <View className="w-40">
          <Button title="Add User" />
        </View>
      </View>
      
      <DataTable columns={COLUMNS} data={MOCK_USERS} />
    </View>
  );
}
