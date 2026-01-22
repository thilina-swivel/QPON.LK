import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import {
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    useFonts as useQuicksandFonts,
} from "@expo-google-fonts/quicksand";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Fonts } from "@/constants/theme";

const { width } = Dimensions.get("window");
const CATEGORY_WIDTH = (width - 56) / 2;

interface SearchMerchant {
  id: number;
  name: string;
  location: string;
  category: string;
  logo: string;
  dealCount: number;
}

interface SearchDeal {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
}

const categories = [
  {
    id: 1,
    name: "Nearby",
    icon: "map-pin",
    color: Colors.orange,
    deals: 89,
    route: "nearby",
  },
  {
    id: 2,
    name: "Cafe",
    icon: "coffee",
    color: Colors.deepNavy,
    deals: 124,
    route: "cafe",
  },
  {
    id: 3,
    name: "Bar",
    icon: "moon",
    color: Colors.purple,
    deals: 56,
    route: "bar",
  },
  {
    id: 4,
    name: "Dining",
    icon: "grid",
    color: Colors.teal,
    deals: 78,
    route: "restaurants",
  },
];

// All merchants for search
const allMerchants: SearchMerchant[] = [
  {
    id: 1,
    name: "Coffee Corner",
    location: "Colombo 03",
    category: "Cafe",
    logo: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=100",
    dealCount: 5,
  },
  {
    id: 2,
    name: "Cafe Nero",
    location: "Colombo 07",
    category: "Cafe",
    logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100",
    dealCount: 3,
  },
  {
    id: 3,
    name: "The Bean House",
    location: "Colombo 05",
    category: "Cafe",
    logo: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100",
    dealCount: 7,
  },
  {
    id: 4,
    name: "Artisan Brew",
    location: "Nugegoda",
    category: "Cafe",
    logo: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=100",
    dealCount: 4,
  },
  {
    id: 5,
    name: "Sky Lounge",
    location: "Colombo 01",
    category: "Bar",
    logo: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=100",
    dealCount: 4,
  },
  {
    id: 6,
    name: "The Pub House",
    location: "Colombo 04",
    category: "Bar",
    logo: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=100",
    dealCount: 6,
  },
  {
    id: 7,
    name: "Moonlight Bar",
    location: "Colombo 03",
    category: "Bar",
    logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=100",
    dealCount: 3,
  },
  {
    id: 8,
    name: "The Ocean Saver",
    location: "Colombo 03",
    category: "Dining",
    logo: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100",
    dealCount: 8,
  },
  {
    id: 9,
    name: "Pizza Paradise",
    location: "Colombo 07",
    category: "Dining",
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
    dealCount: 5,
  },
  {
    id: 10,
    name: "Sushi Master",
    location: "Colombo 05",
    category: "Dining",
    logo: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=100",
    dealCount: 6,
  },
  {
    id: 11,
    name: "Burger Kingdom",
    location: "Colombo 04",
    category: "Dining",
    logo: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=100",
    dealCount: 4,
  },
];

