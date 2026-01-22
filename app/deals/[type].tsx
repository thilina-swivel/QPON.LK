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
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
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
  expiresIn?: string;
}

const pageData: Record<string, { title: string; icon: string; color: string }> =
  {
    "deals-of-day": {
      title: "Deals of the Day",
      icon: "sun",
      color: Colors.orange,
    },
    expiring: {
      title: "Recently Expiring",
      icon: "clock",
      color: Colors.purple,
    },
    recommended: {
      title: "Recommended for You",
      icon: "star",
      color: Colors.teal,
    },
  };

const dealsData: Record<string, Deal[]> = {
  "deals-of-day": [
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
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    },
    {
      id: 3,
      name: "Sushi Premium Set",
      category: "Japanese",
      location: "Colombo 05",
      price: 3500,
      originalPrice: 7000,
      discount: 50,
      couponsLeft: 12,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300",
    },
    {
      id: 4,
      name: "Morning Brew Special",
      category: "Cafe",
      location: "Colombo 03",
      price: 450,
      originalPrice: 900,
      discount: 50,
      couponsLeft: 32,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    },
    {
      id: 5,
      name: "Burger Feast",
      category: "American",
      location: "Colombo 04",
      price: 1200,
      originalPrice: 2000,
      discount: 40,
      couponsLeft: 18,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    },
    {
      id: 6,
      name: "Thai Delight",
      category: "Thai",
      location: "Colombo 02",
      price: 2200,
      originalPrice: 4000,
      discount: 45,
      couponsLeft: 28,
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=300",
    },
  ],
  expiring: [
    {
      id: 1,
      name: "Café Mocha Special",
      category: "Cafe",
      location: "Colombo 03",
      price: 650,
      originalPrice: 1200,
      discount: 46,
      couponsLeft: 5,
      expiresIn: "2h left",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300",
    },
    {
      id: 2,
      name: "Weekend Brunch Buffet",
      category: "Dining",
      location: "Colombo 07",
      price: 3500,
      originalPrice: 6000,
      discount: 42,
      couponsLeft: 3,
      expiresIn: "5h left",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300",
    },
    {
      id: 3,
      name: "Cocktail Hour Deal",
      category: "Bar",
      location: "Colombo 01",
      price: 1500,
      originalPrice: 3000,
      discount: 50,
      couponsLeft: 8,
      expiresIn: "8h left",
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300",
    },
    {
      id: 4,
      name: "Spa Day Package",
      category: "Spa",
      location: "Colombo 04",
      price: 5000,
      originalPrice: 10000,
      discount: 50,
      couponsLeft: 2,
      expiresIn: "12h left",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
    },
    {
      id: 5,
      name: "Ice Cream Sundae",
      category: "Dessert",
      location: "Colombo 06",
      price: 350,
      originalPrice: 700,
      discount: 50,
      couponsLeft: 10,
      expiresIn: "1d left",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300",
    },
    {
      id: 6,
      name: "Pasta Night Special",
      category: "Italian",
      location: "Colombo 05",
      price: 1800,
      originalPrice: 3200,
      discount: 44,
      couponsLeft: 6,
      expiresIn: "18h left",
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300",
    },
  ],
  recommended: [
    {
      id: 1,
      name: "Fine Dining Experience",
      category: "Restaurant",
      location: "Colombo 07",
      price: 4500,
      originalPrice: 9000,
      discount: 50,
      couponsLeft: 15,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
    },
    {
      id: 2,
      name: "Artisan Coffee Tasting",
      category: "Cafe",
      location: "Colombo 03",
      price: 800,
      originalPrice: 1500,
      discount: 47,
      couponsLeft: 22,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
    },
    {
      id: 3,
      name: "Rooftop Lounge Night",
      category: "Bar",
      location: "Colombo 01",
      price: 2500,
      originalPrice: 4500,
      discount: 44,
      couponsLeft: 18,
      image:
        "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=300",
    },
    {
      id: 4,
      name: "Seafood Platter Deluxe",
      category: "Seafood",
      location: "Colombo 03",
      price: 4200,
      originalPrice: 7500,
      discount: 44,
      couponsLeft: 9,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300",
    },
    {
      id: 5,
      name: "BBQ Grill Feast",
      category: "BBQ",
      location: "Colombo 05",
      price: 3200,
      originalPrice: 5500,
      discount: 42,
      couponsLeft: 14,
      image:
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300",
    },
    {
      id: 6,
      name: "Dessert Paradise",
      category: "Dessert",
      location: "Colombo 04",
      price: 900,
      originalPrice: 1600,
      discount: 44,
      couponsLeft: 30,
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300",
    },
  ],
};

const DealsScreen = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const pageType = (type || "deals-of-day").toLowerCase();
  const page = pageData[pageType] || pageData["deals-of-day"];
  const deals = dealsData[pageType] || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, []);

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
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

  const filteredDeals = deals.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderDealCard = ({ item, index }: { item: Deal; index: number }) => (
    <Animated.View
      style={[
        styles.dealCard,
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
      <TouchableOpacity activeOpacity={0.9}>
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
            size={16}
            style={styles.dealFavorite}
          />
          <View style={styles.dealDiscountBadge}>
            <Text style={styles.dealDiscountText}>{item.discount}% OFF</Text>
          </View>
          {item.expiresIn && (
            <View style={styles.expiringBadge}>
              <Feather name="clock" size={10} color={Colors.white} />
              <Text style={styles.expiringText}>{item.expiresIn}</Text>
            </View>
          )}
        </View>
        <View style={styles.dealInfo}>
          <Text style={styles.dealName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.dealLocationRow}>
            <Feather name="map-pin" size={11} color={Colors.gray500} />
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
            <Feather name="tag" size={11} color={Colors.orange} />
            <Text style={styles.couponsText}>
              {item.couponsLeft} coupons left
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{page.title}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scale: searchScale }],
            borderColor: searchFocused ? Colors.orange : Colors.gray200,
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={searchFocused ? Colors.orange : Colors.gray400}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search deals..."
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

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredDeals.length} deals found
        </Text>
      </View>

      {/* Deals Grid */}
      <Animated.FlatList
        data={filteredDeals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="search" size={40} color={Colors.gray400} />
            </View>
            <Text style={styles.emptyTitle}>No deals found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms
            </Text>
          </View>
        }
      />
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
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
  },
  headerSpacer: {
    width: 44,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
    marginLeft: 12,
    marginRight: 8,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dealCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
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
  expiringBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.purple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  expiringText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 10,
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
    marginBottom: 6,
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
  couponsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  couponsText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.orange,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
  },
});

export default DealsScreen;
