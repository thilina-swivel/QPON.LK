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
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteButton from "../components/FavoriteButton";
import { Colors, Fonts } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

const FavoritesScreen = () => {
  const router = useRouter();
  const { favorites } = useFavorites();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  const renderFavoriteCard = (item: (typeof favorites)[0], index: number) => (
    <Animated.View
      key={item.id}
      style={[
        styles.favoriteCard,
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
        activeOpacity={0.9}
        onPress={() => router.push(`/deal/${item.id}`)}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <FavoriteButton item={item} size={16} style={styles.cardFavorite} />
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.category && (
            <View style={styles.cardCategoryRow}>
              <Feather name="tag" size={11} color={Colors.gray500} />
              <Text style={styles.cardCategory}>{item.category}</Text>
            </View>
          )}
          {item.price && (
            <Text style={styles.cardPrice}>
              LKR {item.price.toLocaleString()}
            </Text>
          )}
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
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Content */}
      {favorites.length === 0 ? (
        <Animated.View
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.emptyIcon}>
            <Feather name="heart" size={48} color={Colors.gray400} />
          </View>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring deals and tap the heart icon to save your favorites
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/(tabs)/explore")}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreButtonText}>Explore Deals</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
              saved
            </Text>
          </View>

          <View style={styles.grid}>
            {favorites.map((item, index) => renderFavoriteCard(item, index))}
          </View>

          <View style={styles.bottomPadding} />
        </Animated.ScrollView>
      )}
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
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  resultsHeader: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  resultsCount: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favoriteCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardFavorite: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  discountBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  cardCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  cardCategory: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
  cardPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 14,
    color: Colors.orange,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
  bottomPadding: {
    height: 40,
  },
});

export default FavoritesScreen;
