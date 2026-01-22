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
import { useLocalSearchParams, useRouter } from "expo-router";
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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteButton from "../../components/FavoriteButton";
import { Colors, Fonts } from "../../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

interface Merchant {
  id: number;
  name: string;
  location: string;
  dealCount: number;
  coverImage: string;
  logo: string;
  rating: number;
}

interface Deal {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  couponsLeft: number;
  image: string;
}

const categoryData: Record<
  string,
  { title: string; icon: string; color: string }
> = {
  cafe: { title: "Cafe", icon: "coffee", color: Colors.deepNavy },
  bar: { title: "Bar", icon: "moon", color: Colors.purple },
  restaurants: { title: "Dining", icon: "grid", color: Colors.teal },
  nearby: { title: "Nearby", icon: "map-pin", color: Colors.orange },
};

const merchantsData: Record<string, Merchant[]> = {
  cafe: [
    {
      id: 1,
      name: "Coffee Corner",
      location: "Colombo 03",
      dealCount: 5,
      coverImage:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
      logo: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=100",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Cafe Nero",
      location: "Colombo 07",
      dealCount: 3,
      coverImage:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
      logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100",
      rating: 4.6,
    },
    {
      id: 3,
      name: "The Bean House",
      location: "Colombo 05",
      dealCount: 7,
      coverImage:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      logo: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Artisan Brew",
      location: "Nugegoda",
      dealCount: 4,
      coverImage:
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400",
      logo: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=100",
      rating: 4.5,
    },
  ],
  bar: [
    {
      id: 1,
      name: "Sky Lounge",
      location: "Colombo 01",
      dealCount: 4,
      coverImage:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400",
      logo: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=100",
      rating: 4.7,
    },
    {
      id: 2,
      name: "The Pub House",
      location: "Colombo 04",
      dealCount: 6,
      coverImage:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
      logo: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=100",
      rating: 4.4,
    },
    {
      id: 3,
      name: "Moonlight Bar",
      location: "Colombo 03",
      dealCount: 3,
      coverImage:
        "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400",
      logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=100",
      rating: 4.6,
    },
  ],
  restaurants: [
    {
      id: 1,
      name: "The Ocean Saver",
      location: "Colombo 03",
      dealCount: 8,
      coverImage:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
      logo: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Pizza Paradise",
      location: "Colombo 07",
      dealCount: 5,
      coverImage:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Sushi Master",
      location: "Colombo 05",
      dealCount: 6,
      coverImage:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
      logo: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=100",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Burger Kingdom",
      location: "Colombo 04",
      dealCount: 4,
      coverImage:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      logo: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=100",
      rating: 4.6,
    },
  ],
  nearby: [
    {
      id: 1,
      name: "Coffee Corner",
      location: "500m away",
      dealCount: 5,
      coverImage:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
      logo: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=100",
      rating: 4.8,
    },
    {
      id: 2,
      name: "The Ocean Saver",
      location: "1.2km away",
      dealCount: 8,
      coverImage:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
      logo: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100",
      rating: 4.8,
    },
  ],
};

const dealsData: Record<string, Deal[]> = {
  cafe: [
    {
      id: 1,
      name: "Morning Brew Special",
      price: 450,
      originalPrice: 900,
      discount: 50,
      couponsLeft: 32,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    },
    {
      id: 2,
      name: "Cafe Latte Combo",
      price: 750,
      originalPrice: 1500,
      discount: 50,
      couponsLeft: 18,
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300",
    },
    {
      id: 3,
      name: "Pastry & Coffee",
      price: 650,
      originalPrice: 1300,
      discount: 50,
      couponsLeft: 45,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
    },
    {
      id: 4,
      name: "Iced Coffee Deal",
      price: 400,
      originalPrice: 800,
      discount: 50,
      couponsLeft: 28,
      image:
        "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300",
    },
  ],
  bar: [
    {
      id: 1,
      name: "Happy Hour Special",
      price: 1500,
      originalPrice: 3000,
      discount: 50,
      couponsLeft: 15,
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300",
    },
    {
      id: 2,
      name: "Cocktail Night",
      price: 2000,
      originalPrice: 4000,
      discount: 50,
      couponsLeft: 22,
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300",
    },
    {
      id: 3,
      name: "Weekend Vibes",
      price: 2500,
      originalPrice: 5000,
      discount: 50,
      couponsLeft: 12,
      image:
        "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=300",
    },
  ],
  restaurants: [
    {
      id: 1,
      name: "Seafood Platter",
      price: 2500,
      originalPrice: 5000,
      discount: 50,
      couponsLeft: 45,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300",
    },
    {
      id: 2,
      name: "Pizza Family Deal",
      price: 1800,
      originalPrice: 3000,
      discount: 40,
      couponsLeft: 23,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300",
    },
    {
      id: 3,
      name: "Sushi Premium Set",
      price: 3500,
      originalPrice: 7000,
      discount: 50,
      couponsLeft: 12,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300",
    },
    {
      id: 4,
      name: "Burger Combo",
      price: 1400,
      originalPrice: 2800,
      discount: 50,
      couponsLeft: 32,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    },
  ],
  nearby: [
    {
      id: 1,
      name: "Coffee Special",
      price: 450,
      originalPrice: 900,
      discount: 50,
      couponsLeft: 32,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    },
    {
      id: 2,
      name: "Seafood Lunch",
      price: 2500,
      originalPrice: 5000,
      discount: 50,
      couponsLeft: 45,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300",
    },
  ],
};

