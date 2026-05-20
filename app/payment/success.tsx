// app/payment/success.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function PaymentSuccess() {
  const transactionId = "TXN" + Math.floor(100000 + Math.random() * 900000);
  const [showConfetti, setShowConfetti] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger haptic feedback on success
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animation sequence
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        // @ts-ignore
        easing: Easing.out(Easing.back()),
        useNativeDriver: true,
      }),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Simulate confetti after animation
    setTimeout(() => setShowConfetti(true), 800);
  }, []);

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)/home");
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />

      {/* Animated Gradient Background */}
      <LinearGradient
        colors={["#10b981", "#059669", "#047857"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        {/* Decorative Circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Success Animation */}
            <View style={styles.iconWrapper}>
              <View style={styles.iconRing}>
                <Animated.View
                  style={[
                    styles.iconCircle,
                    {
                      transform: [{ scale: checkmarkScale }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={["#fff", "#f0fdf4"]}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="checkmark" size={64} color="#10b981" />
                  </LinearGradient>
                </Animated.View>
              </View>
              <Animated.View style={styles.particlesContainer}>
                {[...Array(8)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.particle,
                      {
                        transform: [
                          {
                            rotate: `${i * 45}deg`,
                          },
                          {
                            translateX: checkmarkScale.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 80],
                            }),
                          },
                        ],
                        opacity: checkmarkScale,
                      },
                    ]}
                  >
                    <Ionicons name="star" size={12} color="#fff" />
                  </Animated.View>
                ))}
              </Animated.View>
            </View>

            {/* Success Message */}
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
              <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
              <Text style={styles.successSubtitle}>
                Your booking has been confirmed
              </Text>
            </Animated.View>

            {/* Booking Details Card */}
            <Animated.View
              style={[
                styles.infoCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  style={styles.cardHeaderGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.cardHeaderText}>Booking Confirmed</Text>
                </LinearGradient>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Mechanic Arrival</Text>
                  <Text style={styles.progressTime}>~15 mins</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "30%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.divider} />

              {/* Service Info */}
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="construct-outline"
                    size={20}
                    color="#10b981"
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mechanic Assigned</Text>
                  <Text style={styles.infoValue}>Raju Mechanic (4.8 ★)</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Service Location</Text>
                  <Text style={styles.infoValue}>
                    123 Main Street, Bangalore
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="time-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Estimated Arrival</Text>
                  <Text style={styles.infoValue}>
                    Today, {formatTime()} • In 15 minutes
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Transaction Details */}
              <View style={styles.transactionSection}>
                <View style={styles.transactionRow}>
                  <Text style={styles.txnLabel}>Transaction ID</Text>
                  <Text style={styles.txnValue}>{transactionId}</Text>
                </View>
                <View style={styles.transactionRow}>
                  <Text style={styles.txnLabel}>Payment Date</Text>
                  <Text style={styles.txnValue}>{formatDate()}</Text>
                </View>
                <View style={styles.transactionRow}>
                  <Text style={styles.txnLabel}>Payment Method</Text>
                  <Text style={styles.txnValue}>UPI • Google Pay</Text>
                </View>
                <View style={[styles.transactionRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Amount Paid</Text>
                  <Text style={styles.totalValue}>₹150</Text>
                </View>
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGoHome}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#fff", "#f0fdf4"]}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Back to Home</Text>
                  <Ionicons name="home-outline" size={20} color="#059669" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Add share functionality
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={20} color="#fff" />
                <Text style={styles.secondaryButtonText}>Share Receipt</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Extra bottom padding spacer */}
            <View style={styles.bottomSpacer} />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  circle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle2: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle3: {
    position: "absolute",
    top: "40%",
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconWrapper: {
    marginBottom: 32,
    position: "relative",
    marginTop: Platform.OS === "ios" ? 20 : 24,
  },
  iconRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  particlesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  successSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "100%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  cardHeader: {
    overflow: "hidden",
  },
  cardHeaderGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  progressSection: {
    padding: 20,
    paddingBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  progressTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#10b981",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  transactionSection: {
    padding: 20,
    gap: 12,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txnLabel: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },
  txnValue: {
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#374151",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10b981",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#059669",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: Platform.OS === "ios" ? 20 : 16,
  },
});