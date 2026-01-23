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
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

type ContactOption = {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  subtitle: string;
  value: string;
  color: string;
  bgColor: string;
  action: () => void;
};

export default function ContactUsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

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
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCall = () => {
    setIsLoading("call");
    setTimeout(() => {
      Linking.openURL("tel:+94759778858");
      setIsLoading(null);
    }, 500);
  };

  const handleWhatsApp = () => {
    setIsLoading("whatsapp");
    setTimeout(() => {
      Linking.openURL("https://wa.me/94759778858?text=Hello%20QPON%20Team!");
      setIsLoading(null);
    }, 500);
  };

  const handleEmail = () => {
    setIsLoading("email");
    setTimeout(() => {
      Linking.openURL("mailto:inquiries@qpon.lk?subject=Customer%20Inquiry");
      setIsLoading(null);
    }, 500);
  };

  const contactOptions: ContactOption[] = [
    {
      id: "call",
      icon: "phone",
      label: "Call Us",
      subtitle: "+94 75 977 8858",
      value: "+94759778858",
      color: Colors.success,
      bgColor: `${Colors.success}15`,
      action: handleCall,
    },
    {
      id: "whatsapp",
      icon: "message-circle",
      label: "WhatsApp",
      subtitle: "+94 75 977 8858",
      value: "+94759778858",
      color: "#25D366",
      bgColor: "#25D36615",
      action: handleWhatsApp,
    },
    {
      id: "email",
      icon: "mail",
      label: "Email Us",
      subtitle: "inquiries@qpon.lk",
      value: "inquiries@qpon.lk",
      color: Colors.orange,
      bgColor: `${Colors.orange}15`,
      action: handleEmail,
    },
  ];

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
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      <View style={styles.content}>
        {/* Hero Card */}
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.orange, Colors.orangeLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconContainer}>
              <Feather name="headphones" size={32} color={Colors.white} />
            </View>
            <Text style={styles.heroTitle}>We're Here to Help</Text>
            <Text style={styles.heroSubtitle}>
              Get in touch with our support team through any of the channels
              below
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Contact Options */}
        <Animated.View
          style={[styles.optionsContainer, { opacity: listOpacity }]}
        >
          <Text style={styles.sectionTitle}>Choose a Contact Method</Text>
          {contactOptions.map((option, index) => (
            <ContactOptionCard
              key={option.id}
              option={option}
              index={index}
              isLoading={isLoading === option.id}
            />
          ))}
        </Animated.View>

        {/* Business Hours */}
        <Animated.View style={[styles.hoursCard, { opacity: listOpacity }]}>
          <View style={styles.hoursHeader}>
            <View style={styles.hoursIconContainer}>
              <Feather name="clock" size={18} color={Colors.deepNavy} />
            </View>
            <Text style={styles.hoursTitle}>Business Hours</Text>
          </View>
          <View style={styles.hoursList}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday - Friday</Text>
              <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Saturday</Text>
              <Text style={styles.hoursTime}>9:00 AM - 1:00 PM</Text>
            </View>
            <View style={[styles.hoursRow, styles.lastHoursRow]}>
              <Text style={styles.hoursDay}>Sunday</Text>
              <Text style={[styles.hoursTime, styles.closedText]}>Closed</Text>
            </View>
          </View>
        </Animated.View>

        {/* Response Time Note */}
        <Animated.View style={[styles.noteContainer, { opacity: listOpacity }]}>
          <Feather name="info" size={16} color={Colors.gray400} />
          <Text style={styles.noteText}>
            We typically respond within 24 hours during business days
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

type ContactOptionCardProps = {
  option: ContactOption;
  index: number;
  isLoading: boolean;
};

const ContactOptionCard = ({
  option,
  index,
  isLoading,
}: ContactOptionCardProps) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isLoading]);

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
        styles.optionCard,
        {
          opacity: opacityAnim,
          transform: [
            { translateY: slideAnim },
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.optionTouchable}
        onPress={option.action}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        disabled={isLoading}
      >
        <View style={styles.optionContent}>
          <View
            style={[
              styles.optionIconContainer,
              { backgroundColor: option.bgColor },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={option.color} />
            ) : (
              <Feather name={option.icon} size={22} color={option.color} />
            )}
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          </View>
        </View>
        <View style={[styles.optionArrow, { backgroundColor: option.bgColor }]}>
          <Feather name="arrow-right" size={18} color={option.color} />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    padding: 24,
    alignItems: "center",
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
  },
  optionArrow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hoursCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  hoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  hoursIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  hoursTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
  },
  hoursList: {
    gap: 12,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastHoursRow: {
    marginBottom: 0,
  },
  hoursDay: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray600,
  },
  hoursTime: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  closedText: {
    color: Colors.error,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  noteText: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray400,
  },
});
