import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { driverService } from '../../services/driverService';

export default function DriverEarnings() {
  const profileState = useAsyncData(() => driverService.getMyDriverProfile(), []);

  if (profileState.loading && !profileState.data) {
    return <LoadingView message="Loading earnings..." />;
  }

  const transactions = [
    { id: 1, type: 'ride', amount: 150, title: 'Ride to Airport', date: 'Today, 10:30 AM', icon: 'car-sport' },
    { id: 2, type: 'ride', amount: 85, title: 'Ride to Connaught Place', date: 'Yesterday, 2:15 PM', icon: 'car-sport' },
    { id: 3, type: 'payout', amount: -500, title: 'Bank Transfer', date: 'Apr 18, 6:00 PM', icon: 'cash' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase' }}>Driver</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>Your Earnings</Text>

        {/* Total Earnings Card */}
        <BlurView intensity={20} tint="light" style={{ overflow: 'hidden', borderRadius: 24, marginTop: 24, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 14, color: '#9ca5b3', fontWeight: '500' }}>Total Balance</Text>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>
                ₹{profileState.data?.earnings || 0}
              </Text>
            </View>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0, 212, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00d4ff' }}>
              <Ionicons name="wallet-outline" size={32} color="#00d4ff" />
            </View>
          </View>
          
          <TouchableOpacity style={{ marginTop: 24, backgroundColor: '#00d4ff', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Ionicons name="cash-outline" size={20} color="#000" />
            <Text style={{ color: '#000', fontWeight: '700', fontSize: 16 }}>Withdraw Funds</Text>
          </TouchableOpacity>
        </BlurView>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
          <BlurView intensity={20} tint="light" style={{ flex: 1, overflow: 'hidden', borderRadius: 24, padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
            </View>
            <Text style={{ color: '#9ca5b3', fontSize: 13, fontWeight: '500' }}>Completed Rides</Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>{profileState.data?.totalRides || 0}</Text>
          </BlurView>
          
          <BlurView intensity={20} tint="light" style={{ flex: 1, overflow: 'hidden', borderRadius: 24, padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245, 158, 11, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="star-outline" size={24} color="#f59e0b" />
            </View>
            <Text style={{ color: '#9ca5b3', fontSize: 13, fontWeight: '500' }}>Driver Rating</Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>{profileState.data?.rating || '4.8'}</Text>
          </BlurView>
        </View>

        {/* Recent Activity */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 32, marginBottom: 16 }}>Recent Activity</Text>
        <View style={{ gap: 16 }}>
          {transactions.map((tx) => (
            <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: tx.amount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={tx.icon as any} size={24} color={tx.amount > 0 ? '#10b981' : '#f87171'} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{tx.title}</Text>
                <Text style={{ color: '#9ca5b3', fontSize: 13, marginTop: 2 }}>{tx.date}</Text>
              </View>
              <Text style={{ color: tx.amount > 0 ? '#10b981' : '#f87171', fontWeight: 'bold', fontSize: 16 }}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
