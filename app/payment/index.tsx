// app/payment/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

type PaymentMethod = "upi" | "card" | "cash";

export default function PaymentScreen() {
  const { mechanicName, problem, amount } = useLocalSearchParams<{
    mechanicName: string;
    problem: string;
    amount: string;
  }>();

  const finalAmount = amount || "150";
  const finalMechanic = mechanicName || "Raju Mechanic";
  const finalProblem = problem || "Vehicle Assistance";

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/payment/success");
    }, 1500);
  };

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      subtitle: "Google Pay, PhonePe, Paytm",
      icon: "qr-code-outline",
      gradient: ["#667eea", "#764ba2"],
      bgColor: "#e8eaff",
      iconColor: "#667eea",
    },
    {
      id: "card",
      name: "Card",
      subtitle: "Credit/Debit Cards",
      icon: "card-outline",
      gradient: ["#f093fb", "#f5576c"],
      bgColor: "#ffe8f0",
      iconColor: "#f5576c",
    },
    {
      id: "cash",
      name: "Cash",
      subtitle: "Pay at doorstep",
      icon: "cash-outline",
      gradient: ["#4facfe", "#00f2fe"],
      bgColor: "#e0f7fa",
      iconColor: "#00acc1",
    },
  ];

  const getPaymentButtonText = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    return `Pay ₹${finalAmount} via ${method?.name}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
      <LinearGradient colors={["#f8f9ff", "#fff"]} style={styles.gradientBg}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Service Provider Card */}
          <View style={styles.providerCard}>
            <View style={styles.providerIcon}>
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={styles.providerGradient}
              >
                <Ionicons name="construct-outline" size={24} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{finalMechanic}</Text>
              <Text style={styles.providerService}>{finalProblem}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          {/* Bill Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Bill Summary</Text>
              <View style={styles.invoiceBadge}>
                <Text style={styles.invoiceText}>INVOICE</Text>
              </View>
            </View>

            <View style={styles.summaryItems}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Charge</Text>
                <Text style={styles.summaryAmount}>₹{finalAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform Fee</Text>
                <Text style={styles.summaryAmount}>₹0</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (GST)</Text>
                <Text style={styles.summaryAmount}>Included</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <View>
                <Text style={styles.totalValue}>₹{finalAmount}</Text>
                <Text style={styles.totalSaving}>You saved ₹30</Text>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>
            <Text style={styles.sectionSubtitle}>
              Choose your preferred payment option
            </Text>

            <View style={styles.methodsContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.methodCardSelected,
                  ]}
                  onPress={() => setSelectedMethod(method.id as PaymentMethod)}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodLeft}>
                    <View
                      style={[
                        styles.methodIcon,
                        { backgroundColor: method.bgColor },
                      ]}
                    >
                      <Ionicons
                        name={method.icon as any}
                        size={24}
                        color={method.iconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.methodName}>{method.name}</Text>
                      <Text style={styles.methodSubtitle}>
                        {method.subtitle}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedMethod === method.id &&
                        styles.radioCircleSelected,
                    ]}
                  >
                    {selectedMethod === method.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Offer Banner */}
            <LinearGradient
              colors={["#ffd89b", "#c7e9fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.offerBanner}
            >
              <Ionicons name="gift-outline" size={24} color="#f59e0b" />
              <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>🎉 Get 10% Cashback</Text>
                <Text style={styles.offerSubtitle}>
                  on UPI & Card payments above ₹200
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.offerLink}>Apply</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.securityContainer}>
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#10b981" />
              <Text style={styles.securityText}>Secure Payment</Text>
            </View>
            <View style={styles.securityBadge}>
              <Ionicons name="lock-closed" size={14} color="#10b981" />
              <Text style={styles.securityText}>256-bit SSL</Text>
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.payButton,
                isProcessing && styles.payButtonDisabled,
              ]}
              onPress={handlePaymentSubmit}
              disabled={isProcessing}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.payButtonGradient}
              >
                {isProcessing ? (
                  <>
                    <Ionicons name="reload" size={20} color="white" />
                    <Text style={styles.payButtonText}>Processing...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.payButtonText}>
                      {getPaymentButtonText()}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  gradientBg: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  providerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 12,
  },
  providerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  providerService: {
    fontSize: 13,
    color: "#6c757d",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f59e0b",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
  },
  invoiceBadge: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invoiceText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#667eea",
    letterSpacing: 0.5,
  },
  summaryItems: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#667eea",
  },
  totalSaving: {
    fontSize: 12,
    color: "#10b981",
    textAlign: "right",
    marginTop: 4,
  },
  paymentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6c757d",
    marginBottom: 20,
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  methodCardSelected: {
    borderColor: "#667eea",
    backgroundColor: "#f8f9ff",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 12,
    color: "#6c757d",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#dee2e6",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: "#667eea",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#667eea",
  },
  offerBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 2,
  },
  offerSubtitle: {
    fontSize: 12,
    color: "#6c757d",
  },
  offerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f59e0b",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  securityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  securityText: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "500",
  },
  payButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});