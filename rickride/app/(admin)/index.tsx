import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DashboardWidget } from '../../components/admin/DashboardWidget';
import { DataTable } from '../../components/admin/DataTable';

const MOCK_TABLE_DATA = [
  { id: 'TRX-101', user: 'John Doe', driver: 'Ramesh K.', amount: '₹120', status: 'Completed', date: 'Oct 24, 2023' },
  { id: 'TRX-102', user: 'Alice Smith', driver: 'Suresh L.', amount: '₹85', status: 'Completed', date: 'Oct 24, 2023' },
  { id: 'TRX-103', user: 'Bob Johnson', driver: 'Amit P.', amount: '₹200', status: 'Cancelled', date: 'Oct 25, 2023' },
  { id: 'TRX-104', user: 'Emma Davis', driver: 'Rahul S.', amount: '₹150', status: 'In Progress', date: 'Oct 25, 2023' },
];

const COLUMNS = [
  { key: 'id', title: 'Ride ID' },
  { key: 'user', title: 'Passenger' },
  { key: 'driver', title: 'Driver' },
  { key: 'amount', title: 'Fare' },
  { key: 'status', title: 'Status' },
];

export default function AdminDashboard() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Top Widgets */}
      <View className="flex-row flex-wrap mb-8">
        <DashboardWidget title="Total Users" value="1,245" icon="people" trend="12%" trendUp={true} />
        <DashboardWidget title="Active Drivers" value="340" icon="car" trend="5%" trendUp={true} />
        <DashboardWidget title="Completed Rides" value="8,920" icon="map" trend="2%" trendUp={false} />
        <DashboardWidget title="Revenue" value="₹4.5L" icon="wallet" trend="18%" trendUp={true} />
      </View>

      {/* Recent Rides Table */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-4 px-2">
          <Text className="text-xl font-bold text-surfaceDark">Recent Rides</Text>
          <Text className="text-primary font-semibold cursor-pointer">View All</Text>
        </View>
        <DataTable columns={COLUMNS} data={MOCK_TABLE_DATA} />
      </View>
    </ScrollView>
  );
}
