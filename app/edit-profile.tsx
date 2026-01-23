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
    Image,
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

const { width } = Dimensions.get("window");

// Country codes for dropdown
const countryCodes = [
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
];

// Initial user data (would come from auth/backend in real app)
const initialUserData = {
  name: "John Doe",
  phone: "555123456",
  phoneCountryCode: "+94",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
};

export default function EditProfileScreen() {
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

  // Form state
  const [name, setName] = useState(initialUserData.name);
  const [phone, setPhone] = useState(initialUserData.phone);
  const [email, setEmail] = useState(initialUserData.email);
  const [selectedCountry, setSelectedCountry] = useState(
    countryCodes.find((c) => c.code === initialUserData.phoneCountryCode) ||
      countryCodes[0],
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.includes(countrySearch),
  );

  // Track original values for OTP requirement
  const [originalPhone] = useState(initialUserData.phone);
  const [originalEmail] = useState(initialUserData.email);
  const [originalCountryCode] = useState(initialUserData.phoneCountryCode);

  // Verification status
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [otpType, setOtpType] = useState<"phone" | "email">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    phone?: string;
    email?: string;
  }>({});

  // Refs
  const otpInputRefs = useRef<(TextInput | null)[]>([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const modalFadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(300)).current;
  const deleteModalScale = useRef(new Animated.Value(0.8)).current;
  const deleteModalOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Input focus animations
  const nameFocusAnim = useRef(new Animated.Value(0)).current;
  const phoneFocusAnim = useRef(new Animated.Value(0)).current;
  const emailFocusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Resend timer effect
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

  const handleFocus = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const handleBlur = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const getBorderColor = (anim: Animated.Value) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.gray200, Colors.orange],
    });
  };

  const openOtpModal = (type: "phone" | "email") => {
    setOtpType(type);
    setShowOtpModal(true);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setResendTimer(30);
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

  const closeOtpModal = () => {
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
      setShowOtpModal(false);
      modalSlideAnim.setValue(300);
    });
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    Animated.parallel([
      Animated.spring(deleteModalScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 65,
      }),
      Animated.timing(deleteModalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDeleteModal = () => {
    Animated.parallel([
      Animated.timing(deleteModalScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(deleteModalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDeleteModal(false);
      deleteModalScale.setValue(0.8);
    });
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete OTP");
      shakeError();
      return;
    }

    setIsVerifyingOtp(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifyingOtp(false);
      closeOtpModal();

      // Apply the pending change and mark as verified
      if (otpType === "phone") {
        setPhoneVerified(true);
      } else if (otpType === "email") {
        setEmailVerified(true);
      }
      setPendingChanges({});
    }, 1500);
  };

  const handleVerifyPhone = () => {
    if (phone === originalPhone && selectedCountry.code === originalCountryCode)
      return;
    setIsSendingPhoneOtp(true);
    setPendingChanges((prev) => ({
      ...prev,
      phone: `${selectedCountry.code}${phone}`,
    }));
    setTimeout(() => {
      setIsSendingPhoneOtp(false);
      openOtpModal("phone");
    }, 800);
  };

  const handleVerifyEmail = () => {
    if (email === originalEmail) return;
    setIsSendingEmailOtp(true);
    setPendingChanges((prev) => ({ ...prev, email }));
    setTimeout(() => {
      setIsSendingEmailOtp(false);
      openOtpModal("email");
    }, 800);
  };

  const phoneChanged =
    phone !== originalPhone || selectedCountry.code !== originalCountryCode;
  const emailChanged = email !== originalEmail;
  const phoneNeedsVerification = phoneChanged && !phoneVerified;
  const emailNeedsVerification = emailChanged && !emailVerified;

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleSave = () => {
    const phoneChanged = phone !== originalPhone;
    const emailChanged = email !== originalEmail;

    if (phoneChanged) {
      setPendingChanges((prev) => ({ ...prev, phone }));
      setPhone(originalPhone); // Reset to original until verified
      openOtpModal("phone");
      return;
    }

    if (emailChanged) {
      setPendingChanges((prev) => ({ ...prev, email }));
      setEmail(originalEmail); // Reset to original until verified
      openOtpModal("email");
      return;
    }

    // Only name changed or no changes - save directly
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1000);
  };

  const handleDeleteProfile = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      closeDeleteModal();
      // Navigate to sign in
      router.replace("/signin");
    }, 1500);
  };

  const hasChanges =
    name !== initialUserData.name ||
    (phoneChanged && phoneVerified) ||
    (emailChanged && emailVerified);

  const canSave =
    hasChanges && !phoneNeedsVerification && !emailNeedsVerification;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerFadeAnim }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={Colors.deepNavy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerPlaceholder} />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <Animated.View
            style={[
              styles.avatarSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: initialUserData.avatar }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.changeAvatarButton}
                activeOpacity={0.8}
              >
                <Feather name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: getBorderColor(nameFocusAnim) },
                ]}
              >
                <Feather name="user" size={20} color={Colors.gray500} />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.gray400}
                  onFocus={() => handleFocus(nameFocusAnim)}
                  onBlur={() => handleBlur(nameFocusAnim)}
                />
              </Animated.View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                {phoneChanged && (
                  <View
                    style={[
                      styles.verificationBadge,
                      phoneVerified && styles.verifiedBadge,
                    ]}
                  >
                    <Feather
                      name={phoneVerified ? "check-circle" : "alert-circle"}
                      size={12}
                      color={phoneVerified ? Colors.success : Colors.orange}
                    />
                    <Text
                      style={[
                        styles.verificationBadgeText,
                        phoneVerified && styles.verifiedBadgeText,
                      ]}
                    >
                      {phoneVerified ? "Verified" : "Requires verification"}
                    </Text>
                  </View>
                )}
              </View>
              <Animated.View
                style={[
                  styles.phoneInputContainer,
                  { borderColor: getBorderColor(phoneFocusAnim) },
                ]}
              >
                {/* Country Code Selector */}
                <TouchableOpacity
                  style={styles.countryCodeButton}
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryCodeText}>
                    {selectedCountry.code}
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={14}
                    color={Colors.gray500}
                  />
                </TouchableOpacity>
                <View style={styles.phoneDivider} />
                <TextInput
                  style={styles.phoneTextInput}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setPhoneVerified(false);
                  }}
                  placeholder="Enter your phone"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="phone-pad"
                  onFocus={() => handleFocus(phoneFocusAnim)}
                  onBlur={() => handleBlur(phoneFocusAnim)}
                />
                {phoneNeedsVerification && (
                  <TouchableOpacity
                    style={styles.inlineVerifyButton}
                    onPress={handleVerifyPhone}
                    disabled={isSendingPhoneOtp}
                    activeOpacity={0.7}
                  >
                    {isSendingPhoneOtp ? (
                      <ActivityIndicator size="small" color={Colors.orange} />
                    ) : (
                      <Text style={styles.inlineVerifyButtonText}>Verify</Text>
                    )}
                  </TouchableOpacity>
                )}
              </Animated.View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>Email Address</Text>
                {emailChanged && (
                  <View
                    style={[
                      styles.verificationBadge,
                      emailVerified && styles.verifiedBadge,
                    ]}
                  >
                    <Feather
                      name={emailVerified ? "check-circle" : "alert-circle"}
                      size={12}
                      color={emailVerified ? Colors.success : Colors.orange}
                    />
                    <Text
                      style={[
                        styles.verificationBadgeText,
                        emailVerified && styles.verifiedBadgeText,
                      ]}
                    >
                      {emailVerified ? "Verified" : "Requires verification"}
                    </Text>
                  </View>
                )}
              </View>
              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: getBorderColor(emailFocusAnim) },
                ]}
              >
                <Feather name="mail" size={20} color={Colors.gray500} />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailVerified(false);
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus(emailFocusAnim)}
                  onBlur={() => handleBlur(emailFocusAnim)}
                />
                {emailNeedsVerification && (
                  <TouchableOpacity
                    style={styles.inlineVerifyButton}
                    onPress={handleVerifyEmail}
                    disabled={isSendingEmailOtp}
                    activeOpacity={0.7}
                  >
                    {isSendingEmailOtp ? (
                      <ActivityIndicator size="small" color={Colors.orange} />
                    ) : (
                      <Text style={styles.inlineVerifyButtonText}>Verify</Text>
                    )}
                  </TouchableOpacity>
                )}
              </Animated.View>
            </View>
          </Animated.View>

          {/* Delete Profile Button */}
          <Animated.View
            style={[
              styles.deleteSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={openDeleteModal}
              activeOpacity={0.8}
            >
              <Feather name="trash-2" size={20} color={Colors.error} />
              <Text style={styles.deleteButtonText}>Delete Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Save Button */}
        <Animated.View
          style={[
            styles.bottomSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave || isSaving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                canSave
                  ? [Colors.orange, Colors.orangeLight]
                  : [Colors.gray300, Colors.gray400]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="none"
        onRequestClose={closeOtpModal}
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
                onPress={closeOtpModal}
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

              <Text style={styles.modalTitle}>
                Verify Your {otpType === "phone" ? "Phone" : "Email"}
              </Text>
              <Text style={styles.modalSubtitle}>
                We sent a 6-digit code to{" "}
                {otpType === "phone"
                  ? pendingChanges.phone
                  : pendingChanges.email}
              </Text>

              <Animated.View
                style={[
                  styles.otpContainer,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
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
              </Animated.View>

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
                    : "Resend Code"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOtp}
                disabled={isVerifyingOtp}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.orange, Colors.orangeLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verifyButtonGradient}
                >
                  {isVerifyingOtp ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.verifyButtonText}>Verify & Update</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="none"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.deleteModalOverlay}>
          <Animated.View
            style={[
              styles.deleteModalContent,
              {
                transform: [{ scale: deleteModalScale }],
                opacity: deleteModalOpacity,
              },
            ]}
          >
            <View style={styles.deleteModalIconContainer}>
              <LinearGradient
                colors={[Colors.error, "#FF6B6B"]}
                style={styles.deleteModalIcon}
              >
                <Feather name="alert-triangle" size={32} color={Colors.white} />
              </LinearGradient>
            </View>

            <Text style={styles.deleteModalTitle}>Delete Profile?</Text>
            <Text style={styles.deleteModalSubtitle}>
              This action cannot be undone. All your data, including saved
              coupons and favorites, will be permanently deleted.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeDeleteModal}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleDeleteProfile}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCountryPicker(false);
          setCountrySearch("");
        }}
      >
        <View style={styles.countryPickerOverlay}>
          <View style={styles.countryPickerModal}>
            <View style={styles.countryPickerHeader}>
              <Text style={styles.countryPickerTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.countryPickerCloseButton}
                onPress={() => {
                  setShowCountryPicker(false);
                  setCountrySearch("");
                }}
              >
                <Feather name="x" size={22} color={Colors.deepNavy} />
              </TouchableOpacity>
            </View>
            <View style={styles.countrySearchContainer}>
              <Feather name="search" size={18} color={Colors.gray400} />
              <TextInput
                style={styles.countrySearchInput}
                placeholder="Search country or code..."
                placeholderTextColor={Colors.gray400}
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus
              />
              {countrySearch.length > 0 && (
                <TouchableOpacity onPress={() => setCountrySearch("")}>
                  <Feather name="x-circle" size={16} color={Colors.gray400} />
                </TouchableOpacity>
              )}
            </View>
            {filteredCountryCodes.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No countries found</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.countryListScroll}
                showsVerticalScrollIndicator={false}
              >
                {filteredCountryCodes.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={[
                      styles.countryOption,
                      selectedCountry.code === country.code &&
                        styles.countryOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedCountry(country);
                      setShowCountryPicker(false);
                      setCountrySearch("");
                      setPhoneVerified(false);
                    }}
                  >
                    <Text style={styles.countryOptionFlag}>{country.flag}</Text>
                    <Text style={styles.countryName}>{country.country}</Text>
                    <Text style={styles.countryCodeOption}>{country.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
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
    paddingBottom: 120,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  changePhotoText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.orange,
  },
  formSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
    position: "relative",
    zIndex: 10,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verificationBadgeText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.orange,
  },
  verifiedBadge: {
    backgroundColor: `${Colors.success}15`,
  },
  verifiedBadgeText: {
    color: Colors.success,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryCodeText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginHorizontal: 2,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.gray300,
    marginHorizontal: 8,
  },
  phoneTextInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
    paddingVertical: 6,
  },
  countryPickerOverlay: {
    flex: 1,
    backgroundColor: `${Colors.black}50`,
    justifyContent: "flex-end",
  },
  countryPickerModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 34,
  },
  countryPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  countryPickerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  countryPickerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  countryListScroll: {
    maxHeight: 400,
  },
  countrySearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.gray100,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  countrySearchInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.deepNavy,
    paddingVertical: 4,
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray400,
  },
  countryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  countryOptionSelected: {
    backgroundColor: `${Colors.orange}10`,
  },
  countryOptionFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  countryCodeOption: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.gray500,
  },
  inlineVerifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: `${Colors.orange}15`,
  },
  inlineVerifyButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.orange,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  deleteSection: {
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}08`,
  },
  deleteButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.error,
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
    borderRadius: 28,
    overflow: "hidden",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  saveButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.white,
  },

  // OTP Modal Styles
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
    shadowColor: Colors.blue,
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
  errorText: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
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
  verifyButton: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
  },
  verifyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  verifyButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.white,
  },

  // Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: `${Colors.black}80`,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  deleteModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  deleteModalIconContainer: {
    marginBottom: 20,
  },
  deleteModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  deleteModalTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    marginBottom: 12,
  },
  deleteModalSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.gray600,
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
});
