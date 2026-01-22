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
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

interface NearbyMerchant {
  id: number;
  name: string;
  distance: string;
  dealCount: number;
  logo: string;
  category: string;
  position: { top: number; left: number };
}

const nearbyMerchants: NearbyMerchant[] = [
  {
    id: 1,
    name: "Coffee Corner",
    distance: "250m",
    dealCount: 5,
    logo: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=100",
    category: "Cafe",
    position: { top: 25, left: 30 },
  },
  {
    id: 2,
    name: "Pizza Paradise",
    distance: "400m",
    dealCount: 3,
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
    category: "Restaurant",
    position: { top: 45, left: 65 },
  },
  {
    id: 3,
    name: "Sky Lounge",
    distance: "600m",
    dealCount: 4,
    logo: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=100",
    category: "Bar",
    position: { top: 60, left: 20 },
  },
  {
    id: 4,
    name: "Sushi Master",
    distance: "800m",
    dealCount: 6,
    logo: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=100",
    category: "Restaurant",
    position: { top: 35, left: 75 },
  },
  {
    id: 5,
    name: "The Bean House",
    distance: "350m",
    dealCount: 7,
    logo: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100",
    category: "Cafe",
    position: { top: 70, left: 55 },
  },
];

const radiusOptions = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "2km", value: 2000 },
  { label: "5km", value: 5000 },
];

