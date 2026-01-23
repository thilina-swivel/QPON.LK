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
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

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

const SignInScreen = () => {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.includes(countrySearch),
  );
  const [mobileFocused, setMobileFocused] = useState(false);

  // Animation values
  const mobileScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.deepNavy }}>Loading...</Text>
      </View>
    );
  }

  const animateFocus = (scale: Animated.Value, focused: boolean) => {
    Animated.spring(scale, {
      toValue: focused ? 1.02 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleMobileFocus = () => {
    setMobileFocused(true);
    animateFocus(mobileScale, true);
  };

  const handleMobileBlur = () => {
    setMobileFocused(false);
    animateFocus(mobileScale, false);
  };

  const handleContinue = async () => {
    if (!mobileNumber) {
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: "/otp-verification",
        params: {
          phoneNumber: `${selectedCountry.code}${mobileNumber}`,
          isSignIn: "true",
        },
      });
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    console.log("Google Sign In");
  };

  const handleFacebookSignIn = () => {
    // TODO: Implement Facebook Sign In
    console.log("Facebook Sign In");
  };

  const isFormValid = mobileNumber.length >= 9;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color={Colors.white} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>
              Enter Your Registered{"\n"}Mobile Number
            </Text>
            <Text style={styles.subtitle}>
              Please enter your mobile number below to login to your account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Mobile Number Input */}
            <Animated.View
              style={[
                styles.inputContainer,
                mobileFocused && styles.inputContainerFocused,
                { transform: [{ scale: mobileScale }] },
              ]}
            >
              <View style={styles.inputWrapper}>
                {/* Country Code Dropdown */}
                <TouchableOpacity
                  style={styles.countryCodeButton}
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryCodeText}>
                    {selectedCountry.code}
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={16}
                    color={Colors.gray600}
                  />
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.phoneInputWrapper}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your number"
                    placeholderTextColor={Colors.gray400}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    onFocus={handleMobileFocus}
                    onBlur={handleMobileBlur}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </Animated.View>

            {/* Country Picker Dropdown */}
            {showCountryPicker && (
              <Animated.View style={styles.countryPickerDropdown}>
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
                      <Feather
                        name="x-circle"
                        size={16}
                        color={Colors.gray400}
                      />
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
                    nestedScrollEnabled
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
                        }}
                      >
                        <Text style={styles.countryFlag}>{country.flag}</Text>
                        <Text style={styles.countryName}>
                          {country.country}
                        </Text>
                        <Text style={styles.countryCodeOption}>
                          {country.code}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </Animated.View>
            )}
          </View>

          {/* Continue Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isFormValid && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              activeOpacity={0.9}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingIndicator}>
                  <View style={styles.loadingDot} />
                  <View style={[styles.loadingDot, styles.loadingDot2]} />
                  <View style={[styles.loadingDot, styles.loadingDot3]} />
                </View>
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/icons/google.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleFacebookSignIn}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/icons/facebook.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>
                Continue with Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F8",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.deepNavy,
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 24,
    position: "relative",
    zIndex: 10,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: Colors.gray300,
    shadowOpacity: 0.1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  countryCodeText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginRight: 6,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray300,
    marginRight: 16,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 4,
  },
  textInput: {
    fontFamily: Fonts.body.medium,
    fontSize: 16,
    color: Colors.deepNavy,
    paddingVertical: 2,
  },
  countryPickerDropdown: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
    maxHeight: 280,
  },
  countryListScroll: {
    maxHeight: 220,
  },
  countrySearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
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
    paddingVertical: 20,
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
    paddingVertical: 12,
  },
  countryOptionSelected: {
    backgroundColor: Colors.gray100,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  countryCodeOption: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
  continueButton: {
    backgroundColor: Colors.orange,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 17,
    color: Colors.white,
  },
  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginHorizontal: 4,
    opacity: 0.4,
  },
  loadingDot2: {
    opacity: 0.7,
  },
  loadingDot3: {
    opacity: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  dividerText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingVertical: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
  },
  signUpLink: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.orange,
  },
});

export default SignInScreen;
