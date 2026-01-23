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
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

export default function TermsScreen() {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Last Updated */}
        <View style={styles.lastUpdatedContainer}>
          <Feather name="clock" size={14} color={Colors.gray500} />
          <Text style={styles.lastUpdatedText}>
            Last updated: January 15, 2026
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            Welcome to QPON.lk ("we," "our," or "us"). These Terms and
            Conditions govern your use of the QPON.lk mobile application and
            related services. By accessing or using our app, you agree to be
            bound by these terms.
          </Text>
        </View>

        {/* Acceptance of Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By creating an account or using QPON.lk, you acknowledge that you
            have read, understood, and agree to be bound by these Terms and
            Conditions. If you do not agree with any part of these terms, you
            must not use our services.
          </Text>
        </View>

        {/* Eligibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Eligibility</Text>
          <Text style={styles.sectionText}>
            To use QPON.lk, you must be at least 18 years old or have the
            consent of a parent or legal guardian. By using our services, you
            represent and warrant that you meet these eligibility requirements.
          </Text>
        </View>

        {/* User Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Accounts</Text>
          <Text style={styles.sectionText}>
            When you create an account with us, you must provide accurate,
            complete, and current information. You are responsible for
            safeguarding your account credentials and for all activities that
            occur under your account.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Keep your login credentials confidential
            </Text>
            <Text style={styles.bulletItem}>
              • Notify us immediately of any unauthorized access
            </Text>
            <Text style={styles.bulletItem}>
              • Do not share your account with others
            </Text>
            <Text style={styles.bulletItem}>• One account per person</Text>
          </View>
        </View>

        {/* Use of Coupons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Use of Coupons and Deals</Text>
          <Text style={styles.sectionText}>
            Coupons and deals available through QPON.lk are subject to the
            following conditions:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Coupons may only be used once unless otherwise stated
            </Text>
            <Text style={styles.bulletItem}>
              • Coupons cannot be exchanged for cash
            </Text>
            <Text style={styles.bulletItem}>
              • Expiration dates are strictly enforced
            </Text>
            <Text style={styles.bulletItem}>
              • Merchants reserve the right to refuse invalid or expired coupons
            </Text>
            <Text style={styles.bulletItem}>
              • Some coupons may have minimum purchase requirements
            </Text>
          </View>
        </View>

        {/* Prohibited Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
          <Text style={styles.sectionText}>
            You agree not to engage in any of the following prohibited
            activities:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Creating multiple accounts to abuse promotions
            </Text>
            <Text style={styles.bulletItem}>
              • Reselling or transferring coupons for profit
            </Text>
            <Text style={styles.bulletItem}>
              • Using automated systems to access our services
            </Text>
            <Text style={styles.bulletItem}>
              • Attempting to bypass security measures
            </Text>
            <Text style={styles.bulletItem}>
              • Engaging in fraudulent activities
            </Text>
          </View>
        </View>

        {/* Intellectual Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.sectionText}>
            All content, trademarks, logos, and intellectual property displayed
            on QPON.lk are owned by us or our licensors. You may not copy,
            reproduce, distribute, or create derivative works without our prior
            written consent.
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            QPON.lk acts as an intermediary between users and merchants. We are
            not responsible for the quality, safety, or legality of products or
            services offered by merchants. Our liability is limited to the
            maximum extent permitted by law.
          </Text>
        </View>

        {/* Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Termination</Text>
          <Text style={styles.sectionText}>
            We reserve the right to suspend or terminate your account at any
            time, with or without notice, for violating these terms or for any
            other reason we deem necessary. Upon termination, your right to use
            the service will immediately cease.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
          <Text style={styles.sectionText}>
            We may update these Terms and Conditions from time to time. We will
            notify you of any material changes by posting the new terms on this
            page and updating the "Last Updated" date. Your continued use of the
            service after changes constitutes acceptance of the new terms.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions about these Terms and Conditions, please
            contact us at:
          </Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Feather name="mail" size={16} color={Colors.orange} />
              <Text style={styles.contactText}>inquiries@qpon.lk</Text>
            </View>
            <View style={styles.contactItem}>
              <Feather name="phone" size={16} color={Colors.orange} />
              <Text style={styles.contactText}>+94 75 977 8858</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
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
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  lastUpdatedText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 12,
  },
  sectionText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 12,
    gap: 8,
  },
  bulletItem: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
    paddingLeft: 4,
  },
  contactInfo: {
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.deepNavy,
  },
});
