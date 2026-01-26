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
import FavoriteButton from "../../components/FavoriteButton";
import { Colors, Fonts } from "../../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const SMALL_CARD_WIDTH = (width - 56) / 2;

// Mock Data
const categories = [
  { id: 1, name: "Nearby Deals", icon: "map-pin", route: "nearby" },
  { id: 2, name: "Cafe", icon: "coffee", route: "cafe" },
  { id: 3, name: "Bar", icon: "glass", route: "bar" },
  { id: 4, name: "Dining", icon: "utensils", route: "restaurants" },
];

const spotlightDeals = [
  {
    id: 1,
    title: "Gourmet Weekend Deals",
    subtitle: "Save up to 50% on select fine dining",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    sponsored: true,
  },
  {
    id: 2,
    title: "Coffee Lovers Paradise",
    subtitle: "Buy 1 Get 1 Free on all premium coffees",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    sponsored: false,
  },
  {
    id: 3,
    title: "Happy Hour Specials",
    subtitle: "50% off cocktails every evening 5-8 PM",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800",
    sponsored: true,
  },
  {
    id: 4,
    title: "Spa & Wellness Week",
    subtitle: "Relax and rejuvenate with exclusive packages",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    sponsored: false,
  },
];

const dealsOfDay = [
  {
    id: 1,
    name: "The Ocean Saver",
    category: "Seafood",
    location: "Colombo 03",
    price: 2500,
    originalPrice: 5000,
    discount: 20,
    couponsLeft: 45,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
  },
  {
    id: 2,
    name: "Pizza Paradise",
    category: "Italian",
    location: "Colombo 07",
    price: 1800,
    originalPrice: 3000,
    discount: 40,
    couponsLeft: 23,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  },
  {
    id: 3,
    name: "Sushi Master",
    category: "Japanese",
    location: "Colombo 05",
    price: 3500,
    originalPrice: 7000,
    discount: 50,
    couponsLeft: 12,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
  },
];

const expiringDeals = [
  {
    id: 1,
    name: "Cafe Nero Special",
    expiresIn: "23H:45M",
    price: 1750,
    originalPrice: 3500,
    discount: 50,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
  },
  {
    id: 2,
    name: "Meat House Prime",
    expiresIn: "54H:12M",
    price: 3000,
    originalPrice: 6000,
    discount: 50,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200",
  },
  {
    id: 3,
    name: "Sushi Master",
    expiresIn: "12H:30M",
    price: 2250,
    originalPrice: 4500,
    discount: 50,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200",
  },
];

const recommendedDeals = [
  {
    id: 1,
    name: "Burger Kingdom",
    price: 1400,
    originalPrice: 2800,
    discount: 50,
    couponsLeft: 32,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
  },
  {
    id: 2,
    name: "Serenity Spa",
    price: 3000,
    originalPrice: 8000,
    discount: 62,
    couponsLeft: 18,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
  },
  {
    id: 3,
    name: "Coffee Corner",
    price: 900,
    originalPrice: 1500,
    discount: 40,
    couponsLeft: 56,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
  },
  {
    id: 4,
    name: "FitZone Gym",
    price: 3300,
    originalPrice: 5500,
    discount: 40,
    couponsLeft: 12,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300",
  },
  {
    id: 5,
    name: "Sweet Delights",
    price: 1100,
    originalPrice: 2200,
    discount: 50,
    couponsLeft: 28,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300",
  },
  {
    id: 6,
    name: "Cinema Paradise",
    price: 2100,
    originalPrice: 3500,
    discount: 40,
    couponsLeft: 40,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300",
  },
];

