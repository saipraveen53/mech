
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VehicleDetails() {
  const [vehicleNo, setVehicleNo] = useState('TS09AB1234');
  const [model, setModel] = useState('Honda Activa');

  const handleSave = () => {
    // Save logic
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vehicle Number</Text>
      <TextInput style={styles.input} value={vehicleNo} onChangeText={setVehicleNo} />
      <Text style={styles.label}>Model</Text>
      <TextInput style={styles.input} value={model} onChangeText={setModel} />
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '500', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  saveBtn: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 8, marginTop: 30 },
  saveText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});