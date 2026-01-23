import { Colors, Fonts } from "@/constants/theme";
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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// User data (simulating retrieved from sign-up)
const userData = {
  email: "john.doe@example.com",
  name: "John Doe",
};

const { width } = Dimensions.get("window");

interface Package {
  id: number;
  name: string;
  price: number;
  duration: string;
  couponCount: number;
  features: string[];
  popular?: boolean;
  color: string;
  gradientColors: [string, string];
}

// Current package data
const currentPackageData = {
  id: 0,
  name: "Welcome Offer",
  price: 0,
  expirationDate: "2025-02-28",
  totalCoupons: 3,
  remainingCoupons: 2,
  usedCoupons: 1,
  status: "active" as "active" | "expired",
  startDate: "2025-01-01",
};

// Available packages
const availablePackages: Package[] = [
  {
    id: 1,
    name: "Starter",
    price: 499,
    duration: "month",
    couponCount: 5,
    features: ["5 coupons per month", "Basic deals access", "Email support"],
    color: Colors.blue,
    gradientColors: [Colors.blue, Colors.blueLight],
  },
  {
    id: 2,
    name: "Premium",
    price: 999,
    duration: "month",
    couponCount: 15,
    features: [
      "15 coupons per month",
      "Premium deals access",
      "Priority support",
      "Early access to deals",
    ],
    popular: true,
    color: Colors.orange,
    gradientColors: [Colors.orange, Colors.orangeLight],
  },
  {
    id: 3,
    name: "Business",
    price: 1999,
    duration: "month",
    couponCount: 50,
    features: [
      "50 coupons per month",
      "All deals access",
      "24/7 support",
      "Exclusive partner deals",
      "Family sharing (up to 5)",
    ],
    color: Colors.purple,
    gradientColors: [Colors.purple, Colors.purpleLight],
  },
];

