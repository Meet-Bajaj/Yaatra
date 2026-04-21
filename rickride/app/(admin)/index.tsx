import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { adminService } from '../../services/adminService';
import { useAuthStore } from '../../store/useAuthStore';
import { theme } from '../../constants/theme';

export default function AdminDashboard() {
  const { width } = useWindowDimensions();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  const statsState = useAsyncData(async () => {
    if (!token || user?.role !== 'admin') {
      return null;
    }
    return adminService.getStats();
  }, [token, user?.role]);

  if (statsState.loading && !statsState.data) {
    return <LoadingView message="Loading dashboard overview..." />;
  }

  const isDesktop = width >= 768;

  const cards = [
    { label: 'Total Users', value: statsState.data?.totalUsers || 0, icon: 'people', color: '#3b82f6', trend: '+12%' },
    { label: 'Active Drivers', value: statsState.data?.totalDrivers || 0, icon: 'car', color: '#10b981', trend: '+5%' },
    { label: 'Total Trips', value: statsState.data?.totalTrips || 0, icon: 'map', color: '#8b5cf6', trend: '+18%' },
    { label: 'Revenue (INR)', value: `₹${(statsState.data?.totalPayments || 0).toLocaleString()}`, icon: 'wallet', color: '#f59e0b', trend: '+22%' },
  ];

  return (
    <View style={[styles.container, { padding: isDesktop ? 32 : 16 }]}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>Overview Dashboard</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 4 }}>Monitor your platform's key performance metrics.</Text>
      </View>

      {/* KPI Cards */}
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24, marginBottom: 32 }}>
        {cards.map((card) => (
          <View key={card.label} style={[styles.card, { flex: isDesktop ? 1 : undefined }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{card.label}</Text>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827', marginTop: 8 }}>{card.value}</Text>
              </View>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${card.color}15`, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={card.icon as any} size={24} color={card.color} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
              <Ionicons name="trending-up" size={16} color="#10b981" />
              <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600', marginLeft: 4 }}>{card.trend}</Text>
              <Text style={{ fontSize: 14, color: '#9ca5b3', marginLeft: 4 }}>from last month</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Main Content Area (Charts / Tables Placeholder) */}
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24 }}>
        <View style={[styles.card, { flex: 2, minHeight: 400 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 24 }}>Revenue & Rides Overview</Text>
          <View style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed' }}>
            <Ionicons name="bar-chart-outline" size={48} color="#d1d5db" />
            <Text style={{ color: '#9ca5b3', marginTop: 12, fontWeight: '500' }}>Chart Visualization Area</Text>
          </View>
        </View>
        
        <View style={[styles.card, { flex: 1, minHeight: 400 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 24 }}>Recent Activity</Text>
          <View style={{ gap: 16 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: i === 5 ? 0 : 1, borderBottomColor: '#f3f4f6', paddingBottom: i === 5 ? 0 : 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="car-outline" size={20} color="#6b7280" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>New ride requested</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>From Connaught Place to Airport</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9ca5b3' }}>{i * 10}m ago</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  }
});
