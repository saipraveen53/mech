
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MechanicCard from '../components/MechanicCard';

const dummyMechanics = [
  { id: '1', name: 'Raju Mechanic', rating: 4.5, distance: 1.2, price: { tyre: 100, battery: 200 }, phone: '9999999999' },
  { id: '2', name: 'Sreenu Garage', rating: 4.2, distance: 2.0, price: { tyre: 120, battery: 220 }, phone: '8888888888' },
];

export default function MechanicListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Mechanics Nearby</Text>
      <FlatList
        data={dummyMechanics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MechanicCard mechanic={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});