import { Colors, Fonts } from "@/constants/theme";
import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import {
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    useFonts as useQuicksandFonts,
} from "@expo-google-fonts/quicksand";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Package details mapping
const packageDetails: Record<
  string,
  {
    name: string;
    price: number;
    duration: string;
    couponCount: number;
    features: string[];
    color: string;
  }
> = {
  "1": {
    name: "Starter",
    price: 499,
    duration: "month",
    couponCount: 5,
    features: ["5 coupons per month", "Basic deals access", "Email support"],
    color: Colors.blue,
  },
  "2": {
    name: "Premium",
    price: 999,
    duration: "month",
    couponCount: 15,
    features: [
      "15 coupons per month",
      "Premium deals access",
      "Priority support",
      "Early access to deals",
    ],
    color: Colors.orange,
  },
  "3": {
    name: "Business",
    price: 1999,
    duration: "month",
    couponCount: 50,
    features: [
      "50 coupons per month",
      "All deals access",
      "24/7 support",
      "Exclusive partner deals",
      "Family sharing (up to 5)",
    ],
    color: Colors.purple,
  },
};

export default function PackageSuccessScreen() {
  const { packageId, transactionId } = useLocalSearchParams<{
    packageId: string;
    transactionId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const packageInfo = packageDetails[packageId || "1"];

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for success icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Confetti animation
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  const formatDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const generateTransactionId = () => {
    return transactionId || `TXN${Date.now().toString(36).toUpperCase()}`;
  };

  const handleGoToWallet = () => {
    router.replace("/(tabs)/wallet");
  };

  const handleBrowseDeals = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation Header */}
        <Animated.View
          style={[
            styles.successHeader,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.successIconContainer,
              {
                transform: [{ scale: Animated.multiply(checkAnim, pulseAnim) }],
              },
            ]}
          >
            <LinearGradient
              colors={["#10B981", "#34D399"]}
              style={styles.successIconGradient}
            >
              <Feather name="check" size={48} color={Colors.white} />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your subscription has been activated
          </Text>
        </Animated.View>

        {/* Package Summary Card */}
        <Animated.View
          style={[
            styles.summaryCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <View
              style={[
                styles.packageIconLarge,
                { backgroundColor: `${packageInfo.color}15` },
              ]}
            >
              <Feather name="package" size={28} color={packageInfo.color} />
            </View>
            <View style={styles.packageTitleContainer}>
              <Text style={styles.packageName}>{packageInfo.name}</Text>
              <Text style={styles.packageType}>Monthly Subscription</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Package Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Package</Text>
              <Text style={styles.detailValue}>{packageInfo.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coupons</Text>
              <Text style={styles.detailValue}>
                {packageInfo.couponCount} per month
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valid Until</Text>
              <Text style={styles.detailValue}>{formatDate()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValueSmall}>
                {generateTransactionId()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Price Summary */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                LKR {packageInfo.price.toLocaleString()}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax</Text>
              <Text style={styles.priceValue}>LKR 0</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>
                LKR {packageInfo.price.toLocaleString()}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Features Card */}
        <Animated.View
          style={[
            styles.featuresCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.featuresTitle}>What's Included</Text>
          {packageInfo.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: `${packageInfo.color}15` },
                ]}
              >
                <Feather name="check" size={14} color={packageInfo.color} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Info Note */}
        <Animated.View
          style={[
            styles.noteCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Feather name="info" size={16} color={Colors.orange} />
          <Text style={styles.noteText}>
            A confirmation email has been sent to your registered email address
            with the subscription details.
          </Text>
        </Animated.View>

        {/* Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBrowseDeals}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Browse Deals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGoToWallet}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.orange, Colors.orangeLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>Go to Wallet</Text>
            <Feather name="arrow-right" size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F8",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 26,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  packageIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  packageType: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 16,
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
  },
  detailValue: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  detailValueSmall: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray600,
  },
  priceSection: {
    gap: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
  },
  priceValue: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray600,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  totalLabel: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.deepNavy,
  },
  totalValue: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.orange,
  },
  featuresCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
    flex: 1,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255,90,0,0.08)",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray600,
    lineHeight: 20,
  },
  bottomCTA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.white,
  },
});
