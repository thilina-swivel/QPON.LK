import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";
import {
    Quicksand_600SemiBold,
    Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Swipe through\nexclusive offers",
    description:
      "Browse by category or explore your favourite merchants. It’s your adventure, your way. ",
    image: require("../assets/images/onboarding/Slide1.png"),
  },
  {
    id: 2,
    title: "Unlock your \ndeal instantly",
    description:
      "Just show your QPON code at checkout and enjoy your discount. Simple, fast, and rewarding. ",
    image: require("../assets/images/onboarding/Slide2.png"),
  },
  {
    id: 3,
    title: "Request a \ndeal near you",
    description:
      "Request promotions from your favourite merchants, and we’ll help make them happen. ",
    image: require("../assets/images/onboarding/Slide3.png"),
  },
  {
    id: 4,
    title: "Your next \nadventure awaits! ",
    description:
      "QPON is your local travel guide, helping you save time and money on adventures. ",
    image: require("../assets/images/onboarding/Slide4.png"),
  },
  {
    id: 5,
    title: "Deals \nthat find you ",
    description:
      "Get instant alerts for nearby discounts with QPON, always one step from great finds. ",
    image: require("../assets/images/onboarding/Slide5.png"),
  },
];

const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

const WelcomeScreen = () => {
  const router = useRouter();
  const { loginAsGuest } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [fontsLoaded] = useFonts({
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  // Auto-scroll functionality
  const scrollToNextSlide = useCallback(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    flatListRef.current?.scrollToIndex({
      index: nextSlide,
      animated: true,
    });
    setCurrentSlide(nextSlide);
  }, [currentSlide]);

  // Start auto-scroll timer
  useEffect(() => {
    autoScrollTimer.current = setInterval(
      scrollToNextSlide,
      AUTO_SCROLL_INTERVAL,
    );

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [scrollToNextSlide]);

  const handleExploreDeals = () => {
    loginAsGuest();
    router.push("/(tabs)");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleSignIn = () => {
    router.push("/signin");
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slideContainer}>
      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        <Image
          source={item.image}
          style={styles.slideImage}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textSection}>
        <Text style={styles.mainTitle}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.slidesWrapper}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
        />
      </View>

      {/* Indicators */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.indicatorActive,
            ]}
          />
        ))}
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={handleExploreDeals}
          activeOpacity={0.8}
        >
          <Text style={styles.exploreButtonText}>Explore Deals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.deepNavy,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
  },
  slidesWrapper: {
    flex: 1,
  },
  slideContainer: {
    width: width,
    flex: 1,
    justifyContent: "flex-start",
  },
  illustrationContainer: {
    height: height * 0.38,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  slideImage: {
    width: width - 32,
    height: "100%",
  },
  textSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  mainTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 36,
  },
  description: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purpleDark,
  },
  indicatorActive: {
    width: 28,
    backgroundColor: Colors.orange,
    borderRadius: 4,
  },
  buttonSection: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    gap: 12,
  },
  exploreButton: {
    backgroundColor: Colors.orange,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  exploreButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.white,
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.white,
  },
  signInButton: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.white,
  },
});

export default WelcomeScreen;
