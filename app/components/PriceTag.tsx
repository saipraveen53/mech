
import { StyleSheet, Text, View } from 'react-native';

type Props = { price: number; label?: string };

export default function PriceTag({ price, label = 'Estimate' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.price}>₹{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  label: { fontSize: 10, color: '#0369a1' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#0c4a6e' },
});