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

const categories = [
  {
    id: 1,
    name: "Nearby",
    icon: "map-pin",
    color: Colors.orange,
    deals: 89,
  },
  {
    id: 2,
    name: "Cafe",
    icon: "coffee",
    color: Colors.deepNavy,
    deals: 124,
  },
  {
    id: 3,
    name: "Bar",
    icon: "moon",
    color: Colors.purple,
    deals: 56,
  },
  {
    id: 4,
    name: "Restaurants",
    icon: "grid",
    color: Colors.teal,
    deals: 78,
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
    router.push(`/category/${category.name.toLowerCase()}`);
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
          <Text style={styles.subtitle}>Discover deals by category</Text>
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

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => renderCategory(category, index))}
        </View>

        {/* Popular Searches */}
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>Popular Searches</Text>
          <View style={styles.popularTags}>
            {[
              "Fine Dining",
              "Weekend Getaway",
              "Spa Day",
              "Family Fun",
              "Date Night",
            ].map((tag, index) => (
              <TouchableOpacity key={index} style={styles.popularTag}>
                <Text style={styles.popularTagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.deepNavy,
  },
  subtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    marginTop: 4,
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
});

export default ExploreScreen;
