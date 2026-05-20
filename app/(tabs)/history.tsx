import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        <Text style={styles.title}>Service History</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No service history yet.</Text>
          <Text style={styles.emptySubText}>Your completed services will appear here.</Text>
        </View>
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
    backgroundColor: '#fff',
    paddingTop: 32, // Small padding for better spacing
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    color: '#1f2937' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    fontSize: 16, 
    color: '#6b7280' 
  },
  emptySubText: { 
    fontSize: 14, 
    color: '#9ca3af', 
    marginTop: 8 
  },
});