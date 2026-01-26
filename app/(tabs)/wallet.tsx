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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

interface CouponItem {
  id: number;
  name: string;
  expires: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  status: "active" | "used" | "expiring";
  expiresDate: string;
}

const currentPackage = {
  name: "Welcome Offer",
  status: "Active",
  price: 0,
  duration: "Until 31 Feb '25",
  coupons: 3,
  couponsUsed: 1,
  description: "Current Plan",
};

const savingsData = {
  thisMonth: 0,
  totalSavings: 3544000,
};

const activeCoupons: CouponItem[] = [
  {
    id: 1,
    name: "The Ocean Saver",
    expires: "2026-02-15",
    expiresDate: "Expires 2026-02-15",
    price: 2500,
    originalPrice: 5000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
    status: "active",
  },
  {
    id: 2,
    name: "Serenity Spa Retreat",
    expires: "2026-02-28",
    expiresDate: "Expires 2026-02-28",
    price: 5600,
    originalPrice: 8000,
    discount: 30,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
    status: "active",
  },
  {
    id: 3,
    name: "Pizza Paradise",
    expires: "2026-03-10",
    expiresDate: "Expires 2026-03-10",
    price: 1800,
    originalPrice: 3000,
    discount: 40,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    status: "active",
  },
];

const usedCoupons: CouponItem[] = [
  {
    id: 4,
    name: "Coffee Corner",
    expires: "2026-01-15",
    expiresDate: "Used on 2026-01-15",
    price: 900,
    originalPrice: 1500,
    discount: 40,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    status: "used",
  },
];

const expiringSoonCoupons: CouponItem[] = [
  {
    id: 5,
    name: "Burger Kingdom",
    expires: "2026-01-25",
    expiresDate: "Expires in 3 days",
    price: 1400,
    originalPrice: 2800,
    discount: 50,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    status: "expiring",
  },
];