// All deals for search
const allDeals: SearchDeal[] = [
  {
    id: 1,
    name: "Morning Brew Special",
    price: 450,
    originalPrice: 900,
    discount: 50,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    category: "Cafe",
  },
  {
    id: 2,
    name: "Cafe Latte Combo",
    price: 750,
    originalPrice: 1500,
    discount: 50,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300",
    category: "Cafe",
  },
  {
    id: 3,
    name: "Pastry & Coffee",
    price: 650,
    originalPrice: 1300,
    discount: 50,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
    category: "Cafe",
  },
  {
    id: 4,
    name: "Cocktail Night Special",
    price: 1200,
    originalPrice: 2400,
    discount: 50,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300",
    category: "Bar",
  },
  {
    id: 5,
    name: "Happy Hour Deal",
    price: 800,
    originalPrice: 1600,
    discount: 50,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300",
    category: "Bar",
  },
  {
    id: 6,
    name: "Seafood Platter",
    price: 2500,
    originalPrice: 5000,
    discount: 50,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300",
    category: "Dining",
  },
  {
    id: 7,
    name: "Family Pizza Combo",
    price: 1800,
    originalPrice: 3600,
    discount: 50,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300",
    category: "Dining",
  },
  {
    id: 8,
    name: "Sushi Deluxe Set",
    price: 2200,
    originalPrice: 4400,
    discount: 50,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300",
    category: "Dining",
  },
  {
    id: 9,
    name: "Gourmet Burger Meal",
    price: 1400,
    originalPrice: 2800,
    discount: 50,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    category: "Dining",
  },
  {
    id: 10,
    name: "Weekend Brunch Special",
    price: 1600,
    originalPrice: 3200,
    discount: 50,
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=300",
    category: "Cafe",
  },
  {
    id: 11,
    name: "Date Night Package",
    price: 3500,
    originalPrice: 7000,
    discount: 50,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
    category: "Dining",
  },
  {
    id: 12,
    name: "Spa Day Retreat",
    price: 4500,
    originalPrice: 9000,
    discount: 50,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
    category: "Spa",
  },
  {
    id: 13,
    name: "Family Fun Package",
    price: 2800,
    originalPrice: 5600,
    discount: 50,
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300",
    category: "Entertainment",
  },
];

const ExploreScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchScale = useRef(new Animated.Value(1)).current;

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  if (!quicksandLoaded || !manropeLoaded) {
    return null;
  }

  // Filter merchants and deals based on search query
  const filteredMerchants =
    searchQuery.length > 0
      ? allMerchants
          .filter(
            (m) =>
              m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  const filteredDeals =
    searchQuery.length > 0
      ? allDeals
          .filter(
            (d) =>
              d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              d.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  const hasSearchResults =
    filteredMerchants.length > 0 || filteredDeals.length > 0;

  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.spring(searchScale, {
      toValue: 1.02,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.spring(searchScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleCategoryPress = (category: (typeof categories)[0]) => {
    router.push(`/category/${category.route}`);
  };

  const handlePopularTagPress = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleMerchantPress = (merchant: SearchMerchant) => {
    setSearchQuery("");
    router.push(`/merchant/${merchant.id}`);
  };

  const handleDealPress = (deal: SearchDeal) => {
    setSearchQuery("");
    router.push(`/deal/${deal.id}`);
  };

  const renderCategory = (category: (typeof categories)[0], index: number) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      activeOpacity={0.9}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={styles.categoryContent}>
        <View
          style={[
            styles.categoryIconContainer,
            { backgroundColor: `${category.color}15` },
          ]}
        >
          <Feather
            name={category.icon as any}
            size={24}
            color={category.color}
          />
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDeals}>{category.deals} deals</Text>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.title}>Explore</Text>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.7}
          >
            <Feather name="bell" size={22} color={Colors.deepNavy} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            searchFocused && styles.searchContainerFocused,
            { transform: [{ scale: searchScale }] },
          ]}
        >
          <Feather name="search" size={20} color={Colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for deals, restaurants..."
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={18} color={Colors.gray500} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Search Results */}
        {searchQuery.length > 0 ? (
          <View style={styles.searchResultsContainer}>
            {!hasSearchResults ? (
              <View style={styles.noResults}>
                <Feather name="search" size={48} color={Colors.gray300} />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try different keywords or browse categories
                </Text>
              </View>
            ) : (
              <>
                {/* Merchant Results */}
                {filteredMerchants.length > 0 && (
                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Merchants</Text>
                    {filteredMerchants.map((merchant) => (
                      <TouchableOpacity
                        key={`merchant-${merchant.id}`}
                        style={styles.merchantResultItem}
                        onPress={() => handleMerchantPress(merchant)}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={{ uri: merchant.logo }}
                          style={styles.merchantResultLogo}
                        />
                        <View style={styles.merchantResultInfo}>
                          <Text style={styles.merchantResultName}>
                            {merchant.name}
                          </Text>
                          <View style={styles.merchantResultMeta}>
                            <Feather
                              name="map-pin"
                              size={12}
                              color={Colors.gray400}
                            />
                            <Text style={styles.merchantResultLocation}>
                              {merchant.location}
                            </Text>
                            <View style={styles.merchantResultBadge}>
                              <Text style={styles.merchantResultBadgeText}>
                                {merchant.category}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.merchantResultDeals}>
                          <Text style={styles.merchantResultDealsCount}>
                            {merchant.dealCount}
                          </Text>
                          <Text style={styles.merchantResultDealsLabel}>
                            deals
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Deal Results */}
                {filteredDeals.length > 0 && (
                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Deals</Text>
                    {filteredDeals.map((deal) => (
                      <TouchableOpacity
                        key={`deal-${deal.id}`}
                        style={styles.dealResultItem}
                        onPress={() => handleDealPress(deal)}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={{ uri: deal.image }}
                          style={styles.dealResultImage}
                        />
                        <View style={styles.dealResultInfo}>
                          <Text style={styles.dealResultName} numberOfLines={1}>
                            {deal.name}
                          </Text>
                          <View style={styles.dealResultPriceRow}>
                            <Text style={styles.dealResultPrice}>
                              LKR {deal.price.toLocaleString()}
                            </Text>
                            <Text style={styles.dealResultOriginalPrice}>
                              LKR {deal.originalPrice.toLocaleString()}
                            </Text>
                          </View>
                          <View style={styles.dealResultBadge}>
                            <Text style={styles.dealResultBadgeText}>
                              {deal.discount}% OFF
                            </Text>
                          </View>
                        </View>
                        <Feather
                          name="chevron-right"
                          size={20}
                          color={Colors.gray400}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <>
            {/* Categories Grid */}
            <View style={styles.categoriesGrid}>
              {categories.map((category, index) =>
                renderCategory(category, index),
              )}
            </View>

            {/* Popular Searches */}
            <View style={styles.popularSection}>
              <Text style={styles.popularTitle}>Popular Searches</Text>
              <View style={styles.popularTags}>
                {[
                  "Fine Dining",
                  "Weekend Brunch",
                  "Spa Day",
                  "Family Fun",
                  "Date Night",
                  "Coffee",
                  "Cocktail",
                  "Pizza",
                ].map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularTag}
                    onPress={() => handlePopularTagPress(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.popularTagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingBottom: 8,
  },
  title: {
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainerFocused: {
    borderColor: Colors.gray300,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
    marginLeft: 12,
    marginRight: 8,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: CATEGORY_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryContent: {
    padding: 16,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 15,
    color: Colors.deepNavy,
    textAlign: "center",
  },
  categoryDeals: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  popularSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  popularTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 16,
  },
  popularTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  popularTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  popularTagText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray700,
  },
  // Search Results Styles
  searchResultsContainer: {
    paddingHorizontal: 20,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 18,
    color: Colors.gray600,
    marginTop: 16,
  },
  noResultsSubtext: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 4,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultSectionTitle: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 12,
  },
  merchantResultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  merchantResultLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  merchantResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  merchantResultName: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  merchantResultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  merchantResultLocation: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginRight: 8,
  },
  merchantResultBadge: {
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  merchantResultBadgeText: {
    fontFamily: Fonts.body.medium,
    fontSize: 10,
    color: Colors.orange,
  },
  merchantResultDeals: {
    alignItems: "center",
  },
  merchantResultDealsCount: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.orange,
  },
  merchantResultDealsLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 10,
    color: Colors.gray400,
  },
  dealResultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dealResultImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  dealResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dealResultName: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  dealResultPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dealResultPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 14,
    color: Colors.orange,
  },
  dealResultOriginalPrice: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  dealResultBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  dealResultBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 10,
    color: Colors.white,
  },
});

export default ExploreScreen;
