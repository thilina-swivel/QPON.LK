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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteButton from "../components/FavoriteButton";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

interface Deal {
  id: number;
  name: string;
  category: string;
  location: string;
  price: number;
  originalPrice: number;
  discount: number;
  couponsLeft: number;
  image: string;
}

interface Merchant {
  id: number;
  name: string;
  location: string;
  dealCount: number;
  logo: string;
  category: string;
}

const recentSearchesData = [
  "Pizza deals",
  "Coffee near me",
  "Weekend spa",
  "Fine dining Colombo",
  "Happy hour",
];

const allDeals: Deal[] = [
  {
    id: 1,
    name: "Pizza Paradise Special",
    category: "Italian",
    location: "Colombo 07",
    price: 1800,
    originalPrice: 3000,
    discount: 40,
    couponsLeft: 23,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  },
  {
    id: 2,
    name: "Morning Brew Special",
    category: "Cafe",
    location: "Colombo 03",
    price: 450,
    originalPrice: 900,
    discount: 50,
    couponsLeft: 32,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
  },
  {
    id: 3,
    name: "Seafood Platter",
    category: "Seafood",
    location: "Colombo 03",
    price: 2500,
    originalPrice: 5000,
    discount: 50,
    couponsLeft: 45,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300",
  },
  {
    id: 4,
    name: "Sushi Premium Set",
    category: "Japanese",
    location: "Colombo 05",
    price: 3500,
    originalPrice: 7000,
    discount: 50,
    couponsLeft: 12,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300",
  },
  {
    id: 5,
    name: "Happy Hour Cocktails",
    category: "Bar",
    location: "Colombo 01",
    price: 1500,
    originalPrice: 3000,
    discount: 50,
    couponsLeft: 15,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300",
  },
  {
    id: 6,
    name: "Spa Day Package",
    category: "Spa",
    location: "Colombo 04",
    price: 5000,
    originalPrice: 10000,
    discount: 50,
    couponsLeft: 8,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
  },
];

const allMerchants: Merchant[] = [
  {
    id: 1,
    name: "Coffee Corner",
    location: "Colombo 03",
    dealCount: 5,
    logo: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=100",
    category: "Cafe",
  },
  {
    id: 2,
    name: "Pizza Paradise",
    location: "Colombo 07",
    dealCount: 3,
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
    category: "Restaurant",
  },
  {
    id: 3,
    name: "Sky Lounge",
    location: "Colombo 01",
    dealCount: 4,
    logo: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=100",
    category: "Bar",
  },
  {
    id: 4,
    name: "Serenity Spa",
    location: "Colombo 04",
    dealCount: 6,
    logo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100",
    category: "Spa",
  },
  {
    id: 5,
    name: "The Ocean Saver",
    location: "Colombo 03",
    dealCount: 8,
    logo: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100",
    category: "Restaurant",
  },
];

const SearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentSearchesData);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const searchInputRef = useRef<TextInput>(null);
  const inputScale = useRef(new Animated.Value(1)).current;

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
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto focus on search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim().length === 0) {
      setHasSearched(false);
      setFilteredDeals([]);
      setFilteredMerchants([]);
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();

      const deals = allDeals.filter(
        (deal) =>
          deal.name.toLowerCase().includes(lowerQuery) ||
          deal.category.toLowerCase().includes(lowerQuery) ||
          deal.location.toLowerCase().includes(lowerQuery),
      );

      const merchants = allMerchants.filter(
        (merchant) =>
          merchant.name.toLowerCase().includes(lowerQuery) ||
          merchant.category.toLowerCase().includes(lowerQuery) ||
          merchant.location.toLowerCase().includes(lowerQuery),
      );

      setFilteredDeals(deals);
      setFilteredMerchants(merchants);
      setHasSearched(true);
      setIsSearching(false);

      // Add to recent searches if not already there
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]);
      }
    }, 500);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
    Keyboard.dismiss();
  };

  const handleClearRecent = (search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  };

  const handleInputFocus = () => {
    Animated.spring(inputScale, {
      toValue: 1.02,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.spring(inputScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  const renderDealCard = (deal: Deal) => (
    <TouchableOpacity key={deal.id} style={styles.dealCard} activeOpacity={0.9} onPress={() => router.push(`/deal/${deal.id}`)}>
      <View style={styles.dealImageContainer}>
        <Image source={{ uri: deal.image }} style={styles.dealImage} />
        <FavoriteButton
          item={{
            id: deal.id + 500,
            name: deal.name,
            image: deal.image,
            price: deal.price,
            discount: deal.discount,
            category: deal.category,
          }}
          size={16}
          style={styles.dealFavorite}
        />
        <View style={styles.dealDiscountBadge}>
          <Text style={styles.dealDiscountText}>{deal.discount}% OFF</Text>
        </View>
      </View>
      <View style={styles.dealInfo}>
        <Text style={styles.dealName} numberOfLines={1}>
          {deal.name}
        </Text>
        <View style={styles.dealLocationRow}>
          <Feather name="map-pin" size={11} color={Colors.gray500} />
          <Text style={styles.dealLocationText}>
            {deal.category} • {deal.location}
          </Text>
        </View>
        <View style={styles.dealPriceRow}>
          <Text style={styles.dealPrice}>
            LKR {deal.price.toLocaleString()}
          </Text>
          <Text style={styles.dealOriginalPrice}>
            LKR {deal.originalPrice.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMerchantCard = (merchant: Merchant) => (
    <TouchableOpacity
      key={merchant.id}
      style={styles.merchantCard}
      activeOpacity={0.8}
    >
      <Image source={{ uri: merchant.logo }} style={styles.merchantLogo} />
      <View style={styles.merchantInfo}>
        <Text style={styles.merchantName} numberOfLines={1}>
          {merchant.name}
        </Text>
        <View style={styles.merchantMeta}>
          <Feather name="map-pin" size={11} color={Colors.gray500} />
          <Text style={styles.merchantLocation}>{merchant.location}</Text>
        </View>
      </View>
      <View style={styles.merchantDeals}>
        <Text style={styles.merchantDealsCount}>{merchant.dealCount}</Text>
        <Text style={styles.merchantDealsLabel}>deals</Text>
      </View>
    </TouchableOpacity>
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

        <Animated.View
          style={[
            styles.searchContainer,
            { transform: [{ scale: inputScale }] },
          ]}
        >
          <Feather name="search" size={20} color={Colors.gray400} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="What's on your mind?"
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length > 2) {
                handleSearch(text);
              } else if (text.length === 0) {
                setHasSearched(false);
                setFilteredDeals([]);
                setFilteredMerchants([]);
              }
            }}
            onSubmitEditing={() => handleSearch(searchQuery)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setHasSearched(false);
                setFilteredDeals([]);
                setFilteredMerchants([]);
              }}
              activeOpacity={0.7}
            >
              <Feather name="x" size={18} color={Colors.gray500} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading State */}
        {isSearching && (
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="small" color={Colors.orange} />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        )}

        {/* Recent Searches - Show when not searched */}
        {!hasSearched && !isSearching && recentSearches.length > 0 && (
          <Animated.View
            style={[
              styles.recentSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity
                onPress={() => setRecentSearches([])}
                activeOpacity={0.7}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => handleRecentSearchClick(search)}
                activeOpacity={0.7}
              >
                <Feather name="clock" size={16} color={Colors.gray400} />
                <Text style={styles.recentItemText}>{search}</Text>
                <TouchableOpacity
                  onPress={() => handleClearRecent(search)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={16} color={Colors.gray400} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Popular Suggestions - Show when not searched */}
        {!hasSearched && !isSearching && (
          <Animated.View
            style={[
              styles.suggestionsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Popular</Text>
            <View style={styles.suggestionTags}>
              {[
                "Pizza",
                "Coffee",
                "Spa",
                "Fine Dining",
                "Happy Hour",
                "Sushi",
              ].map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionTag}
                  onPress={() => handleRecentSearchClick(tag)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.suggestionTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Search Results */}
        {hasSearched && !isSearching && (
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            {/* No Results */}
            {filteredDeals.length === 0 && filteredMerchants.length === 0 && (
              <View style={styles.noResults}>
                <View style={styles.noResultsIcon}>
                  <Feather name="search" size={40} color={Colors.gray400} />
                </View>
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsSubtitle}>
                  Try different keywords or check your spelling
                </Text>
              </View>
            )}

            {/* Merchants Results */}
            {filteredMerchants.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.resultsSectionHeader}>
                  <Text style={styles.sectionTitle}>Merchants</Text>
                  <Text style={styles.resultsCount}>
                    {filteredMerchants.length} found
                  </Text>
                </View>
                {filteredMerchants.map((merchant) =>
                  renderMerchantCard(merchant),
                )}
              </View>
            )}

            {/* Deals Results */}
            {filteredDeals.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.resultsSectionHeader}>
                  <Text style={styles.sectionTitle}>Deals</Text>
                  <Text style={styles.resultsCount}>
                    {filteredDeals.length} found
                  </Text>
                </View>
                <View style={styles.dealsGrid}>
                  {filteredDeals.map((deal) => renderDealCard(deal))}
                </View>
              </View>
            )}
          </Animated.View>
        )}

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
    marginLeft: 12,
    marginRight: 8,
  },
  scrollContent: {
    paddingTop: 8,
  },
  searchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },
  searchingText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
  },
  clearAllText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.orange,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    gap: 12,
  },
  recentItemText: {
    flex: 1,
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  suggestionsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 16,
  },
  suggestionTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestionTag: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  suggestionTagText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray600,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noResultsTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  resultsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  merchantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  merchantLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  merchantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  merchantName: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  merchantMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  merchantLocation: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  merchantDeals: {
    alignItems: "center",
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  merchantDealsCount: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.orange,
  },
  merchantDealsLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 10,
    color: Colors.orange,
  },
  dealsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dealCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  dealImageContainer: {
    position: "relative",
  },
  dealImage: {
    width: "100%",
    height: 120,
  },
  dealFavorite: {
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
  dealDiscountBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dealDiscountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
  },
  dealInfo: {
    padding: 12,
  },
  dealName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  dealLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  dealLocationText: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
  dealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dealPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 14,
    color: Colors.orange,
  },
  dealOriginalPrice: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  bottomPadding: {
    height: 40,
  },
});

export default SearchScreen;
