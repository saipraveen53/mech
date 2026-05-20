import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock DB or persistent fallback values
const DEFAULT_USER = {
  name: 'Ram Kumar',
  phone: '+91 9876543210',
  email: 'ram.kumar@gmail.com',
  avatar: 'RK',
};



const DUMMY_PAYMENTS = [
  { id: 'tx_1', service: 'Emergency SOS - Tyre Puncture', date: 'May 18, 2026', amount: '₹600', method: 'UPI', status: 'Success' },
  { id: 'tx_2', service: 'General Service (Oil & Brake Check)', date: 'Apr 22, 2026', amount: '₹1,200', method: 'Card', status: 'Success' },
  { id: 'tx_3', service: 'Roadside Assistance - Battery Jump', date: 'Mar 10, 2026', amount: '₹350', method: 'Cash', status: 'Success' },
];

const DUMMY_ADDRESSES = [
  { id: 'addr_1', type: 'Home', address: 'Plot 42, Jubilee Hills, Hyderabad, TS - 500033' },
  { id: 'addr_2', type: 'Work', address: 'Building 1A, Mindspace Tech Park, Madhapur, Hyderabad, TS - 500081' },
];

export default function ProfileScreen() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Custom dialog visibility states
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const loadProfileData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user_profile');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        await AsyncStorage.setItem('@user_profile', JSON.stringify(DEFAULT_USER));
      }



      const storedNotifications = await AsyncStorage.getItem('@notifications_enabled');
      if (storedNotifications !== null) {
        setNotificationsEnabled(storedNotifications === 'true');
      }
    } catch (e) {
      console.error('Failed to load profile data:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const toggleNotifications = async () => {
    try {
      Haptics.selectionAsync();
      const nextValue = !notificationsEnabled;
      setNotificationsEnabled(nextValue);
      await AsyncStorage.setItem('@notifications_enabled', String(nextValue));
    } catch (e) {
      console.error('Failed to toggle notifications:', e);
    }
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Logged Out', 'You have been successfully logged out.');
            router.replace('/(tabs)/home');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />

      {/* Premium Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('App Settings', 'Version 1.0.4\nAll systems fully operational.');
          }}
        >
          <Ionicons name="cog-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Elite User Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarOuterRing}>
            <View style={styles.avatarInnerRing}>
              <Text style={styles.avatarText}>{user.avatar}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarEditBadge}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/profile/edit');
              }}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userContact}>{user.phone}  •  {user.email}</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/profile/edit');
            }}
          >
            <Ionicons name="create-outline" size={16} color="#3b82f6" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>



        {/* Section: Account & Services */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account & Services</Text>
          <View style={styles.menuBlock}>

            {/* Saved Addresses */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAddressModalVisible(true);
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="location-outline" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.menuItemText}>Saved Addresses</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemSubtitle}>2 Locations</Text>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Service History */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/history');
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="time-outline" size={20} color="#10b981" />
                </View>
                <Text style={styles.menuItemText}>Service History</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Payment History */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPaymentModalVisible(true);
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="wallet-outline" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.menuItemText}>Payment History</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Section: Preferences & Support */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.menuBlock}>

            {/* Push Notifications */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#f5f3ff' }]}>
                  <Ionicons name="notifications-outline" size={20} color="#8b5cf6" />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: '#e2e8f0', true: '#c084fc' }}
                thumbColor={notificationsEnabled ? '#8b5cf6' : '#f4f3f4'}
                onValueChange={toggleNotifications}
                value={notificationsEnabled}
              />
            </View>

            <View style={styles.divider} />

            {/* Help & Support */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSupportModalVisible(true);
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#ecfeff' }]}>
                  <Ionicons name="help-buoy-outline" size={20} color="#06b6d4" />
                </View>
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* General Settings */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('App Information', 'Mechanic Assistance Platform\nVersion: 1.0.4\nDeveloper Build');
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#f1f5f9' }]}>
                  <Ionicons name="options-outline" size={20} color="#64748b" />
                </View>
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemSubtitle}>v1.0.4</Text>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Professional Logout Option */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* MODAL 1: Payment History (Slide Drawer Style) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* iOS Style Pull Bar */}
            <View style={styles.pullBar} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment History</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close-circle" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={DUMMY_PAYMENTS}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.paymentCard}>
                  <View style={styles.paymentCardHeader}>
                    <Text style={styles.paymentService}>{item.service}</Text>
                    <Text style={styles.paymentAmount}>{item.amount}</Text>
                  </View>
                  <View style={styles.paymentCardFooter}>
                    <Text style={styles.paymentDate}>{item.date} • {item.method}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Saved Addresses (Slide Drawer Style) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* iOS Style Pull Bar */}
            <View style={styles.pullBar} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Addresses</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close-circle" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={DUMMY_ADDRESSES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.addressCard}>
                  <View style={styles.addressCardHeader}>
                    <View style={styles.addressTypeBadge}>
                      <Ionicons name={item.type === 'Home' ? 'home' : 'briefcase'} size={14} color="#3b82f6" />
                      <Text style={styles.addressTypeText}>{item.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.addressValue}>{item.address}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              style={styles.modalList}
            />

            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => Alert.alert('New Address', 'Dynamic GPS address integration coming soon.')}
              activeOpacity={0.9}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Help & Support (Alert Card Style) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={supportModalVisible}
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.supportCard}>
            <View style={styles.supportHeader}>
              <View style={styles.supportIconCircle}>
                <Ionicons name="help-buoy" size={32} color="#06b6d4" />
              </View>
              <Text style={styles.supportTitle}>Help & Support</Text>
              <Text style={styles.supportSubtitle}>We are online to assist you 24/7</Text>
            </View>

            <View style={styles.supportOptions}>
              <TouchableOpacity
                style={styles.supportOptionBtn}
                onPress={() => Alert.alert('Dialing Helpdesk', 'Calling toll-free 1800-123-4567...')}
              >
                <View style={styles.supportOptionLeft}>
                  <Ionicons name="call" size={20} color="#10b981" />
                </View>
                <View style={styles.supportOptionDetails}>
                  <Text style={styles.supportOptionTitle}>Emergency Helpline</Text>
                  <Text style={styles.supportOptionDesc}>1800-123-4567</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportOptionBtn}
                onPress={() => Alert.alert('Email Support', 'Drafting support request to support@mechapp.com...')}
              >
                <View style={styles.supportOptionLeft}>
                  <Ionicons name="mail" size={20} color="#3b82f6" />
                </View>
                <View style={styles.supportOptionDetails}>
                  <Text style={styles.supportOptionTitle}>Email Support</Text>
                  <Text style={styles.supportOptionDesc}>support@mechapp.com</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setSupportModalVisible(false)} style={styles.supportCloseBtn}>
              <Text style={styles.supportCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  settingsIcon: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  avatarOuterRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  avatarInnerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#e11d48',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#3b82f6',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  userContact: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 18,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  editProfileText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  vehicleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 1.5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  vehicleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  vehicleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleDetails: {
    justifyContent: 'center',
  },
  vehicleModel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  vehicleNo: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  vehicleCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manageText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  menuBlock: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 1.5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff1f2',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecdd3',
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '600',
  },

  // Modals Styling (iOS Slide Drawer)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '82%',
    paddingBottom: 40,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  pullBar: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    padding: 2,
  },
  modalList: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  paymentCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  paymentService: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    paddingRight: 12,
    lineHeight: 20,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#047857',
  },
  paymentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDate: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065f46',
  },

  addressCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressCardHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  addressTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  addressValue: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  addAddressButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  addAddressText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  modalOverlayCentered: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  supportCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  supportHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ecfeff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cffafe',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  supportOptions: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  supportOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  supportOptionLeft: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  supportOptionDetails: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  supportOptionDesc: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  supportCloseBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  supportCloseBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});