export default function PackagesScreen() {
  const router = useRouter();

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

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  // Button press animations
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null,
  );
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonScales = useRef(
    availablePackages.map(() => new Animated.Value(1)),
  ).current;

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(TextInput | null)[]>([]);

  // Payment state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Modal animations
  const modalFadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Entry animations
    Animated.sequence([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Resend OTP timer effect - must be before early return
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: "active" | "expired") => {
    return status === "active" ? Colors.success : Colors.error;
  };

  const getStatusBgColor = (status: "active" | "expired") => {
    return status === "active" ? Colors.successLight : Colors.errorLight;
  };

  const handlePackagePress = (index: number) => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScales[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScales[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openModal = () => {
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  };

  const handleUpgrade = (packageItem: Package) => {
    setSelectedPackage(packageItem);
    setShowEmailModal(true);
    openModal();
  };

  const handleSendOtp = () => {
    setIsSendingOtp(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsSendingOtp(false);
      closeModal(() => {
        setShowEmailModal(false);
        setShowOtpModal(true);
        setResendTimer(30);
        openModal();
      });
    }, 1500);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete OTP");
      return;
    }

    setIsVerifyingOtp(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifyingOtp(false);
      // Simulate success (in real app, validate with backend)
      closeModal(() => {
        setShowOtpModal(false);
        setShowVerifiedModal(true);
        openModal();
        // Auto navigate to payment after showing verified message
        setTimeout(() => {
          closeModal(() => {
            setShowVerifiedModal(false);
            setShowPaymentModal(true);
            openModal();
          });
        }, 2000);
      });
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    // Simulate resend
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = () => {
    // Validate card details
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setPaymentError("Please enter a valid card number");
      return;
    }
    if (expiryDate.length < 5) {
      setPaymentError("Please enter a valid expiry date");
      return;
    }
    if (cvv.length < 3) {
      setPaymentError("Please enter a valid CVV");
      return;
    }
    if (!cardName.trim()) {
      setPaymentError("Please enter the cardholder name");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      closeModal(() => {
        setShowPaymentModal(false);
        // Reset all states
        setOtp(["", "", "", "", "", ""]);
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setCardName("");
        // Navigate to success page
        router.push({
          pathname: "/package-success",
          params: { packageId: selectedPackage?.id.toString() },
        });
      });
    }, 2000);
  };

  const handleCloseAllModals = () => {
    closeModal(() => {
      setShowEmailModal(false);
      setShowOtpModal(false);
      setShowVerifiedModal(false);
      setShowPaymentModal(false);
      setSelectedPackage(null);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setCardName("");
      setPaymentError("");
    });
  };

  const renderCurrentPackage = () => (
    <Animated.View
      style={[
        styles.currentPackageContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.currentPackageCard}>
        <View style={styles.currentPackageHeader}>
          <View style={styles.currentPackageInfo}>
            <View style={styles.packageIconContainer}>
              <LinearGradient
                colors={[Colors.orange, Colors.orangeLight]}
                style={styles.packageIcon}
              >
                <Feather name="gift" size={20} color={Colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.packageNameContainer}>
              <Text style={styles.currentPackageName}>
                {currentPackageData.name}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusBgColor(
                      currentPackageData.status,
                    ),
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getStatusColor(
                        currentPackageData.status,
                      ),
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(currentPackageData.status) },
                  ]}
                >
                  {currentPackageData.status === "active"
                    ? "Active"
                    : "Expired"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              {currentPackageData.price === 0
                ? "Free"
                : `LKR ${currentPackageData.price}`}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.packageDetailsGrid}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={16} color={Colors.gray500} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Expires</Text>
              <Text style={styles.detailValue}>
                {formatDate(currentPackageData.expirationDate)}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Feather name="tag" size={16} color={Colors.gray500} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Total Coupons</Text>
              <Text style={styles.detailValue}>
                {currentPackageData.totalCoupons}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Feather name="check-circle" size={16} color={Colors.gray500} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Remaining</Text>
              <Text style={styles.detailValue}>
                {currentPackageData.remainingCoupons}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentPackageData.usedCoupons / currentPackageData.totalCoupons) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentPackageData.usedCoupons} of{" "}
            {currentPackageData.totalCoupons} coupons used
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPackageCard = (packageItem: Package, index: number) => {
    const isSelected = selectedPackageId === packageItem.id;
    const isCurrentPackage = packageItem.id === currentPackageData.id;

    return (
      <Animated.View
        key={packageItem.id}
        style={[
          styles.packageCardWrapper,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: buttonScales[index] },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => handlePackagePress(index)}
          style={[
            styles.packageCard,
            packageItem.popular && styles.popularPackageCard,
          ]}
        >
          {packageItem.popular && (
            <View style={styles.popularBadge}>
              <Feather name="star" size={10} color={Colors.white} />
              <Text style={styles.popularBadgeText}>Most Popular</Text>
            </View>
          )}

          <View style={styles.packageCardHeader}>
            <View
              style={[
                styles.packageCardIcon,
                { backgroundColor: `${packageItem.color}15` },
              ]}
            >
              <Feather name="package" size={22} color={packageItem.color} />
            </View>
            <View style={styles.packageCardTitleContainer}>
              <Text style={styles.packageCardName}>{packageItem.name}</Text>
              <Text style={styles.packageCardCoupons}>
                {packageItem.couponCount} coupons/month
              </Text>
            </View>
            <View style={styles.packageCardPriceContainer}>
              <Text style={styles.packageCardPrice}>
                LKR {packageItem.price.toLocaleString()}
              </Text>
              <Text style={styles.packageCardDuration}>
                /{packageItem.duration}
              </Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            {packageItem.features.map((feature, featureIndex) => (
              <View key={featureIndex} style={styles.featureItem}>
                <Feather name="check" size={14} color={packageItem.color} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isCurrentPackage && styles.actionButtonDisabled,
            ]}
            onPress={() => !isCurrentPackage && handleUpgrade(packageItem)}
            disabled={isCurrentPackage || isSelected}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isCurrentPackage
                  ? [Colors.gray300, Colors.gray400]
                  : packageItem.gradientColors
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              {isSelected ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.actionButtonText}>
                  {isCurrentPackage ? "Current Plan" : "Upgrade"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerFadeAnim,
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
        <Text style={styles.headerTitle}>Packages</Text>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Package */}
        {renderCurrentPackage()}

        {/* Available Packages */}
        <Animated.View
          style={[
            styles.availablePackagesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Available Packages</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a plan that fits your needs
          </Text>
          {availablePackages.map((packageItem, index) =>
            renderPackageCard(packageItem, index),
          )}
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Email Verification Modal */}
      <Modal
        visible={showEmailModal}
        transparent
        animationType="none"
        onRequestClose={handleCloseAllModals}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: modalFadeAnim }]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalSlideAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseAllModals}
            >
              <Feather name="x" size={24} color={Colors.deepNavy} />
            </TouchableOpacity>

            <View style={styles.modalIconContainer}>
              <LinearGradient
                colors={[Colors.orange, Colors.orangeLight]}
                style={styles.modalIcon}
              >
                <Feather name="mail" size={28} color={Colors.white} />
              </LinearGradient>
            </View>

            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalSubtitle}>
              We'll send a verification code to your email address
            </Text>

            <View style={styles.emailDisplayContainer}>
              <Feather name="mail" size={18} color={Colors.gray500} />
              <Text style={styles.emailDisplayText}>{userData.email}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={handleSendOtp}
              disabled={isSendingOtp}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.orange, Colors.orangeLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalPrimaryButtonGradient}
              >
                {isSendingOtp ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Text style={styles.modalPrimaryButtonText}>
                      Send Verification Code
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={18}
                      color={Colors.white}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="none"
        onRequestClose={handleCloseAllModals}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Animated.View
            style={[styles.modalOverlay, { opacity: modalFadeAnim }]}
          >
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: modalSlideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseAllModals}
              >
                <Feather name="x" size={24} color={Colors.deepNavy} />
              </TouchableOpacity>

              <View style={styles.modalIconContainer}>
                <LinearGradient
                  colors={[Colors.blue, Colors.blueLight]}
                  style={styles.modalIcon}
                >
                  <Feather name="shield" size={28} color={Colors.white} />
                </LinearGradient>
              </View>

              <Text style={styles.modalTitle}>Enter Verification Code</Text>
              <Text style={styles.modalSubtitle}>
                We sent a 6-digit code to {userData.email}
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      otpInputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputFilled,
                      otpError && styles.otpInputError,
                    ]}
                    value={digit}
                    onChangeText={(value) =>
                      handleOtpChange(value.replace(/\D/g, ""), index)
                    }
                    onKeyPress={({ nativeEvent }) =>
                      handleOtpKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {otpError ? (
                <Text style={styles.errorText}>{otpError}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOtp}
                disabled={resendTimer > 0}
              >
                <Text
                  style={[
                    styles.resendButtonText,
                    resendTimer > 0 && styles.resendButtonTextDisabled,
                  ]}
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend code"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handleVerifyOtp}
                disabled={isVerifyingOtp}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.orange, Colors.orangeLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalPrimaryButtonGradient}
                >
                  {isVerifyingOtp ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.modalPrimaryButtonText}>Verify</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Verified Success Modal */}
      <Modal
        visible={showVerifiedModal}
        transparent
        animationType="none"
        onRequestClose={() => {}}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: modalFadeAnim }]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              styles.modalContentSmall,
              { transform: [{ translateY: modalSlideAnim }] },
            ]}
          >
            <View style={styles.verifiedIconContainer}>
              <LinearGradient
                colors={["#10B981", "#34D399"]}
                style={styles.verifiedIcon}
              >
                <Feather name="check" size={40} color={Colors.white} />
              </LinearGradient>
            </View>

            <Text style={styles.verifiedTitle}>Email Verified!</Text>
            <Text style={styles.verifiedSubtitle}>
              Proceeding to payment...
            </Text>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="none"
        onRequestClose={handleCloseAllModals}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Animated.View
            style={[styles.modalOverlay, { opacity: modalFadeAnim }]}
          >
            <Animated.View
              style={[
                styles.modalContent,
                styles.modalContentLarge,
                { transform: [{ translateY: modalSlideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseAllModals}
              >
                <Feather name="x" size={24} color={Colors.deepNavy} />
              </TouchableOpacity>

              <Text style={styles.paymentTitle}>Payment Details</Text>
              <Text style={styles.paymentSubtitle}>
                {selectedPackage?.name} - LKR{" "}
                {selectedPackage?.price.toLocaleString()}/month
              </Text>

              <ScrollView
                style={styles.paymentScrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="credit-card"
                      size={18}
                      color={Colors.gray400}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor={Colors.gray400}
                      value={cardNumber}
                      onChangeText={(text) =>
                        setCardNumber(formatCardNumber(text))
                      }
                      keyboardType="number-pad"
                      maxLength={19}
                    />
                  </View>
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <View style={styles.inputContainer}>
                      <Feather
                        name="calendar"
                        size={18}
                        color={Colors.gray400}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM/YY"
                        placeholderTextColor={Colors.gray400}
                        value={expiryDate}
                        onChangeText={(text) =>
                          setExpiryDate(formatExpiryDate(text))
                        }
                        keyboardType="number-pad"
                        maxLength={5}
                      />
                    </View>
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <View style={styles.inputContainer}>
                      <Feather name="lock" size={18} color={Colors.gray400} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="123"
                        placeholderTextColor={Colors.gray400}
                        value={cvv}
                        onChangeText={(text) =>
                          setCvv(text.replace(/\D/g, "").substring(0, 4))
                        }
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cardholder Name</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="user" size={18} color={Colors.gray400} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="John Doe"
                      placeholderTextColor={Colors.gray400}
                      value={cardName}
                      onChangeText={setCardName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {paymentError ? (
                  <Text style={styles.errorText}>{paymentError}</Text>
                ) : null}

                <View style={styles.secureNote}>
                  <Feather name="shield" size={14} color={Colors.gray500} />
                  <Text style={styles.secureNoteText}>
                    Your payment information is secure and encrypted
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handlePayment}
                disabled={isProcessingPayment}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.orange, Colors.orangeLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalPrimaryButtonGradient}
                >
                  {isProcessingPayment ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <>
                      <Text style={styles.modalPrimaryButtonText}>
                        Pay LKR {selectedPackage?.price.toLocaleString()}
                      </Text>
                      <Feather
                        name="arrow-right"
                        size={18}
                        color={Colors.white}
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 16,
  },

  // Current Package
  currentPackageContainer: {
    marginBottom: 28,
  },
  currentPackageCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  currentPackageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  currentPackageInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  packageIconContainer: {
    marginRight: 14,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  packageNameContainer: {
    flex: 1,
  },
  currentPackageName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  currentPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.orange,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 16,
  },
  packageDetailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailTextContainer: {
    gap: 2,
  },
  detailLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
  detailValue: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.orange,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 8,
    textAlign: "center",
  },

  // Available Packages
  availablePackagesContainer: {
    marginBottom: 20,
  },
  packageCardWrapper: {
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  popularPackageCard: {
    borderWidth: 2,
    borderColor: Colors.orange,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  popularBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 11,
    color: Colors.white,
  },
  packageCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  packageCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  packageCardTitleContainer: {
    flex: 1,
  },
  packageCardName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
    marginBottom: 2,
  },
  packageCardCoupons: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  packageCardPriceContainer: {
    alignItems: "flex-end",
  },
  packageCardPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  packageCardDuration: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  featuresContainer: {
    marginBottom: 16,
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
  },
  actionButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.white,
  },
  bottomSpacing: {
    height: 40,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: `${Colors.black}99`,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalContentSmall: {
    paddingVertical: 40,
  },
  modalContentLarge: {
    maxHeight: "85%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalIconContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  modalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emailDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 24,
    width: "100%",
    gap: 12,
  },
  emailDisplayText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  modalPrimaryButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalPrimaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  modalPrimaryButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.white,
  },

  // OTP Styles
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
    width: "100%",
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.gray200,
    backgroundColor: Colors.gray100,
    textAlign: "center",
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
  },
  otpInputFilled: {
    borderColor: Colors.orange,
    backgroundColor: `${Colors.orange}10`,
  },
  otpInputError: {
    borderColor: Colors.error,
  },
  resendButton: {
    marginBottom: 24,
  },
  resendButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.orange,
  },
  resendButtonTextDisabled: {
    color: Colors.gray400,
  },
  errorText: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },

  // Verified Modal Styles
  verifiedIconContainer: {
    marginBottom: 20,
  },
  verifiedIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  verifiedTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 24,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  verifiedSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
  },

  // Payment Modal Styles
  paymentTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    marginTop: 20,
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 20,
  },
  paymentScrollView: {
    width: "100%",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    width: "100%",
  },
  inputLabel: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray600,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  rowInputs: {
    flexDirection: "row",
    width: "100%",
  },
  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  secureNoteText: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
});
