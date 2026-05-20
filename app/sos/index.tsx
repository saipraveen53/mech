import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function SOSScreen() {
  const [problemDescription, setProblemDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendSOS = async () => {
    if (!problemDescription.trim()) {
      Alert.alert(
        'Description Required',
        'Please describe your vehicle problem.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Use replace instead of push to avoid navigation stack issues
      router.replace({
        pathname: '/sos/tracking',
        params: { problem: problemDescription }
      });
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="car" size={40} color="#dc2626" />
            </View>
            <Text style={styles.title}>Emergency SOS</Text>
            <Text style={styles.subtitle}>Describe what happened to your vehicle</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <Ionicons name="create-outline" size={22} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Car stopped suddenly, making strange noise, battery completely dead, engine overheating..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                value={problemDescription}
                onChangeText={setProblemDescription}
                textAlignVertical="top"
                autoFocus={true}
              />
            </View>
            <Text style={styles.charCount}>
              {problemDescription.length}/500 characters
            </Text>
          </View>

          {/* SOS Button */}
          <TouchableOpacity 
            style={[styles.sosButton, loading && styles.sosButtonDisabled]} 
            onPress={handleSendSOS} 
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.sosButtonContent}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="alert-circle" size={32} color="white" />
              )}
              <Text style={styles.sosButtonText}>
                {loading ? 'SENDING SOS...' : 'SEND SOS REQUEST'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Info Message */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={18} color="#9ca3af" />
            <Text style={styles.infoText}>
              Nearby mechanics will be notified immediately
            </Text>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 160,
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    padding: 0,
    margin: 0,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  sosButton: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sosButtonDisabled: {
    backgroundColor: '#f87171',
    opacity: 0.7,
  },
  sosButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});