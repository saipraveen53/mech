import { router } from 'expo-router';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        <Text style={styles.name}>Ram Kumar</Text>
        <Text style={styles.detailText}>📞 9876543210</Text>
        <Text style={styles.detailText}>🚗 TS09AB1234</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile/edit')}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.vehicleBtn} onPress={() => router.push('/profile/vehicle')}>
          <Text style={styles.btnText}>Vehicle Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 37,
    gap: 12 
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#4b5563',
  },
  editBtn: { 
    backgroundColor: '#3b82f6', 
    padding: 14, 
    borderRadius: 12, 
    marginTop: 20,
    alignItems: 'center',
  },
  vehicleBtn: { 
    backgroundColor: '#10b981', 
    padding: 14, 
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});