import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { LoadingView } from '../../components/LoadingView';
import { useAsyncData } from '../../hooks/useAsyncData';
import { userService } from '../../services/userService';

export default function PassengerWallet() {
  const profileState = useAsyncData(() => userService.getMyProfile(), []);

  if (profileState.loading && !profileState.data) {
    return <LoadingView message="Loading wallet..." />;
  }

  const transactions = [
    { id: 1, type: 'ride', amount: -150, title: 'Ride to Airport', date: 'Today, 10:30 AM', icon: 'car' },
    { id: 2, type: 'topup', amount: 500, title: 'Wallet Top-up', date: 'Yesterday, 6:45 PM', icon: 'add-circle' },
    { id: 3, type: 'ride', amount: -85, title: 'Ride to Connaught Place', date: 'Apr 19, 2:15 PM', icon: 'car' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#00d4ff', letterSpacing: 2, textTransform: 'uppercase' }}>Wallet</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>Your Balance</Text>

        {/* Balance Card */}
        <BlurView intensity={20} tint="light" style={{ overflow: 'hidden', borderRadius: 24, marginTop: 24, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Text style={{ fontSize: 14, color: '#9ca5b3', fontWeight: '500' }}>Available Balance</Text>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginTop: 8 }}>
            ₹{profileState.data?.walletBalance ?? 0}
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#00d4ff', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Ionicons name="add" size={20} color="#000" />
              <Text style={{ color: '#000', fontWeight: '700', fontSize: 16 }}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Send</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Payment Methods */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 32, marginBottom: 16 }}>Payment Methods</Text>
        <View style={{ gap: 12 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(0, 212, 255, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="card" size={20} color="#00d4ff" />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>•••• 4242</Text>
              <Text style={{ color: '#9ca5b3', fontSize: 14, marginTop: 2 }}>Expires 12/26</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <Ionicons name="add-circle-outline" size={24} color="#00d4ff" />
            <Text style={{ color: '#00d4ff', fontWeight: '600', fontSize: 16, marginLeft: 12 }}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 32, marginBottom: 16 }}>Recent Transactions</Text>
        <View style={{ gap: 16 }}>
          {transactions.map((tx) => (
            <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: tx.type === 'ride' ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={tx.icon as any} size={20} color={tx.type === 'ride' ? '#9ca5b3' : '#10b981'} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{tx.title}</Text>
                <Text style={{ color: '#9ca5b3', fontSize: 13, marginTop: 2 }}>{tx.date}</Text>
              </View>
              <Text style={{ color: tx.amount > 0 ? '#10b981' : '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