const SPOTLIGHT_WIDTH = width - 56;
const SPOTLIGHT_INTERVAL = 4000;

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const spotlightDirection = useRef(1); // 1 for forward, -1 for backward
  const spotlightRef = useRef<FlatList>(null);
  const spotlightScrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, []);

  // Auto-scroll spotlight carousel with bounce-back effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => {
        let nextIndex = prev + spotlightDirection.current;

        // Reverse direction at boundaries
        if (nextIndex >= spotlightDeals.length - 1) {
          nextIndex = spotlightDeals.length - 1;
          spotlightDirection.current = -1;
        } else if (nextIndex <= 0) {
          nextIndex = 0;
          spotlightDirection.current = 1;
        }

        spotlightRef.current?.scrollToOffset({
          offset: nextIndex * (SPOTLIGHT_WIDTH + 16),
          animated: true,
        });
        return nextIndex;
      });
    }, SPOTLIGHT_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderCategoryChip = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => {
        setSelectedCategory(item.id);
        router.push(`/category/${item.route}`);
      }}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderDealCard = ({ item }: { item: (typeof dealsOfDay)[0] }) => (
    <Animated.View
      style={[
        styles.dealCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => router.push(`/deal/${item.id}`)}
      >
        <View style={styles.dealImageContainer}>
          <Image source={{ uri: item.image }} style={styles.dealImage} />
          <FavoriteButton
            item={{
              id: item.id,
              name: item.name,
              image: item.image,
              price: item.price,
              discount: item.discount,
              category: item.category,
            }}
            size={18}
            style={styles.favoriteButton}
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF!</Text>
          </View>
        </View>
        <View style={styles.dealInfo}>
          <Text style={styles.dealName}>{item.name}</Text>
          <View style={styles.dealLocation}>
            <Feather name="map-pin" size={12} color={Colors.gray500} />
            <Text style={styles.dealLocationText}>
              {item.category} • {item.location}
            </Text>
          </View>
          <View style={styles.dealPriceRow}>
            <Text style={styles.dealPrice}>
              LKR {item.price.toLocaleString()}
            </Text>
            <Text style={styles.dealOriginalPrice}>
              LKR {item.originalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.couponsRow}>
            <Feather name="tag" size={12} color={Colors.orange} />
            <Text style={styles.couponsText}>
              {item.couponsLeft} coupons left
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderExpiringDeal = ({
    item,
  }: {
    item: (typeof expiringDeals)[0];
  }) => (
    <TouchableOpacity
      style={styles.expiringCard}
      activeOpacity={0.95}
      onPress={() => router.push(`/deal/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.expiringImage} />
      <FavoriteButton
        item={{
          id: item.id + 100,
          name: item.name,
          image: item.image,
          price: item.price,
          discount: item.discount,
        }}
        size={14}
        style={styles.expiringFavorite}
      />
      <View style={styles.expiringInfo}>
        <Text style={styles.expiringName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.expiringTimeRow}>
          <Feather name="clock" size={14} color={Colors.orange} />
          <Text style={styles.expiringTime}>Expires in {item.expiresIn}</Text>
        </View>
        <View style={styles.expiringPriceRow}>
          <View style={styles.expiringPriceSection}>
            <Text style={styles.expiringPrice}>
              LKR {item.price.toLocaleString()}
            </Text>
            <Text style={styles.expiringOriginal}>
              LKR {item.originalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.expiringDiscountBadge}>
            <Text style={styles.expiringDiscountText}>
              {item.discount}% OFF
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedCard = ({
    item,
    index,
  }: {
    item: (typeof recommendedDeals)[0];
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.recommendedCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: Animated.multiply(
                slideAnim,
                new Animated.Value(1 + index * 0.1),
              ),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => router.push(`/deal/${item.id}`)}
      >
        <View style={styles.recommendedImageContainer}>
          <Image source={{ uri: item.image }} style={styles.recommendedImage} />
          <FavoriteButton
            item={{
              id: item.id + 200,
              name: item.name,
              image: item.image,
              price: item.price,
              discount: item.discount,
            }}
            size={16}
            style={styles.recommendedFavorite}
          />
          <View style={styles.recommendedDiscountBadge}>
            <Text style={styles.recommendedDiscountText}>
              {item.discount}% OFF
            </Text>
          </View>
        </View>
        <View style={styles.recommendedInfo}>
          <Text style={styles.recommendedName}>{item.name}</Text>
          <View style={styles.recommendedPriceRow}>
            <Text style={styles.recommendedPrice}>
              LKR {item.price.toLocaleString()}
            </Text>
            <Text style={styles.recommendedOriginal}>
              LKR {item.originalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.recommendedCoupons}>
            <Feather name="tag" size={11} color={Colors.orange} />
            <Text style={styles.recommendedCouponsText}>
              {item.couponsLeft} Coupon left
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

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
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Thilina</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/search")}
              activeOpacity={0.7}
            >
              <Feather name="search" size={22} color={Colors.deepNavy} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/notifications")}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={22} color={Colors.deepNavy} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Savings Card */}
        <LinearGradient
          colors={[Colors.deepNavy, Colors.purpleDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.savingsCard}
        >
          <View style={styles.savingsSection}>
            <Text style={styles.savingsLabel}>YOU'VE SAVED</Text>
            <Text style={styles.savingsAmount}>
              <Text style={styles.savingsCurrency}>LKR </Text>00
            </Text>
            <Text style={styles.savingsApprox}>Approx*</Text>
          </View>
          <View style={styles.savingsDivider} />
          <View style={styles.savingsSection}>
            <Text style={styles.savingsLabel}>TOTAL APP SAVINGS</Text>
            <Text style={[styles.savingsAmount, styles.savingsTotal]}>
              <Text style={styles.savingsCurrency}>LKR </Text>3,544K
            </Text>
            <Text style={styles.savingsApprox}>Approx*</Text>
          </View>
        </LinearGradient>

        {/* Early Bird Alert */}
        <TouchableOpacity
          style={styles.alertBanner}
          activeOpacity={0.9}
          onPress={() => router.push("/(tabs)/wallet")}
        >
          <View style={styles.alertIconContainer}>
            <Feather name="gift" size={20} color={Colors.deepNavy} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Early Bird Offer</Text>
            <Text style={styles.alertSubtitle}>
              Congratulations! You've received 3 free coupons.
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color={Colors.deepNavy} />
        </TouchableOpacity>

        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Spotlight Section */}
        <View style={styles.spotlightHeader}>
          <Text style={styles.sectionTitle}>Spotlight</Text>
        </View>

        <Animated.FlatList
          ref={spotlightRef}
          data={spotlightDeals}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SPOTLIGHT_WIDTH + 16}
          decelerationRate="fast"
          contentContainerStyle={styles.spotlightCarousel}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: spotlightScrollX } } }],
            {
              useNativeDriver: false,
              listener: (event: any) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / (SPOTLIGHT_WIDTH + 16));
                if (
                  index !== currentSpotlight &&
                  index >= 0 &&
                  index < spotlightDeals.length
                ) {
                  setCurrentSpotlight(index);
                }
              },
            },
          )}
          scrollEventThrottle={16}
          renderItem={({ item: deal, index }) => {
            const inputRange = [
              (index - 1) * (SPOTLIGHT_WIDTH + 16),
              index * (SPOTLIGHT_WIDTH + 16),
              (index + 1) * (SPOTLIGHT_WIDTH + 16),
            ];
            const scale = spotlightScrollX.interpolate({
              inputRange,
              outputRange: [0.95, 1, 0.95],
              extrapolate: "clamp",
            });
            const opacity = spotlightScrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
              extrapolate: "clamp",
            });
            return (
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <TouchableOpacity
                  style={styles.spotlightCard}
                  activeOpacity={0.95}
                >
                  <Image
                    source={{ uri: deal.image }}
                    style={styles.spotlightImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.spotlightGradient}
                  >
                    {deal.sponsored && (
                      <View style={styles.sponsoredBadge}>
                        <Feather name="zap" size={12} color={Colors.white} />
                        <Text style={styles.sponsoredText}>SPONSORED</Text>
                      </View>
                    )}
                    <Text style={styles.spotlightTitle}>{deal.title}</Text>
                    <Text style={styles.spotlightSubtitle}>
                      {deal.subtitle}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />

        {/* Spotlight Pagination Dots */}
        <View style={styles.paginationContainer}>
          {spotlightDeals.map((_, index) => {
            const inputRange = [
              (index - 1) * (SPOTLIGHT_WIDTH + 16),
              index * (SPOTLIGHT_WIDTH + 16),
              (index + 1) * (SPOTLIGHT_WIDTH + 16),
            ];
            const dotWidth = spotlightScrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const dotOpacity = spotlightScrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: "clamp",
            });
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  spotlightRef.current?.scrollToOffset({
                    offset: index * (SPOTLIGHT_WIDTH + 16),
                    animated: true,
                  });
                  setCurrentSpotlight(index);
                }}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.paginationDot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor:
                        currentSpotlight === index
                          ? Colors.orange
                          : Colors.gray400,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Deals of the Day */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Deals of the Day</Text>
          <TouchableOpacity onPress={() => router.push("/deals/deals-of-day")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={dealsOfDay}
          renderItem={renderDealCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsContainer}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        />

        {/* Recently Expiring */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Expiring</Text>
          <TouchableOpacity onPress={() => router.push("/deals/expiring")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {expiringDeals.map((deal) => (
          <View key={deal.id}>{renderExpiringDeal({ item: deal })}</View>
        ))}

        {/* Recommended for You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={() => router.push("/deals/recommended")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendedGrid}>
          {recommendedDeals.map((deal, index) => (
            <View key={deal.id} style={styles.recommendedGridItem}>
              {renderRecommendedCard({ item: deal, index })}
            </View>
          ))}
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
  welcomeText: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
  },
  userName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 24,
    color: Colors.deepNavy,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
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
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 10,
    color: Colors.white,
  },
  savingsCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  savingsSection: {
    flex: 1,
  },
  savingsDivider: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 20,
  },
  savingsLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.gray400,
    letterSpacing: 0.5,
  },
  savingsAmount: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.white,
    marginTop: 4,
  },
  savingsCurrency: {
    fontSize: 14,
  },
  savingsTotal: {
    color: Colors.orange,
  },
  savingsApprox: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: Colors.gray400,
    marginTop: 2,
  },
  alertBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#FFB800",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  alertSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.deepNavy,
    opacity: 0.8,
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginRight: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: Colors.deepNavy,
  },
  categoryChipText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray700,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
  },
  viewAllText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.orange,
  },
  spotlightHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  spotlightCarousel: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  spotlightCard: {
    width: width - 56,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 16,
  },
  spotlightImage: {
    width: "100%",
    height: "100%",
  },
  spotlightGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
  },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 4,
  },
  sponsoredText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  spotlightTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.white,
  },
  spotlightSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray300,
    marginTop: 4,
  },
  dealsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  dealCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginRight: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  dealImageContainer: {
    position: "relative",
  },
  dealImage: {
    width: "100%",
    height: 120,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: Colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 12,
    color: Colors.white,
  },
  dealInfo: {
    padding: 16,
  },
  dealName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  dealLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  dealLocationText: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  dealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  dealPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.orange,
  },
  dealOriginalPrice: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  couponsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  couponsText: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.orange,
  },
  expiringCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  expiringImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.gray200,
  },
  expiringFavorite: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expiringInfo: {
    flex: 1,
  },
  expiringName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 6,
  },
  expiringTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },
  expiringTime: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.orange,
  },
  expiringPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expiringPriceSection: {
    flex: 1,
  },
  expiringPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.orange,
    marginBottom: 2,
  },
  expiringOriginal: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  expiringDiscountBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expiringDiscountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.deepNavy,
  },
  recommendedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  recommendedGridItem: {
    width: SMALL_CARD_WIDTH,
  },
  recommendedCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  recommendedImageContainer: {
    position: "relative",
  },
  recommendedImage: {
    width: "100%",
    height: 100,
  },
  recommendedFavorite: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendedDiscountBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedDiscountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  recommendedPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  recommendedPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 15,
    color: Colors.orange,
  },
  recommendedOriginal: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  recommendedCoupons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  recommendedCouponsText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.orange,
  },
  bottomPadding: {
    height: 20,
  },
});

export default HomeScreen;
