import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MechanicDetails() {
  const { id } = useLocalSearchParams();
  // Fetch details using id from API
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Raju Mechanic</Text>
      <Text style={styles.rating}>⭐ 4.5 (120 ratings)</Text>
      <Text style={styles.distance}>📍 1.2 km away</Text>
      <Text style={styles.price}>Tyre Puncture: ₹150</Text>
      <Text style={styles.price}>Battery Dead: ₹200</Text>
      <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/mechanic/booking')}>
        <Text style={styles.bookText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold' },
  rating: { fontSize: 16, marginTop: 4, color: '#6b7280' },
  distance: { fontSize: 14, marginTop: 8 },
  price: { fontSize: 16, marginTop: 12, color: '#059669' },
  bookBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  bookText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});