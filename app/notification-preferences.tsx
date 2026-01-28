import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import {
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
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

const { height } = Dimensions.get("window");

// Mock merchant data for onboarding
const allMerchants = [
  {
    id: "1",
    name: "Keells Super",
    logo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100",
    category: "Supermarket",
    enabled: true,
  },
  {
    id: "2",
    name: "Pizza Hut",
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
    category: "Restaurant",
    enabled: true,
  },
  {
    id: "3",
    name: "Fashion Bug",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
    category: "Fashion",
    enabled: true,
  },
  {
    id: "4",
    name: "Abans",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100",
    category: "Electronics",
    enabled: true,
  },
  {
    id: "5",
    name: "Cargills",
    logo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100",
    category: "Supermarket",
    enabled: false,
  },
  {
    id: "6",
    name: "McDonald's",
    logo: "https://images.unsplash.com/photo-1619881589928-a0a2ab84fc34?w=100",
    category: "Restaurant",
    enabled: true,
  },
  {
    id: "7",
    name: "Softlogic",
    logo: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=100",
    category: "Electronics",
    enabled: false,
  },
  {
    id: "8",
    name: "ODEL",
    logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100",
    category: "Fashion",
    enabled: true,
  },
];

type Merchant = {
  id: string;
  name: string;
  logo: string;
  category: string;
  enabled: boolean;
};

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>(allMerchants);
  const [isSaving, setIsSaving] = useState(false);
  const searchFocusAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
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

  const handleFocus = () => {
    Animated.spring(searchFocusAnim, {
      toValue: 1,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(searchFocusAnim, {
      toValue: 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const getBorderColor = () => {
    return searchFocusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.gray200, Colors.orange],
    });
  };

  const toggleMerchant = (merchantId: string) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId ? { ...m, enabled: !m.enabled } : m,
      ),
    );
  };

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const enabledCount = merchants.filter((m) => m.enabled).length;

  const handleContinue = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.replace("/location-access");
    }, 1000);
  };

  const handleSkip = () => {
    router.replace("/location-access");
  };

  const selectAll = () => {
    setMerchants((prev) => prev.map((m) => ({ ...m, enabled: true })));
  };

  const deselectAll = () => {
    setMerchants((prev) => prev.map((m) => ({ ...m, enabled: false })));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotComplete]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Notification Preferences</Text>
            <Text style={styles.headerSubtitle}>
              Choose which merchants you'd like to hear from
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Animated.View
            style={[styles.searchContainer, { borderColor: getBorderColor() }]}
          >
            <Feather name="search" size={20} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search merchants..."
              placeholderTextColor={Colors.gray400}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x-circle" size={18} color={Colors.gray400} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.merchantCount}>
            {enabledCount} of {merchants.length} selected
          </Text>
          <View style={styles.quickActionButtons}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={selectAll}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionText}>Select All</Text>
            </TouchableOpacity>
            <View style={styles.quickActionDivider} />
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={deselectAll}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionText}>Deselect All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Merchant List */}
        <ScrollView
          style={styles.merchantList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.merchantListContent}
        >
          {filteredMerchants.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="search" size={48} color={Colors.gray300} />
              <Text style={styles.emptyStateTitle}>No merchants found</Text>
              <Text style={styles.emptyStateText}>
                Try a different search term
              </Text>
            </View>
          ) : (
            filteredMerchants.map((merchant, index) => (
              <MerchantItem
                key={merchant.id}
                merchant={merchant}
                onToggle={() => toggleMerchant(merchant.id)}
                index={index}
              />
            ))
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.continueButtonText}>Continue to QPON</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

type MerchantItemProps = {
  merchant: Merchant;
  onToggle: () => void;
  index: number;
};

const MerchantItem = ({ merchant, onToggle, index }: MerchantItemProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={styles.merchantItem}
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.merchantLeft}>
          <Image source={{ uri: merchant.logo }} style={styles.merchantLogo} />
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName}>{merchant.name}</Text>
            <Text style={styles.merchantCategory}>{merchant.category}</Text>
          </View>
        </View>
        <Switch
          value={merchant.enabled}
          onValueChange={onToggle}
          trackColor={{ false: Colors.gray200, true: `${Colors.orange}50` }}
          thumbColor={merchant.enabled ? Colors.orange : Colors.gray400}
          ios_backgroundColor={Colors.gray200}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray100,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray300,
  },
  progressDotComplete: {
    backgroundColor: Colors.orange,
    width: 24,
  },
  progressDotActive: {
    backgroundColor: Colors.orange,
    width: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 24,
    color: Colors.deepNavy,
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    textAlign: "center",
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  quickActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  merchantCount: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  quickActionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quickActionText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.orange,
  },
  quickActionDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.gray300,
    marginHorizontal: 4,
  },
  merchantList: {
    flex: 1,
  },
  merchantListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  merchantItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  merchantLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  merchantLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
  },
  merchantInfo: {
    marginLeft: 12,
    flex: 1,
  },
  merchantName: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 2,
  },
  merchantCategory: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginTop: 16,
  },
  emptyStateText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 4,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: 8,
  },
  continueButton: {
    backgroundColor: Colors.orange,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 17,
    color: Colors.white,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.gray600,
  },
});
