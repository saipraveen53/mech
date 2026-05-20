// app/mechanic/booking.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
export default function BookingScreen() {
  const bookingDetails = {
    mechanicName: "Raju Mechanic",
    problem: "Tyre Puncture Repair",
    amount: 150,
  };
 
  const handleConfirm = () => {
    // Passing data via router params safely
    router.push({
      pathname: "/payment",
      params: {
        mechanicName: bookingDetails.mechanicName,
        problem: bookingDetails.problem,
        amount: bookingDetails.amount.toString(), // Route params must be stringified
      },
    });
  };
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Booking Details</Text>
 
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#4b5563" />
            <Text style={styles.detailText}>
              Mechanic:{" "}
              <Text style={styles.boldText}>{bookingDetails.mechanicName}</Text>
            </Text>
          </View>
 
          <View style={styles.detailRow}>
            <Ionicons name="build-outline" size={20} color="#4b5563" />
            <Text style={styles.detailText}>
              Problem: {bookingDetails.problem}
            </Text>
          </View>
 
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={20} color="#4b5563" />
            <Text style={styles.detailText}>
              Total:{" "}
              <Text style={styles.priceText}>₹{bookingDetails.amount}</Text>
            </Text>
          </View>
        </View>
 
        <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm & Proceed to Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
 
    borderColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1f2937",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  detailText: { fontSize: 16, color: "#4b5563" },
  boldText: { fontWeight: "600", color: "#111827" },
  priceText: { fontWeight: "700", color: "#059669", fontSize: 18 },
  confirm: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  confirmText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});