const NearbyScreen = () => {
  const [selectedRadius, setSelectedRadius] = useState(1000);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMerchant, setSelectedMerchant] =
    useState<NearbyMerchant | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const refreshRotate = useRef(new Animated.Value(0)).current;
  const markerScales = useRef(
    nearbyMerchants.map(() => new Animated.Value(0)),
  ).current;
  const cardSlide = useRef(new Animated.Value(100)).current;

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
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for center marker
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Staggered marker animations
    markerScales.forEach((scale, index) => {
      Animated.spring(scale, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        friction: 6,
        tension: 100,
      }).start();
    });
  }, []);

  useEffect(() => {
    if (selectedMerchant) {
      Animated.spring(cardSlide, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }).start();
    } else {
      Animated.timing(cardSlide, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMerchant]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSelectedMerchant(null);

    // Rotate animation
    Animated.loop(
      Animated.timing(refreshRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();

    // Reset and re-animate markers
    markerScales.forEach((scale) => {
      scale.setValue(0);
    });

    setTimeout(() => {
      setIsRefreshing(false);
      refreshRotate.stopAnimation();
      refreshRotate.setValue(0);

      // Re-animate markers
      markerScales.forEach((scale, index) => {
        Animated.spring(scale, {
          toValue: 1,
          delay: index * 100,
          useNativeDriver: true,
          friction: 6,
          tension: 100,
        }).start();
      });
    }, 1500);
  };

  const handleRadiusChange = (radius: number) => {
    setSelectedRadius(radius);
    setSelectedMerchant(null);

    // Animate markers on radius change
    markerScales.forEach((scale) => {
      scale.setValue(0);
    });

    markerScales.forEach((scale, index) => {
      Animated.spring(scale, {
        toValue: 1,
        delay: index * 80,
        useNativeDriver: true,
        friction: 6,
        tension: 100,
      }).start();
    });
  };

  const spin = refreshRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  const getRadiusLabel = () => {
    const option = radiusOptions.find((r) => r.value === selectedRadius);
    return option ? option.label : "1km";
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
          <View>
            <Text style={styles.title}>Nearby</Text>
            <Text style={styles.subtitle}>Discover deals around you</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              isRefreshing && styles.refreshButtonActive,
            ]}
            onPress={handleRefresh}
            disabled={isRefreshing}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Feather
                name="refresh-cw"
                size={20}
                color={isRefreshing ? Colors.white : Colors.deepNavy}
              />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Location Card */}
        <Animated.View
          style={[
            styles.locationCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.locationIconContainer}>
            <Feather name="navigation" size={20} color={Colors.orange} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Your Location</Text>
            <Text style={styles.locationAddress}>
              42 Galle Road, Colombo 03
            </Text>
          </View>
          <View style={styles.radiusBadge}>
            <Feather name="target" size={14} color={Colors.orange} />
            <Text style={styles.radiusText}>{getRadiusLabel()}</Text>
          </View>
        </Animated.View>

        {/* Radius Selector */}
        <Animated.View
          style={[
            styles.radiusSelector,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.radiusSelectorLabel}>Search Range</Text>
          <View style={styles.radiusOptions}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radiusOption,
                  selectedRadius === option.value && styles.radiusOptionActive,
                ]}
                onPress={() => handleRadiusChange(option.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.radiusOptionText,
                    selectedRadius === option.value &&
                      styles.radiusOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Map Container */}
        <Animated.View
          style={[
            styles.mapContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#E8F4F8", "#F0F7FA", "#E8F4F8"]}
            style={styles.mapBackground}
          >
            {/* Grid lines for map effect */}
            <View style={styles.gridOverlay}>
              {[...Array(6)].map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={[
                    styles.gridLineHorizontal,
                    { top: `${(i + 1) * 14.28}%` },
                  ]}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={[
                    styles.gridLineVertical,
                    { left: `${(i + 1) * 14.28}%` },
                  ]}
                />
              ))}
            </View>

            {/* Radius circle */}
            <View style={styles.radiusCircle}>
              <Animated.View
                style={[
                  styles.radiusCircleInner,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
            </View>

            {/* Center marker (user location) */}
            <View style={styles.centerMarker}>
              <LinearGradient
                colors={[Colors.orange, "#FF8A50"]}
                style={styles.centerMarkerInner}
              >
                <Feather name="navigation" size={16} color={Colors.white} />
              </LinearGradient>
              <View style={styles.centerMarkerShadow} />
            </View>

            {/* Merchant markers */}
            {nearbyMerchants.map((merchant, index) => (
              <Animated.View
                key={merchant.id}
                style={[
                  styles.merchantMarker,
                  {
                    top: `${merchant.position.top}%`,
                    left: `${merchant.position.left}%`,
                    transform: [{ scale: markerScales[index] }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.merchantMarkerContent,
                    selectedMerchant?.id === merchant.id &&
                      styles.merchantMarkerSelected,
                  ]}
                  onPress={() =>
                    setSelectedMerchant(
                      selectedMerchant?.id === merchant.id ? null : merchant,
                    )
                  }
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: merchant.logo }}
                    style={styles.merchantMarkerLogo}
                  />
                  <View style={styles.merchantMarkerBadge}>
                    <Text style={styles.merchantMarkerBadgeText}>
                      {merchant.dealCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Loading overlay */}
            {isRefreshing && (
              <View style={styles.mapLoadingOverlay}>
                <ActivityIndicator size="large" color={Colors.orange} />
                <Text style={styles.mapLoadingText}>
                  Finding nearby deals...
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Merchants count */}
        <View style={styles.merchantsCountContainer}>
          <Text style={styles.merchantsCountText}>
            {nearbyMerchants.length} merchants within {getRadiusLabel()}
          </Text>
        </View>

        {/* Merchant List */}
        <View style={styles.merchantList}>
          <Text style={styles.merchantListTitle}>Nearby Merchants</Text>
          {nearbyMerchants.map((merchant, index) => (
            <Animated.View
              key={merchant.id}
              style={[
                styles.merchantListItem,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.merchantListItemContent,
                  selectedMerchant?.id === merchant.id &&
                    styles.merchantListItemSelected,
                ]}
                onPress={() =>
                  setSelectedMerchant(
                    selectedMerchant?.id === merchant.id ? null : merchant,
                  )
                }
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: merchant.logo }}
                  style={styles.merchantListLogo}
                />
                <View style={styles.merchantListInfo}>
                  <Text style={styles.merchantListName}>{merchant.name}</Text>
                  <View style={styles.merchantListMeta}>
                    <View style={styles.merchantListMetaItem}>
                      <Feather
                        name="map-pin"
                        size={12}
                        color={Colors.gray500}
                      />
                      <Text style={styles.merchantListMetaText}>
                        {merchant.distance}
                      </Text>
                    </View>
                    <View style={styles.merchantListMetaItem}>
                      <Feather name="tag" size={12} color={Colors.orange} />
                      <Text
                        style={[
                          styles.merchantListMetaText,
                          { color: Colors.orange },
                        ]}
                      >
                        {merchant.dealCount} deals
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.merchantListCategory}>
                  <Text style={styles.merchantListCategoryText}>
                    {merchant.category}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Selected Merchant Card */}
      {selectedMerchant && (
        <Animated.View
          style={[
            styles.selectedMerchantCard,
            { transform: [{ translateY: cardSlide }] },
          ]}
        >
          <View style={styles.selectedMerchantHeader}>
            <Image
              source={{ uri: selectedMerchant.logo }}
              style={styles.selectedMerchantLogo}
            />
            <View style={styles.selectedMerchantInfo}>
              <Text style={styles.selectedMerchantName}>
                {selectedMerchant.name}
              </Text>
              <View style={styles.selectedMerchantMeta}>
                <Feather name="map-pin" size={14} color={Colors.gray500} />
                <Text style={styles.selectedMerchantDistance}>
                  {selectedMerchant.distance} away
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedMerchant(null)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
          <View style={styles.selectedMerchantDeals}>
            <View style={styles.selectedMerchantDealsBadge}>
              <Feather name="tag" size={14} color={Colors.orange} />
              <Text style={styles.selectedMerchantDealsText}>
                {selectedMerchant.dealCount} deals available
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewDealsButton}
              activeOpacity={0.8}
            >
              <Text style={styles.viewDealsButtonText}>View Deals</Text>
              <Feather name="arrow-right" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.deepNavy,
  },
  subtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 4,
  },
  refreshButton: {
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
  refreshButtonActive: {
    backgroundColor: Colors.orange,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  locationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.orange}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 2,
  },
  locationAddress: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  radiusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  radiusText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: Colors.orange,
  },
  radiusSelector: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  radiusSelectorLabel: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray600,
    marginBottom: 10,
  },
  radiusOptions: {
    flexDirection: "row",
    gap: 10,
  },
  radiusOption: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  radiusOptionActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  radiusOptionText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray500,
  },
  radiusOptionTextActive: {
    color: Colors.white,
  },
  mapContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  mapBackground: {
    flex: 1,
    position: "relative",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  radiusCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 160,
    height: 160,
    marginTop: -80,
    marginLeft: -80,
    justifyContent: "center",
    alignItems: "center",
  },
  radiusCircleInner: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
    backgroundColor: `${Colors.orange}15`,
    borderWidth: 2,
    borderColor: `${Colors.orange}30`,
  },
  centerMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -20,
    marginLeft: -20,
    alignItems: "center",
  },
  centerMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  centerMarkerShadow: {
    position: "absolute",
    bottom: -4,
    width: 20,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
  },
  merchantMarker: {
    position: "absolute",
    alignItems: "center",
  },
  merchantMarkerContent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  merchantMarkerSelected: {
    borderColor: Colors.orange,
    shadowColor: Colors.orange,
    shadowOpacity: 0.3,
  },
  merchantMarkerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  merchantMarkerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  merchantMarkerBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 10,
    color: Colors.white,
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  mapLoadingText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray600,
    marginTop: 12,
  },
  merchantsCountContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  merchantsCountText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  merchantList: {
    paddingHorizontal: 20,
  },
  merchantListTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 16,
  },
  merchantListItem: {
    marginBottom: 12,
  },
  merchantListItemContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  merchantListItemSelected: {
    borderColor: Colors.orange,
  },
  merchantListLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  merchantListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  merchantListName: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  merchantListMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  merchantListMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  merchantListMetaText: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  merchantListCategory: {
    backgroundColor: `${Colors.deepNavy}10`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  merchantListCategoryText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.deepNavy,
  },
  selectedMerchantCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  selectedMerchantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  selectedMerchantLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  selectedMerchantInfo: {
    flex: 1,
    marginLeft: 14,
  },
  selectedMerchantName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  selectedMerchantMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectedMerchantDistance: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedMerchantDeals: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedMerchantDealsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedMerchantDealsText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.orange,
  },
  viewDealsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.orange,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
  },
  viewDealsButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.white,
  },
  bottomPadding: {
    height: 20,
  },
});

export default NearbyScreen;
