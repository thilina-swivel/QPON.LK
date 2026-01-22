import { Colors, Fonts } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
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
import { useFavorites } from "../../context/FavoritesContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 280;

// Mock deal data - in real app, fetch based on ID
const getDealById = (id: string) => ({
  id: parseInt(id) || 1,
  title: "Gourmet Burger Combo",
  subtitle: "Premium dining experience with signature burgers",
  labels: ["Recently Expiring"],
  merchant: {
    name: "Urban Bites Kitchen",
    location: "Colombo 03, Near Dutch Hospital",
    rating: 4.8,
    reviewCount: 256,
  },
  images: [
    "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
    "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
    "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
  ],
  originalPrice: 2500,
  discountedPrice: 1875,
  discountPercent: 25,
  currency: "LKR",
  totalCoupons: 500,
  soldCount: 347,
  remainingCount: 153,
  expirationDate: "2026-02-15",
  validTimeStart: "5:00 PM",
  validTimeEnd: "9:00 PM",
  validDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  description:
    "Indulge in our signature gourmet burger combo featuring a juicy 200g premium beef patty, topped with aged cheddar, caramelized onions, crispy bacon, fresh lettuce, and our secret house sauce. Served with golden crispy fries and a refreshing drink of your choice.\n\nPerfect for food enthusiasts looking for an exceptional dining experience at an unbeatable price.",
  termsAndConditions: [
    "Valid for dine-in only",
    "One coupon per person per visit",
    "Cannot be combined with other offers",
    "Reservation recommended during peak hours",
    "Valid Monday to Friday, 5:00 PM - 9:00 PM",
    "Must present coupon before ordering",
    "No cash value or refunds",
    "Management reserves the right to modify terms",
  ],
  category: "Dining",
});

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();

  const deal = getDealById(id || "1");
  const isFav = isFavorite(deal.id);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  // Carousel state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const confirmModalAnim = useRef(new Animated.Value(0)).current;
  const confirmSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-scroll carousel
    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  const startAutoScroll = () => {
    autoScrollTimer.current = setInterval(() => {
      setActiveImageIndex((prev) => {
        const next = (prev + 1) % deal.images.length;
        carouselRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
      // Reset auto-scroll timer when user scrolls manually
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
        startAutoScroll();
      }
    }

    // Update header opacity based on scroll
    const scrollY = event.nativeEvent.contentOffset.y;
    Animated.timing(headerOpacity, {
      toValue: scrollY > 100 ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        tension: 300,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        tension: 300,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    toggleFavorite({
      id: deal.id,
      name: deal.title,
      image: deal.images[0],
      price: deal.discountedPrice,
      discount: deal.discountPercent,
      category: deal.category,
    });
  };

  const handleBuyPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      openConfirmModal();
    });
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
    Animated.parallel([
      Animated.timing(confirmModalAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(confirmSlideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeConfirmModal = () => {
    Animated.parallel([
      Animated.timing(confirmModalAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(confirmSlideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmModal(false);
    });
  };

  const handleConfirmPurchase = () => {
    closeConfirmModal();
    // Generate coupon code
    const couponCode = `QPON-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).toUpperCase().slice(-4)}`;
    // Navigate to success page
    setTimeout(() => {
      router.push({
        pathname: "/coupon-success/[id]",
        params: { id: deal.id.toString(), couponCode },
      });
    }, 300);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const remainingPercent = (deal.remainingCount / deal.totalCoupons) * 100;

  const renderImageItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <LinearGradient
        colors={[Colors.deepNavyLight, Colors.deepNavy]}
        style={styles.imagePlaceholder}
      >
        <Image
          source={{ uri: item }}
          style={styles.carouselImage}
          resizeMode="cover"
          defaultSource
        />
      </LinearGradient>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)"]}
        style={styles.imageOverlay}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={Colors.deepNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deal Details</Text>
        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            {isFav ? (
              <Ionicons name="heart" size={24} color={Colors.orange} />
            ) : (
              <Feather name="heart" size={24} color={Colors.deepNavy} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Image Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={carouselRef}
              data={deal.images}
              renderItem={renderImageItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              keyExtractor={(_, index) => index.toString()}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {deal.images.map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeImageIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>

            {/* Discount Badge */}
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                {deal.discountPercent}% OFF
              </Text>
            </View>

            {/* Labels */}
            {deal.labels && deal.labels.length > 0 && (
              <View style={styles.carouselLabels}>
                {deal.labels.map((label, index) => (
                  <View key={index} style={styles.carouselLabelBadge}>
                    <Text style={styles.carouselLabelText}>{label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Main Content Card */}
          <View style={styles.mainCard}>
            {/* Title & Subtitle Section */}
            <View style={styles.titleSection}>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <Text style={styles.dealSubtitle}>{deal.subtitle}</Text>
            </View>

            {/* Merchant & Category */}
            <TouchableOpacity
              style={styles.merchantCategoryRow}
              onPress={() => router.push(`/merchant/${deal.id}`)}
              activeOpacity={0.7}
            >
              <Feather name="map-pin" size={12} color={Colors.gray500} />
              <Text style={styles.merchantText}>{deal.merchant.name}</Text>
              <Feather name="chevron-right" size={14} color={Colors.gray400} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{deal.category}</Text>
              </View>
            </TouchableOpacity>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <View style={styles.priceLeft}>
                <Text style={styles.originalPrice}>
                  {deal.currency} {formatPrice(deal.originalPrice)}
                </Text>
                <Text style={styles.discountedPrice}>
                  {deal.currency} {formatPrice(deal.discountedPrice)}
                </Text>
              </View>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>
                  Save {deal.currency}{" "}
                  {formatPrice(deal.originalPrice - deal.discountedPrice)}
                </Text>
              </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{deal.totalCoupons}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{deal.soldCount}</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.remainingValue]}>
                  {deal.remainingCount}
                </Text>
                <Text style={styles.statLabel}>Left</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { width: `${100 - remainingPercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(100 - remainingPercent)}% claimed
              </Text>
            </View>

            {/* Validity Section - Minimal */}
            <View style={styles.validityRow}>
              <View style={styles.validityChip}>
                <Feather name="calendar" size={14} color={Colors.orange} />
                <Text style={styles.validityChipText}>
                  Expires {formatDate(deal.expirationDate)}
                </Text>
              </View>
              <View style={styles.validityChip}>
                <Feather name="clock" size={14} color={Colors.orange} />
                <Text style={styles.validityChipText}>
                  {deal.validTimeStart} – {deal.validTimeEnd}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="file-text" size={18} color={Colors.orange} />
              <Text style={styles.sectionTitle}>About This Deal</Text>
            </View>
            <Text style={styles.descriptionText}>{deal.description}</Text>
          </View>

          {/* Terms & Conditions Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={18} color={Colors.orange} />
              <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            </View>
            {deal.termsAndConditions.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <View style={styles.termBullet} />
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.ctaLeft}>
          <Text style={styles.ctaPrice}>
            {deal.currency} {formatPrice(deal.discountedPrice)}
          </Text>
          <Text style={styles.ctaOriginal}>
            {deal.currency} {formatPrice(deal.originalPrice)}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyPress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.orange, Colors.orangeLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyButtonGradient}
            >
              <Text style={styles.buyButtonText}>Get Coupon</Text>
              <Feather name="arrow-right" size={18} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="none"
        onRequestClose={closeConfirmModal}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: confirmModalAnim }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeConfirmModal}
          />
          <Animated.View
            style={[
              styles.confirmModal,
              {
                transform: [{ translateY: confirmSlideAnim }],
                paddingBottom: Math.max(34, insets.bottom + 20),
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Confirm Your Purchase</Text>
            <Text style={styles.modalSubtitle}>
              You're about to claim this coupon
            </Text>

            {/* Deal Summary */}
            <View style={styles.modalDealCard}>
              <View style={styles.modalDealHeader}>
                <View style={styles.modalDiscountBadge}>
                  <Text style={styles.modalDiscountText}>
                    {deal.discountPercent}% OFF
                  </Text>
                </View>
                <Text style={styles.modalDealTitle}>{deal.title}</Text>
              </View>

              <View style={styles.modalDealRow}>
                <Feather name="map-pin" size={14} color={Colors.gray500} />
                <Text style={styles.modalDealMerchant}>
                  {deal.merchant.name}
                </Text>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalPriceRow}>
                <View>
                  <Text style={styles.modalPriceLabel}>You Pay</Text>
                  <Text style={styles.modalPrice}>
                    {deal.currency} {formatPrice(deal.discountedPrice)}
                  </Text>
                </View>
                <View style={styles.modalSavings}>
                  <Feather name="tag" size={14} color="#2E8B57" />
                  <Text style={styles.modalSavingsText}>
                    Save {deal.currency}{" "}
                    {formatPrice(deal.originalPrice - deal.discountedPrice)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Validity Info */}
            <View style={styles.modalValidityRow}>
              <View style={styles.modalValidityItem}>
                <Feather name="clock" size={16} color={Colors.orange} />
                <Text style={styles.modalValidityText}>
                  {deal.validTimeStart} – {deal.validTimeEnd}
                </Text>
              </View>
              <View style={styles.modalValidityItem}>
                <Feather name="calendar" size={16} color={Colors.orange} />
                <Text style={styles.modalValidityText}>
                  Expires {formatDate(deal.expirationDate)}
                </Text>
              </View>
            </View>

            {/* Terms Note */}
            <View style={styles.modalNote}>
              <Feather name="info" size={14} color={Colors.gray500} />
              <Text style={styles.modalNoteText}>
                By confirming, you agree to the terms and conditions of this
                deal.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeConfirmModal}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmPurchase}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[Colors.orange, Colors.orangeLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmGradient}
                >
                  <Feather name="check-circle" size={18} color={Colors.white} />
                  <Text style={styles.modalConfirmText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
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
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
  },
  favoriteButton: {
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  carouselContainer: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 20,
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: Colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountBadgeText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
  },
  mainCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  carouselLabels: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    gap: 8,
  },
  carouselLabelBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  carouselLabelText: {
    color: Colors.deepNavy,
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  labelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.gray100,
  },
  labelBadgePrimary: {
    backgroundColor: "rgba(255,90,0,0.1)",
  },
  labelText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 11,
    color: Colors.gray600,
  },
  labelTextPrimary: {
    color: Colors.orange,
  },
  titleSection: {
    marginBottom: 12,
  },
  dealTitle: {
    color: Colors.deepNavy,
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    marginBottom: 4,
  },
  dealSubtitle: {
    color: Colors.gray600,
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    lineHeight: 18,
  },
  merchantCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  merchantText: {
    color: Colors.gray600,
    fontSize: 13,
    fontFamily: Fonts.body.medium,
    marginRight: 4,
  },
  categoryBadge: {
    backgroundColor: "rgba(255,90,0,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: Colors.orange,
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  priceLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  originalPrice: {
    color: Colors.gray400,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    color: Colors.orange,
    fontSize: 26,
    fontFamily: "Quicksand_700Bold",
  },
  savingsBadge: {
    backgroundColor: "rgba(52,199,89,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  savingsText: {
    color: "#2E8B57",
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
  },
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: Colors.deepNavy,
    fontSize: 20,
    fontFamily: "Quicksand_700Bold",
  },
  remainingValue: {
    color: Colors.orange,
  },
  statLabel: {
    color: Colors.gray500,
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.gray200,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.orange,
    borderRadius: 3,
  },
  progressText: {
    color: Colors.gray500,
    fontSize: 11,
    fontFamily: "Manrope_400Regular",
    marginTop: 6,
    textAlign: "right",
  },
  validityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  validityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  validityChipText: {
    color: Colors.gray600,
    fontSize: 12,
    fontFamily: Fonts.body.medium,
  },
  dayBadgeActive: {
    backgroundColor: "rgba(255,90,0,0.12)",
  },
  dayText: {
    color: Colors.gray400,
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
  },
  dayTextActive: {
    color: Colors.orange,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.deepNavy,
    fontSize: 16,
    fontFamily: "Quicksand_600SemiBold",
  },
  descriptionText: {
    color: Colors.gray600,
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    lineHeight: 22,
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  termBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange,
    marginTop: 7,
  },
  termText: {
    flex: 1,
    color: Colors.gray600,
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
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
  },
  ctaLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  ctaPrice: {
    color: Colors.deepNavy,
    fontSize: 22,
    fontFamily: "Quicksand_700Bold",
  },
  ctaOriginal: {
    color: Colors.gray400,
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    textDecorationLine: "line-through",
  },
  buyButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  buyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  buyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
  },
  // Confirmation Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  confirmModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    textAlign: "center",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    marginBottom: 20,
  },
  modalDealCard: {
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  modalDealHeader: {
    marginBottom: 10,
  },
  modalDiscountBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalDiscountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
  },
  modalDealTitle: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 17,
    color: Colors.deepNavy,
  },
  modalDealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  modalDealMerchant: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginBottom: 12,
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalPriceLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 2,
  },
  modalPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.orange,
  },
  modalSavings: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(52,199,89,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalSavingsText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: "#2E8B57",
  },
  modalValidityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  modalValidityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalValidityText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray600,
  },
  modalNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(255,90,0,0.06)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalNoteText: {
    flex: 1,
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray600,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.gray600,
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  modalConfirmGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  modalConfirmText: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.white,
  },
});
