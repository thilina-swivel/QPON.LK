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
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
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

// Mock merchant data
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
    enabled: false,
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
  {
    id: "9",
    name: "KFC",
    logo: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100",
    category: "Restaurant",
    enabled: false,
  },
  {
    id: "10",
    name: "Singer",
    logo: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=100",
    category: "Electronics",
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

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>(allMerchants);
  const [isSaving, setIsSaving] = useState(false);
  const searchFocusAnim = useRef(new Animated.Value(0)).current;

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1000);
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={Colors.deepNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerPlaceholder} />
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
          {enabledCount} of {merchants.length} merchants selected
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
        <Text style={styles.sectionTitle}>
          Receive updates from these merchants
        </Text>

        {filteredMerchants.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="search" size={48} color={Colors.gray300} />
            <Text style={styles.emptyStateTitle}>No merchants found</Text>
            <Text style={styles.emptyStateText}>
              Try a different search term
            </Text>
          </View>
        ) : (
          filteredMerchants.map((merchant) => (
            <MerchantItem
              key={merchant.id}
              merchant={merchant}
              onToggle={() => toggleMerchant(merchant.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

type MerchantItemProps = {
  merchant: Merchant;
  onToggle: () => void;
};

const MerchantItem = ({ merchant, onToggle }: MerchantItemProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    fontSize: 18,
    color: Colors.deepNavy,
  },
  headerPlaceholder: {
    width: 44,
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
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  saveButton: {
    backgroundColor: Colors.orange,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.white,
  },
});
