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
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const OTP_LENGTH = 4;

const OTPVerificationScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const setInputRef = useCallback((ref: TextInput | null, index: number) => {
    inputRefs.current[index] = ref;
  }, []);

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimations = useRef(
    Array(OTP_LENGTH)
      .fill(0)
      .map(() => new Animated.Value(1)),
  ).current;
  const successScale = useRef(new Animated.Value(0)).current;
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

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.deepNavy }}>Loading...</Text>
      </View>
    );
  }

  const animateInput = (index: number, focused: boolean) => {
    Animated.spring(scaleAnimations[index], {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateSuccess = () => {
    Animated.spring(successScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const handleOtpChange = (value: string, index: number) => {
    setError("");

    // Handle paste
    if (value.length > 1) {
      const pastedOtp = value.slice(0, OTP_LENGTH).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (i < OTP_LENGTH) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Animate current input
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimations[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
      }),
    ]).start();

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter the complete OTP");
      shakeError();
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

    setIsVerifying(true);

    // Simulate API verification
    setTimeout(() => {
      // For demo, accept any 4-digit code
      if (otpValue.length === 4) {
        setSuccess(true);
        animateSuccess();
        // Log in the user with mock data
        login({
          id: "1",
          name: "Thilina",
          email: "thilina@example.com",
          phone: phoneNumber,
        });
        setTimeout(() => {
          router.replace("/notification-preferences");
        }, 1500);
      } else {
        setError("Invalid OTP. Please try again.");
        shakeError();
        setIsVerifying(false);
      }
    }, 2000);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError("");

    // Simulate resend API call
    setTimeout(() => {
      setIsResending(false);
      setTimer(30);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }, 1500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maskedPhone = phoneNumber
    ? phoneNumber.slice(0, -4) + "****"
    : "+94 *** ****";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
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
            <Text style={styles.title}>Verify Your Number</Text>
            <Text style={styles.subtitle}>
              We've sent a 4-digit verification code to{"\n"}
              <Text style={styles.phoneText}>{maskedPhone}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <Animated.View
            style={[
              styles.otpContainer,
              { transform: [{ translateX: shakeAnimation }] },
            ]}
          >
            {Array(OTP_LENGTH)
              .fill(0)
              .map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.otpInputWrapper,
                    focusedIndex === index && styles.otpInputFocused,
                    otp[index] && styles.otpInputFilled,
                    error && styles.otpInputError,
                    success && styles.otpInputSuccess,
                    { transform: [{ scale: scaleAnimations[index] }] },
                  ]}
                >
                  <TextInput
                    ref={(ref) => setInputRef(ref, index)}
                    style={styles.otpInput}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => {
                      setFocusedIndex(index);
                      animateInput(index, true);
                    }}
                    onBlur={() => animateInput(index, false)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </Animated.View>
              ))}
          </Animated.View>

          {/* Error Message */}
          {error ? (
            <Animated.View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#FF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          {/* Success Message */}
          {success && (
            <Animated.View
              style={[
                styles.successContainer,
                { transform: [{ scale: successScale }] },
              ]}
            >
              <View style={styles.successIcon}>
                <Feather name="check" size={24} color={Colors.white} />
              </View>
              <Text style={styles.successText}>Verified Successfully!</Text>
            </Animated.View>
          )}

          {/* Resend Section */}
          {!success && (
            <View style={styles.resendSection}>
              {canResend ? (
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={isResending}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resendText}>
                    {isResending ? "Sending..." : "Resend Code"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend code in{" "}
                  <Text style={styles.timerValue}>{formatTimer(timer)}</Text>
                </Text>
              )}
            </View>
          )}

          {/* Verify Button */}
          {!success && (
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  otp.join("").length !== OTP_LENGTH &&
                    styles.verifyButtonDisabled,
                ]}
                onPress={handleVerify}
                activeOpacity={0.9}
                disabled={otp.join("").length !== OTP_LENGTH || isVerifying}
              >
                {isVerifying ? (
                  <View style={styles.loadingIndicator}>
                    <View style={styles.loadingDot} />
                    <View style={[styles.loadingDot, styles.loadingDot2]} />
                    <View style={[styles.loadingDot, styles.loadingDot3]} />
                  </View>
                ) : (
                  <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Change Number Link */}
          {!success && (
            <TouchableOpacity
              style={styles.changeNumberContainer}
              onPress={() => router.back()}
            >
              <Feather name="edit-2" size={14} color={Colors.gray500} />
              <Text style={styles.changeNumberText}>Change phone number</Text>
            </TouchableOpacity>
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
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
    marginBottom: 40,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.deepNavy,
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
    lineHeight: 24,
  },
  phoneText: {
    fontFamily: Fonts.body.semiBold,
    color: Colors.deepNavy,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  otpInputWrapper: {
    width: 64,
    height: 72,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  otpInputFocused: {
    borderColor: Colors.blueSoft,
    shadowOpacity: 0.1,
  },
  otpInputFilled: {
    borderColor: Colors.blueSoftDark,
    backgroundColor: Colors.blueSoftBg,
  },
  otpInputError: {
    borderColor: Colors.errorSoft,
    backgroundColor: Colors.errorSoftBg,
  },
  otpInputSuccess: {
    borderColor: Colors.successSoft,
    backgroundColor: Colors.successSoftBg,
  },
  otpInput: {
    fontFamily: Fonts.body.bold,
    fontSize: 28,
    color: Colors.deepNavy,
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  errorText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.errorSoft,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.successSoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: Colors.successSoft,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  resendSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.orange,
  },
  timerText: {
    fontFamily: Fonts.body.regular,
    fontSize: 15,
    color: Colors.gray600,
  },
  timerValue: {
    fontFamily: Fonts.body.semiBold,
    color: Colors.deepNavy,
  },
  verifyButton: {
    backgroundColor: Colors.orange,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
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
  changeNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  changeNumberText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
  },
});

export default OTPVerificationScreen;
