import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import {
    Quicksand_700Bold,
    useFonts as useQuicksandFonts,
} from "@expo-google-fonts/quicksand";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
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
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

const APP_VERSION = "1.0.0";

type FeatureItem = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: "map-pin",
    title: "Discover Nearby",
    description: "Find amazing deals from merchants right around you",
  },
  {
    icon: "percent",
    title: "Exclusive Discounts",
    description: "Access special offers not available anywhere else",
  },
  {
    icon: "shield",
    title: "Trusted Merchants",
    description: "Partner with verified and reliable local businesses",
  },
  {
    icon: "heart",
    title: "Save Your Favorites",
    description: "Keep track of deals you love for easy access",
  },
];

export default function AboutUsScreen() {
  const router = useRouter();

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const versionOpacity = useRef(new Animated.Value(0)).current;

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    animateContent();
  }, []);

  const animateContent = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(featuresOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(versionOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={Colors.deepNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/qpon-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>Your Local Deals Companion</Text>
        </Animated.View>

        {/* Description Card */}
        <Animated.View
          style={[styles.descriptionCard, { opacity: contentOpacity }]}
        >
          <View style={styles.descriptionHeader}>
            <View style={styles.descriptionIconContainer}>
              <Feather name="info" size={20} color={Colors.orange} />
            </View>
            <Text style={styles.descriptionTitle}>Who We Are</Text>
          </View>
          <Text style={styles.descriptionText}>
            QPON.LK is your local travel and lifestyle companion, helping you
            discover nearby deals and save money effortlessly. Whether you're
            exploring a new city or enjoying your favorite spots, QPON connects
            you with exclusive discounts from trusted merchants around you.
          </Text>
        </Animated.View>

        {/* Features Section */}
        <Animated.View
          style={[styles.featuresSection, { opacity: featuresOpacity }]}
        >
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </View>
        </Animated.View>

        {/* Mission Card */}
        <Animated.View
          style={[styles.missionCard, { opacity: contentOpacity }]}
        >
          <LinearGradient
            colors={[Colors.deepNavy, "#1a2d5a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.missionGradient}
          >
            <View style={styles.missionIconContainer}>
              <Feather name="target" size={24} color={Colors.orange} />
            </View>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              To empower local businesses and help consumers discover amazing
              value in their everyday lives, building stronger communities one
              deal at a time.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Version Section */}
        <Animated.View
          style={[styles.versionSection, { opacity: versionOpacity }]}
        >
          <View style={styles.versionDivider} />
          <View style={styles.versionContent}>
            <View style={styles.versionRow}>
              <Text style={styles.versionLabel}>App Version</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionNumber}>{APP_VERSION}</Text>
              </View>
            </View>
            <Text style={styles.copyrightText}>
              © 2026 QPON.LK. All rights reserved.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

type FeatureCardProps = {
  feature: FeatureItem;
  index: number;
};

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
      style={[
        styles.featureCard,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.featureTouchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.featureIconContainer}>
          <Feather name={feature.icon} size={22} color={Colors.orange} />
        </View>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoImage: {
    width: 200,
    height: 70,
  },
  tagline: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
  descriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  descriptionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${Colors.orange}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  descriptionTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  descriptionText: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  featureCard: {
    width: (width - 52) / 2,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  featureTouchable: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${Colors.orange}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 18,
  },
  missionCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: Colors.deepNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  missionGradient: {
    padding: 24,
    alignItems: "center",
  },
  missionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  missionTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.white,
    marginBottom: 12,
  },
  missionText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
  },
  versionSection: {
    alignItems: "center",
  },
  versionDivider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray200,
    marginBottom: 20,
  },
  versionContent: {
    alignItems: "center",
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  versionLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
  versionBadge: {
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  versionNumber: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.orange,
  },
  copyrightText: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
  },
});
