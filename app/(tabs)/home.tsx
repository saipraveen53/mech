import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MechanicCard from '../components/MechanicCard';
import SOSButton from '../components/SOSButton';

// Dummy data – later replace with API
const dummyMechanics = [
  { id: '1', name: 'Raju Mechanic', rating: 4.5, distance: 1.2, price: { tyre: 100, battery: 200 }, phone: '9999999999' },
  { id: '2', name: 'Sreenu Garage', rating: 4.2, distance: 2.0, price: { tyre: 120, battery: 220 }, phone: '8888888888' },
];

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial location load - only once when app starts
  useEffect(() => {
    if (isInitialLoad) {
      getLocationPermission();
    }
  }, [isInitialLoad]);

  // When screen comes into focus (from SOS), just refresh map, no loading
  useFocusEffect(
    useCallback(() => {
      if (!isInitialLoad && userLocation) {
        // Just animate to existing location, don't reload
        mapRef.current?.animateToRegion(userLocation, 500);
      }
    }, [isInitialLoad, userLocation])
  );

  const getLocationPermission = async () => {
    try {
      setLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Location permission denied. Please enable from settings.');
        setLoading(false);
        Alert.alert(
          'Permission Required',
          'Please enable location permission to find nearby mechanics.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              // @ts-ignore
              onPress: () => Location.openSettings() 
            }
          ]
        );
        setIsInitialLoad(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      
      setUserLocation(newRegion);
      setErrorMsg(null);
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Location error:', error);
      setErrorMsg('Unable to get your location. Please try again.');
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to center map to current location
  const centerToUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      
      setUserLocation(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      
    } catch (error) {
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    }
  };

  // Loading state - only on initial app load
  if (loading && isInitialLoad) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#e11d48" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Error state
  if (errorMsg || !userLocation) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.errorText}>⚠️ {errorMsg || 'Location not available'}</Text>
        <Text style={styles.retryText} onPress={getLocationPermission}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <MapView
        ref={mapRef}
        style={styles.map}
        region={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        <Marker coordinate={userLocation} title="You are here" pinColor="red" />
        {dummyMechanics.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ 
              latitude: userLocation.latitude + (m.distance * 0.01), 
              longitude: userLocation.longitude + (m.distance * 0.008) 
            }}
            title={m.name}
            description={`${m.distance} km away`}
          />
        ))}
      </MapView>

      {/* Custom Location Button */}
      <TouchableOpacity style={styles.locationButton} onPress={centerToUserLocation}>
        <Ionicons name="locate" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Nearby Mechanics</Text>
        <FlatList
          data={dummyMechanics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MechanicCard mechanic={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <SOSButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1, minHeight: 250 },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1f2937' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  retryText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  locationButton: {
    position: 'absolute',
    bottom: 260,
    right: 20,
    backgroundColor: '#3b82f6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
});