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
    Image,
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

// QR Code Generator Component
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

    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed += data.charCodeAt(i);
    }

    for (let row = 0; row < moduleCount; row++) {
      pattern[row] = [];
      for (let col = 0; col < moduleCount; col++) {
        const isTopLeft = row < 7 && col < 7;
        const isTopRight = row < 7 && col >= moduleCount - 7;
        const isBottomLeft = row >= moduleCount - 7 && col < 7;

        if (isTopLeft || isTopRight || isBottomLeft) {
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

// Coupon data based on ID
const getCouponById = (id: string, status: string) => {
  const coupons: Record<string, any> = {
    "1": {
      id: 1,
      name: "The Ocean Saver",
      expires: "2026-02-15",
      expiresDate: "Expires 2026-02-15",
      price: 2500,
      originalPrice: 5000,
      discount: 20,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
      merchant: {
        name: "The Ocean Saver Restaurant",
        location: "Colombo 03, Galle Face",
        rating: 4.7,
      },
      validTimeStart: "11:00 AM",
      validTimeEnd: "10:00 PM",
      validDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      couponCode: "QPON-OCSV-2501",
    },
    "2": {
      id: 2,
      name: "Serenity Spa Retreat",
      expires: "2026-02-28",
      expiresDate: "Expires 2026-02-28",
      price: 5600,
      originalPrice: 8000,
      discount: 30,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
      merchant: {
        name: "Serenity Spa & Wellness",
        location: "Colombo 07, Cinnamon Gardens",
        rating: 4.9,
      },
      validTimeStart: "9:00 AM",
      validTimeEnd: "8:00 PM",
      validDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      couponCode: "QPON-SPRT-2502",
    },
    "3": {
      id: 3,
      name: "Pizza Paradise",
      expires: "2026-03-10",
      expiresDate: "Expires 2026-03-10",
      price: 1800,
      originalPrice: 3000,
      discount: 40,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      merchant: {
        name: "Pizza Paradise",
        location: "Colombo 04, Bambalapitiya",
        rating: 4.5,
      },
      validTimeStart: "12:00 PM",
      validTimeEnd: "11:00 PM",
      validDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      couponCode: "QPON-PZPR-2503",
    },
    "4": {
      id: 4,
      name: "Coffee Corner",
      expires: "2026-01-15",
      expiresDate: "Used on 2026-01-15",
      price: 900,
      originalPrice: 1500,
      discount: 40,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
      merchant: {
        name: "Coffee Corner Café",
        location: "Colombo 05, Kirulapone",
        rating: 4.6,
      },
      validTimeStart: "7:00 AM",
      validTimeEnd: "9:00 PM",
      validDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      couponCode: "QPON-CFCR-2504",
    },
    "5": {
      id: 5,
      name: "Burger Kingdom",
      expires: "2026-01-25",
      expiresDate: "Expires in 3 days",
      price: 1400,
      originalPrice: 2800,
      discount: 50,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      merchant: {
        name: "Burger Kingdom",
        location: "Colombo 06, Wellawatte",
        rating: 4.4,
      },
      validTimeStart: "11:00 AM",
      validTimeEnd: "11:00 PM",
      validDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      couponCode: "QPON-BGKM-2505",
    },
  };

  return coupons[id] || coupons["1"];
};

export default function CouponDetailScreen() {
  const { id, status } = useLocalSearchParams<{
    id: string;
    status?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const coupon = getCouponById(id || "1", status || "active");
  const couponStatus = (status || "active") as "active" | "used" | "expiring";

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // QR Modal state
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
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

  const handleBackToWallet = () => {
    router.back();
  };

  const handleUseNow = () => {
    if (couponStatus === "used") {
      Alert.alert("Already Used", "This coupon has already been redeemed.");
    } else {
      setShowQRModal(true);
    }
  };

  const getStatusConfig = () => {
    switch (couponStatus) {
      case "used":
        return {
          color: Colors.gray500,
          bgColor: "rgba(107, 114, 128, 0.1)",
          icon: "check-circle" as const,
          label: "Used",
          gradient: ["#6B7280", "#9CA3AF"] as [string, string],
        };
      case "expiring":
        return {
          color: "#EF4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
          icon: "alert-circle" as const,
          label: "Expiring Soon",
          gradient: ["#EF4444", "#F87171"] as [string, string],
        };
      default:
        return {
          color: "#10B981",
          bgColor: "rgba(16, 185, 129, 0.1)",
          icon: "check-circle" as const,
          label: "Active",
          gradient: ["#10B981", "#34D399"] as [string, string],
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToWallet}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={Colors.deepNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coupon Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge Header */}
        <Animated.View
          style={[
            styles.statusHeader,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.statusBadgeLarge,
              { backgroundColor: statusConfig.bgColor },
            ]}
          >
            <Feather
              name={statusConfig.icon}
              size={20}
              color={statusConfig.color}
            />
            <Text
              style={[styles.statusBadgeText, { color: statusConfig.color }]}
            >
              {statusConfig.label}
            </Text>
          </View>
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
          {/* Coupon Image */}
          <Image source={{ uri: coupon.image }} style={styles.couponImage} />

          {/* Deal Info */}
          <View style={styles.dealInfoSection}>
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>{coupon.discount}% OFF</Text>
            </View>
            <Text style={styles.dealName}>{coupon.name}</Text>
            <Text style={styles.dealPrice}>
              LKR {formatPrice(coupon.price)}
              <Text style={styles.dealOriginalPrice}>
                {"  "}LKR {formatPrice(coupon.originalPrice)}
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
              <Text style={styles.couponCode}>{coupon.couponCode}</Text>
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
            {couponStatus !== "used" && (
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
            )}
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
                {coupon.validTimeStart} – {coupon.validTimeEnd}
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
                {coupon.validDays.join(", ")}
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
              <Text style={styles.detailLabel}>
                {couponStatus === "used" ? "Used On" : "Expires On"}
              </Text>
              <Text style={styles.detailValue}>
                {formatDate(coupon.expires)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.detailsDivider} />

          {/* Merchant Info */}
          <View style={styles.merchantSection}>
            <Text style={styles.merchantSectionTitle}>Redeem At</Text>
            <TouchableOpacity
              style={styles.merchantInfo}
              onPress={() => router.push(`/merchant/${coupon.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.merchantIcon}>
                <Feather name="shopping-bag" size={20} color={Colors.white} />
              </View>
              <View style={styles.merchantDetails}>
                <Text style={styles.merchantName}>{coupon.merchant.name}</Text>
                <View style={styles.merchantLocationRow}>
                  <Feather name="map-pin" size={12} color={Colors.gray500} />
                  <Text style={styles.merchantLocation}>
                    {coupon.merchant.location}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Important Note */}
        {couponStatus !== "used" && (
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
        )}

        {/* Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToWallet}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Back to Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            couponStatus === "used" && styles.primaryButtonDisabled,
          ]}
          onPress={handleUseNow}
          activeOpacity={0.9}
          disabled={couponStatus === "used"}
        >
          <LinearGradient
            colors={
              couponStatus === "used"
                ? ["#9CA3AF", "#D1D5DB"]
                : [Colors.orange, Colors.orangeLight]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {couponStatus === "used" ? "Already Used" : "Use Now"}
            </Text>
            {couponStatus !== "used" && (
              <Feather name="arrow-right" size={18} color={Colors.white} />
            )}
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
            <Text style={styles.qrModalSubtitle}>{coupon.name}</Text>

            <QRCodeView value={coupon.couponCode} size={220} />

            <Text style={styles.qrModalCode}>{coupon.couponCode}</Text>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statusHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusBadgeLarge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  statusBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
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
  couponImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
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
  primaryButtonDisabled: {
    opacity: 0.8,
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
