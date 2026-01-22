import { Colors, Fonts } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
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
import Svg, { Rect } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// QR Code Generator Component (simplified pattern-based)
const QRCodeView = ({
  value,
  size = 200,
}: {
  value: string;
  size?: number;
}) => {
  const generatePattern = (data: string) => {
    const pattern: boolean[][] = [];
    const moduleCount = 25;

    // Create a deterministic pattern based on the string
    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed += data.charCodeAt(i);
    }

    for (let row = 0; row < moduleCount; row++) {
      pattern[row] = [];
      for (let col = 0; col < moduleCount; col++) {
        // Position patterns (corners)
        const isTopLeft = row < 7 && col < 7;
        const isTopRight = row < 7 && col >= moduleCount - 7;
        const isBottomLeft = row >= moduleCount - 7 && col < 7;

        if (isTopLeft || isTopRight || isBottomLeft) {
          // Finder patterns
          const inOuter =
            (row < 7 &&
              col < 7 &&
              (row === 0 || row === 6 || col === 0 || col === 6)) ||
            (row < 7 &&
              col >= moduleCount - 7 &&
              (row === 0 ||
                row === 6 ||
                col === moduleCount - 7 ||
                col === moduleCount - 1)) ||
            (row >= moduleCount - 7 &&
              col < 7 &&
              (row === moduleCount - 7 ||
                row === moduleCount - 1 ||
                col === 0 ||
                col === 6));
          const inInner =
            (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
            (row >= 2 &&
              row <= 4 &&
              col >= moduleCount - 5 &&
              col <= moduleCount - 3) ||
            (row >= moduleCount - 5 &&
              row <= moduleCount - 3 &&
              col >= 2 &&
              col <= 4);
          pattern[row][col] = inOuter || inInner;
        } else {
          // Data pattern (pseudo-random based on seed)
          const hash = (seed * (row + 1) * (col + 1) + row * col) % 100;
          pattern[row][col] = hash > 45;
        }
      }
    }
    return pattern;
  };

  const pattern = generatePattern(value);
  const moduleSize = size / 25;

  return (
    <View
      style={{ backgroundColor: Colors.white, padding: 16, borderRadius: 16 }}
    >
      <Svg width={size} height={size}>
        {pattern.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell ? (
              <Rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * moduleSize}
                y={rowIndex * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill={Colors.deepNavy}
              />
            ) : null,
          ),
        )}
      </Svg>
    </View>
  );
};

// Mock deal data - same as deal detail
const getDealById = (id: string) => ({
  id: parseInt(id) || 1,
  title: "Gourmet Burger Combo",
  subtitle: "Premium dining experience with signature burgers",
  merchant: {
    name: "Urban Bites Kitchen",
    location: "Colombo 03, Near Dutch Hospital",
    rating: 4.8,
    reviewCount: 256,
  },
  originalPrice: 2500,
  discountedPrice: 1875,
  discountPercent: 25,
  currency: "LKR",
  expirationDate: "2026-02-15",
  validTimeStart: "5:00 PM",
  validTimeEnd: "9:00 PM",
  validDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  category: "Dining",
});

