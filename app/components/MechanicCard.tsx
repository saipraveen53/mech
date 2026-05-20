import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Mechanic = {
  id: string;
  name: string;
  rating: number;
  distance: number;
  price: { tyre: number; battery: number };
  phone: string;
};

export default function MechanicCard({ mechanic }: { mechanic: Mechanic }) {
  const handleBook = () => {
    router.push({ pathname: '/mechanic/details', params: { id: mechanic.id } });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${mechanic.phone}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{mechanic.name}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text style={styles.ratingText}>{mechanic.rating}</Text>
        </View>
      </View>
      <Text style={styles.distance}>{mechanic.distance} km away</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>🔧 Tyre: ₹{mechanic.price.tyre}</Text>
        <Text style={styles.price}>🔋 Battery: ₹{mechanic.price.battery}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={18} color="white" />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Ionicons name="car" size={18} color="white" />
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e7eb', paddingHorizontal: 6, borderRadius: 12 },
  ratingText: { marginLeft: 4, fontSize: 12, fontWeight: '500' },
  distance: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  priceRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  price: { fontSize: 12, color: '#059669', fontWeight: '500' },
  buttonRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
  callButton: { flexDirection: 'row', backgroundColor: '#3b82f6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', flex: 1, justifyContent: 'center', gap: 6 },
  bookButton: { flexDirection: 'row', backgroundColor: '#10b981', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', flex: 1, justifyContent: 'center', gap: 6 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 14 },
});