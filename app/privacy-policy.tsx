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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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

        {/* Privacy Commitment */}
        <View style={styles.highlightBox}>
          <Feather name="shield" size={24} color={Colors.orange} />
          <Text style={styles.highlightText}>
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your personal information.
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            QPON.lk ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our mobile application
            and related services.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect information that you provide directly to us and
            information collected automatically when you use our services.
          </Text>

          <Text style={styles.subSectionTitle}>Personal Information</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Full name</Text>
            <Text style={styles.bulletItem}>• Email address</Text>
            <Text style={styles.bulletItem}>• Phone number</Text>
            <Text style={styles.bulletItem}>• Profile picture (optional)</Text>
            <Text style={styles.bulletItem}>• Payment information</Text>
          </View>

          <Text style={styles.subSectionTitle}>
            Automatically Collected Information
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Device information (model, OS version)
            </Text>
            <Text style={styles.bulletItem}>• IP address</Text>
            <Text style={styles.bulletItem}>
              • Location data (with your permission)
            </Text>
            <Text style={styles.bulletItem}>• App usage statistics</Text>
            <Text style={styles.bulletItem}>• Coupon redemption history</Text>
          </View>
        </View>

        {/* How We Use Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            3. How We Use Your Information
          </Text>
          <Text style={styles.sectionText}>
            We use the information we collect for various purposes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • To provide and maintain our services
            </Text>
            <Text style={styles.bulletItem}>
              • To personalize your experience and show relevant deals
            </Text>
            <Text style={styles.bulletItem}>
              • To process transactions and send related information
            </Text>
            <Text style={styles.bulletItem}>
              • To send promotional communications (with your consent)
            </Text>
            <Text style={styles.bulletItem}>
              • To respond to your inquiries and support requests
            </Text>
            <Text style={styles.bulletItem}>
              • To detect and prevent fraud and abuse
            </Text>
            <Text style={styles.bulletItem}>
              • To improve our app and develop new features
            </Text>
          </View>
        </View>

        {/* Information Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing</Text>
          <Text style={styles.sectionText}>
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • With merchants when you redeem coupons
            </Text>
            <Text style={styles.bulletItem}>
              • With service providers who assist our operations
            </Text>
            <Text style={styles.bulletItem}>
              • When required by law or legal process
            </Text>
            <Text style={styles.bulletItem}>
              • To protect our rights and prevent fraud
            </Text>
            <Text style={styles.bulletItem}>
              • In connection with a merger or acquisition
            </Text>
          </View>
        </View>

        {/* Data Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. These measures include:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Encryption of data in transit and at rest
            </Text>
            <Text style={styles.bulletItem}>
              • Regular security assessments
            </Text>
            <Text style={styles.bulletItem}>
              • Access controls and authentication
            </Text>
            <Text style={styles.bulletItem}>• Secure data centers</Text>
          </View>
        </View>

        {/* Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have certain rights regarding your personal information:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access your personal data</Text>
            <Text style={styles.bulletItem}>
              • Correct inaccurate information
            </Text>
            <Text style={styles.bulletItem}>
              • Delete your account and data
            </Text>
            <Text style={styles.bulletItem}>
              • Opt-out of marketing communications
            </Text>
            <Text style={styles.bulletItem}>• Export your data</Text>
            <Text style={styles.bulletItem}>
              • Withdraw consent at any time
            </Text>
          </View>
        </View>

        {/* Cookies and Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
          <Text style={styles.sectionText}>
            We use cookies and similar tracking technologies to collect
            information about your usage patterns. You can control cookie
            preferences through your device settings. Note that disabling
            certain cookies may affect app functionality.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our services are not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If we become aware that we have collected such information, we
            will take steps to delete it promptly.
          </Text>
        </View>

        {/* Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Data Retention</Text>
          <Text style={styles.sectionText}>
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this policy, unless a longer
            retention period is required by law. When you delete your account,
            we will delete your personal data within 30 days, except for
            information we are legally required to retain.
          </Text>
        </View>

        {/* International Transfers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            10. International Data Transfers
          </Text>
          <Text style={styles.sectionText}>
            Your information may be transferred to and processed in countries
            other than Sri Lanka. We ensure appropriate safeguards are in place
            to protect your information in accordance with this privacy policy
            and applicable data protection laws.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new policy on this page
            and updating the "Last Updated" date. We encourage you to review
            this policy periodically.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>12. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact our Data Protection Officer:
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
    marginBottom: 20,
  },
  lastUpdatedText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  highlightBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: `${Colors.orange}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  highlightText: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.deepNavy,
    lineHeight: 22,
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
  subSectionTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 8,
    gap: 6,
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