// Generate coupon code
const generateCouponCode = (dealId: string) => {
  const prefix = "QPON";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${timestamp}-${random}`;
};

export default function CouponSuccessScreen() {
  const { id, couponCode: passedCode } = useLocalSearchParams<{
    id: string;
    couponCode?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const deal = getDealById(id || "1");
  const couponCode = passedCode || generateCouponCode(id || "1");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // QR Modal state
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

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
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const handleCopyCode = () => {
    // In a real app, use Clipboard API
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert("Copied!", "Coupon code copied to clipboard");
  };

  const handleDownloadQR = async () => {
    try {
      Alert.alert("Success", "QR Code saved to your gallery!");
    } catch (error) {
      Alert.alert("Error", "Failed to save QR code");
    }
  };

  const handleViewQR = () => {
    setShowQRModal(true);
  };

  const handleGoToWallet = () => {
    router.replace("/(tabs)/wallet");
  };

  const handleBackToDeals = () => {
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
              colors={["#4CAF50", "#66BB6A"]}
              style={styles.successIconGradient}
            >
              <Feather name="check" size={48} color={Colors.white} />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.successTitle}>Coupon Claimed!</Text>
          <Text style={styles.successSubtitle}>
            Your coupon has been successfully added to your wallet
          </Text>
        </Animated.View>

        {/* Coupon Card */}
        <Animated.View
          style={[
            styles.couponCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Deal Info */}
          <View style={styles.dealInfoSection}>
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>
                {deal.discountPercent}% OFF
              </Text>
            </View>
            <Text style={styles.dealName}>{deal.title}</Text>
            <Text style={styles.dealPrice}>
              {deal.currency} {formatPrice(deal.discountedPrice)}
              <Text style={styles.dealOriginalPrice}>
                {"  "}
                {deal.currency} {formatPrice(deal.originalPrice)}
              </Text>
            </Text>
          </View>

          {/* Dashed Divider */}
          <View style={styles.dashedDivider}>
            <View style={styles.cutoutLeft} />
            <View style={styles.cutoutRight} />
            {[...Array(20)].map((_, i) => (
              <View key={i} style={styles.dashItem} />
            ))}
          </View>

          {/* Coupon Code Section */}
          <View style={styles.couponCodeSection}>
            <Text style={styles.couponCodeLabel}>Coupon Code</Text>
            <View style={styles.couponCodeRow}>
              <Text style={styles.couponCode}>{couponCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyCode}
                activeOpacity={0.7}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={18}
                  color={copied ? "#4CAF50" : Colors.orange}
                />
              </TouchableOpacity>
            </View>

            {/* QR Code Actions */}
            <View style={styles.qrActions}>
              <TouchableOpacity
                style={styles.qrButton}
                onPress={handleViewQR}
                activeOpacity={0.7}
              >
                <Feather name="maximize" size={18} color={Colors.deepNavy} />
                <Text style={styles.qrButtonText}>View QR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.qrButton}
                onPress={handleDownloadQR}
                activeOpacity={0.7}
              >
                <Feather name="download" size={18} color={Colors.deepNavy} />
                <Text style={styles.qrButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Details Card */}
        <Animated.View
          style={[
            styles.detailsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.detailsTitle}>Coupon Details</Text>

          {/* Validation Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="clock" size={18} color={Colors.orange} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Valid Hours</Text>
              <Text style={styles.detailValue}>
                {deal.validTimeStart} – {deal.validTimeEnd}
              </Text>
            </View>
          </View>

          {/* Valid Days */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="calendar" size={18} color={Colors.orange} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Valid Days</Text>
              <Text style={styles.detailValue}>
                {deal.validDays.join(", ")}
              </Text>
            </View>
          </View>

          {/* Expiration */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons
                name="hourglass-outline"
                size={18}
                color={Colors.orange}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Expires On</Text>
              <Text style={styles.detailValue}>
                {formatDate(deal.expirationDate)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.detailsDivider} />

          {/* Merchant Info */}
          <View style={styles.merchantSection}>
            <Text style={styles.merchantSectionTitle}>Redeem At</Text>
            <View style={styles.merchantInfo}>
              <View style={styles.merchantIcon}>
                <Feather name="shopping-bag" size={20} color={Colors.white} />
              </View>
              <View style={styles.merchantDetails}>
                <Text style={styles.merchantName}>{deal.merchant.name}</Text>
                <View style={styles.merchantLocationRow}>
                  <Feather name="map-pin" size={12} color={Colors.gray500} />
                  <Text style={styles.merchantLocation}>
                    {deal.merchant.location}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Important Note */}
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
            Show the QR code or coupon code at the merchant location to redeem
            your discount.
          </Text>
        </Animated.View>

        {/* Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToDeals}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Browse More</Text>
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
            <Text style={styles.primaryButtonText}>View in Wallet</Text>
            <Feather name="arrow-right" size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQRModal(false)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={24} color={Colors.deepNavy} />
            </TouchableOpacity>

            <Text style={styles.qrModalTitle}>Scan to Redeem</Text>
            <Text style={styles.qrModalSubtitle}>{deal.title}</Text>

            <QRCodeView value={couponCode} size={220} />

            <Text style={styles.qrModalCode}>{couponCode}</Text>

            <TouchableOpacity
              style={styles.qrModalDownload}
              onPress={handleDownloadQR}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[Colors.orange, Colors.orangeLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.qrModalDownloadGradient}
              >
                <Feather name="download" size={18} color={Colors.white} />
                <Text style={styles.qrModalDownloadText}>Save QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowColor: "#4CAF50",
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
    paddingHorizontal: 20,
  },
  couponCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  dealInfoSection: {
    padding: 20,
    alignItems: "center",
  },
  dealBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  dealBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 13,
    color: Colors.white,
  },
  dealName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    textAlign: "center",
    marginBottom: 8,
  },
  dealPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 24,
    color: Colors.orange,
  },
  dealOriginalPrice: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  dashedDivider: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    paddingHorizontal: 24,
    position: "relative",
  },
  cutoutLeft: {
    position: "absolute",
    left: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5F5F8",
  },
  cutoutRight: {
    position: "absolute",
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5F5F8",
  },
  dashItem: {
    width: 8,
    height: 2,
    backgroundColor: Colors.gray300,
    marginHorizontal: 4,
    borderRadius: 1,
  },
  couponCodeSection: {
    padding: 20,
    alignItems: "center",
  },
  couponCodeLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  couponCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  couponCode: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: Colors.deepNavy,
    letterSpacing: 2,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  qrActions: {
    flexDirection: "row",
    gap: 12,
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
  },
  qrButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.deepNavy,
  },
  detailsCard: {
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
  detailsTitle: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,90,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 8,
  },
  merchantSection: {
    marginTop: 8,
  },
  merchantSectionTitle: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  merchantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  merchantIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  merchantLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  merchantLocation: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
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
  // QR Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  qrModalTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    marginBottom: 4,
    marginTop: 8,
  },
  qrModalSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 20,
  },
  qrModalCode: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.deepNavy,
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 20,
  },
  qrModalDownload: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
  },
  qrModalDownloadGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  qrModalDownloadText: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.white,
  },
});