const WalletScreen = () => {
  const router = useRouter();
  const { isGuest } = useAuth();

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

  const [activeTab, setActiveTab] = useState<"active" | "used" | "expiring">(
    "active",
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Guest View
  if (isGuest) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.guestContainer}>
          <View style={styles.guestIconContainer}>
            <Feather name="credit-card" size={32} color={Colors.orange} />
          </View>
          <Text style={styles.guestTitle}>Sign In to Access Wallet</Text>
          <Text style={styles.guestSubtitle}>
            Create an account or sign in to view your coupons, track savings,
            and manage your wallet.
          </Text>
          <TouchableOpacity
            style={styles.guestSignInButton}
            onPress={() => router.push("/signin")}
            activeOpacity={0.8}
          >
            <Text style={styles.guestSignInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.guestRegisterButton}
            onPress={() => router.push("/register")}
            activeOpacity={0.8}
          >
            <Text style={styles.guestRegisterButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderTabButton = (
    tab: "active" | "used" | "expiring",
    label: string,
    count?: number,
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.tabButtonTextActive,
        ]}
      >
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View
          style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}
        >
          <Text
            style={[
              styles.tabBadgeText,
              activeTab === tab && styles.tabBadgeTextActive,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleCouponPress = (item: CouponItem) => {
    router.push({
      pathname: "/coupon-detail/[id]",
      params: { id: item.id.toString(), status: item.status },
    });
  };

  const renderCouponCard = ({ item }: { item: CouponItem }) => (
    <Animated.View
      style={[
        styles.couponCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleCouponPress(item)}
      >
        <View style={styles.couponCardContent}>
          <Image source={{ uri: item.image }} style={styles.couponImage} />
          <View style={styles.couponInfo}>
            <View style={styles.couponHeader}>
              <Text style={styles.couponName} numberOfLines={2}>
                {item.name}
              </Text>
            </View>

            <View style={styles.couponExpiry}>
              <Feather name="clock" size={14} color={Colors.orange} />
              <Text style={styles.couponExpiryText}>{item.expiresDate}</Text>
            </View>

            <View style={styles.couponPriceRow}>
              <View style={styles.priceSection}>
                <Text style={styles.couponPrice}>
                  LKR {item.price.toLocaleString()}
                </Text>
                <Text style={styles.couponOriginalPrice}>
                  LKR {item.originalPrice.toLocaleString()}
                </Text>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  {item.discount}% OFF
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const couponsToDisplay =
    activeTab === "active"
      ? activeCoupons
      : activeTab === "used"
        ? usedCoupons
        : expiringSoonCoupons;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Coupon Wallet</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.7}
          >
            <Feather name="bell" size={22} color={Colors.deepNavy} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Current Package Section - Compact */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.orange, Colors.orangeLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.packageCardCompact}
          >
            <View style={styles.packageCompactRow}>
              <View style={styles.packageCompactLeft}>
                <View style={styles.packageIconSmall}>
                  <Feather name="gift" size={18} color={Colors.white} />
                </View>
                <View style={styles.packageTextContainer}>
                  <Text style={styles.packageNameCompact}>
                    {currentPackage.name}
                  </Text>
                  <Text style={styles.packageCouponsText}>
                    {currentPackage.coupons - currentPackage.couponsUsed}/
                    {currentPackage.coupons} coupons left
                  </Text>
                  <Text style={styles.packageExpiryText}>
                    {currentPackage.duration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.upgradeButtonCompact}
                activeOpacity={0.8}
                onPress={() => router.push("/packages")}
              >
                <Text style={styles.upgradeButtonTextCompact}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Savings Section */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Savings from Deals</Text>
          <LinearGradient
            colors={[Colors.deepNavy, Colors.deepNavyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.savingsCard}
          >
            <View style={styles.savingsSection}>
              <Text style={styles.savingsLabel}>THIS MONTH</Text>
              <Text style={styles.savingsAmount}>
                LKR{" "}
                <Text style={styles.savingsBold}>{savingsData.thisMonth}</Text>
              </Text>
              <Text style={styles.savingsSubtext}>Approx Saving*</Text>
            </View>
            <View style={styles.savingsDivider} />
            <View style={styles.savingsSection}>
              <Text style={styles.savingsLabel}>TOTAL SAVINGS</Text>
              <Text style={[styles.savingsAmount, styles.savingsAmountOrange]}>
                LKR{" "}
                <Text style={styles.savingsBold}>
                  {(savingsData.totalSavings / 1000).toFixed(0)}K
                </Text>
              </Text>
              <Text style={styles.savingsSubtext}>Approx Saving*</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* My Coupons Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Coupons</Text>

          {/* Tab Navigation - Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {renderTabButton("active", "Active", activeCoupons.length)}
            {renderTabButton("used", "Used", usedCoupons.length)}
            {renderTabButton(
              "expiring",
              "Expire Soon",
              expiringSoonCoupons.length,
            )}
          </ScrollView>

          {/* Coupons List */}
          {couponsToDisplay.length > 0 ? (
            <FlatList
              data={couponsToDisplay}
              renderItem={renderCouponCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.couponsListContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather
                name={
                  activeTab === "active"
                    ? "inbox"
                    : activeTab === "used"
                      ? "check-circle"
                      : "clock"
                }
                size={48}
                color={Colors.gray400}
              />
              <Text style={styles.emptyStateText}>
                No {activeTab} coupons yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {activeTab === "active"
                  ? "Browse deals to get started"
                  : activeTab === "used"
                    ? "Your redeemed coupons will appear here"
                    : "Keep an eye on expiring coupons"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.deepNavy,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    marginBottom: 16,
  },

  // Package Card Styles - Compact
  packageCardCompact: {
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  packageCompactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  packageCompactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  packageIconSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  packageTextContainer: {
    flex: 1,
  },
  packageNameCompact: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.white,
    marginBottom: 3,
  },
  packageCouponsText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.white,
    marginBottom: 2,
  },
  packageExpiryText: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  upgradeButtonCompact: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  upgradeButtonTextCompact: {
    fontFamily: Fonts.body.bold,
    fontSize: 13,
    color: Colors.orange,
  },

  // Savings Card Styles
  savingsCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  savingsSection: {
    flex: 1,
  },
  savingsDivider: {
    width: 1,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 20,
  },
  savingsLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  savingsAmount: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 20,
    color: Colors.white,
    marginBottom: 2,
  },
  savingsAmountOrange: {
    color: Colors.orange,
  },
  savingsBold: {
    fontFamily: Fonts.heading.bold,
    fontSize: 24,
  },
  savingsSubtext: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
  },

  // Tab Navigation Styles - Carousel
  tabContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    paddingRight: 20,
  },
  tabButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
    shadowOpacity: 0.1,
  },
  tabButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray600,
  },
  tabButtonTextActive: {
    color: Colors.white,
  },
  tabBadge: {
    backgroundColor: "rgba(255,90,0,0.15)",
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tabBadgeActive: {
    backgroundColor: Colors.white,
  },
  tabBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.orange,
  },
  tabBadgeTextActive: {
    color: Colors.orange,
  },

  // Coupon Card Styles
  couponsListContainer: {
    gap: 12,
  },
  couponCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  couponCardContent: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  couponImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.gray200,
  },
  couponInfo: {
    flex: 1,
  },
  couponHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  couponName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 15,
    color: Colors.deepNavy,
    flex: 1,
  },
  couponExpiry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  couponExpiryText: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.orange,
  },
  couponPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceSection: {
    flex: 1,
  },
  couponPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.orange,
    marginBottom: 2,
  },
  couponOriginalPrice: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
  },
  usedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(166,254,90,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  usedBadgeText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: Colors.green,
  },
  expiringBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,90,0,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  expiringBadgeText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: Colors.orange,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
    textAlign: "center",
  },

  bottomPadding: {
    height: 20,
  },
  // Guest styles
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  guestIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  guestTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    textAlign: "center",
    marginBottom: 12,
  },
  guestSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  guestSignInButton: {
    width: "100%",
    backgroundColor: Colors.orange,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  guestSignInButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
  guestRegisterButton: {
    width: "100%",
    backgroundColor: Colors.deepNavy,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: Colors.deepNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  guestRegisterButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
});

export default WalletScreen;