const CategoryScreen = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const categoryType = (type || "cafe").toLowerCase();
  const category = categoryData[categoryType] || categoryData.cafe;
  const merchants = merchantsData[categoryType] || [];
  const deals = dealsData[categoryType] || [];

  const [activeView, setActiveView] = useState<"merchants" | "deals">("deals");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filterOptions = [
    { id: "expiring", label: "Recently Expiring", icon: "clock" },
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "daily", label: "Deals of the Day", icon: "zap" },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const searchScale = useRef(new Animated.Value(1)).current;

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
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
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

  const filteredMerchants = merchants.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDeals = deals.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderMerchantCard = ({ item }: { item: Merchant }) => (
    <Animated.View
      style={[
        styles.merchantCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.merchantCoverContainer}>
          <Image
            source={{ uri: item.coverImage }}
            style={styles.merchantCover}
          />
          <View style={styles.merchantLogoContainer}>
            <Image source={{ uri: item.logo }} style={styles.merchantLogo} />
          </View>
        </View>
        <View style={styles.merchantInfo}>
          <Text style={styles.merchantName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.merchantLocationRow}>
            <Feather name="map-pin" size={12} color={Colors.gray500} />
            <Text style={styles.merchantLocation}>{item.location}</Text>
          </View>
          <View style={styles.merchantDealsRow}>
            <Feather name="tag" size={12} color={Colors.orange} />
            <Text style={styles.merchantDeals}>
              {item.dealCount} deals available
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDealCard = ({ item }: { item: Deal }) => (
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
        activeOpacity={0.9}
        onPress={() => router.push(`/deal/${item.id}`)}
      >
        <View style={styles.dealImageContainer}>
          <Image source={{ uri: item.image }} style={styles.dealImage} />
          <FavoriteButton
            item={{
              id: item.id + 300,
              name: item.name,
              image: item.image,
              price: item.price,
              discount: item.discount,
            }}
            size={16}
            style={styles.dealFavorite}
          />
          <View style={styles.dealDiscountBadge}>
            <Text style={styles.dealDiscountText}>{item.discount}% OFF</Text>
          </View>
        </View>
        <View style={styles.dealInfo}>
          <Text style={styles.dealName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.dealPriceRow}>
            <Text style={styles.dealPrice}>
              LKR {item.price.toLocaleString()}
            </Text>
            <Text style={styles.dealOriginalPrice}>
              LKR {item.originalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.dealCouponsRow}>
            <Feather name="tag" size={11} color={Colors.orange} />
            <Text style={styles.dealCouponsText}>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={Colors.deepNavy} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{category.title}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.filterButton,
                showFilterDropdown && styles.filterButtonActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Feather
                name="sliders"
                size={20}
                color={showFilterDropdown ? Colors.white : Colors.deepNavy}
              />
            </TouchableOpacity>
            {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      selectedFilter === option.id && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedFilter(
                        selectedFilter === option.id ? null : option.id,
                      );
                      setShowFilterDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={option.icon as any}
                      size={16}
                      color={
                        selectedFilter === option.id
                          ? Colors.orange
                          : Colors.gray500
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedFilter === option.id &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedFilter === option.id && (
                      <Feather name="check" size={16} color={Colors.orange} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
            placeholder={`Search ${activeView === "merchants" ? "merchants" : "deals"}...`}
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              activeOpacity={0.7}
            >
              <Feather name="x" size={18} color={Colors.gray500} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Toggle Chips */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleChip,
              activeView === "merchants" && styles.toggleChipActive,
            ]}
            onPress={() => setActiveView("merchants")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                activeView === "merchants" && styles.toggleTextActive,
              ]}
            >
              Merchants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleChip,
              activeView === "deals" && styles.toggleChipActive,
            ]}
            onPress={() => setActiveView("deals")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                activeView === "deals" && styles.toggleTextActive,
              ]}
            >
              Deals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {activeView === "merchants"
              ? `${filteredMerchants.length} merchants found`
              : `${filteredDeals.length} deals found`}
          </Text>
        </View>

        {/* Content Grid */}
        {activeView === "merchants" ? (
          <FlatList
            data={filteredMerchants}
            renderItem={renderMerchantCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="search" size={48} color={Colors.gray400} />
                <Text style={styles.emptyStateText}>No merchants found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try a different search term
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={filteredDeals}
            renderItem={renderDealCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="search" size={48} color={Colors.gray400} />
                <Text style={styles.emptyStateText}>No deals found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try a different search term
                </Text>
              </View>
            }
          />
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
  scrollContent: {
    paddingBottom: 20,
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
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
  },
  filterButton: {
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
  filterButtonActive: {
    backgroundColor: Colors.orange,
  },
  filterDropdown: {
    position: "absolute",
    top: 52,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  filterOptionActive: {
    backgroundColor: `${Colors.orange}10`,
  },
  filterOptionText: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray600,
  },
  filterOptionTextActive: {
    color: Colors.orange,
    fontFamily: Fonts.body.semiBold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
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
    borderColor: Colors.orange,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
    marginLeft: 12,
    marginRight: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  toggleChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  toggleChipActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  toggleText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray500,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  // Merchant Card Styles
  merchantCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  merchantCoverContainer: {
    position: "relative",
  },
  merchantCover: {
    width: "100%",
    height: 90,
  },
  merchantLogoContainer: {
    position: "absolute",
    bottom: -20,
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  merchantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  merchantInfo: {
    paddingTop: 24,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  merchantName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginBottom: 6,
  },
  merchantLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  merchantLocation: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  merchantDealsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  merchantDeals: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.orange,
  },

  // Deal Card Styles
  dealCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
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
    marginBottom: 6,
  },
  dealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
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
  dealCouponsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dealCouponsText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.orange,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginTop: 16,
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
});

export default CategoryScreen;
