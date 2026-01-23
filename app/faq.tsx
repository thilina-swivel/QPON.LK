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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I find a specific deal on the app?",
    answer:
      'If you know what you are looking for, click on the "Search" bar that appears at the top of the app and type what you are looking for. Press "Search".\n\nIf you are looking for a specific deal offered by your bank, turn on "Banks" switch and it will filter your results for you. You can also look for a deal through the "Categories" tab or filter by "Stores".',
  },
  {
    id: "2",
    question: "How do I request for a deal?",
    answer:
      'Go to "Stores" and click on the store that you would like to request the deal from. There is a button next to the name of the store "Request a deal" which you can click and enter your details.\n\nYou will be required to fill in the category, brand, offer type, products you want the deal for and any additional notes before pressing "Submit". You can request a deal from both the store and the bank.',
  },
  {
    id: "3",
    question: "Do I need a credit or a debit card to use the QPON app?",
    answer: "No. You can simply sign up and start using.",
  },
  {
    id: "4",
    question: "How are errors reported?",
    answer:
      "Depending on the error you are receiving, please refer to the help section and if you cannot find a satisfactory answer to your query, reach out to us via the Contact Us section and we will get back to you in 24 to 72 hours.",
  },
  {
    id: "5",
    question: "Will you be collecting my personal data? How will it be stored?",
    answer:
      "Yes. The data you have used to sign up will be stored in our system and will not be shared with any third parties. However, if you require us to remove all data pertaining to you from our systems, you can contact us and we will do so.",
  },
  {
    id: "6",
    question: "How can I make a complaint if there are issues in promotions?",
    answer:
      "Reach out to us via the Contact Us section with your queries. We will get back to you within 24 to 72 hours.",
  },
  {
    id: "7",
    question:
      "Do I need to add bank account details to view promotions that are specific to me?",
    answer:
      "No, you do not need to add bank account details. Simply browse and enjoy promotions available to you based on your preferences and location.",
  },
];

export default function FAQScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

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
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
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
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[styles.heroSection, { opacity: contentOpacity }]}
        >
          <View style={styles.heroIconContainer}>
            <Feather name="help-circle" size={32} color={Colors.orange} />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            Find answers to frequently asked questions about using QPON.LK
          </Text>
        </Animated.View>

        {/* FAQ List */}
        <Animated.View style={[styles.faqList, { opacity: contentOpacity }]}>
          {faqData.map((item, index) => (
            <FAQCard
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedId === item.id}
              onToggle={() => toggleExpand(item.id)}
            />
          ))}
        </Animated.View>

        {/* Contact Section */}
        <Animated.View
          style={[styles.contactSection, { opacity: contentOpacity }]}
        >
          <View style={styles.contactCard}>
            <View style={styles.contactIconContainer}>
              <Feather name="message-circle" size={24} color={Colors.orange} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactTitle}>Still have questions?</Text>
              <Text style={styles.contactSubtitle}>
                Reach out to us and we'll get back to you within 24-72 hours
              </Text>
            </View>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push("/contact-us")}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>Contact Us</Text>
              <Feather name="arrow-right" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

type FAQCardProps = {
  item: FAQItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
};

const FAQCard = ({ item, index, isExpanded, onToggle }: FAQCardProps) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

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

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View
      style={[
        styles.faqCard,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.faqTouchable}
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.faqHeader}>
          <View style={styles.faqQuestionContainer}>
            <View style={styles.faqNumberBadge}>
              <Text style={styles.faqNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.faqQuestion}>{item.question}</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Feather name="chevron-down" size={20} color={Colors.gray500} />
          </Animated.View>
        </View>
        {isExpanded && (
          <View style={styles.faqAnswerContainer}>
            <View style={styles.faqDivider} />
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
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
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
  },
  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: `${Colors.orange}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 24,
    color: Colors.deepNavy,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  faqList: {
    marginBottom: 24,
  },
  faqCard: {
    marginBottom: 12,
  },
  faqTouchable: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  faqQuestionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 12,
  },
  faqNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: `${Colors.orange}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  faqNumber: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.orange,
  },
  faqQuestion: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    flex: 1,
    lineHeight: 22,
  },
  faqAnswerContainer: {
    marginTop: 12,
  },
  faqDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginBottom: 12,
  },
  faqAnswer: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 22,
    marginLeft: 40,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${Colors.orange}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  contactTextContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  contactTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  contactSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: Colors.orange,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contactButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
});
